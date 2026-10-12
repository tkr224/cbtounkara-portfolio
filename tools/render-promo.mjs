/*
 * Exporte la vidéo promo (40 s) en MP4 avec sa bande-son, image par image.
 *
 *   node tools/render-promo.mjs            → video/promo-9x16.mp4 (1080×1920)
 *   node tools/render-promo.mjs --wide     → video/promo-16x9.mp4 (1920×1080)
 *   node tools/render-promo.mjs --thumb    → video/promo-miniature.jpg (1280×720)
 *   options : --fps 30 · --stills 1,8.5,20 (images de contrôle) · --no-audio
 *
 * Nécessite Playwright (Chromium), ffmpeg, et pour le son : Python 3 avec
 * numpy, scipy, soundfile et sherpa-onnx (voir tools/promo-audio.py).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync, execSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = path.join(ROOT, "promo", "build");
const args = process.argv.slice(2);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const wide = args.includes("--wide");
const thumb = args.includes("--thumb");
const fps = Number(opt("--fps")) || 30;
const stills = opt("--stills");
const [W, H] = thumb ? [1280, 720] : wide ? [1920, 1080] : [1080, 1920];
const out = path.join(ROOT, "video", thumb ? "promo-miniature.jpg" : wide ? "promo-16x9.mp4" : "promo-9x16.mp4");

let playwright;
try {
  playwright = await import("playwright");
} catch {
  const req = createRequire(path.join(execSync("npm root -g").toString().trim(), "noop.js"));
  playwright = req("playwright");
}

// Petit serveur statique
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".wav": "audio/wav",
};
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const target = file.endsWith(path.sep) ? path.join(file, "index.html") : file;
  if (!target.startsWith(ROOT) || !fs.existsSync(target)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": types[path.extname(target)] || "application/octet-stream" });
  fs.createReadStream(target).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/promo/`;

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

async function open() {
  await page.goto(base + (thumb ? "miniature.html" : "index.html?render"), { waitUntil: "networkidle" });
  if (!thumb) await page.waitForFunction(() => window.__promo);
}

fs.mkdirSync(BUILD, { recursive: true });
fs.mkdirSync(path.dirname(out), { recursive: true });

if (thumb) {
  await open();
  await page.waitForTimeout(300);
  await page.screenshot({ path: out, type: "jpeg", quality: 92 });
  console.log(`✔ ${path.relative(ROOT, out)} (${W}×${H})`);
} else {
  // 1. Moments des bruitages (exportés par la timeline) puis bande-son
  await open();
  const cues = await page.evaluate(() => window.__promo.cues);
  fs.writeFileSync(path.join(BUILD, "cues.json"), JSON.stringify(cues, null, 1));
  const mix = path.join(BUILD, "mix.wav");
  if (!args.includes("--no-audio") || !fs.existsSync(mix)) {
    const r = spawnSync("python3", [path.join(ROOT, "tools", "promo-audio.py")], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("promo-audio.py a échoué");
  }
  await open(); // recharge avec le minutage des sous-titres à jour

  const duration = await page.evaluate(() => window.__promo.duration);
  const seekTo = (t) =>
    page.evaluate(
      (t) => new Promise((r) => { window.__promo.seek(t); requestAnimationFrame(() => requestAnimationFrame(r)); }),
      t
    );

  if (stills) {
    const dir = path.join(BUILD, wide ? "stills-16x9" : "stills-9x16");
    fs.mkdirSync(dir, { recursive: true });
    for (const s of stills.split(",").map(Number)) {
      await seekTo(s);
      await page.screenshot({ path: path.join(dir, `${s.toFixed(2).padStart(5, "0")}.jpg`), type: "jpeg", quality: 80 });
    }
    console.log(`✔ images de contrôle dans ${path.relative(ROOT, dir)}`);
  } else {
    const total = Math.round(duration * fps);
    const ff = spawn(
      "ffmpeg",
      [
        "-y", "-loglevel", "error",
        "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
        "-i", mix,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
        "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-t", String(duration), "-movflags", "+faststart", out,
      ],
      { stdio: ["pipe", "inherit", "inherit"] }
    );
    for (let i = 0; i < total; i++) {
      await seekTo(i / fps);
      const buf = await page.screenshot({ type: "jpeg", quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
      if (i % fps === 0) process.stdout.write(`\r${Math.round((i / total) * 100)} %`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on("close", r));
    console.log(`\r✔ ${path.relative(ROOT, out)} (${W}×${H}, ${fps} fps, ${duration}s)`);
  }
}

await browser.close();
server.close();
