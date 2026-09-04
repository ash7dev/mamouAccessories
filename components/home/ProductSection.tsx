"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard, type PublicProductCard } from "@/components/home/ProductCard";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

interface ProductSectionProps {
  eyebrow: string;
  title: string;
  products: PublicProductCard[];
  viewAllHref?: string;
  /** Variante d'affichage mobile */
  mobileLayout?: "carousel" | "grid";
  /** Afficher la barre de filtres rapide par catégorie */
  enableCategoryFilter?: boolean;
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
  enableCategoryFilter = true,
}: ProductSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extraire automatiquement les catégories uniques des produits présentés
  const uniqueCategories = useMemo(() => {
    if (!enableCategoryFilter) return [];
    const cats = Array.from(new Set(products.map((p) => p.categoryName).filter(Boolean)));
    return cats;
  }, [products, enableCategoryFilter]);

  // Filtrer dynamiquement les produits affichés
  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.categoryName?.toLowerCase() === selectedCategory.toLowerCase());
  }, [products, selectedCategory]);

  if (products.length === 0) return null;

  return (
    <section className="px-5 py-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mb-5 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--laiton,#B9793E)]">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 text-xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] lg:text-3xl">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="group flex shrink-0 items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--laiton,#B9793E)] transition-colors hover:text-[var(--obsidienne,#0E0B09)]"
            >
              Voir tout
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </motion.div>

        {/* Pilules de filtres par catégorie (1-Clic) */}
        {uniqueCategories.length > 1 && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="mb-5 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1"
          >
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="relative shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-[var(--obsidienne,#0E0B09)]"
            >
              {selectedCategory === null && (
                <motion.div
                  layoutId={`activeCatPill-${title.replace(/\s+/g, '-')}`}
                  className="absolute inset-0 rounded-full bg-[var(--obsidienne,#0E0B09)] shadow-xs"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${selectedCategory === null ? "text-white" : "opacity-75 hover:opacity-100"}`}>
                Toutes
              </span>
            </button>
            {uniqueCategories.map((catName) => {
              const isSelected = selectedCategory === catName;
              return (
                <button
                  type="button"
                  key={catName}
                  onClick={() => setSelectedCategory(catName)}
                  className="relative shrink-0 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer text-[var(--obsidienne,#0E0B09)]"
                >
                  {isSelected && (
                    <motion.div
                      layoutId={`activeCatPill-${title.replace(/\s+/g, '-')}`}
                      className="absolute inset-0 rounded-full bg-[var(--obsidienne,#0E0B09)] shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${isSelected ? "text-white" : "opacity-75 hover:opacity-100"}`}>
                    {catName}
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Produits en grille ou carrousel avec animation layout */}
        <motion.div
          layout
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className={
            mobileLayout === "carousel"
              ? "scrollbar-none flex snap-x snap-mandatory gap-3.5 sm:gap-5 overflow-x-auto pb-5 -mx-5 px-5 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 items-stretch"
              : "grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-4 lg:gap-6 items-stretch"
          }
        >
          <AnimatePresence mode="popLayout">
            {displayedProducts.map((product, idx) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={
                  mobileLayout === "carousel"
                    ? "w-[47%] sm:w-[48%] shrink-0 snap-start lg:w-auto h-full flex flex-col first:ml-5 sm:first:ml-0"
                    : "h-full flex flex-col"
                }
              >
                <ProductCard product={product} priority={idx < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}