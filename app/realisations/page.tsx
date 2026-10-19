import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaCard, PageHeader } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { PROJECTS } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Réalisations",
  "Sites conçus et développés par Celso Tounkara : TrouveTout224, Kora Festival, Le Baobab, TT Station, Groupe Nimba et Sérénité Spa.",
  "/realisations",
);

/* Bento 6 colonnes : une carte pleine largeur, deux moitiés, trois tiers. */
const SPANS = ["md:col-span-6", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-2", "md:col-span-2"];

export default function RealisationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Réalisations"
        title="Des sites qui travaillent pour leurs clients."
        intro="TrouveTout224 est une plateforme en production, utilisée chaque jour en Guinée. Les autres sont des concepts conçus et développés de A à Z."
      />

      <section className="container-site pb-[88px] pt-14 md:pb-[140px] md:pt-20">
        <h2 className="sr-only">Projets</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.slug} delay={i < 3 ? (i % 2) * 90 : ((i - 3) % 3) * 90} className={SPANS[i]}>
              <ProjectCard project={project} wide={i === 0} compact={i >= 3} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site pb-[88px] md:pb-[140px]">
        <CtaCard />
      </section>
    </>
  );
}
