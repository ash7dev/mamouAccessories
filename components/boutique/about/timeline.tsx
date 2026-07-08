"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "2020",
    title: "La Création",
    description: "Mamou Jewelry voit le jour avec une vision : créer des bijoux uniques qui racontent une histoire.",
  },
  {
    year: "2021",
    title: "Première Collection",
    description: "Lancement de notre première collection, accueillie avec enthousiasme par nos premières clientes.",
  },
  {
    year: "2022",
    title: "Expansion",
    description: "Ouverture de notre atelier et élargissement de notre gamme de produits.",
  },
  {
    year: "2023",
    title: "Communauté",
    description: "Développement d'une communauté fidèle et reconnaissance de notre savoir-faire artisanal.",
  },
];

export function TimelineSection() {
  return (
    <section className="px-6 py-20 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-[var(--text-dark)] lg:text-4xl">
            Notre Parcours
          </h2>
          <p className="text-[var(--text-dark)]/60">
            Les moments clés qui ont façonné Mamou Jewelry
          </p>
        </motion.div>

        <div className="relative">
          {/* Ligne verticale */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--gold)]/50 to-[var(--gold)]/10 lg:left-1/2 lg:-translate-x-1/2" />

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`相对 mb-12 lg:mb-16 ${
                index % 2 === 0 ? "lg:pr-1/2 lg:text-right" : "lg:pl-1/2 lg:ml-auto"
              }`}
            >
              <div className="relative pl-20 lg:pl-0 lg:px-12">
                {/* Point sur la ligne */}
                <div className="absolute left-6 top-2 h-4 w-4 rounded-full bg-[var(--gold)] ring-4 ring-white lg:left-1/2 lg:-translate-x-1/2" />

                <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_-8px_24px_-12px_rgba(43,33,24,0.1)]">
                  <span className="mb-2 inline-block rounded-full bg-[var(--gold)]/10 px-3 py-1 text-sm font-semibold text-[var(--gold)]">
                    {milestone.year}
                  </span>
                  <h3 className="mb-2 text-xl font-bold text-[var(--text-dark)]">
                    {milestone.title}
                  </h3>
                  <p className="text-[var(--text-dark)]/60">
                    {milestone.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
