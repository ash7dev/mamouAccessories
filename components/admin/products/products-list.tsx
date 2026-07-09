/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

/* ============================================================
   Liste des produits — /admin/products

   Deux présentations dans UN composant, selon l'écran :
   - Mobile  : grille de cartes 2 colonnes (les photos priment)
   - Desktop : rangées détaillées type tableau (les données priment)

   Toute la carte/rangée est cliquable → page détail.
   Le bouton crayon → édition directe.
   ============================================================ */

export interface ProductListItem {
  id: string;
  name: string;
  categoryId?: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null; // image principale (Cloudinary, taille réduite)
  isActive: boolean;
  isFeatured: boolean;
  unitsSold: number;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* ---------- Icônes ---------- */

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z" />
    </svg>
  );
}

function DiamondIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 9h20M9 3l3 6 3-6M12 9l0 12" opacity="0.5" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

/* ---------- Badges ---------- */

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/10 px-2.5 py-1 text-[11px] font-semibold text-red-600">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Rupture
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        {stock} restant{stock > 1 ? "s" : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 tabular-nums">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {stock} en stock
    </span>
  );
}

function discountPct(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

/* ---------- Vignette ---------- */

function Thumb({ product, className }: { product: ProductListItem; className: string }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--ivory)]/70 ${className}`}>
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.isActive ? "opacity-40 grayscale" : ""
          }`}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-[var(--gold)]/40">
          <DiamondIcon />
        </div>
      )}
      {product.isFeatured && (
        <span className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-bold text-[#241B14]">
          ★
        </span>
      )}
    </div>
  );
}

/* ---------- État vide ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--gold)]/15 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
      <div className="relative mb-5">
        <div aria-hidden className="absolute -inset-3 rounded-full border border-[var(--gold)]/15" />
        <div aria-hidden className="absolute -inset-1.5 rounded-full border border-[var(--gold)]/25" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/25">
          <DiamondIcon className="h-7 w-7" />
        </div>
      </div>
      <h3 className="mb-1 text-base font-bold text-[var(--text-dark)]">
        Votre vitrine est vide
      </h3>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-[var(--text-dark)]/50">
        Ajoutez votre premier bijou : quelques photos, un prix, et il apparaîtra dans la boutique.
      </p>
      <Link
        href="/admin/products/new"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95"
      >
        <PlusIcon />
        Ajouter un produit
      </Link>
    </div>
  );
}

/* ---------- Composant principal ---------- */

export function ProductsList({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ===================== MOBILE : grille de cartes ===================== */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {products.map((p) => {
          const discount = discountPct(p.price, p.compareAtPrice);
          return (
            <Link
              key={p.id}
              href={`/admin/products/${p.id}`}
              className="group overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] transition-transform active:scale-[0.98]"
            >
              <div className="relative">
                <Thumb product={p} className="aspect-square" />
                {/* Badges d'état sur la photo */}
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {discount && (
                    <span className="rounded-full bg-[#241B14]/85 px-2 py-0.5 text-[10px] font-bold text-[var(--gold)]">
                      −{discount}%
                    </span>
                  )}
                  {!p.isActive && (
                    <span className="rounded-full bg-[#241B14]/85 px-2 py-0.5 text-[10px] font-semibold text-[#F4EFE6]/80">
                      Masqué
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gold-dark)]">
                  {p.categoryName}
                </p>
                <h3 className="mt-0.5 truncate text-sm font-semibold text-[var(--text-dark)]">
                  {p.name}
                </h3>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(p.price)} F
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-[11px] text-[var(--text-dark)]/35 line-through tabular-nums">
                      {formatFCFA(p.compareAtPrice)}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <StockBadge stock={p.stock} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ===================== DESKTOP : rangées détaillées ===================== */}
      <div className="hidden overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] lg:block">
        {/* En-tête de colonnes */}
        <div className="grid grid-cols-[1fr_140px_140px_110px_90px_56px] items-center gap-4 border-b border-[var(--gold)]/10 bg-[var(--ivory)]/40 px-6 py-3">
          {["Produit", "Prix", "Stock", "Statut", "Vendus", ""].map((h, i) => (
            <span
              key={i}
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-dark)]/40 ${
                i >= 4 ? "text-right" : ""
              }`}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-[var(--gold)]/8">
          {products.map((p) => {
            const discount = discountPct(p.price, p.compareAtPrice);
            return (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                className="group grid grid-cols-[1fr_140px_140px_110px_90px_56px] items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--ivory)]/30"
              >
                {/* Produit : vignette + nom + catégorie */}
                <div className="flex min-w-0 items-center gap-4">
                  <Thumb product={p} className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--text-dark)]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[var(--text-dark)]/45">{p.categoryName}</p>
                  </div>
                </div>

                {/* Prix */}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(p.price)} F
                  </span>
                  {p.compareAtPrice && (
                    <span className="text-xs text-[var(--text-dark)]/35 tabular-nums">
                      <span className="line-through">{formatFCFA(p.compareAtPrice)}</span>
                      {discount && (
                        <span className="ml-1.5 font-bold text-[var(--gold-dark)]">−{discount}%</span>
                      )}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <StockBadge stock={p.stock} />
                </div>

                {/* Statut */}
                <div>
                  {p.isActive ? (
                    <span className="text-xs font-medium text-emerald-700">● En ligne</span>
                  ) : (
                    <span className="text-xs font-medium text-[var(--text-dark)]/35">○ Masqué</span>
                  )}
                  {p.isFeatured && (
                    <span className="ml-1.5 text-xs text-[var(--gold-dark)]" title="Mis en avant">
                      ★
                    </span>
                  )}
                </div>

                {/* Vendus */}
                <span className="text-right text-sm font-semibold text-[var(--text-dark)]/70 tabular-nums">
                  {p.unitsSold}
                </span>

                {/* Éditer — visible au survol */}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/admin/products/${p.id}/edit`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      window.location.href = `/admin/products/${p.id}/edit`;
                    }
                  }}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[var(--gold)]/25 text-[var(--text-dark)]/50 opacity-0 transition-all hover:bg-[var(--gold)] hover:text-[#241B14] group-hover:opacity-100"
                  title="Modifier"
                >
                  <PencilIcon />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}