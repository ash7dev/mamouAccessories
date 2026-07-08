/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct, deleteProduct, updateProduct, uploadImagesToCloudinary } from "@/lib/api/products";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

/* ============================================================
   Formulaire produit UNIFIÉ : création ET édition.

   - Sans prop `product`  → mode création (identique à avant)
   - Avec prop `product`  → mode édition : champs pré-remplis,
     images existantes affichées, suivi des images supprimées
     (pour les retirer de Cloudinary côté serveur), zone de danger.

   Usage :
     /admin/products/new        →  <ProductForm />
     /admin/products/[id]/edit  →  <ProductForm product={product} />
   ============================================================ */

interface ProductImage {
  id: string;
  url: string;
  cloudinaryPublicId: string;
  file?: File;
  isNew?: boolean; // true = pas encore uploadée sur Cloudinary
}

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

/* ---------- Petits composants de structure ---------- */

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
      className={`rounded-3xl border bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] ${
        tone === "danger" ? "border-red-200" : "border-[var(--gold)]/15"
      }`}
    >
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset [&>svg]:h-6 [&>svg]:w-6 ${
            tone === "danger"
              ? "bg-red-50 text-red-600 ring-red-200"
              : "bg-[var(--ivory)] text-[var(--gold-dark)] ring-[var(--gold)]/20"
          }`}
        >
          {icon}
        </div>
        <div className="leading-tight">
          <h2 className="text-base font-bold text-[var(--text-dark)]">{title}</h2>
          <p className="mt-0.5 text-sm text-[var(--text-dark)]/50">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

const inputClass =
  "w-full rounded-full border border-[var(--gold)]/25 bg-white px-5 py-3.5 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-colors";

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
    <label className="mb-2 block text-sm font-medium text-[var(--text-dark)]">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

/* ---------- Icônes ---------- */

function InfoIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  );
}

function ToggleIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function PhotoIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

/* ---------- Formulaire ---------- */

export function ProductForm({ product }: ProductFormProps) {
  const isEdit = Boolean(product);
  const router = useRouter();
  const { confirm, Dialog } = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const [images, setImages] = useState<ProductImage[]>(
    product?.images.map((img) => ({ ...img, isNew: false })) ?? []
  );
  // Images existantes retirées par l'admin → à supprimer de Cloudinary côté serveur
  const [, setRemovedImageIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

    setIsSaving(true);
    try {
      const slug = isEdit && product ? product.slug : buildSlug(formData.name);
      const price = Number(formData.price);
      const compareAtPrice = formData.compareAtPrice ? Number(formData.compareAtPrice) : null;
      const stock = formData.stock ? Number(formData.stock) : 0;
      const newFiles = images.filter((img) => img.isNew && img.file).map((img) => img.file!);

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
        const keepPublicIds = images
          .filter((img) => !img.isNew && img.cloudinaryPublicId)
          .map((img) => img.cloudinaryPublicId);
        const uploadedPublicIds = newFiles.length > 0 ? await uploadImagesToCloudinary(newFiles) : [];

        await updateProduct(product.id, {
          ...payload,
          cloudinary_public_ids: [...keepPublicIds, ...uploadedPublicIds],
        });
      } else {
        const uploadedPublicIds = newFiles.length > 0 ? await uploadImagesToCloudinary(newFiles) : [];
        await createProduct({
          ...payload,
          cloudinary_public_ids: uploadedPublicIds,
        });
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
    const confirmed = await confirm({
      title: "Supprimer ce produit ?",
      description: "S'il a déjà été commandé, il sera simplement désactivé pour préserver l'historique des commandes.",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 photos autorisées par produit");
      return;
    }

    setIsUploading(true);

    // TODO: Implement Cloudinary upload
    const newImages: ProductImage[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newImages.push({
        id: `temp-${Date.now()}-${i}`,
        url,
        cloudinaryPublicId: "",
        file,
        isNew: true,
      });
    }

    setImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img && !img.isNew) {
        setRemovedImageIds((current) => [...current, id]);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  return (
    <>
      <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
        {/* ===== Bandeau sombre avec fil d'ariane ===== */}
        <div className="rounded-b-3xl bg-[#241B14] px-6 pb-8 pt-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/admin/products"
              className="flex items-center gap-1.5 text-sm font-medium text-[#F4EFE6]/60 transition-colors hover:text-[#F4EFE6]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Produits
            </Link>
            <h1 className="text-lg font-bold text-[#F4EFE6] lg:text-xl">
              {isEdit ? "Modifier le produit" : "Nouveau produit"}
            </h1>
            {isEdit && (
              <span className="w-full truncate text-sm text-[var(--gold)] lg:w-auto">
                {product!.name}
              </span>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-6 px-6 pb-28 pt-6 lg:px-8 lg:pb-10"
        >
        {/* ===== 1. Informations générales ===== */}
        <SectionCard
          icon={<InfoIcon />}
          title="Informations du produit"
          subtitle="L'essentiel pour démarrer"
        >
          <div className="space-y-5">
            <div>
              <FieldLabel required>Nom du produit</FieldLabel>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex : Boucles d'oreilles dorées"
                className={inputClass}
                required
              />
            </div>

            <div>
              <FieldLabel required>Catégorie</FieldLabel>
              {isLoadingCategories ? (
                <div className="text-sm text-[var(--text-dark)]/50">Chargement des catégories...</div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {categories.map((cat: Category) => {
                    const selected = formData.categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                          selected
                            ? "bg-[var(--text-dark)] text-white shadow-md"
                            : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
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
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez le produit (matériaux, dimensions, style...)"
                rows={4}
                className="w-full resize-none rounded-3xl border border-[var(--gold)]/25 bg-white px-5 py-4 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25"
              />
            </div>
          </div>
        </SectionCard>

        {/* ===== 2. Tarification ===== */}
        <SectionCard icon={<WalletIcon />} title="Tarification" subtitle="Prix, promotion et stock">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <FieldLabel required>Prix (FCFA)</FieldLabel>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex : 15000"
                min="0"
                className={inputClass}
                required
              />
            </div>

            <div>
              <FieldLabel>Prix barré (FCFA)</FieldLabel>
              <input
                type="number"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="Ex : 20000"
                min="0"
                className={inputClass}
              />
              <p className="mt-1.5 pl-2 text-xs text-[var(--text-dark)]/45">
                Ancien prix affiché barré pour signaler une promotion
              </p>
            </div>

            <div>
              <FieldLabel required>Stock disponible</FieldLabel>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Ex : 10"
                min="0"
                className={inputClass}
                required
              />
            </div>
          </div>
        </SectionCard>

        {/* ===== 3. Visibilité ===== */}
        <SectionCard icon={<ToggleIcon />} title="Visibilité" subtitle="Où le produit apparaîtra">
          <div className="space-y-3">
            {[
              {
                key: "isFeatured" as const,
                title: "Produit mis en avant",
                desc: "Apparaîtra sur la page d'accueil",
              },
              {
                key: "isActive" as const,
                title: "Produit actif",
                desc: "Visible dans la boutique",
              },
            ].map((opt) => (
              <label
                key={opt.key}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                  formData[opt.key]
                    ? "border-[var(--gold)]/40 bg-[var(--ivory)]/50"
                    : "border-[var(--gold)]/15 hover:bg-[var(--ivory)]/30"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-[var(--text-dark)]">{opt.title}</p>
                  <p className="text-xs text-[var(--text-dark)]/50">{opt.desc}</p>
                </div>
                <span
                  className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
                    formData[opt.key] ? "bg-[var(--gold)]" : "bg-[var(--text-dark)]/15"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData[opt.key]}
                    onChange={(e) => setFormData({ ...formData, [opt.key]: e.target.checked })}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      formData[opt.key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* ===== 4. Photos ===== */}
        <SectionCard
          icon={<PhotoIcon />}
          title="Photos du produit"
          subtitle={isEdit ? "Gérez les photos existantes ou ajoutez-en" : "La touche finale — jusqu'à 5 photos"}
        >
          {/* Choix du format */}
          <div className="mb-6">
            <FieldLabel required>Format des photos</FieldLabel>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  { key: "portrait", label: "Portrait (3:4)", hint: "Vertical", w: "w-12", h: "h-16" },
                  { key: "landscape", label: "Paysage (4:3)", hint: "Horizontal", w: "w-16", h: "h-12" },
                ] as const
              ).map((opt) => {
                const selected = formData.imageOrientation === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, imageOrientation: opt.key })}
                    className={`rounded-2xl border-2 p-4 transition-all ${
                      selected
                        ? "border-[var(--gold)] bg-[var(--ivory)]/50"
                        : "border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`${opt.w} ${opt.h} rounded-lg ${
                          selected ? "bg-[var(--gold)]/30" : "bg-[var(--text-dark)]/10"
                        }`}
                      />
                      <span className="text-sm font-medium text-[var(--text-dark)]">{opt.label}</span>
                      <span className="text-xs text-[var(--text-dark)]/45">{opt.hint}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Avertissement : changer le format alors que des photos existent déjà */}
            {isEdit &&
              images.some((i) => !i.isNew) &&
              formData.imageOrientation !== product!.imageOrientation && (
                <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                  ⚠ Les photos déjà en ligne ont été recadrées au format{" "}
                  {product!.imageOrientation === "portrait" ? "portrait" : "paysage"}. En changeant de
                  format, remplacez-les pour éviter un affichage incohérent dans la boutique.
                </p>
              )}
          </div>

          {/* Upload */}
          <FieldLabel required>Photos ({images.length}/5)</FieldLabel>

          {images.length === 0 && (
            <div className="rounded-2xl bg-[var(--ivory)]/60 p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div aria-hidden className="absolute -inset-2 rounded-full border border-[var(--gold)]/20" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/25 [&>svg]:h-6 [&>svg]:w-6">
                    <PhotoIcon />
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold text-[var(--text-dark)]">
                    Ajoutez les photos du produit
                  </p>
                  <p className="text-xs text-[var(--text-dark)]/50">
                    Jusqu&apos;à 5 photos · Format{" "}
                    {formData.imageOrientation === "portrait" ? "vertical (3:4)" : "horizontal (4:3)"}
                  </p>
                </div>
                <label className="cursor-pointer rounded-full bg-[var(--text-dark)] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:bg-[var(--text-dark)]/90 active:scale-95">
                  Choisir des photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading || images.length >= 5}
                  />
                </label>
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div>
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-[var(--gold)]/15 bg-[var(--ivory)]/50"
                  >
                    <img src={image.url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />

                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#241B14]">
                        Principale
                      </div>
                    )}

                    {/* Badge "nouvelle" en mode édition */}
                    {isEdit && image.isNew && (
                      <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-[var(--gold-dark)]">
                        Nouvelle
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#241B14]/60 opacity-0 transition-opacity group-hover:opacity-100">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, "up")}
                          className="rounded-full bg-white p-2 transition-colors hover:bg-[var(--ivory)]"
                          title="Déplacer vers la gauche"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                        title="Supprimer"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>

                      {index < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveImage(index, "down")}
                          className="rounded-full bg-white p-2 transition-colors hover:bg-[var(--ivory)]"
                          title="Déplacer vers la droite"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {images.length < 5 && (
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-dashed border-[var(--gold)]/40 bg-[var(--ivory)]/40 px-5 py-2.5 text-sm font-medium text-[var(--text-dark)]/70 transition-colors hover:border-[var(--gold)] hover:text-[var(--text-dark)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Ajouter d&apos;autres photos
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          )}
        </SectionCard>

        {/* ===== 5. Zone de danger — uniquement en édition ===== */}
        {isEdit && (
          <SectionCard
            icon={<TrashIcon />}
            title="Zone de danger"
            subtitle="Action irréversible"
            tone="danger"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="max-w-md text-sm leading-relaxed text-[var(--text-dark)]/60">
                Si ce produit a déjà été commandé, il sera désactivé (retiré de la boutique) pour
                préserver l&apos;historique. Sinon, il sera définitivement supprimé avec ses photos.
              </p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Suppression..." : "Supprimer le produit"}
              </button>
            </div>
          </SectionCard>
        )}

        {/* ===== Actions ===== */}
        {/* Desktop: côte à côte */}
        <div className="hidden lg:flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="group relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-[var(--text-dark)] transition-all hover:border-gray-300 hover:shadow-md active:scale-95"
          >
            <span className="relative z-10">Annuler</span>
          </Link>
          <button
            type="submit"
            disabled={isUploading || isSaving || images.length === 0}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            <span className="relative z-10 flex items-center gap-2">
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? "Enregistrer les modifications" : "Créer le produit"}
                </>
              )}
            </span>
          </button>
        </div>

        {/* Mobile: superposés pleine largeur */}
        <div className="lg:hidden flex flex-col gap-3 pt-4">
          <button
            type="submit"
            disabled={isUploading || isSaving || images.length === 0}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--gold-dark)] to-[var(--gold)] px-6 py-4 text-base font-bold text-white shadow-xl transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-active:opacity-100"></div>
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enregistrement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? "Modifier le produit" : "Créer le produit"}
                </>
              )}
            </span>
          </button>
          <Link
            href="/admin/products"
            className="w-full rounded-2xl border-2 border-gray-200 bg-white px-6 py-4 text-base font-semibold text-[var(--text-dark)] text-center transition-all active:scale-95 active:bg-gray-50"
          >
            Annuler
          </Link>
        </div>
      </form>
      </div>
      <Dialog />
    </>
  );
}