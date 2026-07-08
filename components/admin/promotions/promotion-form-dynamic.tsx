"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProductSelector } from "./product-selector";

/* ============================================================
   Formulaire promotion dynamique - Design Premium
   Les champs apparaissent/disparaissent selon les sélections
   ============================================================ */

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryName: string;
  imageUrl: string | null;
}

interface PromotionData {
  id?: string;
  promotionType: "automatic" | "code";
  code?: string;
  name: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string;
  end_date: string;
  applies_to: "all_products" | "specific_category" | "specific_products";
  category_id: string | null;
  min_purchase_amount: number;
  max_discount_amount: number | null;
  usage_limit: number | null;
  usage_limit_per_customer: number | null;
  is_active: boolean;
}

interface PromotionFormDynamicProps {
  promotion?: PromotionData;
}

/* ---------- Composants UI Premium ---------- */

const inputClass =
  "w-full rounded-full border border-[var(--gold)]/25 bg-white px-5 py-3.5 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-all duration-200";

const textareaClass =
  "w-full resize-none rounded-3xl border border-[var(--gold)]/25 bg-white px-5 py-4 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 transition-all duration-200 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25";

const selectClass =
  "w-full rounded-full border border-[var(--gold)]/25 bg-white px-5 py-3.5 text-sm text-[var(--text-dark)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-all duration-200 cursor-pointer";

const dateInputClass =
  "w-full rounded-full border border-[var(--gold)]/25 bg-white px-5 py-3.5 text-sm text-[var(--text-dark)] focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-all duration-200 [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:transition-opacity";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-[var(--text-dark)]">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function RadioCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-1 items-start gap-4 rounded-3xl border-2 p-6 text-left transition-all duration-300 ${
        selected
          ? "border-[var(--gold)] bg-gradient-to-br from-[var(--ivory)] to-white shadow-[0_8px_32px_-12px_rgba(212,175,55,0.4)]"
          : "border-[var(--gold)]/15 bg-white hover:border-[var(--gold)]/40 hover:shadow-[0_4px_16px_-8px_rgba(43,33,24,0.1)]"
      }`}
    >
      {/* Indicateur sélection */}
      <div
        className={`absolute right-4 top-4 h-5 w-5 rounded-full border-2 transition-all duration-300 ${
          selected
            ? "border-[var(--gold)] bg-[var(--gold)]"
            : "border-[var(--gold)]/25 bg-white group-hover:border-[var(--gold)]/50"
        }`}
      >
        {selected && (
          <svg
            className="h-full w-full p-0.5 text-[#241B14]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Icône */}
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
          selected
            ? "bg-[var(--gold)] text-[#241B14] shadow-md"
            : "bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/20"
        }`}
      >
        {icon}
      </div>

      {/* Texte */}
      <div className="min-w-0 flex-1 pt-1">
        <h3 className="text-base font-bold text-[var(--text-dark)]">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-[var(--text-dark)]/60">{description}</p>
      </div>
    </button>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <span className="text-sm font-medium text-[var(--text-dark)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
          checked ? "bg-[var(--gold)]" : "bg-[var(--gold)]/20"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-300 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </label>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-[var(--gold)]/15" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)]">
          {title}
        </span>
      </div>
    </div>
  );
}

/* ---------- Icônes ---------- */

function AutomaticIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-7 w-7">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-7 w-7">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
      />
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

/* ---------- Formulaire Principal ---------- */

