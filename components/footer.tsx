"use client";

import Link from "next/link";
import { AdminFooterButton } from "@/components/admin/admin-footer-button";

/* ============================================================
   Footer — pied de page public

   Remplace la page Contact : WhatsApp, Instagram, téléphone,
   navigation. CTA WhatsApp bien visible (canal principal).

   Numéro/réseaux à câbler depuis la table settings.
   ============================================================ */

// TODO: depuis settings
const WHATSAPP_NUMBER = "221774907955";
const INSTAGRAM_URL = "https://www.instagram.com/mamou_accessories_/";
const TIKTOK_URL = "https://www.tiktok.com/@mamouaccessories";
const PHONE_DISPLAY = "+221 77 490 79 55";

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos" },
  { href: "/suivi", label: "Suivre ma commande" },
];

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Bonjour 🌸 J'aimerais avoir des informations sur vos bijoux."
  )}`;

  return (
    <footer className="mt-8 overflow-hidden rounded-t-[2rem] bg-[#241B14] text-[#F4EFE6]">
      {/* CTA WhatsApp */}
      <div className="border-b border-white/10 px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">
            Une question ? Écrivez-nous<span className="text-[var(--gold)]">.</span>
          </h2>
          <p className="max-w-md text-sm text-[#F4EFE6]/60">
            Nous répondons rapidement sur WhatsApp pour vous conseiller et prendre vos commandes d'accessoires.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:brightness-105 active:scale-95"
          >
            <WhatsAppIcon />
            Discuter sur WhatsApp
          </a>
        </div>
      </div>

      {/* Liens + marque */}
      <div className="px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:justify-between">
          {/* Marque */}
          <div>
            <div className="flex flex-col leading-none">
              <span className="font-cinzel italic text-xl font-semibold tracking-wide" style={{ letterSpacing: '0.05em' }}>Mamou's</span>
              <span className="font-cinzel text-[9px] font-medium tracking-[0.3em] text-[var(--gold)] uppercase" style={{ letterSpacing: '0.35em' }}>
                ACCESSORIES
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-[#F4EFE6]/50">
              Des accessoires uniques pour sublimer chaque instant de votre vie.
            </p>
          </div>

          {/* Navigation + Admin Button (mobile: côte à côte) */}
          <div className="flex gap-8 lg:gap-12">
            {/* Navigation */}
            <nav className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#F4EFE6]/60 transition-colors hover:text-[var(--gold)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Admin Button - Discret à droite */}
            <div className="flex items-end">
              <AdminFooterButton />
            </div>
          </div>

          {/* Contact + réseaux */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
              Nous joindre
            </p>
            <a
              href={`tel:${WHATSAPP_NUMBER}`}
              className="mt-3 block text-sm text-[#F4EFE6]/70 transition-colors hover:text-[#F4EFE6]"
            >
              {PHONE_DISPLAY}
            </a>
            <div className="mt-4 flex gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/80 transition-colors hover:bg-emerald-500 hover:text-white"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/80 transition-colors hover:bg-[var(--gold)] hover:text-[#241B14]"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/80 transition-colors hover:bg-black hover:text-white"
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mx-auto mt-10 max-w-5xl border-t border-white/10 pt-6">
          <p className="text-center text-xs text-[#F4EFE6]/40">
            © {new Date().getFullYear()} Mamou's Accessories. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}