#!/usr/bin/env python3
"""
Bande-son de la vidéo promo (40 s) : voix off + musique + bruitages + ducking.

    python3 tools/promo-audio.py

Lit promo/content.js (textes de la voix off) et promo/build/cues.json (moments
des transitions et apparitions, exportés par tools/render-promo.mjs), puis écrit :
  - promo/build/mix.wav        la bande-son finale (48 kHz, stéréo)
  - promo/voice-timing.js      le minutage mot à mot des sous-titres

Dépendances : numpy, scipy, soundfile, sherpa-onnx (pip install ...).
La voix française « tom » (Piper, licence AGPL-3.0) est téléchargée
automatiquement dans tools/.cache/ au premier lancement.
"""
import hashlib
import json
import os
import subprocess
import sys
import tarfile
import urllib.request

import numpy as np
import soundfile as sf
from scipy import signal

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BUILD = os.path.join(ROOT, "promo", "build")
CACHE = os.path.join(ROOT, "tools", ".cache")
VOICE = "vits-piper-fr_FR-tom-medium"
VOICE_URL = f"https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/{VOICE}.tar.bz2"

SR = 48000
DUR = 40.0
N = int(SR * DUR)
BPM = 105
BEAT = 60 / BPM
DROP = 14 * BEAT  # 8,0 s
SPEED = 1.05  # débit de la voix (1 = normal)
DUCK_DB = 8.0

rng = np.random.default_rng(224)


# ───────────────────────── utilitaires ─────────────────────────
def t_axis(n):
    return np.arange(n) / SR


def env_exp(n, decay):
    return np.exp(-t_axis(n) / decay)


def butter(x, kind, freq, order=2):
    sos = signal.butter(order, freq, btype=kind, fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=0)


def place(bus, x, t, gain=1.0, pan=0.0):
    """Ajoute un son mono ou stéréo dans le bus stéréo à l'instant t (s)."""
    i = int(round(t * SR))
    if i >= len(bus) or i + len(x) <= 0:
        return
    if x.ndim == 1:
        left, right = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        x = np.stack([x * left * 1.414, x * right * 1.414], axis=1)
    j0, j1 = max(i, 0), min(i + len(x), len(bus))
    bus[j0:j1] += x[j0 - i : j1 - i] * gain


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def saw(f, n, phase=0.0):
    return 2 * ((t_axis(n) * f + phase) % 1.0) - 1


def reverb(x, seconds=1.8, mix=0.25):
    n = int(seconds * SR)
    ir = rng.standard_normal((n, 2)) * env_exp(n, seconds / 6)[:, None]
    ir = butter(ir, "lowpass", 6000)
    ir /= np.sqrt((ir ** 2).sum(axis=0))
    wet = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x)] for c in range(2)], axis=1)
    return x * (1 - mix) + wet * mix * 3


# ───────────────────────── instruments ─────────────────────────
def kick(gain=1.0):
    n = int(0.45 * SR)
    t = t_axis(n)
    f = 45 + 110 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.16)
    click = butter(rng.standard_normal(n), "highpass", 2500) * env_exp(n, 0.004) * 0.25
    return np.tanh((body + click) * 1.6) * gain


def clap():
    n = int(0.35 * SR)
    noise = butter(rng.standard_normal(n), "bandpass", [900, 5200])
    e = np.zeros(n)
    for k, d in enumerate([0, 0.011, 0.022]):
        i = int(d * SR)
        e[i:] += env_exp(n - i, 0.006 if k < 2 else 0.12)
    return noise * e * 0.5


def hat(open_=False):
    n = int((0.3 if open_ else 0.06) * SR)
    x = butter(rng.standard_normal(n), "highpass", 7000)
    return x * env_exp(n, 0.09 if open_ else 0.014) * 0.35


def pad_chord(notes, n, cutoff):
    x = np.zeros(n)
    for m in notes:
        for det in (-0.08, 0.08):
            x += saw(midi(m + det), n, rng.random())
    x /= len(notes) * 2
    a = np.minimum(t_axis(n) / 0.35, 1.0)
    r = np.minimum((n - np.arange(n)) / (0.25 * SR), 1.0)
    return butter(x * a * r, "lowpass", cutoff)


def bass_note(m, length):
    n = int(length * SR)
    t = t_axis(n)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.tanh(2.5 * np.sin(2 * np.pi * f * 2 * t))
    e = np.minimum(t / 0.008, 1) * np.exp(-t / (length * 0.9))
    return butter(x * e, "lowpass", 900) * 0.55


def pluck(m, length=0.4):
    n = int(length * SR)
    x = 0.6 * saw(midi(m), n) + 0.4 * np.sign(np.sin(2 * np.pi * midi(m) * t_axis(n)))
    return butter(x * env_exp(n, 0.11), "lowpass", 3200) * 0.22


