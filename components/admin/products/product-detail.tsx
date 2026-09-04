/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ProductImage } from "@/components/ui/product-image";
import {
  ChevronLeft,
  Pencil,
  ExternalLink,
  Copy,
  Check,
  Star,
  ShoppingBag,
  TrendingUp,
  Package,
  Eye,
  Maximize2,
  X,
  Sparkles,
  Tag,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

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
  createdAt: string;
  images: { id: string; url: string }[];
  stats: {
    unitsSold: number;
    revenue: number;
    avgRating: number | null;
    reviewsCount: number;
  };
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

export function ProductDetail({ product: initialProduct }: { product: ProductDetailData }) {
  const [product, setProduct] = useState(initialProduct);
  const [activeImage, setActiveImage] = useState(0);
  const [stock, setStock] = useState(product.stock);
  const [linkCopied, setLinkCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  const discountAmount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : 0;

  const stockBadge =
    stock === 0
      ? { label: "Rupture de stock", bar: "bg-rose-500", text: "text-rose-700 bg-rose-50 border-rose-200" }
      : stock <= 3
      ? { label: "Stock très limité", bar: "bg-amber-500", text: "text-amber-800 bg-amber-50 border-amber-200" }
      : { label: "En stock", bar: "bg-emerald-500", text: "text-emerald-800 bg-emerald-50 border-emerald-200" };

  const stockPct = Math.min((stock / 20) * 100, 100);
  const storefrontUrl = `/produit/${product.slug}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${storefrontUrl}`);
      setLinkCopied(true);
      toast.success("Lien de la boutique copié !");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(product.id);
      setIdCopied(true);
      toast.success("Identifiant produit copié !");
      setTimeout(() => setIdCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const toggleStatus = async () => {
    setIsUpdatingStatus(true);
    const newStatus = !product.isActive;
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setProduct((prev) => ({ ...prev, isActive: newStatus }));
      toast.success(newStatus ? "Produit publié en ligne" : "Produit masqué de la boutique");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la modification du statut");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const adjustStock = async (delta: number) => {
    const newStock = Math.max(0, stock + delta);
    const previousStock = stock;
    setStock(newStock);

    try {
      const response = await fetch(`/api/products/${product.id}/stock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock");
      const data = await response.json();
      setStock(data.stock);
      toast.success(delta > 0 ? "Stock augmenté" : "Stock diminué", {
        description: `Nouveau stock : ${data.stock} unité${data.stock > 1 ? "s" : ""}`,
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      setStock(previousStock);
      toast.error("Erreur lors de la mise à jour du stock");
    }
  };

  const aspectClass = product.imageOrientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]";

  return (
    <div className="font-sans text-[var(--obsidienne,#0E0B09)]">
      {/* ===== En-tête Supérieur Exécutif (Obsidienne & Laiton) ===== */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-8 lg:px-10 border-b border-[var(--laiton,#B9793E)]/25 shadow-2xl text-[var(--porcelaine,#F1ECE3)]">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 to-transparent blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Fil d'ariane Back Link */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--laiton-clair,#D9AE78)] transition-colors hover:text-white uppercase tracking-wider"
            >
              <ChevronLeft className="h-4 w-4" />
              Catalogue Joaillerie
            </Link>
            <span className="text-[var(--laiton,#B9793E)]/40">•</span>
            <span className="text-xs text-[var(--porcelaine,#F1ECE3)]/60">
              {product.categoryName}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {/* Badges statut & catégorie */}
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full bg-[var(--laiton,#B9793E)]/20 px-3.5 py-1 text-xs font-semibold text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton,#B9793E)]/30 backdrop-blur-xs">
                  {product.categoryName}
                </span>

                <button
                  type="button"
                  onClick={toggleStatus}
                  disabled={isUpdatingStatus}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold border transition-all ${
                    product.isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                      : "bg-neutral-500/20 text-neutral-300 border-neutral-500/40 hover:bg-neutral-500/30"
                  }`}
                  title="Cliquer pour modifier la visibilité"
                >
                  {product.isActive ? "● Actif en ligne" : "○ Masqué"}
                </button>

                {product.isFeatured && (
                  <span className="flex items-center gap-1 rounded-full bg-[var(--laiton,#B9793E)] px-3 py-0.5 text-xs font-bold text-[var(--porcelaine,#F1ECE3)] shadow">
                    <Star className="h-3 w-3 fill-[var(--porcelaine,#F1ECE3)]" />
                    Vedette
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                {product.name}
              </h1>

              <div className="mt-2 flex items-center gap-3 text-xs text-[var(--porcelaine,#F1ECE3)]/60 font-mono">
                <span>RÉF : {product.id.substring(0, 8).toUpperCase()}</span>
                <span>•</span>
                <span>SLUG : /{product.slug}</span>
              </div>
            </div>

            {/* Barre d'Actions Supérieure */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={storefrontUrl}
                target="_blank"
                className="flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                title="Consulter la fiche client dans un nouvel onglet"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Voir en boutique</span>
              </Link>

              <button
                type="button"
                onClick={copyLink}
                className="flex h-11 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
              >
                {linkCopied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                <span className="hidden sm:inline">{linkCopied ? "Lien copié !" : "Copier le lien"}</span>
              </button>

              <Link
                href={`/admin/products/${product.id}/edit`}
                className="flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[var(--laiton-clair,#D9AE78)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-lg transition-all hover:brightness-110 active:scale-95"
              >
                <Pencil className="h-4 w-4 stroke-[2.5]" />
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Grille des KPIs de Performance & Synthèse ===== */}
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Chiffre d'affaires */}
          <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-xs transition-all hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md">
            <div className="flex items-center justify-between text-[var(--laiton,#B9793E)] mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/60">
                Chiffre d&apos;affaires
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--porcelaine,#F1ECE3)]">
                <TrendingUp className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)]">
              {formatFCFA(product.stats.revenue)} <span className="text-xs text-neutral-400">FCFA</span>
            </p>
            <p className="mt-1 text-[11px] text-[var(--obsidienne,#0E0B09)]/50">
              Revenus cumulés sur ce produit
            </p>
          </div>

          {/* Card 2: Ventes totales */}
          <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-xs transition-all hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md">
            <div className="flex items-center justify-between text-[var(--laiton,#B9793E)] mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/60">
                Unités vendues
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--porcelaine,#F1ECE3)]">
                <ShoppingBag className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)]">
              {formatFCFA(product.stats.unitsSold)} <span className="text-xs text-neutral-400">unités</span>
            </p>
            <p className="mt-1 text-[11px] text-[var(--obsidienne,#0E0B09)]/50">
              Commandes enregistrées
            </p>
          </div>

          {/* Card 3: Prix public & Réduction */}
          <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-xs transition-all hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md">
            <div className="flex items-center justify-between text-[var(--laiton,#B9793E)] mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/60">
                Prix de vente
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--porcelaine,#F1ECE3)]">
                <Tag className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)]">
                {formatFCFA(product.price)} <span className="text-xs text-neutral-400">FCFA</span>
              </p>
              {discountPercent && (
                <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  -{discountPercent}%
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-[var(--obsidienne,#0E0B09)]/50">
              {product.compareAtPrice
                ? `Prix barré : ${formatFCFA(product.compareAtPrice)} FCFA`
                : "Tarif standard sans remise"}
            </p>
          </div>

          {/* Card 4: Niveau de stock */}
          <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-xs transition-all hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/60">
                Inventaire
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${stockBadge.text}`}>
                {stockBadge.label}
              </span>
            </div>
            <p className="font-mono text-2xl font-bold text-[var(--obsidienne,#0E0B09)]">
              {stock} <span className="text-xs text-neutral-400">disponibles</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${stockBadge.bar}`}
                style={{ width: `${stockPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* ===== Corps Principal: Galerie Photo & Fiche Technique ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Galerie Photo HD (5 colonnes) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/75">
                  Galerie du bijou ({product.images.length} visuel{product.images.length > 1 ? "s" : ""})
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  {activeImage + 1} / {product.images.length || 1}
                </span>
              </div>

              {/* Photo Active grand format */}
              <div
                className={`group relative overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-neutral-900 ${aspectClass}`}
              >
                {product.images[activeImage] ? (
                  <ProductImage
                    src={product.images[activeImage].url}
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/50">
                    Aucun visuel disponible
                  </div>
                )}

                {/* Badge Photo Principale sur la première */}
                {activeImage === 0 && (
                  <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-[var(--obsidienne,#0E0B09)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] backdrop-blur-md border border-[var(--laiton,#B9793E)]/40 shadow-md">
                    <Star className="h-3 w-3 fill-[var(--laiton-clair,#D9AE78)]" />
                    Photo de Couverture
                  </div>
                )}

                {/* Bouton Agrandir Lightbox */}
                {product.images[activeImage] && (
                  <button
                    type="button"
                    onClick={() => setLightboxImage(product.images[activeImage].url)}
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-110 active:scale-95"
                    title="Agrandir en haute définition"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Miniatures carrousel */}
              {product.images.length > 1 && (
                <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        i === activeImage
                          ? "border-[var(--laiton,#B9793E)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/30 scale-105"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <ProductImage src={img.url} alt="" fill className="h-full w-full object-cover" />
                      {i === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-[var(--obsidienne,#0E0B09)]/80 py-0.5 text-center text-[8px] font-bold uppercase text-[var(--laiton-clair,#D9AE78)]">
                          Main
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stock Adjuster Widget */}
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-normal text-[var(--obsidienne,#0E0B09)]">
                    Ajustement rapide du stock
                  </h3>
                  <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">
                    Modifiez la quantité disponible immédiatement
                  </p>
                </div>
                <Package className="h-5 w-5 text-[var(--laiton,#B9793E)]" />
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-neutral-50 p-4 border border-neutral-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => adjustStock(-1)}
                    disabled={stock <= 0}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-lg font-bold shadow-2xs transition-all hover:bg-neutral-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <div className="text-center font-mono min-w-[4ch]">
                    <span className="text-3xl font-bold text-[var(--obsidienne,#0E0B09)]">{stock}</span>
                    <span className="block text-[10px] text-neutral-400 font-sans">unités</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => adjustStock(1)}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-300 bg-white text-lg font-bold shadow-2xs transition-all hover:bg-neutral-100 active:scale-95"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => adjustStock(5)}
                    className="rounded-xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--laiton,#B9793E)] transition-colors hover:bg-[var(--laiton,#B9793E)] hover:text-white"
                  >
                    +5 unités
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStock(10)}
                    className="rounded-xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--laiton,#B9793E)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--laiton,#B9793E)] transition-colors hover:bg-[var(--laiton,#B9793E)] hover:text-white"
                  >
                    +10 unités
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fiche Technique & Métadonnées (7 colonnes) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Description & Détails */}
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-normal text-[var(--obsidienne,#0E0B09)] mb-3 pb-3 border-b border-[var(--laiton,#B9793E)]/15">
                Description & Histoire du bijou
              </h3>
              {product.description ? (
                <div className="text-sm font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/80 whitespace-pre-line">
                  {product.description}
                </div>
              ) : (
                <p className="text-xs italic text-neutral-400">
                  Aucune description rédigée pour cette création.
                </p>
              )}

              {/* Information promotionnelle si réduction */}
              {discountAmount > 0 && (
                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs text-rose-900">
                  <Sparkles className="h-5 w-5 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-semibold">Promotion Active en Boutique</p>
                    <p className="text-rose-700 text-[11px]">
                      Réduction de <strong className="font-mono">{discountPercent}%</strong>. Économie offerte de{" "}
                      <strong className="font-mono">{formatFCFA(discountAmount)} FCFA</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fiche d'Identité Technique */}
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-xl font-normal text-[var(--obsidienne,#0E0B09)] mb-4 pb-3 border-b border-[var(--laiton,#B9793E)]/15">
                Caractéristiques Techniques
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="flex flex-col gap-1 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/55">
                    ID Unique Database
                  </span>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs font-semibold text-[var(--obsidienne,#0E0B09)]">
                    <span className="truncate">{product.id}</span>
                    <button
                      type="button"
                      onClick={copyId}
                      className="text-[var(--laiton,#B9793E)] hover:underline shrink-0"
                    >
                      {idCopied ? "Copié" : "Copier"}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/55">
                    Format d&apos;affichage Photo
                  </span>
                  <span className="font-semibold text-[var(--obsidienne,#0E0B09)]">
                    {product.imageOrientation === "portrait" ? "Portrait Vertical (3:4)" : "Paysage Horizontal (4:3)"}
                  </span>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/55">
                    Date de Création
                  </span>
                  <span className="font-medium text-[var(--obsidienne,#0E0B09)]">
                    {new Date(product.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex flex-col gap-1 rounded-2xl bg-neutral-50 p-4 border border-neutral-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/55">
                    Exposition Boutique
                  </span>
                  <span className="font-semibold text-[var(--obsidienne,#0E0B09)]">
                    {product.isFeatured ? "Page d'Accueil (Vedette) + Boutique" : "Boutique standard"}
                  </span>
                </div>
              </div>
            </div>

            {/* Simu Rendu Carte Boutique Client */}
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg font-normal text-[var(--obsidienne,#0E0B09)]">
                    Aperçu Rendu Carte Boutique Client
                  </h4>
                  <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">
                    Aspect visuel de la vignette produit sur mamouaccessories.com
                  </p>
                </div>
                <Eye className="h-5 w-5 text-[var(--laiton,#B9793E)]" />
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-white p-4 border border-[var(--laiton,#B9793E)]/20 shadow-xs">
                <div
                  className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ${
                    product.imageOrientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                >
                  {product.images[0] ? (
                    <ProductImage src={product.images[0].url} alt="" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">
                      No Photo
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--laiton,#B9793E)]">
                    {product.categoryName}
                  </span>
                  <h5 className="font-serif text-base font-normal text-[var(--obsidienne,#0E0B09)] truncate">
                    {product.name}
                  </h5>
                  <div className="mt-1 flex items-baseline gap-2 font-mono">
                    <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">
                      {formatFCFA(product.price)} FCFA
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        {formatFCFA(product.compareAtPrice)} FCFA
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={storefrontUrl}
                  target="_blank"
                  className="rounded-full bg-[var(--obsidienne,#0E0B09)] px-4 py-2 text-xs font-semibold text-[var(--porcelaine,#F1ECE3)] hover:bg-[var(--laiton,#B9793E)] transition-colors shrink-0"
                >
                  Tester
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal HD */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-h-[85vh] max-w-[85vw] overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/40 shadow-2xl">
            <ProductImage
              src={lightboxImage}
              alt="Aperçu Grand Format HD"
              width={1200}
              height={1600}
              className="max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}