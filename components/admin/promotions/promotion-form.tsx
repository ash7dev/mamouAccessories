"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

/* ============================================================
   Formulaire promotion : création de promotions automatiques
   ============================================================ */

interface Category {
  id: string;
  name: string;
}

interface Promotion {
  id: string;
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
  is_active: boolean;
}

interface PromotionFormProps {
  promotion?: Promotion;
}

/* ---------- Petits composants de structure ---------- */

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/20 [&>svg]:h-6 [&>svg]:w-6">
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

const textareaClass =
  "w-full resize-none rounded-3xl border border-[var(--gold)]/25 bg-white px-5 py-4 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 transition-colors focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-medium text-[var(--text-dark)]">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function Checkbox({ checked, onChange, children, className = "" }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-6 h-6 rounded-full border-2 transition-all ${
          checked 
            ? "bg-[var(--text-dark)] border-[var(--text-dark)]" 
            : "border-[var(--gold)]/30 bg-white group-hover:border-[var(--gold)]/60"
        }`}>
          {checked && (
            <svg className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm text-[var(--text-dark)]">{children}</span>
    </label>
  );
}

/* ---------- Calendrier moderne (date + heure) ---------- */

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];
const MOIS_COURT = [
  "jan.", "févr.", "mars", "avr.", "mai", "juin",
  "juill.", "août", "sept.", "oct.", "nov.", "déc.",
];
const JOURS_COURT = ["L", "M", "M", "J", "V", "S", "D"];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

// value <-> "YYYY-MM-DDTHH:mm" (heure locale, comme un input datetime-local)
function parseLocalValue(value: string): { date: Date | null; time: string } {
  if (!value) return { date: null, time: "09:00" };
  const [datePart, timePart] = value.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  return {
    date: new Date(y, (m || 1) - 1, d || 1),
    time: timePart ?? "09:00",
  };
}

function toLocalValue(date: Date, time: string): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${time}`;
}