# ───────────────────────── bruitages ─────────────────────────
def sfx_whoosh(length=0.5):
    n = int(length * SR)
    t = t_axis(n) / length
    noise = rng.standard_normal(n)
    lo = butter(noise, "lowpass", 900)
    hi = butter(noise, "bandpass", [2500, 9000])
    e = np.sin(np.pi * np.clip(t, 0, 1)) ** 2
    mono = (lo * (1 - t) + hi * t) * e
    pan = -0.8 + 1.6 * t
    st = np.stack([mono * np.cos((pan + 1) * np.pi / 4), mono * np.sin((pan + 1) * np.pi / 4)], axis=1)
    return st * 0.5


def sfx_pop():
    n = int(0.09 * SR)
    t = t_axis(n)
    f = 300 + 650 * np.exp(-t / 0.012)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(n, 0.022) * 0.45


def sfx_click():
    n = int(0.05 * SR)
    x = butter(rng.standard_normal(n), "highpass", 3000) * env_exp(n, 0.002)
    x += np.sin(2 * np.pi * 2100 * t_axis(n)) * env_exp(n, 0.006) * 0.4
    return x * 0.5


def sfx_key():
    n = int(0.04 * SR)
    x = butter(rng.standard_normal(n), "bandpass", [1500, 6000]) * env_exp(n, 0.004)
    return x * (0.18 + 0.08 * rng.random())


def sfx_ding():
    n = int(2.2 * SR)
    t = t_axis(n)
    f0 = midi(84)  # do 6, dans la tonalité
    x = np.zeros(n)
    for ratio, amp, dec in [(1, 1, 0.9), (2.0, 0.45, 0.5), (2.76, 0.3, 0.35), (5.4, 0.12, 0.15)]:
        x += amp * np.sin(2 * np.pi * f0 * ratio * t) * np.exp(-t / dec)
    return x * np.minimum(t / 0.002, 1) * 0.28


def sfx_riser(length):
    n = int(length * SR)
    t = t_axis(n) / length
    noise = butter(rng.standard_normal(n), "highpass", 1500)
    f = 180 * 2 ** (3 * t)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR)
    e = t ** 2.2
    return (noise * 0.35 + tone * 0.18) * e


def sfx_impact():
    n = int(1.6 * SR)
    t = t_axis(n)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t / 0.06)) / SR) * np.exp(-t / 0.45)
    air = butter(rng.standard_normal(n), "lowpass", 4000) * np.exp(-t / 0.25) * 0.25
    return np.tanh((boom + air) * 1.4) * 0.8


# ───────────────────────── musique ─────────────────────────
PROG = [
    [53, 56, 60, 63, 67],  # Fm9
    [49, 53, 56, 60, 63],  # Dbmaj9
    [44, 56, 60, 63, 67],  # Abmaj7
    [43, 55, 58, 63, 65],  # Eb/G
]
ROOTS = [41, 37, 44, 39]


def chord_at(beat):
    return int(np.floor((beat - 14) / 4)) % 4


