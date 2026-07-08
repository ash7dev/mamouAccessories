"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden rounded-b-[3rem] bg-[#241B14] px-6 py-20 lg:px-8 lg:py-32">
      {/* Ornement : cercles concentriques dorés */}
      <div className="pointer-events-none absolute -right-20 -top-20 opacity-30">
        <div className="h-64 w-64 rounded-full border border-[var(--gold)]/10" />
        <div className="absolute inset-8 rounded-full border border-[var(--gold)]/15" />
        <div className="absolute inset-16 rounded-full border border-[var(--gold)]/20" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-4xl font-bold text-[#F4EFE6] lg:text-6xl">
            Notre Histoire
          </h1>
          <p className="text-lg text-[#F4EFE6]/70 lg:text-xl">
            Découvrez l'histoire de Mamou Jewelry, une passion pour les bijoux élégants et les accessoires qui subliment votre style.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
