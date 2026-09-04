"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Check, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/home/ProductCard";
import type { PublicProductCard } from "@/components/home/ProductCard";
import type { ViewMode } from "./ViewToggle";
import { useCart } from "@/lib/cart-context";
import { ProductImage } from "@/components/ui/product-image";

interface ProductGridProps {
  products: PublicProductCard[];
  isLoading?: boolean;
  viewMode?: ViewMode;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function ProductListItem({ product }: { product: PublicProductCard }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isOut = product.stock === 0;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOut || justAdded) return;
    addItem(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite((v) => !v);
  };

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col sm:flex-row items-stretch gap-4 sm:gap-6 rounded-[2rem] border border-[var(--laiton)]/15 bg-white p-3.5 sm:p-5 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] hover:shadow-[0_20px_48px_-12px_rgba(185,121,62,0.22)] hover:border-[var(--laiton)]/40 transition-all duration-300 overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-48 md:w-56 aspect-[4/3] sm:aspect-square shrink-0 rounded-2xl overflow-hidden bg-[var(--porcelaine)]">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          fill
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isOut ? "opacity-40 grayscale" : ""
          }`}
        />

        {/* Promo Badge */}
        {discount && !isOut && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
            −{discount}%
          </span>
        )}

        {/* Rupture Badge */}
        {isOut && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--obsidienne)]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white shadow">
            Épuisé
          </span>
        )}

        {/* Favori button */}
        <button
          onClick={handleFavorite}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-white/50 shadow-sm transition-all hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite ? "fill-[var(--laiton)] text-[var(--laiton)]" : "text-[var(--obsidienne)]/60"
            }`}
          />
        </button>
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
              {product.categoryName}
            </span>
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200/60">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Rupture
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton)] transition-colors tracking-normal mb-2 capitalize">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 mb-3">
            Découvrez cette pièce d'exception confectionnée avec élégance et finesse pour illuminer toutes vos tenues.
          </p>
        </div>

        {/* Prix & Action Row */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-neutral-100 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[var(--obsidienne,#0E0B09)] tracking-tight tabular-nums">
              {formatFCFA(product.price)}
            </span>
            <span className="text-xs font-bold text-[var(--laiton,#B9793E)] uppercase font-sans tracking-widest">FCFA</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm font-medium text-neutral-400 line-through ml-2 tabular-nums">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>

          {!isOut ? (
            <button
              onClick={handleAddToCart}
              className={`rounded-full py-2.5 px-6 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow flex items-center justify-center gap-2 active:scale-95 ${
                justAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[var(--obsidienne)] hover:bg-[var(--laiton)] text-white"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Ajouté au panier</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Ajouter au panier</span>
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="rounded-full py-2.5 px-5 text-xs font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-400 cursor-not-allowed text-center"
            >
              Épuisé
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products, isLoading, viewMode = "grid" }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={viewMode === "grid" ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" : "space-y-4"}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={viewMode === "grid" ? "aspect-[3/4] rounded-3xl bg-[var(--porcelaine)] animate-pulse" : "h-44 rounded-3xl bg-[var(--porcelaine)] animate-pulse"} />
        ))}
      </div>
    );
  }

  // Grid View
  if (viewMode === "grid") {
    return (
      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-stretch"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="h-full flex flex-col"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  // Luxury List View
  return (
    <div className="space-y-4 sm:space-y-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
        >
          <ProductListItem product={product} />
        </motion.div>
      ))}
    </div>
  );
}
