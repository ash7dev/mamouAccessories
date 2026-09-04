/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronLeft,
  Lock,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  ChevronDown,
} from "lucide-react";

/* ============================================================
   Checkout Haute Joaillerie — /commande
   ============================================================ */

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

export interface DeliveryZoneOption {
  id: string;
  name: string;
  subtext: string;
  fee: number;
}

export const DELIVERY_ZONES: DeliveryZoneOption[] = [
  {
    id: "zone-1",
    name: "Zone 1 - Dakar (2 000 Fcfa)",
    subtext: "Plateau, Fann, Point E, Mermoz, Sacré-Cœur, Liberté, Ouakam, Ngor, Almadies, Yoff, Les Mamelles",
    fee: 2000,
  },
  {
    id: "zone-2",
    name: "Zone 2 - Pikine Guediawaye (2 500 Fcfa)",
    subtext: "Pikine, Guédiawaye, Parcelles Assainies, Grand Yoff, Cambérène",
    fee: 2500,
  },
  {
    id: "zone-3",
    name: "Zone 3 - Thiaroye Yeumbeul - Mbao - Keur Massar - Keur Mbaye Fall (3 500 Fcfa)",
    subtext: "Thiaroye, Yeumbeul, Mbao, Keur Massar, Keur Mbaye Fall, Fas Mbao",
    fee: 3500,
  },
  {
    id: "zone-4",
    name: "Zone 4 : Rufisque - Malika - Tivaouane Peulh (3 500 Fcfa)",
    subtext: "Rufisque, Malika, Tivaouane Peulh, Bargny, Diamniadio, Sangalkam",
    fee: 3500,
  },
  {
    id: "zone-5",
    name: "Zone 5 : Regions (3 500 Fcfa)",
    subtext: "Thiès, Mbour, Saly, Saint-Louis, Kaolack, Touba, Ziguinchor, Diourbel, etc.",
    fee: 3500,
  },
];

interface CheckoutProps {
  /** Produits du panier résolus côté serveur */
  cartProducts: CartProduct[];
  /** Frais de livraison depuis les paramètres */
  deliveryFeeDakar?: number;
  deliveryFeeRegions?: number;
}

type PaymentMethod = "wave" | "cash_on_delivery";
type DeliveryZone = "dakar" | "regions";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* Validation téléphone sénégalais : 7X XXX XX XX (9 chiffres, commence par 7) */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  let local = digits;
  if (local.startsWith("221")) local = local.slice(3);
  if (local.length === 9 && local.startsWith("7")) return `+221${local}`;
  return null;
}

const inputClass =
  "w-full rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-[var(--porcelaine,#F1ECE3)]/40 px-4 py-3.5 text-sm text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20 transition-all font-sans";

