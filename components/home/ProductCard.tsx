"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

/* ============================================================
   ProductCard — carte produit publique réutilisable

   Utilisée par les sections "Coups de cœur" et "Nouveautés"
   de l'accueil, et par la grille boutique. Respecte
   l'orientation de l'image du produit.

   Direction design : une seule carte peut se permettre un geste
   marquant (le lift + la révélation du CTA au survol). Tout le
   reste — badges, favoris, libellés — reste discret pour ne pas
   lui faire concurrence.
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
    if (isOut || justAdded) return;
    addItem(product.id, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite((v) => !v);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* ---------- Image ---------- */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[var(--cream,#F4EFE6)] border border-[var(--text-dark)]/[0.06] shadow-[0_2px_16px_-4px_rgba(36,27,20,0.1)] transition-shadow duration-500 group-hover:shadow-[0_18px_40px_-12px_rgba(36,27,20,0.25)]">
          {product.imageUrl && !imageError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              onError={handleImageError}
              className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045] ${
                isOut ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <img
              src="/placeholder-product.svg"
              alt={product.name}
              className="h-full w-full object-cover p-8 opacity-40 bg-[var(--cream,#F4EFE6)]"
            />
          )}

          {/* Discount badge */}
          {discount && !isOut && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--gold)] px-3 py-1 text-[11px] font-semibold text-[#241B14]">
              −{discount}%
            </span>
          )}

          {/* Out of stock tag */}
          {isOut && (
            <span className="absolute left-4 top-4 rounded-full bg-[#241B14]/85 backdrop-blur-sm px-3 py-1 text-[11px] font-medium tracking-wide text-[#F4EFE6]">
              Épuisé
            </span>
          )}

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/50 backdrop-blur-md border border-white/40 transition-colors hover:bg-white/70"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isFavorite ? "fill-[var(--gold-dark)] text-[var(--gold-dark)]" : "text-[#241B14]/50"
              }`}
            />
          </button>

          {/* CTA reveal — slides up on hover, always present on touch devices */}
          {!isOut && (
            <button
              onClick={handleAddToCart}
              className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-[#241B14]/90 backdrop-blur-md py-3.5 text-[13px] font-medium tracking-wide text-[#F4EFE6] transition-all duration-400 ease-out translate-y-full opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            >
              {justAdded ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Ajouté au panier
                </motion.span>
              ) : (
                "Ajouter au panier"
              )}
            </button>
          )}
        </div>

        {/* ---------- Infos ---------- */}
        <div className="mt-5 px-1">
          <p
            className="mb-1.5 text-[13px] text-[var(--gold-dark)]/80"
            style={{ fontVariant: "small-caps", letterSpacing: "0.02em" }}
          >
            {product.categoryName}
          </p>
          <h3 className="font-heading text-lg font-semibold leading-snug text-[var(--text-dark)] line-clamp-2 mb-2.5">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2.5 mb-4">
            <span className="text-xl font-semibold text-[var(--text-dark)] tabular-nums tracking-tight">
              {formatFCFA(product.price)}
            </span>
            <span className="text-xs text-[var(--text-dark)]/50">FCFA</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[var(--text-dark)]/40 line-through tabular-nums">
                {formatFCFA(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile-visible, understated CTA (mirrors the hover panel on touch devices) */}
          {!isOut && (
            <button
              onClick={handleAddToCart}
              className={`md:hidden w-full rounded-full border py-3 text-[13px] font-medium tracking-wide transition-colors ${
                justAdded
                  ? "border-emerald-600/30 bg-emerald-50 text-emerald-700"
                  : "border-[var(--text-dark)]/15 text-[var(--text-dark)] hover:bg-[var(--text-dark)] hover:text-[#F4EFE6]"
              }`}
            >
              {justAdded ? "Ajouté au panier" : "Ajouter au panier"}
            </button>
          )}
        </div>
      </motion.div>
    </Link>
  );
}