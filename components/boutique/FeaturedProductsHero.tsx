"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProductCard } from "@/components/home/ProductCard";
import type { PublicProductCard } from "@/components/home/ProductCard";

interface FeaturedProductsHeroProps {
  featuredProducts: PublicProductCard[];
}

export function FeaturedProductsHero({ featuredProducts }: FeaturedProductsHeroProps) {
  return (
    <section className="py-12 px-6 lg:px-8 bg-gradient-to-b from-[var(--ivory)]/50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="font-cinzel text-sm font-semibold tracking-[0.3em] text-[var(--gold)] uppercase mb-3">
            Collection Exclusive
          </p>
          <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-dark)] mb-4">
            Nos Créations Favorites
          </h1>
          <p className="text-[var(--text-dark)]/60 max-w-2xl mx-auto">
            Découvrez nos pièces les plus prisées, sélectionnées avec soin pour sublimer votre style.
          </p>
        </motion.div>

        {/* Featured Products Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0">
          {featuredProducts.slice(0, 6).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[160px] md:w-[200px] lg:w-[240px] snap-start"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--espresso)] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[var(--espresso)]/90 hover:scale-105 shadow-lg"
          >
            Voir Toute la Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
