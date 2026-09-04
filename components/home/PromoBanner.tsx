"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Clock, Copy, Check, ArrowRight, Tag, X } from "lucide-react";
import { scaleIn, viewportOnce } from "@/lib/motion";

/* ============================================================
   PromoBanner — Bandeau promotionnel Ultra-Premium & Moderne
   - Compte à rebours dynamique en temps réel
   - Bouton de copie du code promo en 1-clic
   - Design luxury (Obsidienne, Laiton, Glassmorphism)
   - Filtrage strict de la date d'expiration
   ============================================================ */

export interface PromoBannerData {
  id?: string;
  title?: string;
  subtitle?: string;
  discountType?: "percentage" | "fixed_amount" | string;
  discountValue?: number;
  promoCode?: string;
  endDate?: string; // Format ISO
  ctaLabel?: string;
  ctaHref?: string;
  isActive?: boolean;
}

interface PromoBannerProps {
  promo?: PromoBannerData | null;
  // Options de secours si promo directe passée en props
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  promoCode?: string;
  discountValue?: number;
  endDate?: string;
}

export function PromoBanner({
  promo,
  title: defaultTitle = "Ventes Privées d'Exception",
  subtitle: defaultSubtitle = "Bénéficiez d'une offre privilégiée sur une sélection de bijoux de haute qualité.",
  ctaLabel: defaultCtaLabel = "Découvrir la sélection",
  ctaHref: defaultCtaHref = "/boutique",
  promoCode: defaultPromoCode,
  discountValue: defaultDiscountValue,
  endDate: defaultEndDate,
}: PromoBannerProps) {
  const [copied, setCopied] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Fusion des props
  const activeTitle = promo?.title || defaultTitle;
  const activeSubtitle = promo?.subtitle || defaultSubtitle;
  const activeCtaLabel = promo?.ctaLabel || defaultCtaLabel;
  const activeCtaHref = promo?.ctaHref || defaultCtaHref;
  const activePromoCode = promo?.promoCode || defaultPromoCode;
  const activeDiscount = promo?.discountValue || defaultDiscountValue;
  const activeEndDate = promo?.endDate || defaultEndDate;

  // Calcul du temps restant
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    if (!activeEndDate) return;

    const calculateTime = () => {
      const difference = new Date(activeEndDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, expired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeEndDate]);

  // Si le bandeau a été masqué ou si la promo est expirée
  if (dismissed || timeLeft.expired) {
    return null;
  }

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!activePromoCode) return;
    navigator.clipboard.writeText(activePromoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
      <AnimatePresence>
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-[var(--laiton)]/30 bg-gradient-to-br from-[#0E0B09] via-[#1E1610] to-[#0E0B09] p-6 sm:p-10 lg:p-14 text-white shadow-[0_20px_60px_-15px_rgba(14,11,9,0.5)]"
        >
          {/* Cercles décoratifs d'ambiance avec lueur dorée */}
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 opacity-40">
            <div className="h-72 w-72 rounded-full border border-[var(--laiton)]/20 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-[var(--laiton)]/30" />
            <div className="absolute inset-16 rounded-full border border-[var(--laiton)]/40" />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[var(--laiton)]/15 blur-3xl"
          />

          {/* Bouton Fermer */}
          <button
            onClick={() => setDismissed(true)}
            aria-label="Fermer la bannière promotionnelle"
            className="absolute right-5 top-5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-neutral-400 backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Colonne Gauche : Infos Offre */}
            <div className="max-w-2xl text-center lg:text-left">
              {/* Badge En-tête */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton)]/40 bg-[var(--laiton)]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--laiton)] backdrop-blur-md mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Offre Exclusive</span>
                {activeDiscount && (
                  <span className="ml-1 rounded-full bg-[var(--laiton)] px-2 py-0.5 text-[10px] text-white">
                    −{activeDiscount}%
                  </span>
                )}
              </div>

              {/* Titre Principal */}
              <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {activeTitle}
              </h2>

              {/* Description */}
              <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                {activeSubtitle}
              </p>

              {/* Code Promo à copier s'il existe */}
              {activePromoCode && (
                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <span className="text-xs text-neutral-400 font-medium">Code privilège :</span>
                  <button
                    onClick={handleCopyCode}
                    className="group inline-flex items-center gap-2 rounded-xl border border-[var(--laiton)]/40 bg-black/40 px-4 py-2 text-xs font-mono font-bold text-[var(--laiton)] backdrop-blur-md transition-all hover:bg-[var(--laiton)]/20 hover:border-[var(--laiton)] active:scale-95"
                  >
                    <Tag className="h-3.5 w-3.5 text-[var(--laiton)]" />
                    <span>{activePromoCode}</span>
                    {copied ? (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Copié
                      </span>
                    ) : (
                      <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Colonne Droite : Compte à Rebours & Bouton CTA */}
            <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">
              {/* Compte à rebours si date de fin présente */}
              {activeEndDate && !timeLeft.expired && (
                <div className="mb-6 w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--laiton)] font-semibold uppercase tracking-wider mb-3">
                    <Clock className="h-3.5 w-3.5 animate-pulse" />
                    <span>Offre limitée dans le temps</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 p-2 border border-white/5">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                        {String(timeLeft.days).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Jours</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 p-2 border border-white/5">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Heures</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 p-2 border border-white/5">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Mins</span>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-black/50 p-2 border border-white/5">
                      <span className="font-mono text-xl sm:text-2xl font-bold text-white tabular-nums">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Secs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton d'action CTA */}
              <Link
                href={activeCtaHref}
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[var(--laiton)] via-[#C88A4E] to-[var(--laiton)] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_30px_rgba(185,121,62,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_40px_rgba(185,121,62,0.6)] active:scale-95"
              >
                <span>{activeCtaLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}