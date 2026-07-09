/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

/* ============================================================
   Page détail produit (admin) — /admin/products/[id]

   Usage (Server Component parent) :
     const product = await getProductDetail(params.id);
     <ProductDetail product={product} />
   ============================================================ */

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageOrientation: "portrait" | "landscape";
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string; // ISO
  images: { id: string; url: string }[];
  // Statistiques agrégées (requêtes côté serveur)
  stats: {
    unitsSold: number;      // somme des order_items.quantity (commandes non annulées)
    revenue: number;        // somme quantity × unit_price
    avgRating: number | null; // moyenne des avis approuvés
    reviewsCount: number;
  };
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* ---------- Icônes ---------- */

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function PencilIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897l12.682-12.68z" />
    </svg>
  );
}

function ExternalIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  );
}

function LinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function StarIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z" clipRule="evenodd" />
    </svg>
  );
}

/* ---------- Composant ---------- */

export function ProductDetail({ product }: { product: ProductDetailData }) {
  const [activeImage, setActiveImage] = useState(0);
  const [stock, setStock] = useState(product.stock);
  const [linkCopied, setLinkCopied] = useState(false);

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const stockTone =
    stock === 0
      ? { bar: "bg-red-500", text: "text-red-600", label: "Rupture de stock" }
      : stock <= 3
        ? { bar: "bg-amber-500", text: "text-amber-600", label: "Stock faible" }
        : { bar: "bg-[var(--gold)]", text: "text-[var(--text-dark)]/60", label: "En stock" };

  // Jauge : pleine à partir de 20 unités
  const stockPct = Math.min((stock / 20) * 100, 100);

  const storefrontUrl = `/produit/${product.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${storefrontUrl}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      /* clipboard indisponible : rien de bloquant */
    }
  };

  const adjustStock = async (delta: number) => {
    const newStock = Math.max(0, stock + delta);
    const previousStock = stock;

    // Optimistic update
    setStock(newStock);

    try {
      const response = await fetch(`/api/products/${product.id}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      const data = await response.json();
      setStock(data.stock);

      toast.success(delta > 0 ? "Stock augmenté" : "Stock diminué", {
        description: `Nouveau stock: ${data.stock} unité${data.stock > 1 ? "s" : ""}`,
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      // Revert on error
      setStock(previousStock);
      toast.error("Erreur lors de la mise à jour du stock", {
        description: "Veuillez réessayer",
      });
    }
  };

  const aspect = product.imageOrientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
      {/* ===== Bandeau sombre : fil d'ariane + titre + badges + actions ===== */}
      <div className="relative overflow-hidden rounded-b-3xl bg-[#241B14] px-6 pb-8 pt-6 lg:px-8">
        {/* Ornement : cercles concentriques dorés */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 opacity-60">
          <div className="h-44 w-44 rounded-full border border-[var(--gold)]/15" />
          <div className="absolute inset-6 rounded-full border border-[var(--gold)]/20" />
          <div className="absolute inset-12 rounded-full border border-[var(--gold)]/25" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/admin/products"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#F4EFE6]/60 transition-colors hover:text-[#F4EFE6]"
          >
            <ChevronLeftIcon />
            Produits
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#F4EFE6]/80">
                  {product.categoryName}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.isActive
                      ? "bg-emerald-400/15 text-emerald-300"
                      : "bg-white/10 text-[#F4EFE6]/50"
                  }`}
                >
                  {product.isActive ? "● En ligne" : "○ Masqué"}
                </span>
                {product.isFeatured && (
                  <span className="rounded-full bg-[var(--gold)]/20 px-3 py-1 text-xs font-semibold text-[var(--gold)]">
                    ★ Mis en avant
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-[#F4EFE6] lg:text-2xl">{product.name}</h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={storefrontUrl}
                target="_blank"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-[#F4EFE6]/80 transition-colors hover:bg-white/10"
                title="Voir dans la boutique"
              >
                <ExternalIcon />
              </Link>
              <button
                onClick={copyLink}
                className="flex h-11 items-center gap-2 rounded-full bg-white/5 px-4 text-sm font-medium text-[#F4EFE6]/80 transition-colors hover:bg-white/10"
              >
                <LinkIcon />
                {linkCopied ? "Copié !" : "Lien"}
              </button>
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex h-11 items-center gap-2 rounded-full bg-[var(--gold)] px-5 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95"
              >
                <PencilIcon />
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 pb-28 pt-6 lg:px-8 lg:pb-10">
        {/* ===== Rangée de stats : vendus / revenus / note ===== */}
        <div className="grid grid-cols-3 divide-x divide-[var(--gold)]/12 rounded-3xl border border-[var(--gold)]/15 bg-white px-2 py-5 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {formatFCFA(product.stats.unitsSold)}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              Vendus
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {formatFCFA(product.stats.revenue)}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              FCFA générés
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 px-2">
            <span className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums lg:text-3xl">
              {product.stats.avgRating !== null ? (
                <>
                  {product.stats.avgRating.toFixed(1)}
                  <StarIcon className="h-5 w-5 text-[var(--gold)]" />
                </>
              ) : (
                "—"
              )}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--text-dark)]/45">
              {product.stats.reviewsCount} avis
            </span>
          </div>
        </div>

        {/* ===== Galerie + infos clés ===== */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Galerie — respecte l'orientation du produit */}
          <div className="lg:col-span-2">
            <div
              className={`${aspect} overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-[var(--ivory)]/50`}
            >
              {product.images[activeImage] ? (
                <img
                  src={product.images[activeImage].url}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-[var(--text-dark)]/30">
                  Aucune photo
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === activeImage
                        ? "border-[var(--gold)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos clés */}
          <div className="space-y-6 lg:col-span-3">
            {/* Prix */}
            <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                Prix de vente
              </p>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                  {formatFCFA(product.price)} <span className="text-lg font-medium text-[var(--text-dark)]/40">FCFA</span>
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-[var(--text-dark)]/35 line-through tabular-nums">
                    {formatFCFA(product.compareAtPrice)} FCFA
                  </span>
                )}
                {discount && (
                  <span className="rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-xs font-bold text-[var(--gold-dark)]">
                    −{discount}&nbsp;%
                  </span>
                )}
              </div>
            </div>

            {/* Stock : jauge + ajustement rapide */}
            <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                  Stock
                </p>
                <span className={`text-xs font-semibold ${stockTone.text}`}>{stockTone.label}</span>
              </div>

              <div className="flex items-center gap-5">
                {/* Ajustement rapide */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => adjustStock(-1)}
                    disabled={stock === 0}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/25 text-lg font-bold text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)]/60 disabled:opacity-30"
                    aria-label="Retirer une unité"
                  >
                    −
                  </button>
                  <span className="min-w-[3ch] text-center text-3xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                    {stock}
                  </span>
                  <button
                    onClick={() => adjustStock(1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--gold)]/25 text-lg font-bold text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)]/60"
                    aria-label="Ajouter une unité"
                  >
                    +
                  </button>
                </div>

                {/* Jauge */}
                <div className="flex-1">
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--ivory)]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stockTone.bar}`}
                      style={{ width: `${stockPct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--text-dark)]/40">unités disponibles</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                Description
              </p>
              {product.description ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[var(--text-dark)]/70">
                  {product.description}
                </p>
              ) : (
                <p className="text-sm italic text-[var(--text-dark)]/35">
                  Aucune description —{" "}
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="not-italic font-medium text-[var(--gold-dark)] underline-offset-2 hover:underline"
                  >
                    en ajouter une
                  </Link>{" "}
                  aide vos clientes à se décider.
                </p>
              )}

              <p className="mt-4 border-t border-[var(--gold)]/10 pt-3 text-xs text-[var(--text-dark)]/35">
                Ajouté le{" "}
                {new Date(product.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · Format photos : {product.imageOrientation === "portrait" ? "portrait (3:4)" : "paysage (4:3)"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}