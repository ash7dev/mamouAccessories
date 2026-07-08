/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   Hero — section d'accroche de la page d'accueil

   Mobile-first : visuel généreux, titre avec accent doré (le
   "point" à la atozom), CTA vers la boutique. En desktop, passe
   en deux colonnes texte / visuel.

   Prop `heroImage` : une belle photo produit (Cloudinary).
   ============================================================ */

interface HeroProps {
  heroImage?: string;
}

function ArrowRightIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export function Hero({ heroImage }: HeroProps) {
  return (
    <section className="relative overflow-hidden hidden px-5 pt-28 lg:px-8 lg:pt-36 md:block">
      {/* Halo doré diffus en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--gold)]/15 blur-3xl lg:h-96 lg:w-96"
      />

      <div className="relative mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Texte */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center lg:text-left"
        >
          <motion.span
            variants={fadeUp}
            className="inline-block rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)]"
          >
            Bijoux faits avec amour
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight text-[var(--text-dark)] lg:text-6xl"
          >
            Sublimez chaque
            <br />
            instant<span className="text-[var(--gold)]">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[var(--text-dark)]/60 lg:mx-0"
          >
            Des pièces uniques, choisies avec soin pour révéler votre élégance
            au quotidien.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex justify-center lg:justify-start">
            <Link
              href="/boutique"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[var(--gold)] px-7 py-4 text-sm font-bold text-[#241B14] shadow-lg shadow-[var(--gold)]/25 transition-transform hover:brightness-105 active:scale-95"
            >
              Découvrir la collection
              <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Visuel */}
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="show"
          className="relative mx-auto w-full max-w-sm lg:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--gold)]/15 bg-[var(--ivory)]/60 shadow-xl">
            {heroImage ? (
              <img src={heroImage} alt="Bijoux en vedette" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-[var(--gold)]/30">
                ◆
              </div>
            )}
          </div>

          {/* Carte flottante décorative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-4 -left-4 rounded-2xl border border-[var(--gold)]/15 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-dark)]/40">
              Livraison
            </p>
            <p className="text-sm font-bold text-[var(--text-dark)]">Dakar &amp; régions</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}