import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Celso Tounkara, développeur web à Conakry : sites et applications sur mesure.",
};

/** Métadonnées d'une page intérieure : un `openGraph` défini dans une page
 *  remplace entièrement celui du layout, on le reconstruit donc en entier. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  const fullTitle = `${title} · ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
