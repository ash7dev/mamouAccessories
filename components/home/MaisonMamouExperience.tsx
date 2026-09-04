"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Gift, MessageCircle, Crown, ShieldCheck, ArrowRight } from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   MaisonMamouExperience — Section Signature Ultra-Premium
   Remplace les blocs génériques par un univers de marque luxueux
   inspiré de la haute joaillerie.
   ============================================================ */

const pillars = [
  {
    icon: Crown,
    badge: "01. Sélectivité",
    title: "Sélection Rigoureuse",
    desc: "Chaque bijou est soigneusement déniché et contrôlé pour vous offrir éclat, finesse et une excellente tenue au quotidien.",
  },
  {
    icon: Gift,
    badge: "02. Présentation",
    title: "Écrins & Attention",
    desc: "Vos bijoux sont emballés avec le plus grand soin dans de ravissants coffrets, prêts à offrir ou à enrichir votre collection.",
  },
  {
    icon: MessageCircle,
    badge: "03. Service Client VIP",
    title: "Conseil & Aperçu Vidéo",
    desc: "Hésitation entre deux bijoux ? Notre équipe sur WhatsApp vous guide avec plaisir et peut vous montrer les pièces en direct.",
  },
];

export function MaisonMamouExperience() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Soft Glow Effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(185,121,62,0.08),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="text-center max-w-3xl mx-auto mb-14 lg:mb-20"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton)]/30 bg-[var(--laiton)]/10 px-4 py-1.5 backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[var(--laiton)]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--laiton)]">
              La Signature Mamou Jewelry
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--obsidienne)]"
          >
            Sublimez Votre Style au Quotidien
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 text-base sm:text-lg text-[var(--obsidienne)]/70 font-light leading-relaxed"
          >
            Une sélection exclusive de bijoux raffinés et tendances, choisis avec soin pour vous apporter élégance et distinction.
          </motion.p>
        </motion.div>

        {/* 3 Pillars Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={fadeUp}
                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--laiton)]/20 bg-white/80 p-8 shadow-[0_4px_24px_-6px_rgba(14,11,9,0.05)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-[var(--laiton)]/50 hover:shadow-[0_20px_48px_-12px_rgba(185,121,62,0.2)]"
              >
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--obsidienne)] to-[#241B14] text-[var(--laiton)] shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-bold tracking-widest text-[var(--laiton)] uppercase opacity-80">
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-xl font-bold text-[var(--obsidienne)] mb-3 group-hover:text-[var(--laiton)] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--obsidienne)]/70">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--obsidienne)]/5 flex items-center justify-between text-xs font-bold text-[var(--laiton)] uppercase tracking-wider">
                  <span>Qualité Garantie</span>
                  <ShieldCheck className="h-4 w-4 opacity-70" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floating Concierge Banner */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-14 lg:mt-20 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#0E0B09] via-[#1E1712] to-[#0E0B09] p-8 lg:p-12 text-white shadow-2xl border border-[var(--laiton)]/30"
        >
          {/* Subtle Decorative Circles */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 opacity-30">
            <div className="h-64 w-64 rounded-full border border-[var(--laiton)]" />
            <div className="absolute inset-8 rounded-full border border-[var(--laiton)]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--laiton)] mb-2">
                Assistance Personnalisée
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white leading-tight">
                Un coup de cœur ou une question sur un bijou ?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed">
                Contactez directement notre équipe sur WhatsApp pour réserver votre pièce ou demander un aperçu vidéo en direct avant votre achat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/221779878666?text=Bonjour%20Mamou%20Jewelry,%20je%20souhaite%20un%20conseil%20sur%20vos%20bijoux"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_25px_rgba(185,121,62,0.4)] transition-all hover:scale-105 hover:shadow-[0_12px_35px_rgba(185,121,62,0.6)] active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Conseil WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/boutique"
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
              >
                Voir la boutique
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
