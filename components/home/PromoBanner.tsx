"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { scaleIn, viewportOnce } from "@/lib/motion";

/* ============================================================
   PromoBanner — bandeau promotionnel

   Affiché seulement si une promo/offre est active (le parent
   décide). Fond sombre pour contraster avec le reste de la page
   crème et attirer l'œil.
   ============================================================ */

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export function PromoBanner({
  title = "Offre du moment",
  subtitle = "Profitez de nos prix doux sur une sélection de bijoux.",
  ctaLabel = "En profiter",
  ctaHref = "/boutique",
}: PromoBannerProps) {
  return (
    <section className="px-5 py-6 lg:px-8 lg:py-10">
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-[#241B14] px-7 py-10 lg:px-12 lg:py-14"
      >
        {/* Ornement cercles dorés */}
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 opacity-70">
          <div className="h-56 w-56 rounded-full border border-[var(--gold)]/15" />
          <div className="absolute inset-8 rounded-full border border-[var(--gold)]/20" />
          <div className="absolute inset-16 rounded-full border border-[var(--gold)]/25" />
        </div>
        {/* Halo doré */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-[var(--gold)]/20 blur-3xl"
        />

        <div className="relative max-w-md">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
            {title}
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-[#F4EFE6] lg:text-4xl">
            {subtitle}
          </h2>
          <Link
            href={ctaHref}
            className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/90 px-6 py-3.5 text-sm font-bold text-[#241B14] shadow-[0_8px_32px_rgba(185,138,68,0.35)] transition-all hover:shadow-[0_12px_40px_rgba(185,138,68,0.45)] hover:brightness-105 active:scale-95 backdrop-blur-sm"
          >
            {ctaLabel}
            <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}