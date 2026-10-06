/*
 * Intro motion design (≈ 27 s) — inspirée des pubs « kinetic typography + UI ».
 * Toute la timeline utilise la Web Animations API : chaque animation a un
 * départ (en secondes) et une durée, ce qui permet de la jouer en direct sur
 * le site ou de la « scrubber » image par image pour l'export vidéo
 * (voir tools/render-video.mjs, mode ?render).
 */
(function () {
  const C = window.CONTENT;
  const I = C.intro;
  const root = document.getElementById("intro");
  const params = new URLSearchParams(location.search);
  const RENDER = params.has("render");
  const DURATION = 27.5; // durée totale (export vidéo)
  const SITE_END = 26.9; // moment où le site prend le relais

  const EX = "cubic-bezier(.16,1,.3,1)"; // expo out
  const EI = "cubic-bezier(.7,0,.84,0)"; // expo in
  const EIO = "cubic-bezier(.83,0,.17,1)"; // expo in-out

  let list = [];
  let ended = false;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const chars = (s) => [...s].map((c) => `<span class="ch">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("");

  /* anim(el, départ, durée, keyframes, easing) — fill « forwards » uniquement :
     l'état initial est défini en CSS (.ia = opacity 0), et une animation créée
     plus tard sur la même propriété prend le dessus une fois démarrée. */
  function anim(el, t, d, kf, easing = EX, extra = {}) {
    const a = el.animate(kf, { delay: t * 1000, duration: d * 1000, fill: "forwards", easing, ...extra });
    list.push(a);
    return a;
  }
  const IN = (from = "translateY(3vmin)", blur = "1.2vmin") => [
    { opacity: 0, transform: from, filter: `blur(${blur})` },
    { opacity: 1, transform: "none", filter: "blur(0)" },
  ];
  const OUT = (to = "translateY(-3vmin)", blur = "1.2vmin") => [
    { opacity: 1, transform: "none", filter: "blur(0)" },
    { opacity: 0, transform: to, filter: `blur(${blur})` },
  ];

  const CODE_SVG = `<svg viewBox="0 0 100 100"><path pathLength="1" d="M32 24 L10 50 L32 76"/><path pathLength="1" d="M58 14 L42 86"/><path pathLength="1" d="M68 24 L90 50 L68 76"/></svg>`;
  const CURSOR_SVG = `<svg viewBox="0 0 24 24"><path d="M4 2.5 L4 19.5 L8.6 15.4 L11.6 22 L14.6 20.7 L11.7 14.3 L18 14.3 Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
  const ARROW_SVG = `<svg viewBox="0 0 100 100"><path d="M50 80 L50 22 M26 44 L50 20 L74 44"/></svg>`;
  const SEARCH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#6e6e73" stroke-width="2.4" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 L21 21"/></svg>`;

  function template() {
    const words = (arr, accentLast) =>
      arr
        .map((w, i) => {
          const cls = accentLast && i === arr.length - 1 ? "accent" : i % 2 ? "soft" : "";
          return `<span class="ia ${cls}">${esc(w)}</span>`;
        })
        .join("");
    const codeColors = ["#ff7ab6", "#7cc0ff", "#c3e88d", "#ffcb6b", "#89ddff", "#c792ea", "#7cc0ff"];
    const codeWidths = [55, 80, 62, 40, 72, 50, 30];
    const codeIndent = [0, 8, 16, 16, 8, 16, 0];
    const projects = C.projects.slice(0, 6);
    const stack = C.stack.slice(0, 5);

    return `
      <div class="i-blobs ia" data-k="blobs">
        <div class="i-blob i-blob--a"></div><div class="i-blob i-blob--b"></div><div class="i-blob i-blob--c"></div>
      </div>

      <div class="layer"><div class="i-line" data-k="line1">${words(I.line1)}</div></div>
      <div class="layer"><div class="i-big ia" data-k="big">${esc(I.big)}</div></div>

      <div class="i-wipe" data-k="wipe"></div>
      <div class="layer"><div data-k="markWrap"><div class="i-code-mark" data-k="mark">${CODE_SVG}</div></div></div>

      <div class="i-night ia" data-k="night"></div>

      <div class="layer"><div class="i-logo" data-k="logo">
        <div class="i-logo__mark ia" data-k="logoMark">${CODE_SVG}</div>
        <div class="i-logo__name ia" data-k="logoName">${esc(C.name)}</div>
      </div></div>

      <div class="layer"><div class="i-ui" data-k="ui">
        <div class="i-ui__label ia" data-k="uiLabel"><i></i><span>${esc(I.prompt)}</span></div>
        <div class="i-panel ia" data-k="panel">
          <div class="i-field">
            <div class="i-field__thumb">${CODE_SVG}</div>
            <div class="i-field__text" data-k="fieldText">
              <span class="ph" data-k="ph">Décris ton projet…</span>
              <span data-k="typed">${chars(I.typed)}</span>
              <div><span class="i-tag ia" data-k="tag">dev web</span></div>
            </div>
            <div class="i-send" data-k="send">${ARROW_SVG}</div>
          </div>
        </div>
        <div class="i-cursor ia" data-k="cursor1">${CURSOR_SVG}</div>
      </div></div>

      <div class="layer"><div data-k="bwrap" style="position:relative">
        <div class="i-browser ia" data-k="browser">
          <div class="i-browser__bar"><i></i><i></i><i></i><span class="i-browser__url">${esc(C.domain)}</span></div>
          <div class="i-page" data-k="page">
            <div class="b b--nav ia"></div><div class="b b--logo ia"></div>
            <div class="b b--h1 ia"></div><div class="b b--h1b ia"></div>
            <div class="b b--p ia"></div><div class="b b--btn ia"></div>
            <div class="b b--card ia" style="left:6%"></div>
            <div class="b b--card ia" style="left:37%"></div>
            <div class="b b--card ia" style="left:68%"></div>
          </div>
        </div>
        <div class="i-code ia" data-k="code">
          ${codeColors
            .map((c, i) => `<span class="ia" style="background:${c};width:${codeWidths[i]}%;margin-left:${codeIndent[i]}%"></span>`)
            .join("")}
        </div>
      </div></div>

      <div class="layer"><div class="i-line" data-k="line2">${words(I.line2, true)}</div></div>

      <div class="layer"><div class="i-grid" data-k="grid">
        ${projects
          .map(
            (p, i) =>
              `<div class="i-card ia" style="--h:${Number(p.hue) || 215};${i === 1 ? "position:relative;z-index:2" : ""}">
                <div class="i-card__thumb"></div><span class="i-card__label">${esc(p.title)}</span></div>`
          )
          .join("")}
        <div class="i-cursor ia" data-k="cursor2">${CURSOR_SVG}</div>
      </div></div>

      <div class="layer"><div class="i-stack ia" data-k="stack">
        <div class="i-stack__bar ia" data-k="stackBar"></div>
        <div class="i-stack__title ia" data-k="stackTitle">${esc(I.stackTitle)}</div>
        <ul>${stack.map((s) => `<li class="ia">${esc(s)}</li>`).join("")}</ul>
      </div></div>

      ${I.cuts
        .map((w, i) => `<div class="layer"><div class="i-cut ia" style="color:${i === 1 ? "var(--blue)" : "var(--ink)"}">${esc(w)}</div></div>`)
        .join("")}

      <div class="layer"><div class="i-end" data-k="end">
        <div class="i-end__role ia" data-k="endRole">${esc(C.role)}</div>
        <div class="i-end__name" data-k="endName">${[...C.name].map((c) => `<span class="ia" style="display:inline-block">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("")}</div>
        <div class="i-search ia" data-k="search">
          ${SEARCH_SVG}<span class="i-search__text" data-k="domain">${chars(C.domain)}</span>
          <span class="i-search__go" data-k="go">Visiter</span>
        </div>
      </div></div>

      ${RENDER ? "" : `<button class="i-skip" type="button" data-k="skip">Passer l'intro ›</button><div class="i-progress" data-k="progress"></div>`}
    `;
  }

  function timeline() {
    const k = {};
    root.querySelectorAll("[data-k]").forEach((el) => (k[el.dataset.k] = el));
    const kids = (el, sel = ".ia") => [...el.querySelectorAll(sel)];

    // ── Fond : taches bleues qui dérivent en continu
    anim(k.blobs, 0, 1.2, [{ opacity: 0 }, { opacity: 1 }], "ease-out");
    const drift = [
      ["translate(0,0) scale(1)", "translate(-12vw,8vh) scale(1.2)", 7],
      ["translate(0,0) scale(1)", "translate(14vw,-10vh) scale(1.1)", 8.5],
      ["translate(0,0) scale(.9)", "translate(-18vw,-14vh) scale(1.25)", 6],
    ];
    kids(k.blobs, ".i-blob").forEach((b, i) =>
      anim(b, 0, drift[i][2], [{ transform: drift[i][0] }, { transform: drift[i][1] }], "ease-in-out", {
        iterations: Infinity,
        direction: "alternate",
      })
    );

    // ── 1. « Et si ton idée devenait » mot par mot
    kids(k.line1).forEach((w, i) => anim(w, 0.35 + i * 0.32, 0.7, IN()));
    anim(k.line1, 2.7, 0.5, OUT("translateX(-10vw) scale(.96)", "1.6vmin"), EI);

    // ── 2. Gros mot qui fonce vers la caméra
    anim(k.big, 3.0, 0.55, IN("scale(.72)", "2vmin"));
    anim(k.big, 3.55, 0.7, [{ opacity: 1, transform: "scale(1)" }, { opacity: 1, transform: "scale(1.08)" }], "linear");
    anim(k.big, 4.25, 0.55, [{ opacity: 1, transform: "scale(1.08)", filter: "blur(0)" }, { opacity: 0, transform: "scale(7)", filter: "blur(1vmin)" }], EI);

    // ── 3. Volet bleu circulaire + </> dessiné
    anim(k.wipe, 4.35, 0.65, [{ clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(80% at 50% 50%)" }], EIO);
    kids(k.mark, "path").forEach((p, i) => anim(p, 4.75 + i * 0.12, 0.6, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], EIO));
    anim(k.markWrap, 4.75, 1.0, [{ transform: "scale(.8) rotate(-8deg)" }, { transform: "scale(1) rotate(0)" }]);
    anim(k.markWrap, 5.75, 0.4, [{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(.4)" }], EI);

    // ── 4. Passage au sombre + logo
    anim(k.night, 5.85, 0.5, [{ opacity: 0 }, { opacity: 1 }], "ease-in-out");
    anim(k.wipe, 6.5, 0.01, [{ opacity: 1 }, { opacity: 0 }]);
    anim(k.logoMark, 6.1, 0.8, [{ opacity: 0, transform: "scale(.3) rotate(-25deg)" }, { opacity: 1, transform: "none" }]);
    anim(k.logoName, 6.45, 0.8, [{ opacity: 0, clipPath: "inset(0 100% 0 0)", transform: "translateX(-4vmin)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", transform: "none" }]);
    anim(k.logo, 6.1, 1.3, [{ transform: "scale(.94)" }, { transform: "scale(1)" }], "linear");
    anim(k.logo, 7.35, 0.4, [{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0, transform: "scale(1.12)", filter: "blur(1.5vmin)" }], EI);

    // ── 5. Interface « prompt » : le curseur clique, le texte se tape, envoi
    anim(k.uiLabel, 7.6, 0.6, IN());
    anim(k.panel, 7.75, 0.8, IN("translateY(6vmin) scale(.94)", "1vmin"));
    const ui = k.ui.getBoundingClientRect();
    const rel = (el, fx, fy) => {
      const r = el.getBoundingClientRect();
      return { x: r.left - ui.left + r.width * fx, y: r.top - ui.top + r.height * fy };
    };
    const p0 = { x: ui.width * 0.95, y: ui.height * 1.25 };
    const p1 = rel(k.fieldText, 0.25, 0.4);
    const p2 = rel(k.send, 0.45, 0.45);
    const at = (p) => ({ left: `${p.x}px`, top: `${p.y}px` });
    anim(k.cursor1, 8.1, 0.7, [{ opacity: 0, ...at(p0) }, { opacity: 1, ...at(p1) }], EIO);
    anim(k.cursor1, 8.85, 0.25, [{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1)" }], "ease-in-out");
    anim(k.ph, 8.95, 0.1, [{ opacity: 1 }, { opacity: 0 }], "linear");
    const typed = kids(k.typed, ".ch");
    typed.forEach((c, i) => anim(c, 9.0 + i * (1.3 / typed.length), 0.04, [{ opacity: 0 }, { opacity: 1 }], "linear"));
    anim(k.tag, 10.35, 0.45, IN("translateY(1.5vmin) scale(.9)", "0.5vmin"));
    anim(k.cursor1, 10.35, 0.55, [at(p1), at(p2)], EIO);
    anim(k.cursor1, 10.95, 0.25, [{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1)" }], "ease-in-out");
    anim(k.send, 10.95, 0.6, [
      { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(41,151,255,.7)" },
      { transform: "scale(.85)", offset: 0.25 },
      { transform: "scale(1.12)", boxShadow: "0 0 0 3vmin rgba(41,151,255,0)" },
    ]);
    anim(k.ui, 11.3, 0.5, OUT("scale(1.15)", "2vmin"), EI);

    // ── 6. Le site se construit dans un navigateur
    anim(k.browser, 11.4, 0.9, [
      { opacity: 0, transform: "perspective(1400px) rotateX(20deg) translateY(10vmin) scale(.9)" },
      { opacity: 1, transform: "perspective(1400px) rotateX(0deg) translateY(0) scale(1)" },
    ]);
    kids(k.page).forEach((b, i) => anim(b, 11.85 + i * 0.12, 0.55, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)" }]));
    anim(k.code, 11.95, 0.7, IN("translateX(-6vmin)", "1vmin"));
    kids(k.code).forEach((l, i) => anim(l, 12.2 + i * 0.13, 0.4, [{ opacity: 0, transform: "scaleX(0)" }, { opacity: 1, transform: "scaleX(1)" }]));
    anim(k.bwrap, 11.4, 2.3, [{ transform: "scale(1)" }, { transform: "scale(1.05)" }], "linear");
    anim(k.bwrap, 13.65, 0.5, [{ opacity: 1, transform: "scale(1.05)", filter: "blur(0)" }, { opacity: 0, transform: "scale(1.25)", filter: "blur(2vmin)" }], EI);
    anim(k.night, 13.85, 0.6, [{ opacity: 1 }, { opacity: 0 }], "ease-in-out");

    // ── 7. « Besoin d'un site qui convertit ? »
    kids(k.line2).forEach((w, i) => anim(w, 14.35 + i * 0.32, 0.7, IN()));
    anim(k.line2, 16.1, 0.45, OUT("translateY(-4vmin)", "1.4vmin"), EI);

    // ── 8. Grille de projets + sélection au curseur
    const cards = kids(k.grid, ".i-card");
    cards.forEach((c, i) => anim(c, 16.55 + i * 0.09, 0.75, IN("translateY(5vmin) scale(.85)", "1vmin")));
    const g = k.grid.getBoundingClientRect();
    const target = cards[1].getBoundingClientRect();
    const g0 = { x: g.width * 0.9, y: g.height * 1.2 };
    const g1 = { x: target.left - g.left + target.width * 0.55, y: target.top - g.top + target.height * 0.5 };
    anim(k.cursor2, 17.55, 0.65, [{ opacity: 0, ...at(g0) }, { opacity: 1, ...at(g1) }], EIO);
    anim(k.cursor2, 18.25, 0.25, [{ transform: "scale(1)" }, { transform: "scale(.8)" }, { transform: "scale(1)" }], "ease-in-out");
    cards.forEach((c, i) => {
      if (i === 1) anim(c, 18.4, 0.8, [{ transform: "scale(1)" }, { transform: "scale(1.3)" }]);
      else anim(c, 18.4, 0.5, [{ opacity: 1, transform: "scale(1)", filter: "blur(0)" }, { opacity: 0.25, transform: "scale(.94)", filter: "blur(.4vmin)" }]);
    });
    anim(k.cursor2, 18.6, 0.3, [{ opacity: 1 }, { opacity: 0 }]);
    anim(k.grid, 19.35, 0.45, OUT("scale(1.08)", "1.6vmin"), EI);

    // ── 9. Carte « Stack technique »
    anim(k.stack, 19.75, 0.7, IN("translateY(6vmin) scale(.95)", "1vmin"));
    anim(k.stackBar, 19.95, 0.9, [{ opacity: 0, transform: "scaleY(0)" }, { opacity: 1, transform: "scaleY(1)" }], EIO);
    anim(k.stackTitle, 20.0, 0.5, IN("translateX(-2vmin)", "0.6vmin"));
    kids(k.stack, "li").forEach((li, i) => anim(li, 20.25 + i * 0.18, 0.45, IN("translateX(-3vmin)", "0.6vmin")));
    anim(k.stack, 21.75, 0.4, OUT("translateY(-4vmin)", "1.4vmin"), EI);

    // ── 10. Coupes rapides
    kids(root, ".i-cut").forEach((c, i) => {
      const t = 22.15 + i * 0.48;
      anim(c, t, 0.22, IN("scale(1.3)", "1vmin"));
      anim(c, t + 0.42, 0.06, [{ opacity: 1 }, { opacity: 0 }], "linear");
    });

    // ── 11. Écran final : nom + barre de recherche
    anim(k.endRole, 23.75, 0.6, IN());
    kids(k.endName).forEach((c, i) => anim(c, 23.9 + i * 0.045, 0.7, IN("translateY(6vmin) scale(.9)", "1vmin")));
    anim(k.search, 24.6, 0.75, IN("translateY(4vmin) scale(.95)", "1vmin"));
    const dom = kids(k.domain, ".ch");
    dom.forEach((c, i) => anim(c, 25.0 + i * (0.8 / dom.length), 0.04, [{ opacity: 0 }, { opacity: 1 }], "linear"));
    anim(k.go, 26.0, 0.5, [{ transform: "scale(1)" }, { transform: "scale(.9)", offset: 0.3 }, { transform: "scale(1)" }], "ease-in-out");

    if (k.progress) anim(k.progress, 0, SITE_END, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], "linear");
    return k;
  }

  function end() {
    if (ended) return;
    ended = true;
    try {
      sessionStorage.setItem("introSeen", "1");
    } catch (e) {}
    root.style.transition = "opacity .7s cubic-bezier(.16,1,.3,1)";
    root.style.opacity = "0";
    document.body.classList.remove("is-intro");
    window.startSite();
    setTimeout(() => {
      list.forEach((a) => a.cancel());
      list = [];
      root.classList.remove("is-on");
      root.innerHTML = "";
    }, 750);
  }

  async function play() {
    ended = false;
    list.forEach((a) => a.cancel());
    list = [];
    root.style.transition = "none";
    root.style.opacity = "1";
    root.classList.add("is-on");
    document.body.classList.add("is-intro");
    window.scrollTo(0, 0);
    try {
      await document.fonts.ready;
    } catch (e) {}
    root.innerHTML = template();
    const k = timeline();

    if (RENDER) {
      list.forEach((a) => a.pause());
      window.__intro = {
        duration: DURATION,
        seek(t) {
          list.forEach((a) => (a.currentTime = t * 1000));
        },
      };
      return;
    }
    k.skip.addEventListener("click", end);
    k.progress.getAnimations()[0].finished.then(end).catch(() => {});
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-on") && !RENDER) end();
  });
  document.querySelector("[data-replay]").addEventListener("click", play);

  let seen = false;
  try {
    seen = sessionStorage.getItem("introSeen") === "1";
  } catch (e) {}
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (RENDER || params.has("intro") || (!seen && !reduce)) play();
  else window.startSite();
})();