export function PromotionFormDynamic({ promotion }: PromotionFormDynamicProps) {
  const isEdit = Boolean(promotion);
  const router = useRouter();
  const { confirm, Dialog } = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    promotionType: (promotion?.promotionType || "automatic") as "automatic" | "code",
    code: promotion?.code || "",
    name: promotion?.name || "",
    description: promotion?.description || "",
    discountType: (promotion?.discount_type || "percentage") as "percentage" | "fixed_amount",
    discountValue: promotion?.discount_value?.toString() || "",
    hasMaxDiscount: Boolean(promotion?.max_discount_amount),
    maxDiscountAmount: promotion?.max_discount_amount?.toString() || "",
    startDate: promotion?.start_date ? new Date(promotion.start_date).toISOString().slice(0, 16) : "",
    endDate: promotion?.end_date ? new Date(promotion.end_date).toISOString().slice(0, 16) : "",
    appliesTo: (promotion?.applies_to || "all_products") as "all_products" | "specific_category" | "specific_products",
    categoryId: promotion?.category_id || "",
    selectedProducts: [] as Product[],
    hasMinPurchase: Boolean(promotion?.min_purchase_amount && promotion.min_purchase_amount > 0),
    minPurchaseAmount: promotion?.min_purchase_amount?.toString() || "0",
    hasUsageLimit: Boolean(promotion?.usage_limit),
    usageLimit: promotion?.usage_limit?.toString() || "",
    hasUsageLimitPerCustomer: Boolean(promotion?.usage_limit_per_customer),
    usageLimitPerCustomer: promotion?.usage_limit_per_customer?.toString() || "",
    isActive: promotion?.is_active ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Charger les catégories
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    if (formData.promotionType === "code" && !formData.code.trim()) {
      toast.error("Le code promo est requis");
      return;
    }

    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      toast.error("La valeur de réduction doit être positive");
      return;
    }

    if (formData.discountType === "percentage" && (Number(formData.discountValue) < 1 || Number(formData.discountValue) > 100)) {
      toast.error("Le pourcentage doit être entre 1 et 100");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Les dates sont requises");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    if (formData.appliesTo === "specific_category" && !formData.categoryId) {
      toast.error("Sélectionnez une catégorie");
      return;
    }

    if (formData.appliesTo === "specific_products" && formData.selectedProducts.length === 0) {
      toast.error("Sélectionnez au moins un produit");
      return;
    }

    setIsSaving(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discount_type: formData.discountType,
        discount_value: Number(formData.discountValue),
        start_date: new Date(formData.startDate).toISOString(),
        end_date: new Date(formData.endDate).toISOString(),
        applies_to: formData.appliesTo,
        category_id: formData.appliesTo === "specific_category" ? formData.categoryId : null,
        min_purchase_amount: formData.hasMinPurchase ? Number(formData.minPurchaseAmount) : 0,
        max_discount_amount: formData.hasMaxDiscount ? Number(formData.maxDiscountAmount) : null,
        is_active: formData.isActive,
      };

      // Ajouter les champs spécifiques selon le type
      if (formData.promotionType === "code") {
        payload.code = formData.code.trim().toUpperCase();
        payload.usage_limit = formData.hasUsageLimit ? Number(formData.usageLimit) : null;
        payload.usage_limit_per_customer = formData.hasUsageLimitPerCustomer ? Number(formData.usageLimitPerCustomer) : null;
      }

      // Ajouter les produits spécifiques
      if (formData.appliesTo === "specific_products") {
        payload.product_ids = formData.selectedProducts.map((p) => p.id);
      }

      // Déterminer l'endpoint selon le type
      const endpoint = formData.promotionType === "code"
        ? "/api/admin/promo-codes"
        : "/api/admin/promotions";

      const method = isEdit ? "PUT" : "POST";
      const url = isEdit && promotion ? `${endpoint}/${promotion.id}` : endpoint;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur lors de l'enregistrement");
      }

      toast.success(isEdit ? "Promotion mise à jour" : "Promotion créée");
      router.push("/admin/promotions");
      router.refresh();
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
        {/* Bandeau header */}
        <div className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-[#241B14] to-[#3a2d1f] px-6 pb-12 pt-6 lg:px-8">
          {/* Motif décoratif */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--gold)]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--gold)]" />
          </div>

          <div className="relative mx-auto max-w-3xl">
            <Link
              href="/admin/promotions"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#F4EFE6]/60 transition-colors hover:text-[#F4EFE6]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Retour aux promotions
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-[#F4EFE6] lg:text-3xl">
              {isEdit ? "Modifier la promotion" : "Nouvelle promotion"}
            </h1>
            {isEdit && promotion && (
              <p className="mt-2 text-sm text-[var(--gold)]">{promotion.name}</p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-3xl space-y-8 px-6 pb-28 pt-8 lg:px-8 lg:pb-12"
        >
          {/* ===== 1. Type de promotion ===== */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[var(--text-dark)]">Type de promotion</h2>
              <p className="mt-1 text-sm text-[var(--text-dark)]/60">
                Choisissez comment la promotion sera appliquée
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <RadioCard
                selected={formData.promotionType === "automatic"}
                onClick={() => setFormData({ ...formData, promotionType: "automatic" })}
                icon={<AutomaticIcon />}
                title="Promotion automatique"
                description="S'applique automatiquement aux produits éligibles"
              />
              <RadioCard
                selected={formData.promotionType === "code"}
                onClick={() => setFormData({ ...formData, promotionType: "code" })}
                icon={<CodeIcon />}
                title="Code promo"
                description="Le client doit saisir un code pour bénéficier de la réduction"
              />
            </div>

            {/* Champ code promo (conditionnel) */}
            {formData.promotionType === "code" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="rounded-3xl border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--ivory)] to-white p-6 shadow-sm">
                  <FieldLabel required>Code promo</FieldLabel>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, "") })
                    }
                    placeholder="Ex: BIENVENUE10"
                    className={inputClass}
                    required
                  />
                  <p className="mt-2 text-xs text-[var(--text-dark)]/50">
                    Lettres et chiffres uniquement, sans espaces
                  </p>
                </div>
              </div>
            )}
          </div>

          <SectionDivider title="Détails" />

          {/* ===== 2. Informations générales ===== */}
          <div className="space-y-5">
            <div>
              <FieldLabel required>Nom de la promotion</FieldLabel>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Soldes d'été"
                className={inputClass}
                required
              />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez cette promotion (optionnel)..."
                rows={3}
                className={textareaClass}
              />
            </div>
          </div>

          <SectionDivider title="Réduction" />

          {/* ===== 3. Type de réduction ===== */}
          <div className="space-y-5">
            <div>
              <FieldLabel required>Type de réduction</FieldLabel>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: "percentage" })}
                  className={`flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                    formData.discountType === "percentage"
                      ? "bg-[var(--text-dark)] text-white shadow-lg"
                      : "border-2 border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50"
                  }`}
                >
                  <span className="text-lg">%</span>
                  Pourcentage
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: "fixed_amount" })}
                  className={`flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition-all duration-300 ${
                    formData.discountType === "fixed_amount"
                      ? "bg-[var(--text-dark)] text-white shadow-lg"
                      : "border-2 border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50"
                  }`}
                >
                  <span className="text-lg">FCFA</span>
                  Montant fixe
                </button>
              </div>
            </div>

            <div>
              <FieldLabel required>
                {formData.discountType === "percentage" ? "Pourcentage" : "Montant (FCFA)"}
              </FieldLabel>
              <div className="relative">
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder={formData.discountType === "percentage" ? "Ex: 20" : "Ex: 5000"}
                  min="1"
                  className={inputClass}
                  required
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-dark)]/40">
                  {formData.discountType === "percentage" ? "%" : "FCFA"}
                </span>
              </div>
            </div>

            {/* Plafond (conditionnel pour percentage) */}
            {formData.discountType === "percentage" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-3">
                <ToggleSwitch
                  checked={formData.hasMaxDiscount}
                  onChange={(checked) => setFormData({ ...formData, hasMaxDiscount: checked })}
                  label="Définir un plafond de réduction"
                />
                {formData.hasMaxDiscount && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      placeholder="Montant maximum en FCFA"
                      min="1"
                      className={inputClass}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <SectionDivider title="Portée" />

          {/* ===== 4. Application ===== */}
          <div className="space-y-5">
            <div>
              <FieldLabel required>S'applique à</FieldLabel>
              <select
                value={formData.appliesTo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appliesTo: e.target.value as "all_products" | "specific_category" | "specific_products",
                  })
                }
                className={selectClass}
              >
                <option value="all_products">Tous les produits</option>
                <option value="specific_category">Catégorie spécifique</option>
                <option value="specific_products">Produits spécifiques</option>
              </select>
            </div>

            {/* Sélecteur de catégorie (conditionnel) */}
            {formData.appliesTo === "specific_category" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <FieldLabel required>Catégorie</FieldLabel>
                {isLoadingCategories ? (
                  <div className="text-sm text-[var(--text-dark)]/50">Chargement...</div>
                ) : (
                  <div className="flex flex-wrap gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, categoryId: cat.id })}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                          formData.categoryId === cat.id
                            ? "bg-[var(--text-dark)] text-white shadow-md"
                            : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sélecteur de produits (conditionnel) */}
            {formData.appliesTo === "specific_products" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <FieldLabel required>Produits</FieldLabel>
                <ProductSelector
                  selectedProducts={formData.selectedProducts}
                  onProductsChange={(products) => setFormData({ ...formData, selectedProducts: products })}
                />
              </div>
            )}
          </div>

          <SectionDivider title="Conditions" />

          {/* ===== 5. Conditions ===== */}
          <div className="space-y-5">
            {/* Montant minimum */}
            <div className="space-y-3">
              <ToggleSwitch
                checked={formData.hasMinPurchase}
                onChange={(checked) => setFormData({ ...formData, hasMinPurchase: checked })}
                label="Montant minimum d'achat"
              />
              {formData.hasMinPurchase && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                  <input
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                    placeholder="Montant en FCFA"
                    min="0"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {/* Limites d'utilisation (codes promo uniquement) */}
            {formData.promotionType === "code" && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-5 rounded-3xl border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--ivory)] to-white p-6">
                <h3 className="text-sm font-bold text-[var(--text-dark)]">Limites d'utilisation</h3>

                <div className="space-y-3">
                  <ToggleSwitch
                    checked={formData.hasUsageLimit}
                    onChange={(checked) => setFormData({ ...formData, hasUsageLimit: checked })}
                    label="Nombre d'utilisations maximum (global)"
                  />
                  {formData.hasUsageLimit && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        type="number"
                        value={formData.usageLimit}
                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                        placeholder="Ex: 100"
                        min="1"
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <ToggleSwitch
                    checked={formData.hasUsageLimitPerCustomer}
                    onChange={(checked) => setFormData({ ...formData, hasUsageLimitPerCustomer: checked })}
                    label="Limite par client"
                  />
                  {formData.hasUsageLimitPerCustomer && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        type="number"
                        value={formData.usageLimitPerCustomer}
                        onChange={(e) => setFormData({ ...formData, usageLimitPerCustomer: e.target.value })}
                        placeholder="Ex: 1"
                        min="1"
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel required>Date de début</FieldLabel>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={dateInputClass}
                    required
                  />
                </div>
              </div>
              <div>
                <FieldLabel required>Date de fin</FieldLabel>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className={dateInputClass}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <SectionDivider title="Activation" />

          {/* ===== 6. Activation ===== */}
          <div className="rounded-3xl border border-[var(--gold)]/20 bg-gradient-to-br from-[var(--ivory)] to-white p-6">
            <ToggleSwitch
              checked={formData.isActive}
              onChange={(checked) => setFormData({ ...formData, isActive: checked })}
              label="Activer immédiatement cette promotion"
            />
          </div>

          {/* ===== Actions ===== */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <Link
              href="/admin/promotions"
              className="flex-1 rounded-full border-2 border-[var(--gold)]/25 bg-white px-6 py-4 text-center text-sm font-semibold text-[var(--text-dark)] transition-all hover:border-[var(--gold)]/50 hover:bg-[var(--ivory)]"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-full bg-gradient-to-r from-[var(--gold)] to-[#d4af37] px-6 py-4 text-center text-sm font-bold text-[#241B14] shadow-lg transition-all hover:shadow-xl hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#241B14] border-t-transparent" />
                  {isEdit ? "Mise à jour..." : "Création..."}
                </span>
              ) : (
                <span>{isEdit ? "Mettre à jour la promotion" : "Créer la promotion"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
      <Dialog />
    </>
  );
}