function isSameDay(a: Date | null, b: Date) {
  if (!a) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildMonthGrid(viewYear: number, viewMonth: number): Date[] {
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  // Lundi = 0 ... Dimanche = 6
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(viewYear, viewMonth, 1 - firstWeekday);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function CalendarIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronIcon({ direction, className = "w-4 h-4" }: { direction: "left" | "right"; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={direction === "left" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"}
      />
    </svg>
  );
}

function DatePicker({
  value,
  onChange,
  label,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
}) {
  const { date: initialDate, time: initialTime } = parseLocalValue(value);
  const today = new Date();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const [timeValue, setTimeValue] = useState(initialTime);
  const [viewYear, setViewYear] = useState((initialDate ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((initialDate ?? today).getMonth());

  const containerRef = useRef<HTMLDivElement>(null);

  // Resynchronise l'affichage si la valeur change depuis l'extérieur
  useEffect(() => {
    const { date, time } = parseLocalValue(value);
    setSelectedDate(date);
    setTimeValue(time);
    if (date) {
      setViewYear(date.getFullYear());
      setViewMonth(date.getMonth());
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const grid = buildMonthGrid(viewYear, viewMonth);

  function goToPrevMonth() {
    const d = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function goToNextMonth() {
    const d = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function handleSelectDay(day: Date) {
    setSelectedDate(day);
    onChange(toLocalValue(day, timeValue));
  }

  function handleTimeChange(newTime: string) {
    setTimeValue(newTime);
    if (selectedDate) {
      onChange(toLocalValue(selectedDate, newTime));
    }
  }

  const displayLabel = selectedDate
    ? `${selectedDate.getDate()} ${MOIS_COURT[selectedDate.getMonth()]} ${selectedDate.getFullYear()} · ${timeValue}`
    : "Sélectionner une date";

  return (
    <div ref={containerRef} className="relative">
      <FieldLabel required={required}>{label}</FieldLabel>

      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={`${inputClass} flex items-center justify-between gap-3 text-left ${
          !selectedDate ? "text-[var(--text-dark)]/35" : ""
        }`}
      >
        <span>{displayLabel}</span>
        <CalendarIcon className="h-5 w-5 shrink-0 text-[var(--gold-dark)]" />
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-3 w-[320px] max-w-[90vw] rounded-3xl border border-[var(--gold)]/20 bg-white p-5 shadow-[0_16px_40px_-12px_rgba(43,33,24,0.28)]">
          {/* En-tête mois / année */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dark)]/60 transition-colors hover:bg-[var(--ivory)] hover:text-[var(--text-dark)]"
              aria-label="Mois précédent"
            >
              <ChevronIcon direction="left" />
            </button>
            <span className="text-sm font-bold capitalize tracking-wide text-[var(--text-dark)]">
              {MOIS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-dark)]/60 transition-colors hover:bg-[var(--ivory)] hover:text-[var(--text-dark)]"
              aria-label="Mois suivant"
            >
              <ChevronIcon direction="right" />
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {JOURS_COURT.map((j, i) => (
              <div
                key={i}
                className="flex h-7 items-center justify-center text-[11px] font-semibold uppercase text-[var(--text-dark)]/35"
              >
                {j}
              </div>
            ))}
          </div>

          {/* Grille des jours */}
          <div className="grid grid-cols-7 gap-1">
            {grid.map((day, i) => {
              const inMonth = day.getMonth() === viewMonth;
              const selected = isSameDay(selectedDate, day);
              const isToday = isSameDay(today, day);

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all ${
                    selected
                      ? "bg-[var(--text-dark)] font-bold text-white shadow-md"
                      : inMonth
                      ? "text-[var(--text-dark)] hover:bg-[var(--ivory)]"
                      : "text-[var(--text-dark)]/25 hover:bg-[var(--ivory)]/60"
                  }`}
                >
                  {day.getDate()}
                  {isToday && !selected && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--gold-dark)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Sélecteur d'heure */}
          <div className="mt-4 flex items-center gap-3 rounded-full border border-[var(--gold)]/20 bg-[var(--ivory)] px-4 py-2.5">
            <ClockIcon className="h-4 w-4 shrink-0 text-[var(--gold-dark)]" />
            <input
              type="time"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-[var(--text-dark)] focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-90"
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                handleSelectDay(today);
              }}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--gold-dark)] transition-colors hover:bg-[var(--ivory)]"
            >
              Aujourd'hui
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[var(--text-dark)] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[var(--text-dark)]/90"
            >
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Icônes (sections du formulaire) ---------- */

function InfoIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M12 10h.01M12 14h.01" />
    </svg>
  );
}

function CalendarSectionIcon() {
  return (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
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

export function PromotionForm({ promotion }: PromotionFormProps) {
  const isEdit = Boolean(promotion);
  const router = useRouter();
  const { confirm, Dialog } = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    name: promotion?.name ?? "",
    description: promotion?.description ?? "",
    discountType: promotion?.discount_type ?? "percentage",
    discountValue: promotion?.discount_value?.toString() ?? "",
    startDate: promotion?.start_date ? new Date(promotion.start_date).toISOString().slice(0, 16) : "",
    endDate: promotion?.end_date ? new Date(promotion.end_date).toISOString().slice(0, 16) : "",
    appliesTo: promotion?.applies_to ?? "all_products",
    categoryId: promotion?.category_id ?? "",
    minPurchaseAmount: promotion?.min_purchase_amount?.toString() ?? "0",
    maxDiscountAmount: promotion?.max_discount_amount?.toString() ?? "",
    isActive: promotion?.is_active ?? true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Le nom de la promotion est obligatoire");
      return;
    }

    if (!formData.discountValue) {
      toast.error("La valeur de la réduction est obligatoire");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Les dates de début et de fin sont obligatoires");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    if (formData.appliesTo === 'specific_category' && !formData.categoryId) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        discount_type: formData.discountType,
        discount_value: Number(formData.discountValue),
        start_date: new Date(formData.startDate).toISOString(),
        end_date: new Date(formData.endDate).toISOString(),
        applies_to: formData.appliesTo,
        category_id: formData.appliesTo === 'specific_category' ? formData.categoryId : null,
        min_purchase_amount: Number(formData.minPurchaseAmount) || 0,
        max_discount_amount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        is_active: formData.isActive,
      };

      if (isEdit && promotion) {
        const response = await fetch(`/api/admin/promotions/${promotion.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la mise à jour de la promotion');
        }
        toast.success("Promotion mise à jour avec succès");
      } else {
        const response = await fetch('/api/admin/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Erreur lors de la création de la promotion');
        }
        toast.success("Promotion créée avec succès");
      }

      router.push('/admin/promotions');
      router.refresh();
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement de la promotion');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!promotion) return;
    
    const confirmed = await confirm({
      title: "Supprimer cette promotion ?",
      description: "Cette action est irréversible.",
      confirmLabel: "Supprimer",
      cancelLabel: "Annuler",
      isDestructive: true,
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(`/api/admin/promotions/${promotion.id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la suppression de la promotion');
          }

          toast.success("Promotion supprimée avec succès");
          router.push('/admin/promotions');
          router.refresh();
        } catch (error) {
          console.error('Error deleting promotion:', error);
          toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression de la promotion');
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  return (
    <>
      <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
        {/* ===== Bandeau sombre avec fil d'ariane ===== */}
        <div className="rounded-b-3xl bg-[#241B14] px-6 pb-8 pt-6 lg:px-8">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-3 gap-y-1">
            <Link
              href="/admin/promotions"
              className="flex items-center gap-1.5 text-sm font-medium text-[#F4EFE6]/60 transition-colors hover:text-[#F4EFE6]"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Promotions
            </Link>
            <h1 className="text-lg font-bold text-[#F4EFE6] lg:text-xl">
              {isEdit ? "Modifier la promotion" : "Nouvelle promotion"}
            </h1>
            {isEdit && promotion && (
              <span className="w-full truncate text-sm text-[var(--gold)] lg:w-auto">
                {promotion.name}
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
          title="Informations de la promotion"
          subtitle="Détails de base"
        >
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
                placeholder="Décrivez cette promotion..."
                rows={3}
                className={textareaClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* ===== 2. Réduction ===== */}
        <SectionCard
          icon={<PercentIcon />}
          title="Réduction"
          subtitle="Type et valeur"
        >
          <div className="space-y-5">
            <div>
              <FieldLabel required>Type de réduction</FieldLabel>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: "percentage" })}
                  className={`flex-1 rounded-full px-5 py-3.5 text-sm font-medium transition-all ${
                    formData.discountType === "percentage"
                      ? "bg-[var(--text-dark)] text-white shadow-md"
                      : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
                  }`}
                >
                  Pourcentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, discountType: "fixed_amount" })}
                  className={`flex-1 rounded-full px-5 py-3.5 text-sm font-medium transition-all ${
                    formData.discountType === "fixed_amount"
                      ? "bg-[var(--text-dark)] text-white shadow-md"
                      : "border border-[var(--gold)]/25 bg-white text-[var(--text-dark)]/70 hover:border-[var(--gold)]/50 hover:text-[var(--text-dark)]"
                  }`}
                >
                  Montant fixe (FCFA)
                </button>
              </div>
            </div>

            <div>
              <FieldLabel required>
                {formData.discountType === "percentage" ? "Pourcentage de réduction" : "Montant de réduction (FCFA)"}
              </FieldLabel>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                placeholder={formData.discountType === "percentage" ? "Ex: 20" : "Ex: 5000"}
                min="1"
                className={inputClass}
                required
              />
              {formData.discountType === "percentage" && (
                <p className="mt-2 text-xs text-[var(--text-dark)]/50">Entre 1 et 100%</p>
              )}
            </div>

            <div>
              <FieldLabel>Plafond de réduction (FCFA)</FieldLabel>
              <input
                type="number"
                value={formData.maxDiscountAmount}
                onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                placeholder="Ex: 10000 (optionnel)"
                min="1"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-[var(--text-dark)]/50">Utile uniquement pour les réductions en pourcentage</p>
            </div>
          </div>
        </SectionCard>

        {/* ===== 3. Période de validité ===== */}
        <SectionCard
          icon={<CalendarSectionIcon />}
          title="Période de validité"
          subtitle="Dates de début et de fin"
        >
          <div className="space-y-5">
            <DatePicker
              value={formData.startDate}
              onChange={(value) => setFormData({ ...formData, startDate: value })}
              label="Date de début"
              required
            />

            <DatePicker
              value={formData.endDate}
              onChange={(value) => setFormData({ ...formData, endDate: value })}
              label="Date de fin"
              required
            />
          </div>
        </SectionCard>

        {/* ===== 4. Application ===== */}
        <SectionCard
          icon={<InfoIcon />}
          title="Application"
          subtitle="Produits concernés"
        >
          <div className="space-y-5">
            <div>
              <FieldLabel required>Portée de la promotion</FieldLabel>
              <div className="space-y-3">
                <Checkbox
                  checked={formData.appliesTo === "all_products"}
                  onChange={(checked) => checked && setFormData({ ...formData, appliesTo: "all_products" })}
                >
                  Tous les produits
                </Checkbox>
                <Checkbox
                  checked={formData.appliesTo === "specific_category"}
                  onChange={(checked) => checked && setFormData({ ...formData, appliesTo: "specific_category" })}
                >
                  Catégorie spécifique
                </Checkbox>
              </div>
            </div>

            {formData.appliesTo === "specific_category" && (
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
            )}

            <div>
              <FieldLabel>Montant minimum d'achat (FCFA)</FieldLabel>
              <input
                type="number"
                value={formData.minPurchaseAmount}
                onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                placeholder="Ex: 5000 (optionnel)"
                min="0"
                className={inputClass}
              />
            </div>
          </div>
        </SectionCard>

        {/* ===== 5. État ===== */}
        <SectionCard
          icon={<InfoIcon />}
          title="État"
          subtitle="Activation"
        >
          <Checkbox
            checked={formData.isActive}
            onChange={(checked) => setFormData({ ...formData, isActive: checked })}
          >
            Promotion active
          </Checkbox>
        </SectionCard>

        {/* ===== Actions ===== */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/promotions"
            className="flex-1 rounded-full border border-[var(--gold)]/25 bg-white px-6 py-3.5 text-center text-sm font-medium text-[var(--text-dark)] transition-colors hover:border-[var(--gold)]/50 hover:bg-[var(--ivory)]"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 rounded-full bg-[var(--text-dark)] px-6 py-3.5 text-center text-sm font-medium text-white shadow-lg transition-all hover:bg-[var(--text-dark)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (isEdit ? "Mise à jour..." : "Création...") : (isEdit ? "Mettre à jour" : "Créer la promotion")}
          </button>
        </div>
      </form>
      </div>
      <Dialog />
    </>
  );
}