import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CtaCard, PageHeader, PricingGrid, ProcessSteps, SectionTitle, ServicesBento } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = pageMetadata(
  "Services et tarifs",
  "Sites vitrines, boutiques en ligne, applications web et plateformes sur mesure. Tarifs clairs en GNF, de la landing page à 700 000 GNF au projet sur mesure.",
  "/services",
);

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services et tarifs"
        title="Un projet clair, du premier appel à la mise en ligne."
        intro="Quatre façons de vous accompagner, un processus en cinq étapes et des tarifs affichés sans surprise."
      />

      <section className="container-site section pt-14 md:pt-20">
        <h2 className="sr-only">Services</h2>
        <ServicesBento detailed />
      </section>

      <section className="container-site section pt-0 md:pt-0">
        <SectionTitle title="Processus." intro="Cinq étapes, des points réguliers, aucune surprise." />
        <ProcessSteps />
      </section>

      <section className="container-site section pt-0 md:pt-0">
        <SectionTitle title="Tarifs." intro="Des forfaits en francs guinéens, adaptés à chaque besoin." />
        <PricingGrid />
        <Reveal>
          <p className="mt-8 text-center text-[15px] text-mute">
            Acompte de 50 % au lancement. Maintenance optionnelle : 250 000 GNF par mois.
          </p>
        </Reveal>
      </section>

      <section className="container-site pb-[88px] md:pb-[140px]">
        <CtaCard />
      </section>
    </>
  );
}
