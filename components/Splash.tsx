"use client";

import { useEffect } from "react";

const KEY = "ct-splash-seen";

/* Exécuté pendant le parsing, avant le premier affichage : décide d'afficher
   le splash (première visite de la session, sans réduction des animations). */
const decide = `try{if(!sessionStorage.getItem('${KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('splash','splash-lock')}}catch(e){}`;

export function Splash() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("splash")) return;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    // Le défilement se libère quand l'overlay a quitté l'écran (2,5 s + 1 s),
    // puis on retire le mode splash une fois la cascade du hero terminée.
    // Volontairement sans nettoyage : ces classes doivent tomber même si
    // l'on quitte l'accueil avant la fin.
    window.setTimeout(() => root.classList.remove("splash-lock"), 3400);
    window.setTimeout(() => root.classList.remove("splash"), 5200);
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: decide }} />
      <div
        aria-hidden="true"
        className="splash-overlay fixed inset-0 z-[100] flex-col items-center justify-center bg-white px-6"
      >
        <span className="splash-dot mb-7 block h-3 w-3 rounded-full bg-blue" />
        <p className="splash-name text-center text-[clamp(2.5rem,11vw,54px)] font-bold leading-none tracking-[-0.035em] text-ink">
          Celso Tounkara
        </p>
        <span className="splash-line mt-6 block h-[2px] w-[240px] max-w-[70vw] bg-ink" />
        <p className="splash-sub mt-5 text-[17px] text-mute">Développeur web · Conakry</p>
      </div>
    </>
  );
}