export function Checkout({
  cartProducts,
  deliveryFeeDakar = 1500,
  deliveryFeeRegions = 3000,
}: CheckoutProps) {
  const router = useRouter();
  const { items, clear } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("wave"); // Wave par défaut
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone-1");
  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedZone = useMemo(() => {
    return DELIVERY_ZONES.find((z) => z.id === selectedZoneId) || DELIVERY_ZONES[0];
  }, [selectedZoneId]);

  // Fusion panier × produits résolus
  const lines = useMemo(() => {
    return items
      .map((it) => {
        const p = cartProducts.find((cp) => cp.id === it.productId && cp.isActive);
        if (!p) return null;
        const quantity = Math.min(it.quantity, p.stock || 99);
        return { ...p, quantity, lineTotal: quantity * p.price, requested: it.quantity };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null && l.quantity > 0);
  }, [items, cartProducts]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const deliveryFee = selectedZone.fee;
  const total = subtotal + deliveryFee;

  const hasAdjustments = lines.some((l) => l.quantity < l.requested);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Votre nom complet est requis";
    if (!normalizePhone(form.phone)) e.phone = "Numéro invalide (ex : 77 123 45 67)";
    if (!form.address.trim()) e.address = "L'adresse de livraison est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (lines.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const phone = normalizePhone(form.phone)!;
      const fullAddress = `[${selectedZone.name}] ${form.address.trim()}`;

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name.trim(),
          customer_phone: phone,
          customer_email: form.email.trim() || undefined,
          delivery_address: fullAddress,
          delivery_note: form.note.trim() || undefined,
          delivery_fee: deliveryFee,
          payment_method: payment,
          items: lines.map(l => ({
            product_id: l.id,
            quantity: l.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la commande');
      }

      const { order } = await response.json();

      clear();

      if (payment === "wave") {
        const waveUrl = `https://pay.wave.com/m/M_sn_wi1Bfmu7HgWY/c/sn/?amount=${total}`;
        // 1. Rediriger vers la page de confirmation en arrière-plan
        router.push(`/commande/confirmation/${order.order_number}`);
        // 2. Déclencher immédiatement l'ouverture de l'application Wave
        setTimeout(() => {
          window.location.href = waveUrl;
        }, 300);
      } else {
        router.push(`/commande/confirmation/${order.order_number}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : "Une erreur est survenue. Réessayez."
      });
      setSubmitting(false);
    }
  };

  /* ----- Panier vide ----- */
  if (items.length === 0 || lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-28 text-center font-sans">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton,#B9793E)]/25 shadow-inner">
          <ShoppingBag className="h-10 w-10 stroke-[1.25]" />
        </div>
        <h1 className="font-serif mb-2 text-2xl sm:text-3xl font-medium text-[var(--obsidienne,#0E0B09)]">
          Votre panier est vide
        </h1>
        <p className="mb-8 text-xs sm:text-sm text-[var(--obsidienne,#0E0B09)]/60 leading-relaxed">
          Sélectionnez vos bijoux avant de finaliser votre commande.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--obsidienne,#0E0B09)] px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-lg transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-95"
        >
          <span>Découvrir la Boutique</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F1ECE3)]/40 text-[var(--obsidienne,#0E0B09)] font-sans pb-36 pt-24 lg:pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/panier"
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-[var(--laiton,#B9793E)] hover:underline uppercase tracking-wider mb-3"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Retour au panier</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--laiton,#B9793E)]/20 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--laiton,#B9793E)]/30 bg-white px-3.5 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] shadow-2xs mb-2">
                <Sparkles className="h-3 w-3" />
                Commande Sécurisée
              </div>
              <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-[var(--obsidienne,#0E0B09)]">
                Finaliser Votre Commande
              </h1>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 text-xs font-sans font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px]">✓</span>
              <span className="text-neutral-500">Panier</span>
              <ChevronLeft className="h-3 w-3 rotate-180 text-neutral-400" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] text-[10px] font-bold">2</span>
              <span className="text-[var(--obsidienne,#0E0B09)] font-bold">Commande</span>
              <ChevronLeft className="h-3 w-3 rotate-180 text-neutral-400" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 text-[10px]">3</span>
              <span className="text-neutral-400">Paiement</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* ===================== COLONNE FORMULAIRE (7 COLS) ===================== */}
          <div className="lg:col-span-7 space-y-6">
            {/* Coordonnées Client */}
            <section className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
                  1. Vos Coordonnées
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-1.5">
                    Nom complet <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Marie Sarr"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                  {errors.name && <p className="mt-1 pl-1 text-xs text-rose-600 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-1.5">
                    Téléphone WhatsApp <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="ex : 77 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                  {errors.phone ? (
                    <p className="mt-1 pl-1 text-xs text-rose-600 font-semibold">{errors.phone}</p>
                  ) : (
                    <p className="mt-1 pl-1 text-[11px] text-[var(--obsidienne,#0E0B09)]/50">
                      Ce numéro servira à vous contacter sur WhatsApp pour la livraison.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-1.5">
                    Adresse e-mail <span className="text-neutral-400 font-normal">(Optionnel)</span>
                  </label>
                  <input
                    type="email"
                    placeholder="ex : marie.sarr@gmail.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Mode de Livraison */}
            <section className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2 mb-5">
                <Truck className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
                  2. Zone & Adresse de Livraison
                </h2>
              </div>

              {/* Sélection Zone - Liste Fond Blanc Premium (Sans Select Natif) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-2.5">
                    Sélectionner votre zone de livraison <span className="text-rose-600">*</span>
                  </label>

                  {/* Liste Visuelle des Items sur Fond Blanc (Cards Premium) */}
                  <div className="space-y-2.5">
                    {DELIVERY_ZONES.map((z) => {
                      const isSelected = z.id === selectedZoneId;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => setSelectedZoneId(z.id)}
                          className={`w-full flex items-start justify-between gap-3 rounded-2xl border-2 bg-white p-3.5 text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "border-[var(--laiton,#B9793E)] shadow-md ring-2 ring-[var(--laiton,#B9793E)]/20"
                              : "border-neutral-200/80 hover:border-[var(--laiton,#B9793E)]/40 hover:bg-neutral-50/50"
                          }`}
                        >
                          <div className="flex items-start gap-3 min-w-0 flex-1">
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                              isSelected
                                ? "border-[var(--laiton,#B9793E)] bg-[var(--laiton,#B9793E)] text-white"
                                : "border-neutral-300 bg-white"
                            }`}>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white fill-[var(--laiton,#B9793E)]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-bold text-[var(--obsidienne,#0E0B09)]">
                                {z.name}
                              </span>
                              <span className="mt-1 block text-[11px] text-neutral-500 leading-relaxed">
                                {z.subtext}
                              </span>
                            </div>
                          </div>

                          <span className="shrink-0 font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] bg-neutral-100 px-2.5 py-1 rounded-xl border border-neutral-200/60 tabular-nums">
                            {formatFCFA(z.fee)} F
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-1.5">
                    Adresse exacte de livraison <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    placeholder="Quartier, rue, villa, point de repère précis..."
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.address && (
                    <p className="mt-1 pl-1 text-xs text-rose-600 font-semibold">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--obsidienne,#0E0B09)] mb-1.5">
                    Instructions particulières <span className="text-neutral-400 font-normal">(Optionnel)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex : Appeler à l'arrivée, livrer au bureau..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Mode de Paiement */}
            <section className="rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 sm:p-7 shadow-2xs">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-4 w-4 text-[var(--laiton,#B9793E)]" />
                <h2 className="text-xs font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
                  3. Mode de Paiement
                </h2>
              </div>

              <div className="space-y-3.5">
                {/* WAVE (Avec logo wavelogo.jpeg) */}
                <button
                  type="button"
                  onClick={() => setPayment("wave")}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    payment === "wave"
                      ? "border-[var(--laiton,#B9793E)] bg-gradient-to-r from-sky-50/50 via-white to-white shadow-md ring-1 ring-[var(--laiton,#B9793E)]/30"
                      : "border-[var(--laiton,#B9793E)]/15 hover:border-[var(--laiton,#B9793E)]/40 bg-white"
                  }`}
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-sky-200 bg-white p-1 shadow-sm flex items-center justify-center">
                    <img
                      src="/wavelogo.jpeg"
                      alt="Wave Sénégal"
                      className="h-full w-full object-contain rounded-xl"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">
                        Payer avec Wave
                      </span>
                      <span className="rounded-full bg-sky-500/10 border border-sky-500/30 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                        Recommandé · Instantané
                      </span>
                    </div>
                    <span className="mt-1 block text-xs text-[var(--obsidienne,#0E0B09)]/60 leading-relaxed">
                      Validation rapide par transfert Wave. Vous recevrez le lien de paiement juste après la confirmation.
                    </span>
                  </div>

                  {payment === "wave" && (
                    <CheckCircle2 className="h-6 w-6 text-[var(--laiton,#B9793E)] shrink-0" />
                  )}
                </button>

                {/* ESPÈCES À LA LIVRAISON */}
                <button
                  type="button"
                  onClick={() => setPayment("cash_on_delivery")}
                  className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                    payment === "cash_on_delivery"
                      ? "border-[var(--laiton,#B9793E)] bg-[var(--porcelaine,#F1ECE3)]/60 shadow-md ring-1 ring-[var(--laiton,#B9793E)]/30"
                      : "border-[var(--laiton,#B9793E)]/15 hover:border-[var(--laiton,#B9793E)]/40 bg-white"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--laiton,#B9793E)]/30 bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] shadow-sm">
                    <Truck className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-bold text-[var(--obsidienne,#0E0B09)]">
                      Paiement à la Livraison (Espèces)
                    </span>
                    <span className="mt-1 block text-xs text-[var(--obsidienne,#0E0B09)]/60 leading-relaxed">
                      Vous réglez en espèces directement au livreur lors de la remise de votre bijou.
                    </span>
                  </div>

                  {payment === "cash_on_delivery" && (
                    <CheckCircle2 className="h-6 w-6 text-[var(--laiton,#B9793E)] shrink-0" />
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* ===================== COLONNE RÉCAPITULATIF (5 COLS) ===================== */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <section className="rounded-3xl border border-[var(--laiton,#B9793E)]/30 bg-white p-6 sm:p-7 shadow-lg space-y-5">
              <h2 className="font-serif text-xl font-semibold text-[var(--obsidienne,#0E0B09)] border-b border-[var(--laiton,#B9793E)]/20 pb-4">
                Vos Articles ({lines.reduce((s, l) => s + l.quantity, 0)})
              </h2>

              {/* Lignes de produits */}
              <div className="divide-y divide-[var(--laiton,#B9793E)]/15 max-h-72 overflow-y-auto pr-1 scrollbar-none">
                {lines.map((l) => {
                  const imageUrl = resolveProductImageUrl(l.imageUrl);
                  return (
                    <div key={l.id} className="flex items-center gap-3.5 py-3.5 first:pt-0">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/20">
                        {imageUrl ? (
                          <img src={imageUrl} alt={l.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-lg text-[var(--laiton,#B9793E)]">💎</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[var(--obsidienne,#0E0B09)]">{l.name}</p>
                        <p className="text-[11px] font-mono text-[var(--obsidienne,#0E0B09)]/60 tabular-nums mt-0.5">
                          {l.quantity} × {formatFCFA(l.price)} FCFA
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums shrink-0">
                        {formatFCFA(l.lineTotal)} <span className="text-[9px] font-sans font-normal opacity-60">FCFA</span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {hasAdjustments && (
                <p className="rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800 border border-amber-200 font-sans">
                  Certaines quantités ont été adaptées au stock disponible.
                </p>
              )}

              {/* Totaux financier */}
              <div className="space-y-2.5 pt-4 border-t border-[var(--laiton,#B9793E)]/20 text-xs font-sans">
                <div className="flex justify-between text-[var(--obsidienne,#0E0B09)]/70">
                  <span>Sous-total articles</span>
                  <span className="font-mono font-medium tabular-nums">{formatFCFA(subtotal)} FCFA</span>
                </div>
                <div className="flex justify-between text-[var(--obsidienne,#0E0B09)]/70">
                  <span>Frais de livraison ({selectedZone.name.split('(')[0].replace(/^Zone \d+ - /, '').trim()})</span>
                  <span className="font-mono font-medium tabular-nums text-[var(--laiton,#B9793E)]">{formatFCFA(deliveryFee)} FCFA</span>
                </div>
                <div className="flex items-baseline justify-between pt-3 border-t border-[var(--laiton,#B9793E)]/25">
                  <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">Total à régler</span>
                  <span className="font-mono text-2xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] tabular-nums">
                    {formatFCFA(total)} <span className="text-xs font-sans font-normal opacity-60">FCFA</span>
                  </span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {errors.submit}
                </p>
              )}

              {/* Bouton Desktop */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="hidden lg:flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--obsidienne,#0E0B09)] py-4 text-xs font-bold uppercase tracking-wider text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] shadow-xl transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-[0.98] disabled:opacity-50"
              >
                {submitting ? (
                  "Traitement en cours..."
                ) : (
                  <>
                    <span>{payment === "wave" ? "Valider & Payer sur Wave" : "Confirmer la Commande"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Reassurance Footer */}
              <div className="pt-4 border-t border-[var(--laiton,#B9793E)]/15 space-y-2 text-[11px] text-[var(--obsidienne,#0E0B09)]/70">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[var(--laiton,#B9793E)] shrink-0" />
                  <span>Paiement sécurisé par Wave & Espèces</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-[var(--laiton,#B9793E)] shrink-0" />
                  <span>Confirmation instantanée sur WhatsApp</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ===================== FLOATING MOBILE STICKY BUTTON ===================== */}
      <div className="lg:hidden fixed bottom-4 inset-x-3 z-50 rounded-[2rem] border border-[var(--laiton,#B9793E)]/40 bg-[var(--obsidienne,#0E0B09)]/95 backdrop-blur-2xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] py-3.5 text-xs font-extrabold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
        >
          {submitting ? (
            "Traitement en cours..."
          ) : (
            <>
              <span>{payment === "wave" ? `Commander & Payer Wave` : `Confirmer Commande`}</span>
              <span className="font-mono text-xs text-[var(--obsidienne,#0E0B09)] opacity-90">({formatFCFA(total)} F)</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}