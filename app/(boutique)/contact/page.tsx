"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/boutique/navbar";
import { Footer } from "@/components/footer";
import { NewsletterSection } from "@/components/NewsletterSection";
import { Phone, MapPin, ArrowRight, MessageCircle, Copy, Check, Sparkles, ShoppingBag, HelpCircle, ChevronDown, Clock, ShieldCheck } from "lucide-react";

const WHATSAPP_NUMBER = "221774907955";
const PHONE_DISPLAY = "+221 77 490 79 55";
const INSTAGRAM_URL = "https://www.instagram.com/mamou_accessories_/";
const TIKTOK_URL = "https://www.tiktok.com/@mamouaccessories";

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
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const FAQ_ITEMS = [
  {
    q: "Comment puis-je passer commande ?",
    r: "Directement depuis notre boutique en ligne en ajoutant vos coups de cœur au panier, ou en nous envoyant directement une capture d'écran sur WhatsApp pour une prise en charge guidée.",
  },
  {
    q: "Quels sont les délais de livraison à Dakar ?",
    r: "Les livraisons sont effectuées très rapidement à Dakar et dans sa banlieue sous 24h à 48h après confirmation de votre commande.",
  },
  {
    q: "Puis-je voir un aperçu vidéo avant d'acheter ?",
    r: "Absolument ! Notre équipe WhatsApp se fera un plaisir de vous faire une démonstration en direct ou de vous envoyer des vidéos haute définition de la pièce.",
  },
];

