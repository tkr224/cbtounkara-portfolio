/* Remplit le portfolio à partir de content.js et gère les apparitions au scroll. */
(function () {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  $$("[data-name]").forEach((el) => (el.textContent = C.name));
  $$("[data-initials]").forEach((el) => (el.textContent = C.initials));
  $("[data-year]").textContent = new Date().getFullYear();
  document.title = `${C.name} — ${C.role}`;

  $("[data-hero-eyebrow]").textContent = C.hero.eyebrow;
  $("[data-hero-title]").innerHTML = C.hero.title.map((l) => `<span>${esc(l)}</span>`).join("");
  $("[data-hero-subtitle]").textContent = C.hero.subtitle;

  $("[data-projects]").innerHTML = C.projects
    .map(
      (p) => `
      <a class="card reveal" href="${esc(p.url)}" style="--h:${Number(p.hue) || 215}">
        <div class="card__thumb"></div>
        <div class="card__body">
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        </div>
      </a>`
    )
    .join("");

  $("[data-stack]").innerHTML = C.stack.map((s) => `<li class="reveal">${esc(s)}</li>`).join("");

  $("[data-about]").textContent = C.about.text;
  $("[data-stats]").innerHTML = C.about.stats
    .map((s) => `<div class="reveal"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
    .join("");

  const mail = $("[data-email]");
  mail.href = `mailto:${C.contact.email}`;
  mail.textContent = C.contact.email;
  $("[data-socials]").innerHTML = C.contact.socials
    .map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a>`)
    .join("");

  // Apparitions au scroll (léger décalage entre éléments voisins)
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const siblings = [...e.target.parentElement.children].filter((n) => n.classList.contains("reveal"));
        e.target.style.transitionDelay = `${Math.min(siblings.indexOf(e.target), 6) * 70}ms`;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  // Appelé par intro.js quand l'intro est terminée (ou passée)
  window.startSite = function () {
    document.body.classList.add("is-ready");
    $$(".reveal").forEach((el) => io.observe(el));
  };
})();
