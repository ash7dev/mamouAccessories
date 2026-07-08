"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   CategoryRail — accès rapide aux catégories

   Style "app mobile" : rangée à défilement horizontal de
   catégories, chacune avec sa vignette ronde. En desktop, ça
   se centre naturellement.
   ============================================================ */

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

export function CategoryRail({ categories }: { categories: HomeCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="px-5 py-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Explorez
            </p>
            <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-[var(--text-dark)] lg:text-3xl">
              Nos catégories
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="scrollbar-none -mx-5 flex gap-6 overflow-x-auto px-5 pb-4 lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link
                href={`/boutique?categorie=${cat.slug}`}
                className="group flex w-24 shrink-0 flex-col items-center gap-3 lg:w-28"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full border-2 border-[var(--gold)]/30 bg-gradient-to-br from-[var(--ivory)] to-[var(--gold)]/20 shadow-[0_8px_24px_-8px_rgba(185,138,68,0.25)] transition-all duration-300 group-hover:border-[var(--gold)]/60 group-hover:shadow-[0_12px_32px_-8px_rgba(185,138,68,0.35)] group-hover:scale-105">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-3xl text-[var(--gold)]/40">
                      ◆
                    </div>
                  )}
                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241B14]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <span className="text-center text-sm font-semibold leading-tight text-[var(--text-dark)] transition-colors group-hover:text-[var(--gold-dark)]">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}