"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check, ShoppingBag } from "lucide-react";
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

export function ProductCard({ product }: { product: PublicProductCard }) {
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
    <Link href={`/produit/${product.slug}`} className="group flex flex-col h-full w-full">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col justify-between h-full w-full rounded-[1.75rem] border border-[var(--laiton)]/15 bg-white shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] hover:shadow-[0_20px_48px_-12px_rgba(185,121,62,0.22)] hover:border-[var(--laiton)]/40 transition-all duration-300 overflow-hidden"
      >
        {/* ---------- Zone Image Pleine Largeur (Ratios 3:4, Sans Bordure Interne) ---------- */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[1.75rem] bg-[var(--porcelaine)] shrink-0">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
              isOut ? "opacity-40 grayscale" : ""
            }`}
          />

          {/* Badge Promo */}
          {discount && !isOut && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-[var(--laiton)] to-[#9A622E] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm tracking-wider uppercase">
              −{discount}%
            </span>
          )}

          {/* Badge Rupture */}
          {isOut && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--obsidienne)]/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow">
              Épuisé
            </span>
          )}

          {/* Bouton Favori Flottant */}
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

        {/* ---------- Informations Produit (Structure Flex Alignée) ---------- */}
        <div className="flex-1 flex flex-col justify-between p-3.5 sm:p-5">
          <div>
            {/* Catégorie */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[var(--laiton,#B9793E)] mb-1">
              {product.categoryName}
            </p>

            {/* Titre avec hauteur minimale égale pour empêcher tout décalage */}
            <h3 className="font-heading text-sm sm:text-base font-semibold text-[var(--obsidienne,#0E0B09)] line-clamp-2 min-h-[2.4rem] sm:min-h-[2.8rem] mb-2 leading-tight group-hover:text-[var(--laiton)] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Bloc Bas : Prix + Bouton Panier */}
          <div>
            {/* Prix */}
            <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[var(--obsidienne)] tabular-nums tracking-tight">
                {formatFCFA(product.price)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-[var(--obsidienne)]/50 font-medium">FCFA</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-[var(--obsidienne)]/40 line-through tabular-nums ml-auto">
                  {formatFCFA(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Bouton CTA Panier Toujours Alignés */}
            {!isOut ? (
              <button
                onClick={handleAddToCart}
                className={`w-full rounded-full py-2.5 px-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow flex items-center justify-center gap-1.5 active:scale-95 ${
                  justAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-[var(--obsidienne)] hover:bg-[var(--laiton)] text-white"
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Ajouté</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Ajouter</span>
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-full py-2.5 px-3 text-xs font-semibold uppercase tracking-wider bg-neutral-100 text-neutral-400 cursor-not-allowed text-center"
              >
                Indisponible
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}