"use client";

import { useState } from "react";
import { EMAIL } from "@/lib/site";

const PROJECT_TYPES = [
  "Landing page",
  "Portfolio",
  "Site vitrine",
  "Boutique en ligne",
  "Application web",
  "Plateforme sur mesure",
  "Autre",
];

/** Le formulaire prépare un e-mail dans la messagerie du visiteur. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const type = String(data.get("type") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const subject = `Projet ${type} : ${name}`;
    const body = `${message}\n\n${name}\n${email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="mb-2 block text-[14px] font-medium text-ink">Nom</span>
        <input name="name" required autoComplete="name" className="field" placeholder="Votre nom" />
      </label>
      <label className="block">
        <span className="mb-2 block text-[14px] font-medium text-ink">E-mail</span>
        <input name="email" type="email" required autoComplete="email" className="field" placeholder="vous@exemple.com" />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-[14px] font-medium text-ink">Type de projet</span>
        <span className="relative block">
          <select name="type" required defaultValue="" className="field appearance-none pr-11">
            <option value="" disabled>
              Choisissez un type de projet
            </option>
            {PROJECT_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <svg aria-hidden="true" width="12" height="8" viewBox="0 0 12 8" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mute">
            <path d="m1 1.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-2 block text-[14px] font-medium text-ink">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          className="field resize-y"
          placeholder="Parlez-moi de votre projet, de vos objectifs et de vos délais."
        />
      </label>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary px-8">
          Envoyer
        </button>
        <p className="text-[14px] text-mute" aria-live="polite">
          {sent
            ? "Votre messagerie s'ouvre avec le message prêt à partir."
            : `Votre messagerie s'ouvrira avec le message adressé à ${EMAIL}.`}
        </p>
      </div>
    </form>
  );
}
