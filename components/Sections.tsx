import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ServiceIcon } from "@/components/ServiceIcon";
import { CALENDLY_LINK, INCLUDED, PLANS, PROCESS, SERVICES } from "@/lib/site";

export function SectionTitle({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 className="display text-title text-ink">{title}</h2>
        {intro && <p className="mt-4 text-lead text-mute">{intro}</p>}
      </div>
      {action}
    </Reveal>
  );
}

/** Bento 2 × 2 des quatre services. */
export function ServicesBento({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5">
      {SERVICES.map((service, i) => (
        <Reveal key={service.title} delay={(i % 2) * 90} className="h-full">
          <article className="card flex h-full flex-col bg-cloud p-8 md:min-h-[300px] md:p-10">
            <ServiceIcon kind={service.icon} className="text-blue" />
            <div className="mt-auto pt-14">
              <h3 className="display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05]">{service.title}</h3>
              <p className="mt-3 max-w-md text-[17px] leading-relaxed text-mute">
                {detailed ? service.long : service.short}
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/** Liste « Toujours inclus » en trois colonnes séparées par des filets. */
export function IncludedList() {
  return (
    <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {INCLUDED.map((item, i) => (
        <Reveal as="li" key={item.title} delay={(i % 3) * 80} className="border-t border-hair py-7">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" className="text-blue">
            <circle cx="11" cy="11" r="10" stroke="currentColor" strokeWidth="1.6" />
            <path d="m6.8 11.3 2.8 2.7 5.6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 className="mt-4 text-[21px] font-bold tracking-[-0.02em]">{item.title}</h3>
          <p className="mt-1.5 text-[16px] leading-relaxed text-mute">{item.text}</p>
        </Reveal>
      ))}
    </ul>
  );
}

/** Processus en cinq étapes numérotées. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-5">
      {PROCESS.map((step, i) => (
        <Reveal as="li" key={step.title} delay={i * 80} className="border-t border-hair pb-6 pt-6">
          <span className="display block text-[44px] leading-none text-blue">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-5 text-[19px] font-bold tracking-[-0.02em]">{step.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-mute">{step.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

/** Six cartes de tarifs en GNF. */
export function PricingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
      {PLANS.map((plan, i) => {
        const featured = plan.featured;
        return (
          <Reveal key={plan.name} delay={(i % 3) * 90} className="h-full">
            <article
              className={`card relative flex h-full flex-col p-8 md:p-9 ${
                featured ? "bg-blue text-white shadow-[0_30px_60px_-30px_rgba(0,113,227,.7)]" : "bg-cloud text-ink"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[22px] font-bold tracking-[-0.02em]">{plan.name}</h3>
                {featured && (
                  <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-semibold text-blue">
                    Le plus choisi
                  </span>
                )}
              </div>
              <p className={`mt-2 text-[15px] leading-relaxed ${featured ? "text-white/80" : "text-mute"}`}>
                {plan.description}
              </p>

              <p className="mt-8">
                {plan.from && (
                  <span className={`mr-1.5 text-[15px] font-medium ${featured ? "text-white/80" : "text-mute"}`}>Dès</span>
                )}
                <span className="display text-[40px] leading-none">{plan.price}</span>
                <span className={`ml-1.5 text-[15px] font-semibold ${featured ? "text-white/80" : "text-mute"}`}>GNF</span>
              </p>

              <ul className={`mt-7 space-y-2.5 border-t pt-6 text-[15px] ${featured ? "border-white/25" : "border-hair"}`}>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className={`mt-[3px] shrink-0 ${featured ? "text-white" : "text-blue"}`}>
                      <path d="m3.5 8.4 3 2.9 6-6.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={`btn mt-8 px-5 py-2.5 text-[15px] ${
                  featured ? "bg-white text-blue hover:bg-white/90" : "bg-ink text-white hover:bg-black"
                }`}
              >
                Discutons-en
              </Link>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Carte d'appel à l'action sombre. */
export function CtaCard() {
  return (
    <Reveal>
      <div className="card relative overflow-hidden bg-ink px-8 py-16 text-center text-white md:px-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(0,113,227,.45), transparent)" }}
        />
        <div className="relative">
          <h2 className="display text-title">Parlons de votre projet.</h2>
          <p className="mx-auto mt-4 max-w-md text-lead text-white/65">Appel découverte gratuit de 30 minutes.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
            <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Prendre rendez-vous
            </a>
            <Link href="/contact" className="inline-flex items-center gap-1 text-[17px] font-medium text-[#2997ff] hover:underline underline-offset-4">
              Autres moyens de contact <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** En-tête des pages intérieures. */
export function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="container-site pb-4 pt-20 text-center md:pt-28">
      <p className="rise text-[17px] font-semibold text-mute" style={{ "--i": 0 } as React.CSSProperties}>
        {eyebrow}
      </p>
      <h1 className="rise display mx-auto mt-3 max-w-4xl text-[clamp(2.75rem,7.5vw,5.5rem)] leading-[1.02]" style={{ "--i": 1 } as React.CSSProperties}>
        {title}
      </h1>
      <p className="rise mx-auto mt-5 max-w-2xl text-lead text-mute" style={{ "--i": 2 } as React.CSSProperties}>
        {intro}
      </p>
    </header>
  );
}
