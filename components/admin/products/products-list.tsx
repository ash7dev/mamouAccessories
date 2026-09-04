/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Edit3,
  Sparkles,
  Star,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { ViewMode } from "./products-header";

export interface ProductListItem {
  id: string;
  name: string;
  categoryId?: string;
  categoryName: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  unitsSold: number;
}

interface ProductsListProps {
  products: ProductListItem[];
  viewMode?: ViewMode;
  onProductUpdate?: (updatedProduct: ProductListItem) => void;
  onProductDelete?: (productId: string) => void;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function discountPct(price: number, compareAt: number | null) {
  if (!compareAt || compareAt <= price) return null;
  return Math.round((1 - price / compareAt) * 100);
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-sans font-semibold text-rose-700 border border-rose-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
        Rupture
      </span>
    );
  }
  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-sans font-semibold text-amber-800 border border-amber-500/25 tabular-nums">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
        {stock} restant{stock > 1 ? "s" : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-sans font-semibold text-emerald-800 border border-emerald-500/20 tabular-nums">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {stock} en stock
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-8 sm:p-12 lg:p-16 text-center shadow-xs">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/25">
        <Sparkles className="h-8 w-8 stroke-[1.5]" />
      </div>

      <h3 className="font-serif mb-2 text-xl font-medium text-[var(--obsidienne,#0E0B09)]">
        Aucun bijou trouvé
      </h3>
      <p className="mb-6 max-w-sm text-xs font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/60">
        Ajoutez vos créations de joaillerie ou modifiez vos critères de recherche.
      </p>
      <Link
        href="/admin/products/new"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] px-6 py-3 text-xs font-sans font-bold tracking-widest text-[var(--porcelaine,#F1ECE3)] transition-all uppercase hover:bg-[var(--laiton,#B9793E)] active:scale-95 shadow-sm"
      >
        <span>+ Ajouter un bijou</span>
      </Link>
    </div>
  );
}

