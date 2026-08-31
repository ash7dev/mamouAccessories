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
  const [imageError, setImageError] = useState(false);
  const isOut = product.stock === 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

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

  const handleImageError = () => {
    console.error('Image failed to load:', product.imageUrl);
    setImageError(true);
  };

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div
          className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--ivory)] via-[var(--ivory)]/80 to-[var(--gold)]/10 shadow-[0_8px_32px_-12px_rgba(185,138,68,0.15)] group-hover:shadow-[0_16px_48px_-12px_rgba(185,138,68,0.25)] transition-shadow duration-500"
        >
          {product.imageUrl && !imageError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={handleImageError}
              className={`h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                isOut ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-[var(--gold)]/20">
              ◆
            </div>
          )}

          {/* Subtle overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#241B14]/0 via-transparent to-[#241B14]/0 group-hover:from-[#241B14]/5 group-hover:via-transparent group-hover:to-[#241B14]/0 transition-all duration-500" />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {discount && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-white/30 backdrop-blur-xl border border-white/40 px-3 py-1.5 text-[10px] font-bold text-[#241B14] shadow-[0_8px_32px_rgba(185,138,68,0.4)]"
              >
                −{discount}%
              </motion.span>
            )}
          </div>

          {/* Favorite Icon */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavorite}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.15)] transition-all hover:bg-white/30 hover:border-white/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </motion.button>

          {/* Quick Add Button */}
          {!isOut && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className={`absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.2)] transition-all hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)] ${
                justAdded
                  ? "bg-emerald-500/90 text-white border-emerald-400/50"
                  : "bg-gradient-to-br from-[var(--gold)]/90 to-[var(--gold)]/70 text-[#241B14] hover:from-[var(--gold)] hover:to-[var(--gold)]/90"
              }`}
            >
              {justAdded ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex items-center justify-center"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </motion.div>
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </motion.button>
          )}

          {isOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#241B14]/40 backdrop-blur-md">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full bg-[#241B14]/80 backdrop-blur-xl border border-white/10 px-5 py-2 text-xs font-semibold text-[#F4EFE6] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                Rupture de stock
              </motion.span>
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="mt-5 px-1">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1.5"
          >
            {product.categoryName}
          </motion.p>
          <h3 className="font-heading text-lg font-bold text-[var(--text-dark)] leading-snug mb-2.5 line-clamp-2 group-hover:text-[var(--gold-dark)] transition-colors duration-300">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-xl font-bold text-[var(--text-dark)] tabular-nums tracking-tight">
              {formatFCFA(product.price)} FCFA
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--text-dark)]/50 line-through tabular-nums">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          {/* Buy Button */}
          {!isOut && (
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="w-full rounded-2xl bg-gradient-to-r from-[var(--gold)] via-[var(--gold)] to-[var(--gold)]/90 py-3.5 text-sm font-bold text-[#241B14] shadow-[0_4px_20px_rgba(185,138,68,0.25)] transition-all hover:shadow-[0_8px_32px_rgba(185,138,68,0.35)] hover:brightness-105"
            >
              Acheter maintenant
            </motion.button>
          )}
        </div>
      </motion.div>
    </Link>
  );
}