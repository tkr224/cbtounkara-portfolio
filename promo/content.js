/*
 * ─────────────────────────────────────────────────────────────
 *  VIDÉO PROMO (40 s) — tous les textes et réglages.
 *  Modifie ce fichier, puis relance :
 *    python3 tools/promo-audio.py          → voix off + musique + bruitages
 *    node tools/render-promo.mjs           → video/promo-9x16.mp4
 *    node tools/render-promo.mjs --wide    → video/promo-16x9.mp4
 * ─────────────────────────────────────────────────────────────
 */
window.PROMO = {
  name: "Celso Tounkara",
  role: "Développeur web freelance",
  city: "Conakry",
  domain: "cbtounkara.online",
  email: "tunkaracelso@gmail.com",
  // Numéro affiché sous le bouton WhatsApp (ex. "+224 6XX XX XX XX"). Vide = bouton seul.
  whatsapp: "",
  // Photo ronde de l'écran final (ex. "captures/celso.jpg"). Vide = logo à la place.
  photo: "",

  bpm: 105,

  hook: ["Ton", "business", "n'a pas", "de site ?"],
  search: "restaurant près de moi",
  promise: ["Rapide.", "Élégant.", "Pensé pour convertir."],

  // Projets : une capture = un cadre de navigateur. Sans capture, le projet
  // apparaît dans l'écran « Et aussi » (nom seul, aucune image inventée).
  projects: [
    {
      name: "TrouveTout224",
      type: "Marketplace d'annonces · Guinée",
      url: "trouvetout224.site",
      capture: "captures/trouvetout224.jpg",
      mobile: "captures/trouvetout224-mobile.jpg",
      live: true,
    },
    {
      name: "TT Station",
      type: "Boutique en ligne · streetwear",
      url: "TT Station — Streetwear Conakry",
      capture: "captures/tt-station.jpg",
    },
    {
      name: "Groupe Nimba",
      type: "Site corporate · BTP, immobilier, négoce",
      url: "groupenimba.com",
      capture: "captures/groupe-nimba.jpg",
    },
    { name: "Kora Festival", type: "", url: "", capture: "" },
    { name: "Le Baobab", type: "", url: "", capture: "" },
    { name: "Sérénité Spa", type: "", url: "", capture: "" },
  ],

  stack: ["Next.js", "Tailwind"],

  prices: [
    { label: "Landing page", value: 700000 },
    { label: "Site vitrine", value: 1500000 },
    { label: "Boutique en ligne", value: 3000000 },
  ],
  perks: [
    { title: "Révisions illimitées", sub: "pendant 7 jours" },
    { title: "Livraison rapide", sub: "" },
  ],

  // Voix off : « at » = départ en secondes, « text » = sous-titre affiché,
  // « say » = ce que lit la voix (orthographe phonétique si besoin),
  // « speed » = débit de cette réplique (1,05 par défaut).
  voice: [
    { at: 0.25, text: "Ton business n'a pas de site ?", say: "Ton bizness n'a pas de site ?" },
    { at: 3.15, text: "Tes clients te cherchent en ligne… et ne trouvent rien.", say: "Tes clients te cherchent en ligne, et ne trouvent rien." },
    { at: 8.2, text: "Je crée ton site." },
    { at: 9.45, text: "Rapide, élégant, pensé pour convertir." },
    { at: 12.2, text: "TrouveTout224, déjà en production.", say: "Trouve Tout, deux deux quatre, déjà en production." },
    { at: 14.95, text: "Site vitrine, boutique en ligne, application web, plateforme sur mesure." },
    { at: 19.55, text: "TT Station." },
    { at: 20.75, text: "Groupe Nimba.", say: "Groupe Nim-ba." },
    { at: 23.2, text: "Et aussi Kora Festival, Le Baobab et Sérénité Spa.", say: "Et aussi : Kora Festival. Le Baobab. Et Sérénité Spa." },
    { at: 26.75, text: "Le tout en Next.js et Tailwind.", say: "Le tout en Nexte Jé Esse et Tél-wainde." },
    { at: 29.3, text: "Dès 700 000 francs guinéens.", say: "Dès sept cent mille francs guinéens." },
    { at: 31.45, text: "Révisions illimitées pendant 7 jours, livraison rapide.", say: "Révisions illimitées pendant sept jours, livraison rapide.", speed: 1.12 },
    { at: 34.85, text: "Je suis Celso Tounkara.", say: "Je suis Celso Toun-kara." },
    { at: 36.55, text: "Écris-moi sur WhatsApp. cbtounkara.online", say: "Écris-moi sur Ouatsap. Cé bé Toun-kara point online.", speed: 1.12 },
  ],
};
