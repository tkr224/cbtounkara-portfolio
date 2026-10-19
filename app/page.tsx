import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Splash } from "@/components/Splash";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaCard, IncludedList, SectionTitle, ServicesBento } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { CALENDLY_LINK, PROJECTS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const step = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function HomePage() {
  const [featured, ...others] = PROJECTS;

  return (
    <>
      <Splash />

      {/* Hero */}
      <section className="container-site flex min-h-[calc(100svh-54px)] flex-col items-center justify-center pb-20 pt-16 text-center md:pb-28">
        <div className="rise flex items-center gap-3.5 text-left" style={step(0)}>
          <Image
            src="/celso.jpg"
            alt="Portrait de Celso Tounkara"
            width={64}
            height={64}
            priority
            className="h-16 w-16 rounded-full object-cover ring-1 ring-black/5"
          />
          <div>
            <p className="text-[17px] font-semibold leading-tight">Celso Tounkara</p>
            <p className="text-[15px] text-mute">Développeur web, Conakry</p>
          </div>
        </div>

        <h1 className="rise display mt-9 text-hero" style={step(1)}>
          Sites et applications <br className="hidden sm:block" />
          <span className="text-gradient whitespace-nowrap">sur mesure.</span>
        </h1>

        <p className="rise mt-7 max-w-xl text-lead text-mute" style={step(2)}>
          Livrés depuis Conakry pour des clients partout dans le monde.
        </p>

        <div className="rise mt-10 flex flex-col items-center gap-5 sm:flex-row sm:gap-8" style={step(3)}>
          <Link href="/realisations" className="btn-primary">
            Voir les réalisations
          </Link>
          <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="btn-link">
            Prendre rendez-vous <span aria-hidden="true">›</span>
          </a>
        </div>
      </section>

      {/* Ce que je fais */}
      <section className="container-site section pt-0 md:pt-6">
        <SectionTitle title="Ce que je fais." intro="Du site vitrine à la plateforme complète, chaque projet est conçu pour votre activité." />
        <ServicesBento />
      </section>

      {/* Réalisations */}
      <section className="container-site section pt-0 md:pt-0">
        <SectionTitle
          title="Réalisations."
          intro="Une plateforme en production et des concepts conçus de A à Z."
          action={
            <Link href="/realisations" className="btn-link shrink-0">
              Tout voir <span aria-hidden="true">›</span>
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
          <Reveal className="md:col-span-6">
            <ProjectCard project={featured} wide />
          </Reveal>
          {others.slice(0, 2).map((project, i) => (
            <Reveal key={project.slug} delay={i * 90} className="md:col-span-3">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Toujours inclus */}
      <section className="container-site section pt-0 md:pt-0">
        <SectionTitle title="Toujours inclus." intro="Les fondamentaux d'un site professionnel, dans chaque projet." />
        <IncludedList />
      </section>

      <section className="container-site pb-[88px] md:pb-[140px]">
        <CtaCard />
      </section>
    </>
  );
}
