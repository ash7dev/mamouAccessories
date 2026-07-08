/* eslint-disable @next/next/no-img-element */
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
    <section className="px-5 py-10 lg:px-8 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-5 flex items-end justify-between"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Explorez
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--text-dark)] lg:text-2xl">
              Nos catégories
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="scrollbar-none -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-wrap lg:justify-center lg:px-0"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={fadeUp}>
              <Link
                href={`/boutique?categorie=${cat.slug}`}
                className="group flex w-20 shrink-0 flex-col items-center gap-2.5 lg:w-24"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full border border-[var(--gold)]/20 bg-[var(--ivory)]/60 ring-2 ring-transparent transition-all group-hover:ring-[var(--gold)]/40 group-active:scale-95">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl text-[var(--gold)]/40">
                      ◆
                    </div>
                  )}
                </div>
                <span className="text-center text-xs font-medium leading-tight text-[var(--text-dark)]/70 transition-colors group-hover:text-[var(--text-dark)]">
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