// Contenus et coordonnées du site, centralisés ici pour être modifiés facilement.

export const SITE_URL = "https://www.cbtounkara.online";
export const SITE_NAME = "Celso Tounkara";

export const CALENDLY_LINK = "https://calendly.com/tunkaracelso/30min";
export const WHATSAPP_LINK = "https://wa.me/244973238188";
export const WHATSAPP_DISPLAY = "+244 973 238 188";
export const EMAIL = "tunkaracelso@gmail.com";
export const GITHUB_LINK = "https://github.com/tkr224";

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/services", label: "Services et tarifs" },
  { href: "/contact", label: "Contact" },
] as const;

export type ServiceIcon = "showcase" | "shop" | "app" | "platform";

export const SERVICES: readonly {
  icon: ServiceIcon;
  title: string;
  short: string;
  long: string;
}[] = [
  {
    icon: "showcase",
    title: "Sites vitrines",
    short: "Une présence en ligne crédible, qui inspire confiance dès la première visite.",
    long: "Votre activité, vos services et vos coordonnées présentés clairement, avec un design professionnel qui inspire confiance dès la première visite.",
  },
  {
    icon: "shop",
    title: "Boutiques en ligne",
    short: "Catalogue, panier et paiement sécurisé pour vendre directement en ligne.",
    long: "Catalogue, panier, paiement sécurisé et gestion des commandes : tout ce qu'il faut pour transformer votre boutique en véritable canal de vente.",
  },
  {
    icon: "app",
    title: "Applications web",
    short: "Tableaux de bord et outils métier qui font gagner du temps à votre équipe.",
    long: "Tableaux de bord, outils métier, espaces clients : des applications qui digitalisent vos processus et font gagner du temps à votre équipe.",
  },
  {
    icon: "platform",
    title: "Plateformes sur mesure",
    short: "Marketplaces et systèmes multi-utilisateurs, pensés pour grandir.",
    long: "Marketplaces, systèmes multi-utilisateurs, plateformes avec plusieurs types de comptes : des architectures solides capables d'accompagner votre croissance.",
  },
];

export type Project = {
  slug: string;
  name: string;
  type: string;
  status: "production" | "demo";
  url: string;
  image: string;
  /** Fond de la carte et couleur du texte. */
  bg: string;
  dark?: boolean;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "trouvetout224",
    name: "TrouveTout224",
    type: "Marketplace",
    status: "production",
    url: "https://trouvetout224.site",
    image: "/projects/trouvetout224.jpg",
    bg: "#e9f2fd",
  },
  {
    slug: "dropbrief",
    name: "Dropbrief",
    type: "SaaS pour agences créatives",
    status: "production",
    url: "https://www.dropbrief.online",
    image: "/projects/dropbrief.webp",
    bg: "#eef0fb",
  },
  {
    slug: "fete-des-couleurs",
    name: "La Fête des Couleurs",
    type: "Site de festival + billetterie en ligne",
    status: "production",
    url: "https://www.lafetedescouleurs.com",
    image: "/projects/fete-des-couleurs.webp",
    bg: "#fdeef4",
  },
  {
    slug: "kora",
    name: "Kora Festival",
    type: "Festival de musique",
    status: "demo",
    url: "https://festival-kora.vercel.app",
    image: "/projects/kora.jpg",
    bg: "#fff3d1",
  },
  {
    slug: "baobab",
    name: "Le Baobab",
    type: "Restaurant",
    status: "demo",
    url: "https://le-baobab-beta.vercel.app",
    image: "/projects/baobab.jpg",
    bg: "#f4ece2",
  },
  {
    slug: "tt-station",
    name: "TT Station",
    type: "Boutique streetwear",
    status: "demo",
    url: "https://tt-station.vercel.app",
    image: "/projects/tt-station.jpg",
    bg: "#1d1d1f",
    dark: true,
  },
  {
    slug: "nimba",
    name: "Groupe Nimba",
    type: "BTP / immobilier / import-export",
    status: "demo",
    url: "https://nimba-group.vercel.app",
    image: "/projects/nimba.jpg",
    bg: "#e5f2ee",
  },
  {
    slug: "serenite-spa",
    name: "Sérénité Spa",
    type: "Institut bien-être",
    status: "demo",
    url: "https://spa-model.vercel.app",
    image: "/projects/serenite-spa.jpg",
    bg: "#f2ecf7",
  },
];

