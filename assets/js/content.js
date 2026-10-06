/*
 * ─────────────────────────────────────────────────────────────
 *  CONTENU DU PORTFOLIO — modifie uniquement ce fichier.
 *  Tout ce qui est marqué « à remplacer » est un texte provisoire.
 * ─────────────────────────────────────────────────────────────
 */
window.CONTENT = {
  name: "Celso tkr",
  role: "Développeur web",
  initials: "C",

  // Domaine affiché dans la barre de recherche de fin d'intro (à remplacer)
  domain: "celsotkr.dev",

  hero: {
    eyebrow: "Développeur web · Freelance",
    title: ["Des sites rapides.", "Élégants.", "Pensés pour convertir."],
    subtitle:
      "Je conçois et développe des sites et applications web modernes, du design à la mise en ligne.",
  },

  // Projets (à remplacer) — hue = teinte de la vignette (0–360)
  projects: [
    {
      title: "Nova Studio",
      desc: "Site vitrine pour une agence créative, animations fluides et score Lighthouse de 100.",
      tags: ["Next.js", "GSAP", "Tailwind"],
      url: "#",
      hue: 215,
    },
    {
      title: "Pulse Dashboard",
      desc: "Tableau de bord SaaS temps réel avec graphiques interactifs et authentification.",
      tags: ["React", "TypeScript", "Supabase"],
      url: "#",
      hue: 200,
    },
    {
      title: "Maison Kora",
      desc: "Boutique e-commerce minimaliste, paiement Stripe et gestion de stock.",
      tags: ["Shopify", "Liquid", "JavaScript"],
      url: "#",
      hue: 230,
    },
    {
      title: "Trajet",
      desc: "Application web de réservation de trajets avec carte interactive.",
      tags: ["Vue", "Node.js", "Mapbox"],
      url: "#",
      hue: 190,
    },
    {
      title: "Lumen Docs",
      desc: "Plateforme de documentation rapide avec recherche instantanée.",
      tags: ["Astro", "MDX", "Algolia"],
      url: "#",
      hue: 245,
    },
    {
      title: "Atelier API",
      desc: "API REST sécurisée et documentée pour une application mobile.",
      tags: ["Node.js", "PostgreSQL", "Docker"],
      url: "#",
      hue: 205,
    },
  ],

  stack: [
    "HTML / CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Figma",
  ],

  about: {
    text: "Passionné par le web, je transforme des idées en produits numériques clairs, rapides et accessibles. J'accorde autant d'importance au code qu'au détail visuel. (Texte à remplacer.)",
    stats: [
      { value: "20+", label: "projets livrés" },
      { value: "3 ans", label: "d'expérience" },
      { value: "100", label: "score Lighthouse visé" },
    ],
  },

  contact: {
    email: "ton.email@exemple.com", // à remplacer
    socials: [
      { label: "GitHub", url: "https://github.com/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/" },
      { label: "Instagram", url: "https://www.instagram.com/" },
    ],
  },

  // Textes de l'intro animée
  intro: {
    line1: ["Et si", "ton idée", "devenait"],
    big: "réalité.",
    prompt: "CELSO, ON CONSTRUIT QUOI AUJOURD'HUI ?",
    typed: "Un site rapide, élégant et moderne",
    line2: ["Besoin d'un site", "qui", "convertit ?"],
    stackTitle: "Stack technique",
    cuts: ["Sites.", "Apps.", "Interfaces."],
  },
};
