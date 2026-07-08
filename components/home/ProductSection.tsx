"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProductCard, type PublicProductCard } from "@/components/home/ProductCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/* ============================================================
   ProductSection — section de produits réutilisable

   Sert pour "Coups de cœur" (mis en avant) ET "Nouveautés".
   - Mobile  : carrousel horizontal (2 cartes visibles)
   - Desktop : grille 4 colonnes

   Le carrousel mobile utilise le scroll natif avec snap — pas
   de dépendance. Pour un swipe plus riche, embla-carousel-react
   peut remplacer la div scrollable.
   ============================================================ */

interface ProductSectionProps {
  eyebrow: string;
  title: string;
  products: PublicProductCard[];
  viewAllHref?: string;
  /** Variante d'affichage mobile */
  mobileLayout?: "carousel" | "grid";
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export function ProductSection({
  eyebrow,
  title,
  products,
  viewAllHref = "/boutique",
  mobileLayout = "carousel",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-5 py-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-5xl">
        {/* En-tête */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-6 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--text-dark)] lg:text-2xl">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--gold-dark)] transition-colors hover:text-[var(--text-dark)]"
            >
              Voir tout
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>

        {/* Mobile : carrousel ou grille */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className={
            mobileLayout === "carousel"
              ? "scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0"
              : "grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
          }
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              className={
                mobileLayout === "carousel"
                  ? "w-[46%] shrink-0 snap-start lg:w-auto"
                  : ""
              }
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}