def build_music():
    music = np.zeros((N, 2))
    pads = np.zeros((N, 2))
    bass = np.zeros((N, 2))
    total_beats = int(DUR / BEAT) + 1
    end_beat = 67  # 38,3 s : la batterie s'arrête, l'accord final résonne

    # Nappe (filtrée et froide avant le drop, ouverte après)
    for bar_start in range(-2, total_beats, 4):
        b0 = max(bar_start, 0)
        t0 = b0 * BEAT
        if t0 >= DUR:
            break
        length = (bar_start + 4 - b0) * BEAT + 0.3
        if bar_start + 4 > 14 and bar_start < 14:  # coupe la nappe juste avant le drop
            length = (14 - b0) * BEAT - 0.12
        if bar_start >= 64:
            length = DUR - t0
        cut = 650 if t0 < DROP else 2600
        x = pad_chord(PROG[chord_at(b0 + 0.01)], int(length * SR), cut)
        if t0 >= DROP and bar_start >= 64:
            x *= np.linspace(1, 0, len(x)) ** 1.5
        place(pads, x, t0, 0.55 if t0 < DROP else 0.42, pan=0)

    # Batterie
    for b in range(total_beats):
        t = b * BEAT
        if t >= DUR:
            break
        if b < 14:
            if 5 <= b < 13:
                place(music, kick(0.45), t)  # pouls feutré pendant le problème
            if 5 <= b < 13:
                place(music, hat(), t + BEAT / 2, 0.35, pan=0.3)
            continue
        if b >= end_beat:
            continue
        place(music, kick(), t)
        if b % 2 == 1:
            place(music, clap(), t, 0.8, pan=-0.05)
        for k in range(4):  # doubles croches avec léger swing
            tt = t + k * BEAT / 4 + (0.018 if k % 2 else 0)
            g = [0.55, 0.25, 0.8, 0.3][k]
            place(music, hat(open_=(k == 2 and b % 4 == 3)), tt, g, pan=0.25)

    # Basse
    for b in range(14, end_beat):
        t = b * BEAT
        root = ROOTS[chord_at(b + 0.01)]
        for off, ln in [(0, 0.75), (0.75, 0.25)] if b % 2 == 0 else [(0.5, 0.45)]:
            place(bass, bass_note(root, ln * BEAT), t + off * BEAT)

    # Arpège pluck (avec écho stéréo)
    arp = np.zeros((N, 2))
    for b in range(14, end_beat + 1):
        notes = PROG[chord_at(b + 0.01)]
        for k in range(2):
            m = notes[(b * 2 + k) % len(notes)] + 12
            place(arp, pluck(m), b * BEAT + k * BEAT / 2, 1.0, pan=0)
    d = int(BEAT * 0.75 * SR)
    echo = np.zeros_like(arp)
    echo[d:, 0] += arp[:-d, 0] * 0.45
    echo[2 * d :, 1] += arp[: -2 * d, 1] * 0.3
    arp = arp + echo

    # Sidechain : la nappe et la basse respirent sur chaque temps après le drop
    sc = np.ones(N)
    for b in range(14, end_beat):
        i = int(b * BEAT * SR)
        n = int(0.32 * SR)
        j = min(i + n, N)
        sc[i:j] = np.minimum(sc[i:j], 1 - 0.65 * np.exp(-t_axis(j - i) / 0.09))
    pads *= sc[:, None]
    bass *= sc[:, None]

    # Vinyle : craquements discrets
    vinyl = butter(rng.standard_normal(N), "bandpass", [1000, 6000]) * 0.004
    for i in rng.integers(0, N, 260):
        vinyl[i : i + 40] += rng.standard_normal(min(40, N - i)) * 0.05
    music += np.stack([vinyl, vinyl * 0.8], axis=1)

    music += pads + bass * 0.9 + arp * 0.8
    music = reverb(music, 1.6, 0.18)

    # Montée avant le drop + coupure sèche + impact
    rise = 5.75
    place(music, sfx_riser(DROP - rise - 0.1), rise, 0.9)
    i0, i1 = int((DROP - 0.1) * SR), int(DROP * SR)
    music[i0:i1] *= np.linspace(1, 0.0, i1 - i0)[:, None]
    place(music, sfx_impact(), DROP, 0.9)

    # Fondu final
    f0 = int(38.6 * SR)
    music[f0:] *= np.linspace(1, 0, N - f0)[:, None] ** 2
    return music


# ───────────────────────── voix off ─────────────────────────
def load_content():
    code = (
        "global.window={};require(process.argv[1]);"
        "process.stdout.write(JSON.stringify(window.PROMO))"
    )
    out = subprocess.check_output(["node", "-e", code, os.path.join(ROOT, "promo", "content.js")])
    return json.loads(out)


def ensure_voice():
    d = os.path.join(CACHE, VOICE)
    if os.path.isdir(d):
        return d
    os.makedirs(CACHE, exist_ok=True)
    arc = d + ".tar.bz2"
    print("Téléchargement de la voix", VOICE, "…")
    urllib.request.urlretrieve(VOICE_URL, arc)
    with tarfile.open(arc) as tf:
        tf.extractall(CACHE, filter="data")
    os.remove(arc)
    return d


