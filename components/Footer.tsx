import Link from "next/link";
import { CALENDLY_LINK, EMAIL, GITHUB_LINK, NAV_LINKS, WHATSAPP_LINK } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative z-10 bg-cloud text-[13px] text-mute">
      <div className="container-site py-12 md:py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="text-[17px] font-bold tracking-[-0.02em] text-ink">Celso Tounkara</p>
            <p className="mt-2 leading-relaxed">
              Développeur web à Conakry. Sites et applications sur mesure pour des clients partout dans le monde.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-2 sm:grid-cols-[auto_auto]">
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-ink hover:underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2.5">
              <li>
                <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-ink hover:underline underline-offset-4">
                  Calendly
                </a>
              </li>
              <li>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-ink hover:underline underline-offset-4">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="hover:text-ink hover:underline underline-offset-4">
                  E-mail
                </a>
              </li>
              <li>
                <a href={GITHUB_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-ink hover:underline underline-offset-4">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-hair pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Celso Tounkara. Tous droits réservés.</p>
          <a href="https://cbtounkara.online" className="hover:text-ink">
            cbtounkara.online
          </a>
        </div>
      </div>
    </footer>
  );
}