export const INCLUDED: readonly { title: string; text: string }[] = [
  {
    title: "Design moderne et sur mesure",
    text: "Conçu pour vous, jamais à partir d'un modèle générique.",
  },
  {
    title: "Responsive tous écrans",
    text: "Parfait sur mobile, tablette et ordinateur, mobile en priorité.",
  },
  {
    title: "Rapide et optimisé",
    text: "Des pages qui se chargent vite, même avec une connexion limitée.",
  },
  {
    title: "SEO de base",
    text: "Titres, balises, structure et vitesse posés dès le départ.",
  },
  {
    title: "Sécurisé et fiable",
    text: "Certificat SSL, bonnes pratiques et code propre.",
  },
  {
    title: "Révisions illimitées 7 jours",
    text: "Sept jours après la livraison pour ajuster chaque détail.",
  },
];

export const PROCESS: readonly { title: string; text: string }[] = [
  {
    title: "Appel découverte",
    text: "On parle de votre projet, vos objectifs, votre budget et vos délais. Gratuit et sans engagement.",
  },
  {
    title: "Proposition",
    text: "Une offre claire : périmètre, contenu, délai et tarif. Aucun frais caché.",
  },
  {
    title: "Design",
    text: "Vous voyez le rendu avant la moindre ligne de code, et on l'ajuste ensemble.",
  },
  {
    title: "Développement",
    text: "Je construis le site avec des points d'étape réguliers pour suivre l'avancement.",
  },
  {
    title: "Mise en ligne et suivi",
    text: "Publication, vérifications, prise en main, puis disponibilité pour la suite.",
  },
];

export type Plan = {
  name: string;
  price: string;
  from?: boolean;
  featured?: boolean;
  description: string;
  features: readonly string[];
};

export const PLANS: readonly Plan[] = [
  {
    name: "Landing page",
    price: "700 000",
    description: "Une page unique et efficace pour présenter une offre ou un événement.",
    features: ["Une page percutante", "Responsive mobile", "Formulaire ou lien WhatsApp", "Hébergement inclus (1 an)"],
  },
  {
    name: "Portfolio perso",
    price: "900 000",
    description: "Pour un photographe, un artiste ou un freelance : parcours, réalisations, contact.",
    features: ["Galerie de réalisations", "Animation d'intro", "Section contact directe", "Hébergement inclus (1 an)"],
  },
  {
    name: "Vitrine simple",
    price: "1 000 000",
    description: "Quelques sections claires pour une petite structure qui veut plus qu'une page.",
    features: ["Accueil, à propos, services, contact", "Google Maps et fiche Business", "Nom de domaine inclus (1 an)", "Hébergement inclus (1 an)"],
  },
  {
    name: "Site vitrine",
    price: "1 500 000",
    featured: true,
    description: "Plusieurs pages pour présenter votre entreprise et donner confiance.",
    features: ["Jusqu'à 5 pages", "SEO de base configuré", "Formulaire de contact intégré", "Domaine et hébergement (1 an)"],
  },
  {
    name: "Boutique en ligne",
    price: "3 000 000",
    description: "Vente en ligne avec paiement sécurisé et gestion complète des commandes.",
    features: ["Catalogue produits illimité", "Paiement en ligne sécurisé", "Commandes et stock", "Tableau de bord admin"],
  },
  {
    name: "Sur mesure",
    price: "8 000 000",
    from: true,
    description: "Plateformes, marketplaces ou applications métier aux besoins spécifiques.",
    features: ["Architecture dédiée", "Plusieurs types de comptes", "Intégrations sur mesure", "Accompagnement long terme"],
  },
];
