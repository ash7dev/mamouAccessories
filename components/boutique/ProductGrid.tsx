"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/home/ProductCard";
import type { PublicProductCard } from "@/components/home/ProductCard";
import type { ViewMode } from "./ViewToggle";

interface ProductGridProps {
  products: PublicProductCard[];
  isLoading?: boolean;
  viewMode?: ViewMode;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ProductGrid({ products, isLoading, viewMode = "grid" }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" : "space-y-4"}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={viewMode === "grid" ? "aspect-[3/4] rounded-2xl bg-[var(--ivory)]/50 animate-pulse" : "h-32 rounded-2xl bg-[var(--ivory)]/50 animate-pulse"} />
        ))}
      </div>
    );
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link
            href={`/produit/${product.slug}`}
            className="group flex gap-4 md:gap-6 rounded-2xl border border-[var(--gold)]/10 bg-white p-4 shadow-sm hover:shadow-md hover:border-[var(--gold)]/30 transition-all"
          >
            {/* Image */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--ivory)]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 96px, 128px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--gold)]/30">
                  <span className="text-4xl">◆</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-xs text-[var(--gold-dark)] font-medium mb-1">
                  {product.categoryName}
                </p>
                <h3 className="text-base md:text-lg font-semibold text-[var(--text-dark)] mb-2 truncate">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg md:text-xl font-bold text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(product.price)} F
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-[var(--text-dark)]/40 line-through tabular-nums">
                      {formatFCFA(product.compareAtPrice)} F
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Badge */}
              <div className="flex items-center gap-2 mt-2">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    En stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Épuisé
                  </span>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="inline-flex rounded-full bg-[var(--gold)]/10 px-3 py-1 text-xs font-semibold text-[var(--gold-dark)]">
                    Promo
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
