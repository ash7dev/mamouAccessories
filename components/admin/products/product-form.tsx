/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, deleteProduct, updateProduct } from "@/lib/api/products";
import { uploadProductImage } from "@/lib/api/upload";
import { ProductImageUploader, ImageItem } from "@/components/ui/product-image-uploader";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductImage } from "@/components/ui/product-image";
import {
  Sparkles,
  ChevronLeft,
  Package,
  Tag,
  Eye,
  Image as ImageIcon,
  AlertTriangle,
  Check,
  Trash2,
  Percent,
  Layers,
  Smartphone,
  Info,
} from "lucide-react";

export interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageOrientation: "portrait" | "landscape";
  isFeatured: boolean;
  isActive: boolean;
  images: { id: string; url: string; cloudinaryPublicId: string }[];
}

interface ProductFormProps {
  product?: ProductWithImages;
}

interface Category {
  id: string;
  name: string;
}

/* ---------- Composants UI Luxueux ---------- */

function SectionCard({
  icon,
  title,
  subtitle,
  children,
  tone = "default",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={`rounded-3xl border bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(14,11,9,0.05)] transition-all duration-300 ${
        tone === "danger"
          ? "border-rose-500/30 bg-rose-500/[0.01]"
          : "border-[var(--laiton,#B9793E)]/20 hover:border-[var(--laiton,#B9793E)]/35"
      }`}
    >
      <div className="mb-6 flex items-center gap-4 pb-4 border-b border-[var(--laiton,#B9793E)]/10">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
            tone === "danger"
              ? "bg-rose-500/10 text-rose-700 border-rose-500/20"
              : "bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border-[var(--laiton,#B9793E)]/25 shadow-2xs"
          }`}
        >
          {icon}
        </div>
        <div className="leading-tight">
          <h2 className="font-serif text-xl font-normal text-[var(--obsidienne,#0E0B09)] tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-xs font-sans font-medium text-[var(--obsidienne,#0E0B09)]/55">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3.5 text-xs sm:text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/35 focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-1 focus:ring-[var(--laiton,#B9793E)]/30 transition-colors shadow-2xs font-sans";

function buildSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-xs font-sans font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/75">
      {children}
      {required && <span className="ml-1 text-rose-600 font-bold">*</span>}
    </label>
  );
}

function formatPrice(val: number) {
  return new Intl.NumberFormat("fr-FR").format(val);
}

/* ---------- Formulaire Principal ---------- */

export function ProductForm({ product }: ProductFormProps) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const { confirm, Dialog } = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [formData, setFormData] = useState({
    name: product?.name ?? "",
    categoryId: product?.categoryId ?? "",
    description: product?.description ?? "",
    price: product?.price?.toString() ?? "",
    compareAtPrice: product?.compareAtPrice?.toString() ?? "",
    stock: product?.stock?.toString() ?? "",
    imageOrientation: product?.imageOrientation ?? ("portrait" as "portrait" | "landscape"),
    isFeatured: product?.isFeatured ?? false,
    isActive: product?.isActive ?? true,
  });

  const [images, setImages] = useState<ImageItem[]>(
    product?.images.map((img) => ({ ...img, isNew: false })) ?? []
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  // Calculs financiers dynamiques
  const numPrice = Number(formData.price) || 0;
  const numCompare = Number(formData.compareAtPrice) || 0;
  const hasDiscount = numCompare > numPrice && numPrice > 0;
  const discountPercent = hasDiscount ? Math.round(((numCompare - numPrice) / numCompare) * 100) : 0;
  const discountAmount = hasDiscount ? numCompare - numPrice : 0;

  const numStock = Number(formData.stock) || 0;
  const stockBadge =
    numStock <= 0
      ? { label: "Rupture de stock", color: "bg-rose-50 text-rose-700 border-rose-200" }
      : numStock <= 3
      ? { label: "Stock très limité", color: "bg-amber-50 text-amber-800 border-amber-200" }
      : { label: "En stock", color: "bg-emerald-50 text-emerald-800 border-emerald-200" };

  const selectedCategoryName =
    categories.find((c) => c.id === formData.categoryId)?.name ?? "Catégorie";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Le nom du produit est obligatoire");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    if (images.length === 0) {
      toast.error("Au moins une photo est requise pour le produit");
      return;
    }

    setIsSaving(true);
    try {
      const slug = isEdit && product ? product.slug : buildSlug(formData.name);
      const price = Number(formData.price);
      const compareAtPrice = formData.compareAtPrice ? Number(formData.compareAtPrice) : null;
      const stock = formData.stock ? Number(formData.stock) : 0;

      // Upload des nouvelles photos
      const finalPublicIds: string[] = [];
      for (const img of images) {
        if (!img.isNew && img.cloudinaryPublicId) {
          finalPublicIds.push(img.cloudinaryPublicId);
        } else if (img.file) {
          toast.loading("Upload de la photo...", { id: "upload-status" });
          const res = await uploadProductImage(img.file);
          finalPublicIds.push(res.publicId);
          toast.dismiss("upload-status");
        }
      }

      const payload = {
        category_id: formData.categoryId,
        name: formData.name.trim(),
        slug,
        description: formData.description.trim() || undefined,
        price,
        compare_at_price: compareAtPrice ?? undefined,
        stock,
        image_orientation: formData.imageOrientation,
        is_featured: formData.isFeatured,
        is_active: formData.isActive,
      };

      if (isEdit && product) {
        await updateProduct(product.id, {
          ...payload,
          cloudinary_public_ids: finalPublicIds,
        });
        toast.success("Produit mis à jour avec succès");
      } else {
        await createProduct({
          ...payload,
          cloudinary_public_ids: finalPublicIds,
        });
        toast.success("Produit créé avec succès");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'enregistrement du produit");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    await confirm({
      title: "Supprimer ce produit ?",
      description: "S'il a déjà été commandé, il sera simplement désactivé pour préserver l'historique des ventes.",
      confirmLabel: "Supprimer",
      cancelLabel: "Annuler",
      isDestructive: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          if (!product) return;
          await deleteProduct(product.id);
          toast.success("Produit supprimé avec succès");
          router.push("/admin/products");
          router.refresh();
        } catch (error) {
          console.error("Error deleting product:", error);
          toast.error(error instanceof Error ? error.message : "Erreur lors de la suppression du produit");
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  return (
    <>
      <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
        {/* ===== En-tête Haute Joaillerie (Obsidienne & Laiton) ===== */}
        <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-6 pb-10 pt-8 lg:px-10 border-b border-[var(--laiton,#B9793E)]/25 shadow-2xl text-[var(--porcelaine,#F1ECE3)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[var(--laiton,#B9793E)]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[var(--laiton-clair,#D9AE78)] transition-colors hover:text-white uppercase tracking-wider"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Catalogue
                </Link>
                <span className="text-[var(--laiton)]/40">•</span>
                <span className="text-xs font-sans font-medium text-[var(--porcelaine)]/60">
                  {isEdit ? "Édition de bijou" : "Nouvelle création"}
                </span>
              </div>

              {/* Onglets d'affichage Mode Édition vs Aperçu boutique */}
              <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 border border-white/15 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "edit"
                      ? "bg-[var(--laiton,#B9793E)] text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  Formulaire
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-sans font-medium transition-all ${
                    activeTab === "preview"
                      ? "bg-[var(--laiton,#B9793E)] text-white shadow-sm"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                  Aperçu boutique
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-[var(--porcelaine,#F1ECE3)]">
                  {formData.name.trim() ? formData.name : isEdit ? product!.name : "Nouveau Bijou / Accessoire"}
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)]/65 font-sans">
                  Configurez le nom, le tarif, les photos et la visibilité dans la joaillerie.
                </p>
              </div>

              {/* Tag de statut */}
              <div className="flex items-center gap-2">
                {formData.isFeatured && (
                  <span className="rounded-full bg-[var(--laiton,#B9793E)]/20 px-3 py-1 text-[11px] font-sans font-semibold text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton,#B9793E)]/40">
                    ✦ Vedette
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-sans font-semibold border ${
                    formData.isActive
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-neutral-500/20 text-neutral-300 border-neutral-500/40"
                  }`}
                >
                  {formData.isActive ? "● Actif en ligne" : "○ Masqué"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Vue de l'aperçu boutique (Si l'onglet preview est actif) ===== */}
        {activeTab === "preview" && (
          <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 font-sans animate-in fade-in duration-200">
            <div className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-10 shadow-xl">
              <div className="mb-6 flex items-center justify-between pb-4 border-b">
                <div>
                  <h3 className="font-serif text-lg font-normal text-[var(--obsidienne,#0E0B09)]">
                    Simulateur de Carte Produit
                  </h3>
                  <p className="text-xs text-[var(--obsidienne,#0E0B09)]/60">
                    Rendu visuel exact du bijou sur la boutique en ligne Mamou.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-200"
                >
                  Retour au formulaire
                </button>
              </div>

              <div className="mx-auto max-w-sm">
                <div className="group relative overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                  {/* Photo principale */}
                  <div
                    className={`relative w-full overflow-hidden bg-neutral-100 ${
                      formData.imageOrientation === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
                    }`}
                  >
                    {images.length > 0 ? (
                      <ProductImage
                        src={images[0].url}
                        alt={formData.name}
                        fill
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}

                    {/* Badges sur l'image */}
                    <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
                      {formData.isFeatured && (
                        <span className="rounded-full bg-[var(--laiton,#B9793E)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] shadow">
                          Vedette
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contenu carte produit */}
                  <div className="p-5">
                    <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[var(--laiton,#B9793E)]">
                      {selectedCategoryName}
                    </p>
                    <h4 className="mt-1 font-serif text-lg font-normal text-[var(--obsidienne,#0E0B09)] line-clamp-1">
                      {formData.name || "Titre du produit"}
                    </h4>

                    <p className="mt-2 text-xs text-[var(--obsidienne,#0E0B09)]/60 line-clamp-2 leading-relaxed">
                      {formData.description || "Aucune description renseignée..."}
                    </p>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-base font-bold text-[var(--obsidienne,#0E0B09)]">
                          {numPrice > 0 ? `${formatPrice(numPrice)} FCFA` : "Prix NC"}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-neutral-400 line-through">
                            {formatPrice(numCompare)} FCFA
                          </span>
                        )}
                      </div>

                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${stockBadge.color}`}>
                        {stockBadge.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Formulaire Principal ===== */}
        <form
          onSubmit={handleSubmit}
          className={`mx-auto max-w-5xl space-y-8 px-6 pb-28 pt-8 lg:px-8 lg:pb-16 ${
            activeTab === "preview" ? "hidden" : "block"
          }`}
        >
          {/* ===== 1. Informations générales ===== */}
          <SectionCard
            icon={<Package className="h-5 w-5 stroke-[1.5]" />}
            title="Informations générales"
            subtitle="Désignation de la création et catégorie de joaillerie"
          >
            <div className="space-y-6">
              <div>
                <FieldLabel required>Nom de la création</FieldLabel>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex : Pendentif Collier Laiton Doré Soleil Artisanal"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <FieldLabel required>Catégorie de bijou</FieldLabel>
                {isLoadingCategories ? (
                  <div className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 py-2">
                    Chargement des catégories...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat: Category) => {
                      const selected = formData.categoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                          className={`rounded-full px-5 py-2.5 text-xs font-sans font-medium transition-all ${
                            selected
                              ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/40 scale-[1.02]"
                              : "border border-[var(--laiton,#B9793E)]/25 bg-white text-[var(--obsidienne,#0E0B09)]/75 hover:border-[var(--laiton,#B9793E)]/60 hover:text-[var(--obsidienne,#0E0B09)]"
                          }`}
                        >
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <FieldLabel>Description & Conseils d&apos;entretien</FieldLabel>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez la composition du bijou (laiton poli, placage, pierres), les dimensions exactes et les préconisations pour préserver son éclat..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-white px-4 py-3.5 text-xs sm:text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/35 transition-colors focus:border-[var(--laiton,#B9793E)] focus:outline-none focus:ring-1 focus:ring-[var(--laiton,#B9793E)]/30 shadow-2xs font-sans leading-relaxed"
                />
              </div>
            </div>
          </SectionCard>

          {/* ===== 2. Tarification & Stock ===== */}
          <SectionCard
            icon={<Tag className="h-5 w-5 stroke-[1.5]" />}
            title="Tarification & Gestion du Stock"
            subtitle="Prix de vente public, réductions et niveau d'inventaire"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <FieldLabel required>Prix de vente (FCFA)</FieldLabel>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex : 25000"
                      min="0"
                      className={`${inputClass} font-mono font-semibold text-base pr-16`}
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-neutral-400">
                      FCFA
                    </span>
                  </div>
                </div>

                <div>
                  <FieldLabel>Prix barré / d&apos;origine (FCFA)</FieldLabel>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                      placeholder="Ex : 35000"
                      min="0"
                      className={`${inputClass} font-mono text-base pr-16`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-neutral-400">
                      FCFA
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] font-sans text-[var(--obsidienne,#0E0B09)]/50">
                    Saisissez un prix supérieur pour afficher une réduction
                  </p>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <FieldLabel required>Quantité en stock</FieldLabel>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="Ex : 5"
                      min="0"
                      className={`${inputClass} font-mono font-semibold text-base`}
                      required
                    />
                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${stockBadge.color}`}>
                      {stockBadge.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Banner de calcul automatique de promotion */}
              {hasDiscount && (
                <div className="flex items-center justify-between rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs font-sans text-rose-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm font-bold font-mono">
                      -{discountPercent}%
                    </div>
                    <div>
                      <p className="font-semibold">Remise appliquée en boutique</p>
                      <p className="text-rose-700/80 text-[11px]">
                        Le client économisera{" "}
                        <strong className="font-mono">{formatPrice(discountAmount)} FCFA</strong> sur ce produit.
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold text-rose-800">
                    Prix affiché : {formatPrice(numPrice)} FCFA
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          {/* ===== 3. Visibilité & Options ===== */}
          <SectionCard
            icon={<Eye className="h-5 w-5 stroke-[1.5]" />}
            title="Visibilité & Statut en ligne"
            subtitle="Définissez l'exposition du bijou dans la vitrine digitale"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  key: "isFeatured" as const,
                  title: "Produit en Vedette",
                  desc: "Mettre en valeur dans la carrousel 'Sélection d'exception' sur la page d'accueil",
                  badge: "✦ Vedette",
                },
                {
                  key: "isActive" as const,
                  title: "Disponible à l'achat",
                  desc: "Rendre le bijou actif et visible sur la boutique Mamou immédiatement",
                  badge: "● En ligne",
                },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex cursor-pointer items-start justify-between gap-3 rounded-2xl border p-5 transition-all ${
                    formData[opt.key]
                      ? "border-[var(--laiton,#B9793E)]/50 bg-[var(--laiton,#B9793E)]/10 shadow-xs"
                      : "border-[var(--laiton,#B9793E)]/15 bg-white hover:bg-neutral-50"
                  }`}
                >
                  <div className="pr-2">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[var(--laiton,#B9793E)] block mb-1">
                      {opt.badge}
                    </span>
                    <p className="font-serif text-base font-normal text-[var(--obsidienne,#0E0B09)]">
                      {opt.title}
                    </p>
                    <p className="mt-1 text-xs font-sans text-[var(--obsidienne,#0E0B09)]/55 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                  <span
                    className={`relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      formData[opt.key] ? "bg-[var(--laiton,#B9793E)]" : "bg-[var(--obsidienne,#0E0B09)]/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData[opt.key]}
                      onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.checked })}
                      className="peer sr-only"
                    />
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        formData[opt.key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </span>
                </label>
              ))}
            </div>
          </SectionCard>

          {/* ===== 4. Visuels & Galerie photo modernisée ===== */}
          <SectionCard
            icon={<ImageIcon className="h-5 w-5 stroke-[1.5]" />}
            title="Photographies & Studio Visuel"
            subtitle="Sélectionnez et organisez jusqu'à 5 clichés haute résolution"
          >
            <div className="space-y-6">
              {/* Choix du format avec explications visuelles */}
              <div>
                <FieldLabel required>Orientation et format du cadre</FieldLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(
                    [
                      {
                        key: "portrait",
                        label: "Portrait Vertical (3:4)",
                        hint: "Recommandé pour les bijoux portés, mannequins & colliers",
                        w: "w-10",
                        h: "h-14",
                      },
                      {
                        key: "landscape",
                        label: "Paysage Horizontal (4:3)",
                        hint: "Idéal pour les coffrets cadeaux & étuis",
                        w: "w-14",
                        h: "h-10",
                      },
                    ] as const
                  ).map((opt) => {
                    const selected = formData.imageOrientation === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setFormData({ ...formData, imageOrientation: opt.key })}
                        className={`rounded-2xl border-2 p-4 transition-all text-left ${
                          selected
                            ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)]/10 shadow-xs"
                            : "border-[var(--laiton,#B9793E)]/15 bg-white hover:border-[var(--laiton,#B9793E)]/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`${opt.w} ${opt.h} rounded-xl shrink-0 transition-colors ${
                              selected ? "bg-[var(--laiton,#B9793E)] shadow-sm" : "bg-[var(--obsidienne,#0E0B09)]/15"
                            }`}
                          />
                          <div>
                            <span className="font-serif text-sm font-normal text-[var(--obsidienne,#0E0B09)] block">
                              {opt.label}
                            </span>
                            <span className="text-[11px] font-sans text-[var(--obsidienne,#0E0B09)]/50 block leading-tight">
                              {opt.hint}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Avertissement si changement de format en edition */}
                {isEdit &&
                  images.some((i) => !i.isNew) &&
                  formData.imageOrientation !== product!.imageOrientation && (
                    <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 p-4 text-xs font-sans leading-relaxed text-amber-900">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <span>
                        Les photos déjà enregistrées ont été recadrées au format{" "}
                        <strong>{product!.imageOrientation === "portrait" ? "portrait" : "paysage"}</strong>. Pensez à remplacer les clichés pour préserver l'esthétique globale de la boutique.
                      </span>
                    </div>
                  )}
              </div>

              {/* Zone d'Upload de photos moderne */}
              <div>
                <FieldLabel required>Galerie du bijou</FieldLabel>
                <ProductImageUploader
                  images={images}
                  onChange={setImages}
                  maxImages={5}
                  orientation={formData.imageOrientation}
                  disabled={isSaving || isDeleting}
                />
              </div>
            </div>
          </SectionCard>

          {/* ===== 5. Zone de danger — uniquement en édition ===== */}
          {isEdit && (
            <SectionCard
              icon={<Trash2 className="h-5 w-5 stroke-[1.5]" />}
              title="Zone de suppression"
              subtitle="Retrait définitif du catalogue de la boutique"
              tone="danger"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-md text-xs font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/65">
                  Si ce produit a déjà été commandé, il sera désactivé pour préserver l&apos;historique de vente. Sinon, il sera définitivement supprimé.
                </p>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="rounded-full border border-rose-200 bg-rose-50 px-6 py-2.5 text-xs font-sans font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? "Suppression en cours..." : "Supprimer ce bijou"}
                </button>
              </div>
            </SectionCard>
          )}

          {/* ===== Barre d'Actions Flottante Haute Joaillerie au Bas de l'Écran ===== */}
          <div className="sticky bottom-4 sm:bottom-6 z-40 mt-8 rounded-3xl border border-[var(--laiton,#B9793E)]/35 bg-[var(--obsidienne,#0E0B09)]/95 p-3.5 sm:p-4 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-[var(--porcelaine,#F1ECE3)] transition-all">
            <div className="flex items-center justify-between gap-3">
              {/* Infos Produit sur Bureau & Tablette */}
              <div className="hidden sm:flex items-center gap-3 min-w-0">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--laiton,#B9793E)]/20 to-[var(--laiton-clair,#D9AE78)]/10 text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton,#B9793E)]/30">
                  <Sparkles className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="font-serif text-sm font-medium text-[var(--porcelaine,#F1ECE3)] truncate">
                    {formData.name.trim() ? formData.name : isEdit ? product!.name : "Nouveau Bijou"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[var(--porcelaine,#F1ECE3)]/60">
                    <span className="text-[var(--laiton-clair,#D9AE78)] font-semibold">{images.length}/5 photos</span>
                    <span>•</span>
                    <span>{numPrice > 0 ? `${formatPrice(numPrice)} FCFA` : "Prix NC"}</span>
                  </div>
                </div>
              </div>

              {/* Résumé compact sur Mobile */}
              <div className="flex sm:hidden flex-col min-w-0 pr-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-[var(--laiton-clair,#D9AE78)] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isEdit ? "Édition" : "Nouveau"}
                </span>
                <span className="font-mono text-xs font-bold text-white truncate mt-0.5">
                  {numPrice > 0 ? `${formatPrice(numPrice)} FCFA` : "Prix NC"}
                </span>
              </div>

              {/* Boutons d'Action */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <Link
                  href="/admin/products"
                  className="rounded-2xl border border-white/20 bg-white/10 px-4 sm:px-6 py-2.5 sm:py-3 text-xs font-sans font-semibold text-white transition-all hover:bg-white/20 active:scale-95 text-center"
                >
                  Annuler
                </Link>

                <button
                  type="submit"
                  disabled={isSaving || images.length === 0}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] bg-[length:200%_auto] px-5 sm:px-8 py-2.5 sm:py-3 text-xs font-sans font-bold tracking-wider text-[var(--obsidienne,#0E0B09)] shadow-[0_8px_25px_rgba(185,121,62,0.4)] transition-all hover:bg-right hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 uppercase"
                >
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="hidden sm:inline">Enregistrement...</span>
                        <span className="sm:hidden">Sauvegarde...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[2.5]" />
                        <span>{isEdit ? "Enregistrer" : "Créer"}</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Dialog />
    </>
  );
}