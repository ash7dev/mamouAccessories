"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function BoutiqueHero() {
  return (
    <section className="hidden lg:block py-16 px-8 bg-gradient-to-br from-[var(--ivory)]/40 via-white to-[var(--ivory)]/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B8935E' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Eyebrow avec icône */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold-dark)]">
              Collection Exclusive
            </p>
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
          </div>

          {/* Titre principal */}
          <h1 className="font-cinzel text-5xl md:text-6xl font-bold text-[var(--text-dark)] mb-4 tracking-tight">
            La Boutique
          </h1>

          {/* Description */}
          <p className="text-lg text-[var(--text-dark)]/60 max-w-2xl mx-auto leading-relaxed">
            Découvrez notre sélection de bijoux raffinés, conçus pour sublimer chaque instant
          </p>

          {/* Ligne décorative */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/30" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
