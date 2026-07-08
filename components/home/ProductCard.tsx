"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";

/* ============================================================
   ProductCard — carte produit publique réutilisable

   Utilisée par les sections "Coups de cœur" et "Nouveautés"
   de l'accueil, et par la grille boutique. Respecte
   l'orientation de l'image du produit.
   ============================================================ */

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

export function ProductCard({ product }: { product: PublicProductCard }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isOut = product.stock === 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const aspect = product.imageOrientation === "landscape" ? "aspect-[4/3]" : "aspect-[3/4]";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOut) return;
    addItem(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOut) return;
    addItem(product.id, 1);
    window.location.href = `/produit/${product.slug}`;
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className={`relative ${aspect} overflow-hidden rounded-[1.5rem] border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--ivory)]/50 to-[var(--gold)]/5 shadow-[0_-4px_16px_-8px_rgba(185,138,68,0.1)]`}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                isOut ? "opacity-60" : ""
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-[var(--gold)]/30">
              ◆
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {discount && (
              <span className="rounded-full bg-[var(--gold)] px-2.5 py-1 text-[11px] font-bold text-[#241B14] shadow-md">
                −{discount}%
              </span>
            )}
          </div>

          {/* Favorite Icon */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-colors hover:bg-white"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </motion.button>

          {/* Quick Add Button */}
          {!isOut && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all ${
                justAdded
                  ? "bg-emerald-500 text-white"
                  : "bg-[var(--gold)] text-[#241B14] hover:bg-[var(--gold)]/90"
              }`}
            >
              {justAdded ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </motion.button>
          )}

          {isOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-[#241B14]/85 px-4 py-1.5 text-xs font-semibold text-[#F4EFE6]">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="mt-4 px-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)] mb-1">
            {product.categoryName}
          </p>
          <h3 className="font-heading text-base font-bold text-[var(--text-dark)] leading-tight mb-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-[var(--text-dark)] tabular-nums">
              {formatFCFA(product.price)} FCFA
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--text-dark)]/40 line-through tabular-nums">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          {/* Espace blanc */}
          <div className="mt-2" />
          
          {/* Buy Button */}
          {!isOut && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBuyNow}
              className="w-full rounded-xl bg-gradient-to-r from-[var(--gold)] to-[var(--gold)]/90 py-3 text-sm font-bold text-[#241B14] shadow-lg shadow-[var(--gold)]/30 transition-all hover:brightness-105"
            >
              Acheter maintenant
            </motion.button>
          )}
        </div>
      </motion.div>
    </Link>
  );
}