export default function ContactPage() {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Bonjour 🌸 J'aimerais avoir des conseils et des informations sur vos bijoux Mamou's Accessories."
  )}`;

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PHONE_DISPLAY);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F7F4EF)] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">

          {/* ================= SECTION HAUTE (2 COLONNES) ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Colonne Gauche : Titre & Cartes d'info */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                {/* Eyebrow Badge Original */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] shadow-sm border border-[var(--laiton)]/20 mb-4">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--laiton)] animate-pulse" />
                  <span>SERVICE CLIENT & ASSISTANCE</span>
                </div>

                {/* Titre Principal Original Playfair Display */}
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] leading-[1.1] mb-4">
                  Sublimez votre expérience.
                </h1>

                {/* Description personnalisée */}
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-lg font-sans">
                  Une hésitation entre deux bijoux, une question sur une taille ou une commande en cours ? L&apos;équipe <strong className="text-[var(--obsidienne)] font-semibold">MAMOU&apos;S ACCESSORIES</strong> vous accompagne avec bienveillance et réactivité.
                </p>
              </div>

              {/* Deux cartes pilules d'information d'exception */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

                {/* Carte Téléphone */}
                <div className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] border border-[var(--laiton)]/15 hover:border-[var(--laiton)]/40 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--porcelaine,#F7F4EF)] text-[var(--laiton,#B9793E)]">
                      <Phone className="h-4 w-4" />
                    </div>
                    <button
                      onClick={handleCopyPhone}
                      className="text-neutral-400 hover:text-[var(--obsidienne)] p-1.5 rounded-full hover:bg-neutral-100 transition-all flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider"
                      title="Copier le numéro"
                    >
                      {copiedPhone ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Copié
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="h-3.5 w-3.5" /> Copier
                        </span>
                      )}
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] block mb-1">
                      LIGNE DIRECTE & WHATSAPP
                    </span>
                    <a
                      href={`tel:${WHATSAPP_NUMBER}`}
                      className="font-mono text-base font-extrabold text-[var(--obsidienne)] hover:text-[var(--laiton)] transition-colors block"
                    >
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </div>

                {/* Carte Zone & Livraison */}
                <div className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] border border-[var(--laiton)]/15 hover:border-[var(--laiton)]/40 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--porcelaine,#F7F4EF)] text-[var(--laiton,#B9793E)]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Disponible
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] block mb-1">
                      ZONE DE LIVRAISON
                    </span>
                    <span className="font-serif text-base font-extrabold text-[var(--obsidienne)] block">
                      Dakar & Envois Express
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Colonne Droite : Carte Contact Rapide Sur-Mesure */}
            <div className="lg:col-span-6">
              <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_10px_40px_-10px_rgba(14,11,9,0.08)] border border-[var(--laiton)]/15 space-y-4">

                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--laiton,#B9793E)] block mb-1">
                    VOS CANAUX PRIVILÉGIÉS
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--obsidienne,#0E0B09)]">
                    Échangez avec nous.
                  </h2>
                </div>

                <div className="space-y-3 pt-2">

                  {/* Option 1 : WhatsApp VIP (Sombre Obsidienne) */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-3xl bg-[var(--obsidienne,#0E0B09)] text-white p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md">
                        <MessageCircle className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-bold tracking-tight leading-snug">
                          Conseil Privé & WhatsApp
                        </h3>
                        <p className="text-xs text-white/70 truncate">
                          Discussion, aperçu vidéo & commande
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] group-hover:bg-[var(--porcelaine)] transition-colors">
                      <span>DISCUTER</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>

                  {/* Option 2 : Instagram Lookbook (Fond Blanc) */}
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-3xl bg-white border border-neutral-200/90 p-4 sm:p-5 hover:border-[var(--laiton)]/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 text-[var(--obsidienne)]">
                        <InstagramIcon className="h-5 w-5 text-pink-600" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-bold tracking-tight text-[var(--obsidienne)] leading-snug">
                          Instagram & Nouveautés
                        </h3>
                        <p className="text-xs text-neutral-500 truncate">
                          Inspirations de looks & nouvelles pièces
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--obsidienne)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white group-hover:bg-[var(--laiton)] transition-colors">
                      <span>REJOINDRE</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>

                  {/* Option 3 : TikTok Video Studio (Fond Blanc) */}
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-3xl bg-white border border-neutral-200/90 p-4 sm:p-5 hover:border-[var(--laiton)]/50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-[var(--obsidienne)]">
                        <TikTokIcon className="h-5 w-5 text-[var(--obsidienne)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-bold tracking-tight text-[var(--obsidienne)] leading-snug">
                          TikTok
                        </h3>
                        <p className="text-xs text-neutral-500 truncate">
                          Présentations vidéo HD en mouvement
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--obsidienne)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white group-hover:bg-[var(--laiton)] transition-colors">
                      <span>VOIR</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>

                </div>

              </div>
            </div>

          </div>

          {/* ================= SECTION FAQ INTERACTIVE (Touche de Luxe Mamou) ================= */}
          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--laiton,#B9793E)] block mb-1">
                QUESTIONS FRÉQUENTES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--obsidienne,#0E0B09)]">
                Tout ce que vous devez savoir.
              </h2>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-[var(--laiton)]/15 overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-serif font-bold text-sm sm:text-base text-[var(--obsidienne)] focus:outline-none"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-[var(--laiton)] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans border-t border-neutral-100">
                        <p className="pt-3">{item.r}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= BANNIÈRE INFÉRIEURE COMMANDER (Style Obsidienne Signature) ================= */}
          <div className="mt-16 sm:mt-20 rounded-[2.5rem] bg-[var(--obsidienne,#0E0B09)] text-white p-8 sm:p-10 lg:p-12 shadow-xl border border-[var(--laiton)]/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Ornements dorés concentriques d'ambiance */}
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 opacity-20">
              <div className="h-80 w-80 rounded-full border border-[var(--laiton)]" />
              <div className="absolute inset-10 rounded-full border border-[var(--laiton)]" />
            </div>

            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--laiton-clair,#D9AE78)] block mb-2">
                VOTRE PROCHAINE PIÈCE FAVORIE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                Laissez-vous séduire par nos créations d&apos;exception.
              </h2>
            </div>

            <Link
              href="/boutique"
              className="relative z-10 shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne)] shadow-md hover:bg-[var(--porcelaine)] hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <span>EXPLORER LA BOUTIQUE</span>
              <ShoppingBag className="h-4 w-4 text-[var(--laiton)]" />
            </Link>
          </div>

        </div>

        {/* Newsletter Section */}
        <div className="mt-16 sm:mt-20">
          <NewsletterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
