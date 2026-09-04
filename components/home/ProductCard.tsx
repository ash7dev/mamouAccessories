"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { ProductImage } from "@/components/ui/product-image";

export interface PublicProductCard {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null;
  imageOrientation: "portrait" | "landscape";
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ProductCard({ product, priority = false }: { product: PublicProductCard; priority?: boolean }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
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

  return (
    <Link href={`/produit/${product.slug}`} className="group flex flex-col h-full w-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col justify-between h-full w-full rounded-[1.5rem] bg-white border border-neutral-200/60 hover:border-[var(--laiton)]/30 shadow-[0_2px_12px_-4px_rgba(14,11,9,0.05)] hover:shadow-[0_12px_40px_-8px_rgba(185,121,62,0.18)] transition-all duration-300 overflow-hidden"
      >
        {/* ---------- Zone Image ---------- */}
        <div className="relative aspect-square sm:aspect-[1/1.15] w-full overflow-hidden bg-[var(--porcelaine)] shrink-0">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            fill
            priority={priority}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isOut ? "opacity-40 grayscale" : ""
            }`}
          />

          {/* Badge Promo */}
          {discount && !isOut && (
            <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 z-10 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white shadow-sm tracking-wider uppercase">
              −{discount}%
            </span>
          )}

          {/* Badge Nouveau */}
          {!discount && !isOut && (
            <span className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 z-10 rounded-md bg-[var(--obsidienne)] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-bold text-white tracking-wider uppercase">
              NEW
            </span>
          )}

          {/* Badge Stock Limité / Rareté */}
          {!isOut && product.stock <= 3 && (
            <span className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 z-10 rounded-full bg-amber-600/95 backdrop-blur-sm px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-extrabold text-white shadow-sm tracking-wider uppercase flex items-center gap-1">
              <span>⚡</span> {product.stock} dispo
            </span>
          )}

          {/* Badge Rupture */}
          {isOut && (
            <span className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="rounded-full bg-white/90 backdrop-blur-sm px-4 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--obsidienne)] shadow-lg border border-neutral-200">
                Rupture
              </span>
            </span>
          )}
        </div>

        {/* ---------- Infos Produit — Style Jaguar ---------- */}
        <div className="flex flex-col justify-between flex-1 px-3.5 pt-2.5 pb-3.5 sm:px-5 sm:pt-4 sm:pb-5">
          {/* Catégorie */}
          <div>
            <p className="text-[9px] sm:text-[11px] font-bold tracking-[0.15em] uppercase text-[var(--laiton,#B9793E)] mb-0.5 sm:mb-1">
              {product.categoryName}
            </p>

            {/* Nom Produit — Format médium équilibré desktop & mobile */}
            <h3 className="font-sans text-base sm:text-xl lg:text-2xl font-bold text-[var(--obsidienne,#0E0B09)] leading-snug line-clamp-2 min-h-[2.5rem] sm:min-h-[3.2rem] group-hover:text-[var(--laiton)] transition-colors capitalize tracking-tight">
              {product.name}
            </h3>
          </div>

          {/* Prix + Bouton Flèche — Grand & Très Lisible */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-0">
            <p className="font-sans text-lg sm:text-[1.5rem] font-black text-[var(--obsidienne,#0E0B09)] tracking-tight tabular-nums">
              {formatFCFA(product.price)}{" "}
              <span className="text-xs sm:text-sm font-bold tracking-wide uppercase opacity-75">FCFA</span>
            </p>

            {/* Bouton Flèche Rond */}
            {!isOut ? (
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={handleAddToCart}
                aria-label="Ajouter au panier"
                className={`flex h-8 w-8 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                  justAdded
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-[var(--obsidienne)] hover:bg-[var(--laiton)] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {justAdded ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  >
                    <Check className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="arrow"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    <ArrowRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                  </motion.span>
                )}
              </motion.button>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Indisponible
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}