def synth_voice(lines):
    import sherpa_onnx

    d = ensure_voice()
    model = [f for f in os.listdir(d) if f.endswith(".onnx")][0]
    cfg = sherpa_onnx.OfflineTtsConfig(
        model=sherpa_onnx.OfflineTtsModelConfig(
            vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                model=os.path.join(d, model),
                tokens=os.path.join(d, "tokens.txt"),
                data_dir=os.path.join(d, "espeak-ng-data"),
            ),
            num_threads=4,
        )
    )
    tts = None
    cache = os.path.join(BUILD, "vo")
    os.makedirs(cache, exist_ok=True)
    vo = np.zeros(N)
    timing = []
    for k, line in enumerate(lines):
        say = line.get("say") or line["text"]
        speed = line.get("speed", SPEED)
        # une réplique déjà générée est réutilisée telle quelle (la synthèse
        # varie légèrement à chaque fois, le minutage des sous-titres aussi)
        key = hashlib.sha1(f"{VOICE}|{speed}|{say}".encode()).hexdigest()[:12]
        wav = os.path.join(cache, key + ".wav")
        if os.path.exists(wav):
            x, _ = sf.read(wav)
        else:
            tts = tts or sherpa_onnx.OfflineTts(cfg)
            a = tts.generate(say, sid=0, speed=speed)
            x = signal.resample_poly(np.asarray(a.samples, dtype=np.float64), SR, a.sample_rate)
            # rogne les silences de début et de fin
            e = np.convolve(np.abs(x), np.ones(480) / 480, mode="same")
            on = np.where(e > 0.02 * e.max())[0]
            x = x[max(on[0] - 480, 0) : on[-1] + 2400]
            # voix : nettoyage du bas, légère présence, compression douce
            x = butter(x, "highpass", 90)
            x = x + 0.3 * butter(x, "bandpass", [2000, 5000])
            x = np.tanh(x / np.abs(x).max() * 1.8) / np.tanh(1.8)
            sf.write(wav, x.astype(np.float32), SR)
        start = line["at"]
        end = start + len(x) / SR
        nxt = lines[k + 1]["at"] if k + 1 < len(lines) else DUR
        flag = "  ⚠ chevauche la réplique suivante" if end > nxt else ""
        print(f"  {start:5.2f} → {end:5.2f} s  {line['text']}{flag}")
        place_mono(vo, x * 0.5, start)
        timing.append({"start": round(start, 3), "end": round(end, 3), "words": word_times(line["text"], x, start)})
    return vo, timing


def place_mono(bus, x, t):
    i = int(round(t * SR))
    j = min(i + len(x), len(bus))
    bus[i:j] += x[: j - i]


def word_times(text, x, start):
    """Répartit les mots du sous-titre sur la durée parlée, au prorata des syllabes."""
    words = text.split()
    w = np.array([max(sum(c in "aeiouyàâéèêëîïôûùAEIOUYÉÈ0123456789" for c in wd), 1) + 0.4 for wd in words])
    # les pauses de ponctuation prennent un peu de temps
    w += np.array([0.9 if wd[-1] in ",.?!…:" else 0 for wd in words])
    dur = len(x) / SR
    edges = np.concatenate([[0], np.cumsum(w) / w.sum()]) * dur
    return [[round(start + edges[i], 3), round(start + edges[i + 1], 3)] for i in range(len(words))]


# ───────────────────────── mixage ─────────────────────────
def build_sfx(cues):
    bus = np.zeros((N, 2))
    gen = {
        "whoosh": lambda: sfx_whoosh(),
        "pop": lambda: sfx_pop(),
        "click": lambda: sfx_click(),
        "key": lambda: sfx_key(),
        "ding": lambda: sfx_ding(),
    }
    gains = {"whoosh": 0.55, "pop": 0.5, "click": 0.7, "key": 0.8, "ding": 0.75}
    for c in cues:
        kind = c["type"]
        if kind not in gen:
            continue
        x = gen[kind]()
        t = c["t"] - (0.25 if kind == "whoosh" else 0)  # le souffle culmine sur la coupe
        place(bus, x, t, gains[kind], pan=c.get("pan", 0))
    return bus


def main():
    os.makedirs(BUILD, exist_ok=True)
    content = load_content()
    cues_path = os.path.join(BUILD, "cues.json")
    cues = json.load(open(cues_path)) if os.path.exists(cues_path) else []
    if not cues:
        print("⚠ promo/build/cues.json absent : lance plutôt node tools/render-promo.mjs")

    print("Voix off :")
    vo, timing = synth_voice(content["voice"])
    print("Musique…")
    music = build_music()
    sfx = build_sfx(cues)

    # Ducking : la musique baisse de 8 dB pendant la voix
    act = np.convolve(np.abs(vo), np.ones(960) / 960, mode="same") > 0.004
    act = act.astype(float)
    att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.3 * SR))
    g = signal.lfilter([1 - rel], [1, -rel], act)  # enveloppe lissée
    g = np.clip(np.maximum(g, signal.lfilter([1 - att], [1, -att], act)), 0, 1)
    duck = 10 ** (-DUCK_DB * g / 20)
    music *= duck[:, None]

    voice = np.stack([vo, vo], axis=1)
    mix = music * 0.5 + sfx * 0.7 + voice * 1.0
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    mix *= 0.89 / np.abs(mix).max()
    sf.write(os.path.join(BUILD, "mix.wav"), mix.astype(np.float32), SR)

    with open(os.path.join(ROOT, "promo", "voice-timing.js"), "w") as f:
        f.write("/* Généré par tools/promo-audio.py — ne pas modifier à la main. */\n")
        f.write("window.PROMO_TIMING = " + json.dumps(timing, ensure_ascii=False) + ";\n")
    print("✔ promo/build/mix.wav et promo/voice-timing.js")


if __name__ == "__main__":
    sys.exit(main())
