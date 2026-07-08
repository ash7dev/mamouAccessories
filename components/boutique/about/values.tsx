"use client";

import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Gem } from "lucide-react";

const values = [
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Qualité Premium",
    description: "Des matériaux soigneusement sélectionnés pour des créations durables et élégantes.",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Passion Artisanale",
    description: "Chaque pièce est façonnée avec amour et expertise par nos artisans talentueux.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Engagement Client",
    description: "Votre satisfaction est notre priorité absolue, avec un service personnalisé.",
  },
  {
    icon: <Gem className="h-8 w-8" />,
    title: "Unicité",
    description: "Des créations exclusives qui vous permettent de vous démarquer avec style.",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-[var(--ivory)] px-6 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-[var(--text-dark)] lg:text-4xl">
            Nos Valeurs
          </h2>
          <p className="text-[var(--text-dark)]/60 max-w-2xl mx-auto">
            Ce qui nous anime chaque jour dans la création de nos bijoux
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_-8px_24px_-12px_rgba(43,33,24,0.1)] transition-all hover:shadow-[0_-8px_24px_-12px_rgba(43,33,24,0.2)] hover:border-[var(--gold)]/30">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#241B14] text-[var(--gold)] group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--text-dark)]">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--text-dark)]/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
