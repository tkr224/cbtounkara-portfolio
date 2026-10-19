import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { MouseBackground } from "@/components/MouseBackground";
import { EMAIL, GITHUB_LINK, SITE_NAME, SITE_URL } from "@/lib/site";

// Figtree (variable 400 → 800), auto-hébergée : la build ne dépend pas de
// Google Fonts. Fichier issu de @fontsource-variable/figtree (latin, OFL).
const figtree = localFont({
  src: "./fonts/Figtree-Variable.woff2",
  weight: "400 800",
  variable: "--font-figtree",
  display: "swap",
});

const description =
  "Celso Tounkara, développeur web à Conakry : sites vitrines, boutiques en ligne, applications web et plateformes sur mesure pour des clients partout dans le monde.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Celso Tounkara · Développeur web à Conakry",
    template: "%s · Celso Tounkara",
  },
  description,
  keywords: [
    "développeur web Conakry",
    "création site internet Guinée",
    "développeur web freelance",
    "boutique en ligne",
    "application web sur mesure",
    "Celso Tounkara",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Celso Tounkara · Développeur web à Conakry",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Celso Tounkara · Développeur web à Conakry",
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/celso.jpg`,
  jobTitle: "Développeur web",
  email: `mailto:${EMAIL}`,
  address: { "@type": "PostalAddress", addressLocality: "Conakry", addressCountry: "GN" },
  sameAs: [GITHUB_LINK],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={figtree.variable} suppressHydrationWarning>
      <head>
        {/* Avant le premier rendu : active les animations d'apparition. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="relative min-h-screen font-sans antialiased">
        <MouseBackground />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
