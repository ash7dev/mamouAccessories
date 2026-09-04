"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/motion";

/* ============================================================
   MaisonMamouExperience — Banner Assistance & Concierge WhatsApp
   ============================================================ */

export function MaisonMamouExperience() {
  return (
    <section className="relative overflow-hidden py-10 lg:py-16 px-4 sm:px-6 lg:px-8">
      {/* Background Soft Glow Effects */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[300px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(185,121,62,0.06),transparent_70%)]"
      />

      <div className="mx-auto max-w-7xl">
        {/* Floating Concierge Banner - White Luxe Card */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 lg:p-12 text-[var(--obsidienne,#0E0B09)] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-amber-900/10"
        >
          {/* Subtle Decorative Circles */}
          <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 opacity-15">
            <div className="h-64 w-64 rounded-full border border-[var(--laiton)]" />
            <div className="absolute inset-8 rounded-full border border-[var(--laiton)]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--laiton)] mb-2">
                Assistance Personnalisée
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[var(--obsidienne,#0E0B09)] leading-tight">
                Un coup de cœur ou une question sur un bijou ?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
                Contactez directement notre équipe sur WhatsApp pour réserver votre pièce ou demander un aperçu vidéo en direct avant votre achat.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <a
                href="https://wa.me/221779878666?text=Bonjour%20Mamou%20Jewelry,%20je%20souhaite%20un%20conseil%20sur%20vos%20bijoux"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[0_8px_25px_rgba(185,121,62,0.35)] transition-all hover:scale-105 hover:shadow-[0_12px_35px_rgba(185,121,62,0.5)] active:scale-95"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Conseil WhatsApp</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <Link
                href="/boutique"
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-900/20 bg-neutral-50 px-7 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white hover:border-neutral-900 active:scale-95"
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
