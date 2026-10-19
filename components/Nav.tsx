"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CALENDLY_LINK, NAV_LINKS } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Referme le menu mobile à chaque changement de page.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/[0.72] backdrop-blur-xl backdrop-saturate-[1.8]">
      <nav className="container-site flex h-[54px] items-center justify-between gap-6" aria-label="Navigation principale">
        <Link href="/" className="text-[17px] font-bold tracking-[-0.02em] text-ink">
          Celso Tounkara
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-[14px] transition-colors duration-200 ${
                  isActive(link.href) ? "font-medium text-ink" : "text-mute hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={CALENDLY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-blue px-4 py-[7px] text-[14px] font-medium text-white transition-colors hover:bg-blue-hover sm:inline-flex"
          >
            Prendre rendez-vous
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="relative block h-3 w-[18px]">
              <span
                className={`absolute left-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-300 ease-out ${
                  open ? "top-[5px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 h-[1.5px] w-full rounded bg-ink transition-transform duration-300 ease-out ${
                  open ? "top-[5px] -rotate-45" : "top-[10px]"
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-500 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <ul className={`container-site flex flex-col pb-8 pt-4 transition-[visibility] duration-500 ${open ? "visible" : "invisible"}`}>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`block py-2.5 text-[28px] font-bold tracking-[-0.03em] ${
                    isActive(link.href) ? "text-ink" : "text-mute"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-6">
              <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                Prendre rendez-vous
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
