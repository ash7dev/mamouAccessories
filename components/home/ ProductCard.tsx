/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

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
  const isOut = product.stock === 0;
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const aspect = product.imageOrientation === "landscape" ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <Link href={`/produit/${product.slug}`} className="group block">
      <div
        className={`relative ${aspect} overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-[var(--ivory)]/50`}
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
            <span className="rounded-full bg-[var(--gold)] px-2.5 py-1 text-[11px] font-bold text-[#241B14] shadow-sm">
              −{discount}%
            </span>
          )}
        </div>

        {isOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-[#241B14]/85 px-4 py-1.5 text-xs font-semibold text-[#F4EFE6]">
              Rupture de stock
            </span>
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="mt-3 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gold-dark)]">
          {product.categoryName}
        </p>
        <h3 className="mt-0.5 truncate text-sm font-semibold text-[var(--text-dark)]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-[var(--text-dark)] tabular-nums">
            {formatFCFA(product.price)} FCFA
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-[var(--text-dark)]/35 line-through tabular-nums">
              {formatFCFA(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}