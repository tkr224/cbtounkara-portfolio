import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/Sections";
import { Reveal } from "@/components/Reveal";
import { CALENDLY_LINK, EMAIL, WHATSAPP_DISPLAY, WHATSAPP_LINK } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Réservez un appel découverte gratuit de 30 minutes, écrivez sur WhatsApp ou par e-mail à Celso Tounkara, développeur web à Conakry.",
  "/contact",
);

const CHANNELS = [
  {
    label: "Calendly",
    title: "Réserver un appel",
    text: "Appel découverte gratuit de 30 minutes.",
    action: "Choisir un créneau",
    href: CALENDLY_LINK,
    className: "bg-blue text-white",
    sub: "text-white",
    link: "text-white",
  },
  {
    label: "WhatsApp",
    title: "Écrire sur WhatsApp",
    text: WHATSAPP_DISPLAY,
    action: "Ouvrir la conversation",
    href: WHATSAPP_LINK,
    className: "bg-ink text-white",
    sub: "text-white/60",
    link: "text-[#2997ff]",
  },
  {
    label: "E-mail",
    title: "Envoyer un e-mail",
    text: EMAIL,
    action: "Écrire un message",
    href: `mailto:${EMAIL}`,
    className: "bg-cloud text-ink",
    sub: "text-mute",
    link: "text-link",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de votre projet."
        intro="Un appel, un message ou un e-mail : je réponds généralement dans la journée."
      />

      <section className="container-site pt-14 md:pt-20">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {CHANNELS.map((channel, i) => (
            <Reveal key={channel.label} delay={i * 90} className="h-full">
              <a
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`project-card card flex h-full min-h-[240px] flex-col p-8 ${channel.className}`}
              >
                <span className={`text-[14px] font-semibold ${channel.sub}`}>{channel.label}</span>
                <span className="mt-auto pt-10">
                  <span className="display block text-[28px] leading-tight">{channel.title}</span>
                  <span className={`mt-1.5 block break-words text-[16px] ${channel.sub}`}>{channel.text}</span>
                  <span className={`mt-5 block text-[15px] font-medium ${channel.link}`}>
                    {channel.action} <span aria-hidden="true">›</span>
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site section">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <h2 className="display text-title">Écrivez-moi.</h2>
            <p className="mt-4 text-lead text-mute">Quelques lignes suffisent pour commencer.</p>
          </Reveal>
          <Reveal className="mt-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
