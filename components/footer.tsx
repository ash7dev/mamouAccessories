"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, MapPin, MessageCircle, Sparkles, ShoppingBag } from "lucide-react";
import { AdminFooterButton } from "@/components/admin/admin-footer-button";

const WHATSAPP_NUMBER = "221774907955";
const INSTAGRAM_URL = "https://www.instagram.com/mamou_accessories_/";
const TIKTOK_URL = "https://www.tiktok.com/@mamouaccessories";
const PHONE_DISPLAY = "+221 77 490 79 55";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

const navigationLinks = [
  { href: "/", label: "Accueil" },
  { href: "/boutique", label: "Boutique" },
  { href: "/a-propos", label: "À propos / Contact" },
  { href: "/panier", label: "Panier" },
];

export function Footer() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Bonjour 🌸 J'aimerais avoir des informations sur vos bijoux."
  )}`;

  return (
    <footer className="w-full py-6 md:py-10 px-2 sm:px-4 lg:px-6 bg-[var(--porcelaine)]">
      {/* Carte Flottante Principale Style Joaillerie Obsidienne */}
      <div className="max-w-[1480px] mx-auto rounded-[2.5rem] bg-[var(--obsidienne,#0E0B09)] text-[var(--texte-nuit,#F1ECE3)] p-6 sm:p-10 md:p-12 lg:p-14 border border-[var(--laiton)]/20 shadow-[0_32px_80px_-20px_rgba(14,11,9,0.5)] relative overflow-hidden">
        
        {/* Ligne lumineuse Laiton supérieure */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--laiton-clair,#D9AE78)] to-transparent opacity-70" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 pb-12">
          
          {/* Colonne 1 : Logo & Description & Badges (md:col-span-5) */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Logo Badge & Marque */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-[var(--laiton)]/40 overflow-hidden shadow-inner shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="Mamou Accessories Logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
                    MAMOU&apos;S
                  </h3>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[var(--laiton-clair,#D9AE78)]">
                    ACCESSORIES & JEWELLERY
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-sm text-[var(--texte-nuit)]/70 leading-relaxed max-w-sm mb-6 font-sans">
                Une sélection féminine, moderne et élégante pour composer une allure chic, raffinée et assumée.
              </p>
            </div>

            {/* Badges Pilules */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/80 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[var(--laiton-clair)]" />
                Sélection Premium
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/80 uppercase">
                <ShoppingBag className="w-3.5 h-3.5 text-[var(--laiton-clair)]" />
                Commande Simple
              </span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/80 uppercase hover:border-[var(--laiton)] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[var(--laiton-clair)]" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation Boutons Pilules (md:col-span-3.5) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)] mb-4">
              NAVIGATION
            </p>
            <div className="flex flex-col space-y-2.5">
              {navigationLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center justify-between w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-[var(--texte-nuit)]/85 hover:bg-white/10 hover:border-[var(--laiton)]/40 hover:text-white transition-all duration-200"
                >
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-[var(--laiton-clair)] group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              ))}
            </div>
          </div>

          {/* Colonne 3 : Contact & Réseaux Sociaux (md:col-span-4) */}
          <div className="md:col-span-4 space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--laiton-clair,#D9AE78)] mb-4">
              CONTACT & RÉSEAUX
            </p>
            <div className="flex flex-col space-y-2.5">
              {/* Téléphone */}
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="flex items-center justify-between w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-[var(--texte-nuit)]/85 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[var(--laiton-clair)]" />
                  <span>{PHONE_DISPLAY}</span>
                </div>
              </a>

              {/* Ville */}
              <div className="flex items-center justify-between w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-sm text-[var(--texte-nuit)]/85">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[var(--laiton-clair)]" />
                  <span>Dakar, Sénégal</span>
                </div>
              </div>

              {/* Bouton WhatsApp Mis en avant (Porcelaine/Laiton contrasté) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--obsidienne,#0E0B09)] px-5 py-3.5 font-bold text-sm shadow-md hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 mt-1"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4.5 h-4.5 text-[var(--obsidienne)]" />
                  <span className="uppercase tracking-wider text-xs">WHATSAPP</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--obsidienne)] group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--texte-nuit)]/85 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <InstagramIcon className="w-4 h-4 text-white/60" />
                  <span>INSTAGRAM</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* TikTok */}
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--texte-nuit)]/85 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <TikTokIcon className="w-4 h-4 text-white/60" />
                  <span>TIKTOK</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Rangerie inférieure / Copyright */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--texte-nuit)]/50">
          <p>© {new Date().getFullYear()} MAMOU&apos;S ACCESSORIES. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span>Boutique d&apos;accessoires & bijoux · Dakar</span>
            <AdminFooterButton />
          </div>
        </div>

      </div>
    </footer>
  );
}