export function ProductsList({
  products,
  viewMode = "table",
  onProductUpdate,
  onProductDelete,
}: ProductsListProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<ProductListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirection globale vers la fiche produit
  const navigateToDetail = (productId: string, e: React.MouseEvent) => {
    // Si le clic provient d'un bouton ou lien d'action, ne pas rediriger
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(`/admin/products/${productId}`);
  };

  // Basculer l'état actif/masqué
  const handleToggleActive = async (p: ProductListItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newActiveState = !p.isActive;
    setUpdatingId(p.id);

    try {
      const response = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: newActiveState }),
      });

      if (!response.ok) throw new Error("Erreur de mise à jour");

      const updated = { ...p, isActive: newActiveState };
      onProductUpdate?.(updated);
      toast.success(
        newActiveState
          ? `"${p.name}" est maintenant en ligne sur la boutique.`
          : `"${p.name}" a été masqué de la boutique.`
      );
    } catch {
      toast.error("Impossible de modifier le statut du produit.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Basculer l'état vedette
  const handleToggleFeatured = async (p: ProductListItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newFeaturedState = !p.isFeatured;
    setUpdatingId(p.id);

    try {
      const response = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: newFeaturedState }),
      });

      if (!response.ok) throw new Error("Erreur de mise à jour");

      const updated = { ...p, isFeatured: newFeaturedState };
      onProductUpdate?.(updated);
      toast.success(
        newFeaturedState
          ? `"${p.name}" est mis en vedette en page d'accueil.`
          : `"${p.name}" retiré des produits en vedette.`
      );
    } catch {
      toast.error("Impossible de modifier la mise en vedette.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Confirmation de suppression
  const confirmDelete = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/products/${deleteProduct.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erreur lors de la suppression");

      onProductDelete?.(deleteProduct.id);
      toast.success(`Le produit "${deleteProduct.name}" a été supprimé.`);
      setDeleteProduct(null);
    } catch {
      toast.error("Erreur lors de la suppression du produit.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (products.length === 0) return <EmptyState />;

  return (
    <div className="mx-auto max-w-7xl font-sans">
      {/* ===================== MODE GRILLE HAUTE JOAILLERIE ===================== */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p) => {
            const discount = discountPct(p.price, p.compareAtPrice);
            const isUpdating = updatingId === p.id;

            return (
              <div
                key={p.id}
                onClick={(e) => navigateToDetail(p.id, e)}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--laiton,#B9793E)]/50 hover:shadow-[0_12px_35px_-8px_rgba(185,121,62,0.18)] cursor-pointer"
              >
                {/* Visual Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--porcelaine,#F1ECE3)]/60">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${!p.isActive ? "opacity-45 grayscale" : ""
                        }`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--laiton,#B9793E)]/30 font-serif text-3xl">
                      ✦
                    </div>
                  )}

                  {/* Badges sur l'image */}
                  <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5 items-start">
                    {p.isFeatured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] px-3 py-1 text-[9px] font-sans font-extrabold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-sm">
                        <Sparkles className="h-3 w-3 stroke-[2]" />
                        Vedette
                      </span>
                    )}
                    {discount && (
                      <span className="inline-flex items-center rounded-full bg-[var(--obsidienne,#0E0B09)] px-2.5 py-0.5 text-[10px] font-mono font-bold text-[var(--laiton-clair,#D9AE78)] shadow-sm border border-[var(--laiton,#B9793E)]/30">
                        −{discount}%
                      </span>
                    )}
                  </div>

                  {/* Bouton de statut rapide haut-droit */}
                  <div className="absolute right-3 top-3 z-10">
                    <button
                      type="button"
                      onClick={(e) => handleToggleActive(p, e)}
                      disabled={isUpdating}
                      className={`flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-sm ${p.isActive
                          ? "bg-emerald-500/90 text-white border border-emerald-400/30 hover:scale-110"
                          : "bg-neutral-900/80 text-neutral-400 border border-neutral-700/50 hover:scale-110"
                        }`}
                      title={p.isActive ? "Cliquer pour masquer" : "Cliquer pour publier"}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : p.isActive ? (
                        <CheckCircle2 className="h-4.5 w-4.5" />
                      ) : (
                        <XCircle className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Block */}
                <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] truncate">
                        {p.categoryName}
                      </span>
                      <StockBadge stock={p.stock} />
                    </div>

                    <h3 className="font-serif text-base sm:text-lg font-medium text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors leading-tight line-clamp-1">
                      {p.name}
                    </h3>

                    {/* Prix */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                        {formatFCFA(p.price)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
                      </span>
                      {p.compareAtPrice && (
                        <span className="font-mono text-xs text-[var(--obsidienne,#0E0B09)]/40 line-through tabular-nums">
                          {formatFCFA(p.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar Footer */}
                  <div className="mt-4 pt-3 border-t border-[var(--laiton,#B9793E)]/15 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Toggle Vedette */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(p, e)}
                        disabled={isUpdating}
                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${p.isFeatured
                            ? "bg-[var(--laiton,#B9793E)]/15 border-[var(--laiton,#B9793E)]/40 text-[var(--laiton,#B9793E)]"
                            : "border-neutral-200 bg-white text-neutral-400 hover:text-[var(--laiton,#B9793E)] hover:border-[var(--laiton,#B9793E)]/30"
                          }`}
                        title={p.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                      >
                        <Star className={`h-4 w-4 ${p.isFeatured ? "fill-current" : ""}`} />
                      </button>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteProduct(p);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                        title="Supprimer le produit"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[var(--obsidienne,#0E0B09)] transition-all hover:border-[var(--laiton,#B9793E)]/40 hover:bg-[var(--porcelaine,#F1ECE3)]"
                        title="Fiche produit"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="flex h-9 px-3.5 items-center gap-1.5 rounded-xl bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] font-sans text-xs font-semibold tracking-wider transition-all hover:bg-[var(--laiton,#B9793E)] shadow-xs"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Modifier</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ===================== MODE TABLEAU ÉDITORIAL & MOBILE ADAPTATIF ===================== */
        <div className="space-y-3">
          {/* En-tête des colonnes sur Bureau (Masqué sur mobile) */}
          <div className="hidden md:grid grid-cols-[1fr_150px_130px_120px_80px_120px] items-center gap-4 px-6 py-2.5 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
            <span>Création & Collection</span>
            <span>Prix de Vente</span>
            <span>Stock</span>
            <span>Visibilité</span>
            <span className="text-center">Ventes</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Lignes Produits */}
          {products.map((p) => {
            const discount = discountPct(p.price, p.compareAtPrice);
            const isUpdating = updatingId === p.id;

            return (
              <div
                key={p.id}
                onClick={(e) => navigateToDetail(p.id, e)}
                className="group relative cursor-pointer rounded-3xl border border-[var(--laiton,#B9793E)]/15 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-200 hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md"
              >
                {/* ---------- LAYOUT MOBILE (< md) ---------- */}
                <div className="flex md:hidden flex-col gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Vignette Photo Mobile */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/20 shadow-2xs">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          className={`h-full w-full object-cover ${!p.isActive ? "opacity-45 grayscale" : ""}`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--laiton,#B9793E)]/40 font-serif text-xl">
                          ✦
                        </div>
                      )}
                      {p.isFeatured && (
                        <span className="absolute left-1 top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] shadow-xs">
                          <Sparkles className="h-2.5 w-2.5 stroke-[2.5]" />
                        </span>
                      )}
                    </div>

                    {/* Titre, catégorie & prix mobile */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[var(--laiton,#B9793E)] truncate">
                          {p.categoryName}
                        </span>
                        <StockBadge stock={p.stock} />
                      </div>

                      <h3 className="font-serif text-base font-medium text-[var(--obsidienne,#0E0B09)] truncate">
                        {p.name}
                      </h3>

                      <div className="mt-1 flex items-baseline gap-2 font-mono">
                        <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">
                          {formatFCFA(p.price)} FCFA
                        </span>
                        {p.compareAtPrice && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatFCFA(p.compareAtPrice)}
                          </span>
                        )}
                        {discount && (
                          <span className="text-[10px] font-bold text-[var(--laiton,#B9793E)]">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 group-hover:text-[var(--laiton,#B9793E)] transition-colors mt-2" />
                  </div>

                  {/* Rangée d'Actions Mobile */}
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={(e) => handleToggleActive(p, e)}
                      disabled={isUpdating}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-sans font-semibold border transition-all ${p.isActive
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200"
                        }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : p.isActive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          En ligne
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          Masqué
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(p, e)}
                        disabled={isUpdating}
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border ${p.isFeatured
                            ? "bg-[var(--laiton,#B9793E)]/15 border-[var(--laiton,#B9793E)]/40 text-[var(--laiton,#B9793E)]"
                            : "border-neutral-200 bg-white text-neutral-400"
                          }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${p.isFeatured ? "fill-current" : ""}`} />
                      </button>

                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="flex h-8 items-center gap-1.5 rounded-xl bg-[var(--obsidienne,#0E0B09)] px-3 text-xs font-semibold text-white shadow-xs"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Modifier</span>
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteProduct(p);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* ---------- LAYOUT DESKTOP (>= md) ---------- */}
                <div className="hidden md:grid grid-cols-[1fr_150px_130px_120px_80px_120px] items-center gap-4">
                  {/* Colonne Produit */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/20 shadow-2xs">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          loading="lazy"
                          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${!p.isActive ? "opacity-40 grayscale" : ""
                            }`}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--laiton,#B9793E)]/40 font-serif text-lg">
                          ✦
                        </div>
                      )}
                      {p.isFeatured && (
                        <span className="absolute left-1 top-1 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] shadow-xs">
                          <Sparkles className="h-2.5 w-2.5 stroke-[2.5]" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] block leading-none mb-1">
                        {p.categoryName}
                      </span>
                      <h3 className="font-serif text-base font-medium text-[var(--obsidienne,#0E0B09)] tracking-tight truncate group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  {/* Colonne Prix */}
                  <div className="flex flex-col">
                    <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                      {formatFCFA(p.price)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
                    </span>
                    {p.compareAtPrice && (
                      <div className="flex items-center gap-1.5 text-xs tabular-nums mt-0.5">
                        <span className="font-mono text-[var(--obsidienne,#0E0B09)]/40 line-through">
                          {formatFCFA(p.compareAtPrice)}
                        </span>
                        {discount && (
                          <span className="font-mono font-bold text-[var(--laiton,#B9793E)] text-[10px]">
                            −{discount}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Colonne Stock */}
                  <div>
                    <StockBadge stock={p.stock} />
                  </div>

                  {/* Colonne Visibilité Switch Rapide */}
                  <div>
                    <button
                      type="button"
                      onClick={(e) => handleToggleActive(p, e)}
                      disabled={isUpdating}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-sans font-semibold transition-all border ${p.isActive
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200"
                        }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : p.isActive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          En ligne
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                          Masqué
                        </>
                      )}
                    </button>
                  </div>

                  {/* Colonne Vendus */}
                  <div className="text-center">
                    <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums bg-[var(--porcelaine,#F1ECE3)]/60 px-3 py-0.5 rounded-full border border-[var(--laiton,#B9793E)]/15">
                      {p.unitsSold}
                    </span>
                  </div>

                  {/* Colonne Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleToggleFeatured(p, e)}
                      disabled={isUpdating}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${p.isFeatured
                          ? "bg-[var(--laiton,#B9793E)]/15 border-[var(--laiton,#B9793E)]/40 text-[var(--laiton,#B9793E)]"
                          : "border-neutral-200 bg-white text-neutral-400 hover:text-[var(--laiton,#B9793E)] hover:border-[var(--laiton,#B9793E)]/30"
                        }`}
                      title={p.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                    >
                      <Star className={`h-3.5 w-3.5 ${p.isFeatured ? "fill-current" : ""}`} />
                    </button>

                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-[var(--obsidienne,#0E0B09)] transition-all hover:border-[var(--laiton,#B9793E)]/30 hover:bg-[var(--porcelaine,#F1ECE3)] hover:text-[var(--laiton,#B9793E)]"
                      title="Voir la fiche"
                    >
                      <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Link>

                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--laiton,#B9793E)]/25 bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)]"
                      title="Modifier"
                    >
                      <Edit3 className="h-3.5 w-3.5 stroke-[1.5]" />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDeleteProduct(p);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-400 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== MODALE DE CONFIRMATION DE SUPPRESSION ===== */}
      {deleteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-[var(--laiton,#B9793E)]/30 bg-white p-6 shadow-2xl space-y-4 font-sans">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--obsidienne,#0E0B09)]">
                  Supprimer le bijou ?
                </h3>
                <p className="text-xs text-neutral-500">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 border border-[var(--laiton,#B9793E)]/15">
              <p className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)]">
                {deleteProduct.name}
              </p>
              <p className="text-xs font-mono text-[var(--laiton,#B9793E)] mt-0.5">
                {formatFCFA(deleteProduct.price)} FCFA · {deleteProduct.categoryName}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={isDeleting}
                className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Confirmer la suppression"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}