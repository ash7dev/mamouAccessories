"use client";

import { motion } from "framer-motion";

export function StorySection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center"
        >
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/5 p-8">
              <div className="h-full w-full rounded-2xl bg-[#241B14] overflow-hidden">
                <img
                  src="/props.jpeg"
                  alt="Notre Atelier"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Ornement décoratif */}
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border-2 border-[var(--gold)]/30" />
          </div>

          <div>
            <h2 className="mb-6 text-3xl font-bold text-[var(--text-dark)] lg:text-4xl">
              Notre Passion
            </h2>
            <div className="space-y-4 text-[var(--text-dark)]/70">
              <p className="leading-relaxed">
                Mamou Jewelry est née d'une passion pour les bijoux et les accessoires qui racontent une histoire. Chaque pièce que nous créons est le fruit d'un savoir-faire artisanal et d'une attention méticuleuse aux détails.
              </p>
              <p className="leading-relaxed">
                Depuis nos débuts, nous nous engageons à offrir des créations uniques qui allient élégance et qualité. Notre mission est de vous aider à exprimer votre style à travers des pièces qui vous ressemblent.
              </p>
              <p className="leading-relaxed">
                Que ce soit pour une occasion spéciale ou pour le quotidien, nos bijoux sont conçus pour sublimer chaque moment de votre vie.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
