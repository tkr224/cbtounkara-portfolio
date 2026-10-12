/*
 * Vidéo promo (40 s, 105 BPM) — même principe que assets/js/intro.js :
 * chaque animation a un départ et une durée (Web Animations API), ce qui
 * permet de la jouer en direct ou de la « scrubber » image par image pour
 * l'export (tools/render-promo.mjs, mode ?render).
 *
 * Toutes les coupes tombent sur un temps : 1 temps = 60 / 105 s.
 */
(function () {
  const P = window.PROMO;
  const TIMING = window.PROMO_TIMING || [];
  const params = new URLSearchParams(location.search);
  const RENDER = params.has("render");
  const DURATION = 40;
  const B = 60 / P.bpm;
  const beat = (n) => n * B;
  const stage = document.getElementById("stage");

  // Courbes : entrées = cubic-bezier(0.2, 0.7, 0.2, 1), déplacements = ease-in-out
  const ENTER = "cubic-bezier(0.2, 0.7, 0.2, 1)";
  const MOVE = "cubic-bezier(0.42, 0, 0.58, 1)";
  const EXIT = "cubic-bezier(0.7, 0, 0.84, 0)";
  const BACK = "cubic-bezier(0.34, 1.56, 0.64, 1)";
  const STAGGER = 0.08;

  let list = [];
  const ticks = [];
  const cues = [];

  function anim(el, t, d, kf, easing = ENTER, extra = {}) {
    if (!el) return null;
    const a = el.animate(kf, { delay: t * 1000, duration: d * 1000, fill: "forwards", easing, ...extra });
    list.push(a);
    return a;
  }
  const cue = (t, type, pan = 0) => cues.push({ t: Math.round(t * 1000) / 1000, type, pan });
  const IN = (from = "translateY(4vmin)", blur = "1vmin") => [
    { opacity: 0, transform: from, filter: `blur(${blur})` },
    { opacity: 1, transform: "none", filter: "blur(0)" },
  ];
  const OUT = (to = "translateY(-4vmin)", blur = "1vmin") => [
    { opacity: 1, transform: "none", filter: "blur(0)" },
    { opacity: 0, transform: to, filter: `blur(${blur})` },
  ];
  const REVEAL = [{ transform: "translateY(140%)" }, { transform: "translateY(0)" }];
  const HIDE = [{ transform: "translateY(0)" }, { transform: "translateY(-140%)" }];

  const esc = (s) =>
    String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const nnbsp = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const words = (i) => (TIMING[i] ? TIMING[i].words : null);
  // départ du mot n de la réplique i (sinon valeur de secours)
  const wordAt = (i, n, fallback) => (words(i) && words(i)[n] ? words(i)[n][0] : fallback);

  const CODE_SVG = `<svg viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d="M32 24 L10 50 L32 76"/><path pathLength="1" d="M58 14 L42 86"/><path pathLength="1" d="M68 24 L90 50 L68 76"/></svg>`;
  const SEARCH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>`;
  const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path pathLength="1" d="M5 12.5 L10 17.5 L19 7"/></svg>`;
  const CHAT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5 L5.3 15.6 A8 8 0 1 1 8.4 18.7 Z"/></svg>`;
  const GLOBE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 C15 6 15 18 12 21 M12 3 C9 6 9 18 12 21"/></svg>`;
  const CURSOR_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.3 L18 14.3 Z" fill="#fff" stroke="#1d1d1f" stroke-width="1.4" stroke-linejoin="round"/></svg>`;

  // ───────────── Plan des scènes (en temps musicaux) ─────────────
  const T = {
    hook: [0, beat(5)],
    search: [beat(5), beat(10)],
    empty: [beat(10), beat(14)],
    drop: beat(14), // 8,0 s
    create: [beat(14), beat(17)],
    promise: [beat(17), beat(21)],
    proofs: [beat(21), beat(51)], // 12,0 → 29,1 s
    price: [beat(51), beat(55)],
    perks: [beat(55), beat(60)],
    who: [beat(60), beat(64)],
    ctas: [beat(64), beat(68)],
    logo: [beat(68), DURATION],
  };

  // Plans de preuves : une capture = un cadre ; les projets sans capture
  // sont regroupés dans « Et aussi » (aucune image inventée).
  function proofShots() {
    const withCap = P.projects.filter((p) => p.capture);
    const others = P.projects.filter((p) => !p.capture);
    let shots = withCap.map((p) => ({ kind: "browser", p }));
    if (others.length) shots.push({ kind: "also", names: others.map((p) => p.name) });
    shots.push({ kind: "stack" });
    for (const p of withCap) {
      if (shots.length >= 6) break;
      if (p.mobile) shots.splice(shots.findIndex((s) => s.p === p) + 1, 0, { kind: "phone", p });
    }
    while (shots.length > 6) shots.splice(shots.findIndex((s) => s.kind === "stack"), 1);
    return shots;
  }

  // ───────────── Gabarit ─────────────
  function template(shots) {
    const mask = (txt, cls = "") => `<span class="mask"><span class="${cls}">${esc(txt)}</span></span>`;
    const hookCls = ["", "", "muted", ""];
    const hook = P.hook
      .map((w, i) =>
        i === P.hook.length - 1 && w.includes(" ")
          ? `<span class="mask"><span>${esc(w.split(" ")[0])} <span class="accent">${esc(w.split(" ").slice(1).join(" "))}</span></span></span>`
          : mask(w, hookCls[i])
      )
      .join("");

    const label = (p, type, live) => `
      <div class="label-pos"><div class="label ia">
        <div class="label__name">${esc(p.name)}</div>
        ${type ? `<div class="label__type">${esc(type)}</div>` : ""}
        ${live ? `<div class="live"><i></i>En production</div>` : ""}
      </div></div>`;

    const shotHtml = shots
      .map((s) => {
        if (s.kind === "browser")
          return `<section class="sc proj" data-shot>
            <div class="ghost-pos"><div class="ghost ia">${esc(s.p.name)}</div></div>
            <div class="rig"><div class="rig-in ia"><div class="par"><div class="browser">
              <div class="browser__bar"><i></i><i></i><i></i><span class="browser__url">${esc(s.p.url || s.p.name)}</span></div>
              <div class="viewport"><img src="${esc(s.p.capture)}" alt="" /></div>
            </div></div></div></div>
            ${label(s.p, s.p.type, s.p.live)}
          </section>`;
        if (s.kind === "phone")
          return `<section class="sc proj proj--phone" data-shot>
            <div class="ghost-pos"><div class="ghost ia">${esc(s.p.name)}</div></div>
            <div class="rig"><div class="rig-in ia"><div class="par"><div class="phone">
              <div class="viewport"><img src="${esc(s.p.mobile)}" alt="" /></div>
            </div></div></div></div>
            ${label(s.p, "Version mobile", s.p.live)}
          </section>`;
        if (s.kind === "also")
          return `<section class="sc" data-shot><div class="also">
            <div class="eyebrow ia">Et aussi</div>
            ${s.names.map((n) => `<div class="chip ia">${esc(n)}</div>`).join("")}
          </div></section>`;
        return `<section class="sc" data-shot><div class="stack">
            <div class="eyebrow ia">Le tout codé en</div>
            <div class="stack__word ia">${esc(P.stack[0])}</div>
            <div class="stack__plus ia">+</div>
            <div class="stack__word grad ia">${esc(P.stack[1])}</div>
          </div></section>`;
      })
      .join("");

    const [first, ...rest] = P.name.split(" ");
    const avatar = P.photo
      ? `<div class="avatar ia" data-k="avatar"><img src="${esc(P.photo)}" alt="" /></div>`
      : `<div class="mark ia" data-k="avatar">${CODE_SVG}</div>`;
    return `
      <div class="bg-light"><div class="mesh" data-k="mesh"><i class="m1"></i><i class="m2"></i><i class="m3"></i><i class="m4"></i></div></div>
      <div class="bg-night" data-k="night"><div class="cold" data-k="cold"></div></div>

      <section class="sc" data-k="s1"><div class="hook" data-k="hook">${hook}</div></section>

      <section class="sc" data-k="s2"><div class="searchbox ia" data-k="search">
        ${SEARCH_SVG}<span class="searchbox__text"><span data-k="typed"></span><i class="caret" data-k="caret"></i></span>
      </div></section>

      <section class="sc" data-k="s3"><div class="empty" data-k="empty">
        <div class="empty__zero ia" data-k="zero">0</div>
        <div class="empty__label ia" data-k="zeroLabel">résultat</div>
        <div class="empty__rows"><i class="ia"></i><i class="ia"></i><i class="ia"></i></div>
      </div></section>

      <section class="sc" data-k="s4"><div class="title" data-k="create">
        <span class="ia">Je</span><span class="ia">crée</span><span class="ia">ton</span><span class="ia grad">site.</span>
      </div></section>

      <section class="sc" data-k="s5"><div class="promise" data-k="promise">
        ${mask(P.promise[0])}${mask(P.promise[1], "ink2")}
        <span class="mask"><span>${esc(P.promise[2].split(" ").slice(0, -1).join(" "))} <span class="grad">${esc(P.promise[2].split(" ").slice(-1)[0])}</span></span></span>
      </div></section>

      ${shotHtml}

      <section class="sc" data-k="s7"><div class="offer">
        <div class="offer__from ia" data-k="from">Dès</div>
        <div class="offer__price ia" data-k="price"><div class="offer__glow" data-k="glow"></div><span data-k="count">0</span></div>
        <div class="offer__cur ia grad" data-k="cur">GNF</div>
        <div class="tiers ia" data-k="tiers">
          ${P.prices.map((p) => `<div class="tier ia"><span>${esc(p.label)}</span><b>${nnbsp(p.value)} <small>GNF</small></b></div>`).join("")}
        </div>
      </div></section>

      <section class="sc" data-k="s8"><div class="perks">
        ${P.perks.map((p) => `<div class="perk ia"><span class="perk__ic">${CHECK_SVG}</span><span>${esc(p.title)}${p.sub ? `<small>${esc(p.sub)}</small>` : ""}</span></div>`).join("")}
      </div></section>

      <section class="sc" data-k="s9"><div class="who">
        ${avatar}
        <div class="who__name">${mask(first)} ${mask(rest.join(" "))}</div>
        <div class="who__role ia" data-k="role">${esc(P.role)} · ${esc(P.city)}</div>
      </div></section>

      <section class="sc" data-k="s10"><div class="ctas" data-k="ctas">
        <div class="ctas__name ia">Écris-moi</div>
        <div class="btn btn--primary ia" data-k="btnWa">${CHAT_SVG}<span>WhatsApp${P.whatsapp ? `<small>${esc(P.whatsapp)}</small>` : ""}</span></div>
        <div class="btn btn--glass ia" data-k="btnWeb">${GLOBE_SVG}<span>${esc(P.domain)}</span></div>
        <div class="cursor ia" data-k="cursor">${CURSOR_SVG}</div>
      </div></section>

      <section class="sc" data-k="s11"><div class="logo">
        <div class="mark ia" data-k="logoMark">${CODE_SVG}</div>
        <div class="logo__name" data-k="logoName">${[...P.name].map((c) => `<span class="ia">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("")}</div>
        <div class="logo__url ia" data-k="logoUrl">${esc(P.domain)}</div>
      </div></section>

      <div class="leak" data-k="leak"><i class="l1"></i><i class="l2"></i><i class="l3"></i></div>
      <div class="flash" data-k="flash"></div>
      <div class="vignette" data-k="vigDark"></div>
      <div class="vignette vignette--light ia" data-k="vigLight"></div>
      <div class="captions"><div class="cap" data-k="cap"></div></div>
      <canvas class="grain" data-k="grain"></canvas>
      <div class="fadeout" data-k="fadeout"></div>
    `;
  }

  // ───────────── Timeline ─────────────
  function timeline(shots) {
    const k = {};
    stage.querySelectorAll("[data-k]").forEach((el) => (k[el.dataset.k] = el));
    const $$ = (el, sel) => [...el.querySelectorAll(sel)];

    // Fond « mesh » : dérive lente et continue
    const drift = [
      ["translate(0,0) scale(1)", "translate(-10vw,6vh) scale(1.15)", 7],
      ["translate(0,0) scale(1)", "translate(12vw,-8vh) scale(1.1)", 8.5],
      ["translate(0,0) scale(.9)", "translate(-14vw,-10vh) scale(1.2)", 6],
      ["translate(0,0) scale(1)", "translate(8vw,10vh) scale(1.1)", 9],
    ];
    $$(k.mesh, "i").forEach((b, i) =>
      anim(b, 0, drift[i][2], [{ transform: drift[i][0] }, { transform: drift[i][1] }], MOVE, {
        iterations: Infinity,
        direction: "alternate",
      })
    );

    // ── 1. Accroche (0 → 2,9 s) : mot par mot, mask reveal, push-in lent
    const hookWords = $$(k.hook, ".mask > span");
    const hookIdx = [0, 1, 2, 4]; // Ton · business · n'a (pas) · de (site ?)
    hookWords.forEach((w, i) => {
      const t = Math.max(0.12, wordAt(0, hookIdx[i], 0.2 + i * 0.36) - 0.1);
      anim(w, t, 0.5, REVEAL);
      cue(t + 0.05, "pop", -0.3 + i * 0.2);
    });
    anim(k.s1, 0, T.hook[1] + 0.2, [{ transform: "scale(1)" }, { transform: "scale(1.07)" }], MOVE);
    hookWords.forEach((w, i) => anim(w, T.hook[1] - 0.36 + i * 0.05, 0.3, HIDE, EXIT));
    cue(T.hook[1], "whoosh");

    // ── 2a. Problème : la recherche (2,9 → 5,7 s)
    const [s0, s1] = T.search;
    anim(k.search, s0 + 0.06, 0.6, IN("translateY(5vmin) scale(.94)", "0.8vmin"));
    cue(s0 + 0.08, "pop");
    anim(k.s2, s0, s1 - s0, [{ transform: "scale(1)" }, { transform: "scale(1.05)" }], MOVE);
    const typeStart = s0 + 0.5;
    const typeEnd = s0 + 1.85;
    const q = P.search;
    for (let i = 0; i < q.length; i++) if (q[i] !== " ") cue(typeStart + (i / q.length) * (typeEnd - typeStart), "key", 0.2);
    ticks.push((t) => {
      const n = Math.max(0, Math.min(q.length, Math.floor(((t - typeStart) / (typeEnd - typeStart)) * q.length)));
      if (k.typed.textContent.length !== n) k.typed.textContent = q.slice(0, n);
      const typing = t > typeStart && t < typeEnd;
      k.caret.style.opacity = typing || (t * 2) % 1 < 0.55 ? 1 : 0;
    });
    anim(k.search, s0 + 2.05, 0.3, [{ transform: "scale(1)" }, { transform: "scale(.96)", offset: 0.4 }, { transform: "scale(1)" }], MOVE);
    cue(s0 + 2.1, "click");
    anim(k.search, s1 - 0.3, 0.3, OUT("translateY(-5vmin) scale(.98)", "1vmin"), EXIT);
    cue(s1, "whoosh");

    // ── 2b. « 0 résultat » : froid, puis push-in qui accélère (speed ramp)
    const [e0, e1] = T.empty;
    anim(k.zero, e0 + 0.04, 0.6, IN("scale(1.25)", "2vmin"));
    cue(e0 + 0.06, "pop");
    anim(k.zeroLabel, e0 + 0.04 + STAGGER, 0.6, IN());
    const rows = $$(k.empty, ".empty__rows i");
    rows.forEach((r, i) => {
      anim(r, e0 + 0.2 + i * STAGGER, 0.5, IN("translateY(2vmin)", "0.4vmin"));
      anim(r, e0 + 0.75 + i * STAGGER, 0.6, [{ opacity: 1 }, { opacity: 0.25 }, { opacity: 0.9 }, { opacity: 0.15 }], MOVE);
      anim(r, e0 + 1.35 + i * STAGGER, 0.3, OUT("translateY(1vmin)", "0.4vmin"), EXIT);
    });
    anim(k.empty, e0 + 1.2, 0.3, [{ transform: "scale(1)" }, { transform: "scale(.95)" }], MOVE); // anticipation
    anim(k.s3, e1 - 0.02, 0.04, [{ opacity: 1 }, { opacity: 0 }], MOVE);
    anim(k.empty, e0 + 1.5, e1 - e0 - 1.52, [{ transform: "scale(.95)", filter: "blur(0)" }, { transform: "scale(3.2)", filter: "blur(1.2vmin)" }], EXIT);

    // ── 3. Bascule (8,0 s) : flash, light leak, la marque explose
    const D = T.drop;
    anim(k.flash, D - 0.08, 0.08, [{ opacity: 0 }, { opacity: 1 }], EXIT);
    anim(k.flash, D, 0.55, [{ opacity: 1 }, { opacity: 0 }], ENTER);
    anim(k.night, D - 0.02, 0.04, [{ opacity: 1 }, { opacity: 0 }], MOVE);
    anim(k.vigDark, D - 0.02, 0.04, [{ opacity: 1 }, { opacity: 0 }], MOVE);
    anim(k.vigLight, D, 0.4, [{ opacity: 0 }, { opacity: 1 }], MOVE);
    anim(k.leak, D - 0.1, 1.2, [
      { opacity: 0, transform: "translateX(-40vmin) rotate(-8deg)" },
      { opacity: 1, offset: 0.3 },
      { opacity: 0, transform: "translateX(50vmin) rotate(6deg)" },
    ], MOVE);
    anim(k.mesh, D, 0.8, [
      { opacity: 0, transform: "scale(.25)" },
      { opacity: 1, transform: "scale(1.08)", offset: 0.7 },
      { opacity: 1, transform: "scale(1)" },
    ]);
    // « Je crée ton site. » arrive au ralenti (sortie du speed ramp)
    const [c0, c1] = T.create;
    $$(k.create, "span").forEach((w, i) => {
      anim(w, c0 + 0.04 + i * STAGGER, 0.8, IN("scale(1.6)", "2vmin"));
      anim(w, c1 - 0.3 + i * 0.04, 0.3, OUT("translateY(-5vmin)", "0.8vmin"), EXIT);
    });
    cue(c0 + 0.3, "pop");
    anim(k.s4, c0, c1 - c0, [{ transform: "scale(1)" }, { transform: "scale(1.05)" }], MOVE);
    cue(c1, "whoosh");

    // « Rapide. Élégant. Pensé pour convertir. » calé sur la voix
    const [p0, p1] = T.promise;
    const lines = $$(k.promise, ".mask > span");
    const promiseWord = [0, 1, 2];
    lines.forEach((l, i) => {
      const t = Math.max(p0 + 0.02, wordAt(3, promiseWord[i], p0 + 0.1 + i * 0.6) - 0.08);
      anim(l, t, 0.5, REVEAL);
      cue(t + 0.05, "pop", -0.2 + i * 0.2);
    });
    // Match cut : le bloc de texte devient le cadre du navigateur
    anim(k.promise, p1 - 0.5, 0.35, [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.12)" }], EXIT);

    // ── 4. Preuves (12,0 → 29,1 s) : 6 plans de 5 temps
    const [q0, q1] = T.proofs;
    const len = (q1 - q0) / shots.length;
    $$(stage, "[data-shot]").forEach((sec, i) => {
      const s = shots[i];
      const t0 = q0 + i * len;
      const t1 = t0 + len;
      if (i > 0) cue(t0, "whoosh");
      if (s.kind === "browser" || s.kind === "phone") {
        const rig = sec.querySelector(".rig-in");
        const par = sec.querySelector(".par");
        const tilt = sec.querySelector(".browser, .phone");
        const ghost = sec.querySelector(".ghost");
        const labelEl = sec.querySelector(".label");
        const img = sec.querySelector(".viewport img");
        const vp = sec.querySelector(".viewport");
        if (i === 0) {
          // le cadre naît du texte (match cut)
          anim(rig, t0 - 0.5, 0.5, [{ opacity: 0, transform: "scale(.55)" }, { opacity: 1, transform: "scale(1)" }], ENTER);
          anim(img, t0 - 0.5, 0.01, [{ opacity: 0 }, { opacity: 0 }], MOVE);
          anim(img, t0, 0.35, [{ opacity: 0 }, { opacity: 1 }], MOVE);
        } else {
          anim(rig, t0, 0.7, IN("translateY(10vmin) scale(.9)", "1vmin"));
        }
        anim(labelEl, t0 + STAGGER, 0.7, IN("translateY(4vmin) scale(.96)", "0.8vmin"));
        cue(t0 + STAGGER + 0.1, "pop", 0.3);
        anim(ghost, t0 + 2 * STAGGER, 0.8, [{ opacity: 0, transform: "translateY(4vmin)" }, { opacity: 1, transform: "none" }]);
        // parallax 3D léger : chaque plan bouge à sa vitesse
        anim(par, t0, len, [{ transform: "translateY(2vmin)" }, { transform: "translateY(-2vmin)" }], MOVE);
        anim(ghost, t0 + 0.8, len - 0.8, [{ transform: "none" }, { transform: "translateY(3vmin)" }], MOVE);
        anim(sec.querySelector(".label-pos"), t0, len, [{ translate: "0 1.5vmin" }, { translate: "0 -3vmin" }], MOVE);
        anim(tilt, t0, len, [
          { transform: `rotateY(${s.kind === "phone" ? 10 : -7}deg) rotateX(5deg)` },
          { transform: `rotateY(${s.kind === "phone" ? 3 : -2}deg) rotateX(2deg)` },
        ], MOVE);
        // zoom lent + défilement fluide dans la capture
        const scroll = Math.max(0, Math.min(img.offsetHeight - vp.offsetHeight, vp.offsetHeight * 0.95));
        anim(img, t0 + 0.25, len - 0.25, [
          { transform: "translateY(0) scale(1)" },
          { transform: `translateY(${-scroll}px) scale(1.05)` },
        ], MOVE);
        // sortie
        anim(rig, t1 - 0.3, 0.3, OUT("translateY(-6vmin) scale(1.03)", "1vmin"), EXIT);
        anim(labelEl, t1 - 0.3 + 0.04, 0.26, OUT("translateY(-4vmin)", "0.6vmin"), EXIT);
        anim(ghost, t1 - 0.3, 0.3, [{ opacity: 1 }, { opacity: 0 }], EXIT);
        const dot = sec.querySelector(".live i");
        if (dot)
          anim(dot, t0 + 0.6, 0.8, [
            { boxShadow: "0 0 0 0 rgba(0,113,227,.55)" },
            { boxShadow: "0 0 0 1.6vmin rgba(0,113,227,0)" },
          ], MOVE, { iterations: 3 });
      } else {
        const items = $$(sec, ".ia");
        items.forEach((el, j) => {
          anim(el, t0 + 0.05 + j * STAGGER, 0.6, [
            { opacity: 0, transform: "translateY(5vmin) scale(.8)" },
            { opacity: 1, transform: "none" },
          ], BACK);
          if (j > 0) cue(t0 + 0.12 + j * STAGGER, "pop", -0.3 + j * 0.15);
          anim(el, t1 - 0.3 + j * 0.03, 0.27, OUT("translateY(-4vmin)", "0.8vmin"), EXIT);
        });
        anim(sec.firstElementChild, t0, len, [{ transform: "scale(1)" }, { transform: "scale(1.05)" }], MOVE);
      }
    });

    // ── 5. Offre : « Dès 700 000 GNF » (compteur avec overshoot)
    const [o0, o1] = T.price;
    cue(o0, "whoosh");
    anim(k.leak, o0 - 0.1, 0.8, [
      { opacity: 0, transform: "translateX(-40vmin)" },
      { opacity: 0.45, offset: 0.35 },
      { opacity: 0, transform: "translateX(40vmin)" },
    ], MOVE);
    anim(k.from, o0 + 0.04, 0.5, IN());
    anim(k.price, o0 + 0.04 + STAGGER, 0.6, IN("scale(.9)", "1vmin"));
    anim(k.cur, o0 + 0.04 + 2 * STAGGER, 0.5, IN());
    const lowest = P.prices.reduce((a, b) => (b.value < a.value ? b : a)).value;
    const cs = o0 + 0.2;
    const cd = 0.8;
    const back = (x) => {
      const c1 = 1.2;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    };
    ticks.push((t) => {
      const x = Math.max(0, Math.min(1, (t - cs) / cd));
      const v = Math.round((back(x) * lowest) / 1000) * 1000;
      const txt = nnbsp(x >= 1 ? lowest : v);
      if (k.count.textContent !== txt) k.count.textContent = txt;
    });
    cue(cs + cd, "ding");
    anim(k.price, cs + cd - 0.02, 0.45, [{ transform: "scale(1)" }, { transform: "scale(1.06)", offset: 0.4 }, { transform: "scale(1)" }], MOVE);
    anim(k.glow, cs + cd - 0.05, 0.8, [{ opacity: 0.4, transform: "scale(.9)" }, { opacity: 1, transform: "scale(1.1)" }], MOVE);
    anim(k.tiers, cs + cd + 0.1, 0.5, IN("translateY(4vmin)", "0.6vmin"));
    $$(k.tiers, ".tier").forEach((r, i) => {
      anim(r, cs + cd + 0.15 + i * STAGGER, 0.45, IN("translateY(2vmin)", "0.3vmin"));
      cue(cs + cd + 0.18 + i * STAGGER, "pop", -0.3 + i * 0.3);
    });
    [k.from, k.price, k.cur, k.tiers].forEach((el, i) => anim(el, o1 - 0.3 + i * 0.03, 0.27, OUT(), EXIT));

    // Puces : révisions illimitées 7 jours, livraison rapide
    const [r0, r1] = T.perks;
    cue(r0, "whoosh");
    const perkEls = $$(stage, ".perk");
    const perkT = [r0 + 0.08, Math.max(r0 + 0.5, wordAt(11, 5, r0 + 1.6) - 0.1)];
    perkEls.forEach((el, i) => {
      anim(el, perkT[i], 0.6, [{ opacity: 0, transform: "translateY(5vmin) scale(.85)" }, { opacity: 1, transform: "none" }], BACK);
      cue(perkT[i] + 0.1, "pop", -0.2 + i * 0.4);
      anim(el.querySelector("path"), perkT[i] + 0.2, 0.45, [{ strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDasharray: 1, strokeDashoffset: 0 }], MOVE);
      anim(el, r1 - 0.3 + i * 0.04, 0.27, OUT(), EXIT);
    });
    anim(k.s8, r0, r1 - r0, [{ transform: "scale(1)" }, { transform: "scale(1.04)" }], MOVE);

    // ── 6. Appel à l'action
    const [w0, w1] = T.who;
    cue(w0, "whoosh");
    anim(k.leak, w0 - 0.1, 0.8, [
      { opacity: 0, transform: "translateX(40vmin)" },
      { opacity: 0.4, offset: 0.35 },
      { opacity: 0, transform: "translateX(-40vmin)" },
    ], MOVE);
    anim(k.avatar, w0 + 0.05, 0.6, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }], BACK);
    cue(w0 + 0.1, "pop");
    $$(k.s9, ".mask > span").forEach((w, i) => anim(w, w0 + 0.13 + i * STAGGER, 0.55, REVEAL));
    anim(k.role, w0 + 0.3, 0.5, IN("translateY(2vmin)", "0.4vmin"));
    anim(k.s9, w0, w1 - w0, [{ transform: "scale(1)" }, { transform: "scale(1.04)" }], MOVE);
    anim(k.s9.firstElementChild, w1 - 0.3, 0.3, OUT("translateY(-5vmin)", "1vmin"), EXIT);

    const [x0, x1] = T.ctas;
    cue(x0, "whoosh");
    const ctaItems = [k.ctas.querySelector(".ctas__name"), k.btnWa, k.btnWeb];
    ctaItems.forEach((el, i) => {
      anim(el, x0 + 0.04 + i * STAGGER, 0.55, [{ opacity: 0, transform: "translateY(4vmin) scale(.88)" }, { opacity: 1, transform: "none" }], BACK);
      if (i) cue(x0 + 0.1 + i * STAGGER, "pop");
    });
    // le curseur clique sur WhatsApp puis sur le site
    const box = k.ctas.getBoundingClientRect();
    const center = (el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - box.left + r.width * 0.62, y: r.top - box.top + r.height * 0.55 };
    };
    const pos = (p) => ({ transform: `translate(${p.x}px, ${p.y}px)` });
    const c_0 = { x: box.width * 0.95, y: box.height * 1.15 };
    const c_1 = center(k.btnWa);
    const c_2 = center(k.btnWeb);
    const click1 = x0 + 0.85;
    const click2 = Math.max(click1 + 0.8, wordAt(13, 3, x0 + 1.75));
    anim(k.cursor, x0 + 0.3, 0.5, [{ opacity: 0, ...pos(c_0) }, { opacity: 1, ...pos(c_1) }], MOVE);
    anim(k.cursor, click2 - 0.55, 0.5, [{ opacity: 1, ...pos(c_1) }, { opacity: 1, ...pos(c_2) }], MOVE);
    [
      [k.btnWa, click1],
      [k.btnWeb, click2],
    ].forEach(([btn, t]) => {
      anim(btn, t, 0.3, [{ transform: "scale(1)" }, { transform: "scale(.94)", offset: 0.35 }, { transform: "scale(1)" }], MOVE);
      cue(t, "click");
    });
    ctaItems.forEach((el, i) => anim(el, x1 - 0.3 + i * 0.03, 0.27, OUT(), EXIT));
    anim(k.cursor, x1 - 0.3, 0.2, [{ opacity: 1 }, { opacity: 0 }], EXIT);

    // Le logo se pose (follow-through), glow doux, puis fondu
    const l0 = T.logo[0];
    cue(l0, "whoosh");
    anim(k.logoMark, l0 + 0.02, 0.75, [
      { opacity: 0, transform: "translateY(-30vmin) rotate(-14deg) scale(.9)" },
      { opacity: 1, transform: "translateY(2.2vmin) rotate(5deg) scale(1.03)", offset: 0.55 },
      { opacity: 1, transform: "translateY(-0.8vmin) rotate(-2deg) scale(1)", offset: 0.8 },
      { opacity: 1, transform: "none" },
    ], MOVE);
    cue(l0 + 0.42, "pop");
    $$(k.logoName, "span").forEach((c, i) =>
      anim(c, l0 + 0.12 + i * 0.015, 0.45, [{ opacity: 0, transform: "translateY(4vmin)" }, { opacity: 1, transform: "none" }], BACK)
    );
    anim(k.logoUrl, l0 + 0.4, 0.45, IN("translateY(2vmin)", "0.4vmin"));
    anim(k.logoMark, l0 + 0.6, 0.5, [
      { boxShadow: "0 0 8vmin rgba(41,151,255,.45)" },
      { boxShadow: "0 0 14vmin rgba(41,151,255,.75)" },
    ], MOVE);
    anim(k.fadeout, DURATION - 0.45, 0.45, [{ opacity: 0 }, { opacity: 1 }], MOVE);

    // ── Sous-titres synchronisés (mot actif en bleu)
    const maxChars = innerWidth > innerHeight ? 46 : 26;
    const chunks = TIMING.map((line, i) => {
      const ws = P.voice[i].text.split(/\s+/);
      const groups = [];
      let cur = [];
      ws.forEach((w, j) => {
        const len = cur.map((n) => ws[n]).join(" ").length;
        if (cur.length && len + w.length + 1 > maxChars) {
          groups.push(cur);
          cur = [];
        }
        cur.push(j);
      });
      if (cur.length) groups.push(cur);
      return { line, ws, groups };
    });
    let last = "";
    ticks.push((t) => {
      let html = "";
      let op = 0;
      for (const c of chunks) {
        const { start, end, words: wt } = c.line;
        if (t < start - 0.08 || t > end + 0.3) continue;
        let wi = wt.findIndex(([a, b]) => t >= a && t < b);
        if (wi < 0) wi = t < start ? 0 : wt.length - 1;
        const g = c.groups.find((gr) => gr.includes(wi)) || c.groups[0];
        html = g.map((j) => `<span${j === wi && t <= end ? ' class="on"' : ""}>${esc(c.ws[j])}</span>`).join(" ");
        op = Math.min(1, (t - (start - 0.08)) / 0.1, (end + 0.3 - t) / 0.15);
      }
      if (html !== last) {
        k.cap.innerHTML = html;
        last = html;
      }
      k.cap.style.opacity = Math.max(0, op);
    });

    // ── Grain de film (≈ 3 %)
    const g = k.grain;
    g.width = Math.round(innerWidth / 2);
    g.height = Math.round(innerHeight / 2);
    const ctx = g.getContext("2d");
    const img = ctx.createImageData(g.width, g.height);
    ticks.push((t) => {
      let s = Math.floor(t * 30) * 2654435761 + 1;
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        const v = 128 + ((s & 255) - 128) * 0.9;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    });

    return k;
  }

  function seek(t) {
    list.forEach((a) => (a.currentTime = t * 1000));
    ticks.forEach((f) => f(t));
  }

  async function build() {
    try {
      await document.fonts.ready;
    } catch (e) {}
    const shots = proofShots();
    stage.innerHTML = template(shots);
    await Promise.all([...stage.querySelectorAll("img")].map((im) => im.decode().catch(() => {})));
    timeline(shots);
    list.forEach((a) => a.pause());
    seek(0);

    if (RENDER) {
      window.__promo = { duration: DURATION, seek, cues: cues.sort((a, b) => a.t - b.t) };
      return;
    }
    // Lecture dans le navigateur (avec la bande-son si elle a été générée)
    const btn = document.createElement("button");
    btn.className = "play";
    btn.textContent = "▶ Lire la promo";
    stage.appendChild(btn);
    const audio = new Audio("build/mix.wav");
    btn.addEventListener("click", () => {
      btn.remove();
      const t0 = performance.now();
      audio.play().catch(() => {});
      const loop = () => {
        const t = audio.currentTime > 0 ? audio.currentTime : (performance.now() - t0) / 1000;
        seek(Math.min(t, DURATION));
        if (t < DURATION) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }

  build();
})();
