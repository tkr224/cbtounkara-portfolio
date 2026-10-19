import Image from "next/image";
import type { Project } from "@/lib/site";

type Props = {
  project: Project;
  /** Carte pleine largeur : texte à gauche, capture à droite sur grand écran. */
  wide?: boolean;
  /** Carte plus compacte (grille de trois colonnes). */
  compact?: boolean;
  priority?: boolean;
};

const domainOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export function ProjectCard({ project, wide, compact, priority }: Props) {
  const dark = project.dark;

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.name}, ${project.type} : ouvrir le site dans un nouvel onglet`}
      className={`project-card group relative flex h-full flex-col overflow-hidden rounded-card ${
        wide ? "md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-end md:gap-4" : ""
      } ${dark ? "text-white" : "text-ink"}`}
      style={{ backgroundColor: project.bg }}
    >
      <div className={`relative z-10 ${compact ? "p-7 pb-6" : "p-8 pb-7 md:p-10"} ${wide ? "md:self-center md:pb-10 md:pr-0" : ""}`}>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${
            dark ? "bg-white/10 text-white/85" : "bg-white/80 text-ink/80"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${project.status === "production" ? "bg-[#30d158]" : dark ? "bg-white/50" : "bg-mute/60"}`}
          />
          {project.status === "production" ? "En production" : "Démo"}
        </span>

        <h3
          className={`display mt-4 leading-[1.05] ${
            wide ? "text-[clamp(2rem,4.4vw,3.5rem)]" : compact ? "text-[26px]" : "text-[clamp(1.75rem,3vw,2.25rem)]"
          }`}
        >
          {project.name}
        </h3>
        <p className={`mt-1.5 text-[17px] ${dark ? "text-white/70" : "text-[#515154]"}`}>{project.type}</p>
        <p className={`mt-0.5 text-[14px] ${dark ? "text-white/60" : "text-[#5e5e63]"}`}>{domainOf(project.url)}</p>
        <p className={`mt-5 text-[15px] font-medium ${dark ? "text-[#2997ff]" : "text-link"}`}>
          Ouvrir le site <span aria-hidden="true">↗</span>
        </p>
      </div>

      <div className={`relative mt-auto ${compact ? "pl-7" : "pl-8 md:pl-10"} ${wide ? "md:mt-10 md:pl-0" : ""}`}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-tl-[14px] shadow-[0_10px_40px_-12px_rgba(0,0,0,.28)] ring-1 ring-black/5">
          <Image
            src={project.image}
            alt={`Capture d'écran du site ${project.name}`}
            fill
            priority={priority}
            sizes={wide ? "(min-width: 1180px) 680px, (min-width: 768px) 58vw, 92vw" : compact ? "(min-width: 768px) 360px, 92vw" : "(min-width: 1180px) 560px, (min-width: 768px) 46vw, 92vw"}
            className="object-cover object-left-top"
          />
        </div>
      </div>
    </a>
  );
}
