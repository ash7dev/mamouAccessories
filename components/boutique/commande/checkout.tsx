/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

/* ============================================================
   Checkout — /commande

   Étape 2 du tunnel : panier → COMMANDE → confirmation.

   À la validation, on crée la commande (status=pending,
   payment_status=unpaid) via une Server Action, puis on
   REDIRIGE vers /commande/confirmation/[orderNumber] où se
   fait le paiement Wave (lien + upload preuve) ou le message
   "nous vous appelons" pour le paiement à la livraison.

   Le panier (ids + quantités) vient de useCart(). Les produits
   correspondants (prix, stock, nom, image) doivent être passés
   en prop `cartProducts` — résolus côté serveur au chargement
   de la page pour garantir des prix à jour.
   ============================================================ */

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
}

interface CheckoutProps {
  /** Produits du panier résolus côté serveur (prix/stock frais) */
  cartProducts: CartProduct[];
  /** Frais de livraison depuis la table settings */
  deliveryFeeDakar?: number;
  deliveryFeeRegions?: number;
}

type PaymentMethod = "wave" | "cash_on_delivery";
type DeliveryZone = "dakar" | "regions";

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/* Validation téléphone sénégalais : 7X XXX XX XX (9 chiffres, commence par 7) */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, "");
  // accepte 77xxxxxxx (9), 221xxxxxxxxx (12), +221...
  let local = digits;
  if (local.startsWith("221")) local = local.slice(3);
  if (local.length === 9 && local.startsWith("7")) return `+221${local}`;
  return null;
}

/* ---------- Icônes ---------- */

function WaveMarkIcon({ className = "w-6 h-6" }: { className?: string }) {
  // Pastille stylisée (pas le logo officiel Wave)
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="7" fill="currentColor" />
      <path d="M5 14c1.5 0 1.5-3 3-3s1.5 3 3 3 1.5-3 3-3 1.5 3 3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TruckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-5.25m0 0V6.75a1.5 1.5 0 011.5-1.5h3.75m0 0V4.5A1.5 1.5 0 0016.5 3h-9a1.5 1.5 0 00-1.5 1.5v9.75" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-2xl border border-[var(--gold)]/25 bg-white px-4 py-3.5 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/35 focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25 transition-colors";

/* ---------- Composant ---------- */

export function Checkout({
  cartProducts,
  deliveryFeeDakar = 1500,
  deliveryFeeRegions = 3000,
}: CheckoutProps) {
  const router = useRouter();
  const { items, setQuantity, clear } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("wave"); // Wave par défaut
  const [zone, setZone] = useState<DeliveryZone>("dakar");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Fusion panier (ids+qty) × produits résolus. On ignore les produits
  // devenus inactifs/absents (revalidation).
  const lines = useMemo(() => {
    return items
      .map((it) => {
        const p = cartProducts.find((cp) => cp.id === it.productId && cp.isActive);
        if (!p) return null;
        const quantity = Math.min(it.quantity, p.stock); // plafonne au stock dispo
        return { ...p, quantity, lineTotal: quantity * p.price, requested: it.quantity };
      })
      .filter((l): l is NonNullable<typeof l> => l !== null && l.quantity > 0);
  }, [items, cartProducts]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const deliveryFee = zone === "dakar" ? deliveryFeeDakar : deliveryFeeRegions;
  const total = subtotal + deliveryFee;

  // Y a-t-il des lignes ajustées (stock insuffisant) ?
  const hasAdjustments = lines.some((l) => l.quantity < l.requested);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Votre nom est requis";
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
      // TODO: Server Action createOrder({
      //   customer: { name, phone, email, address, note },
      //   items: lines.map(l => ({ productId, quantity })),  // prix refixés serveur
      //   paymentMethod: payment,
      //   deliveryZone: zone,
      // })
      // → renvoie { orderNumber }
      const fakeOrderNumber = "CMD-2026-0042"; // placeholder

      clear();
      router.push(`/commande/confirmation/${fakeOrderNumber}`);
    } catch {
      setErrors({ submit: "Une erreur est survenue. Réessayez." });
      setSubmitting(false);
    }
  };

  /* ----- Panier vide ----- */
  if (items.length === 0 || lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ivory)] text-2xl text-[var(--gold)]/50">
          🛍️
        </div>
        <h1 className="mb-1 text-lg font-bold text-[var(--text-dark)]">Votre panier est vide</h1>
        <p className="mb-6 text-sm text-[var(--text-dark)]/50">
          Ajoutez quelques bijoux avant de passer commande.
        </p>
        <Link
          href="/boutique"
          className="inline-flex rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-24 lg:px-6 lg:pb-12 lg:pt-32">
      <Link
        href="/boutique"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-dark)]/50 transition-colors hover:text-[var(--text-dark)]"
      >
        <ChevronLeftIcon />
        Retour à la boutique
      </Link>

      <h1 className="mb-6 text-2xl font-bold tracking-tight text-[var(--text-dark)] lg:text-3xl">
        Finaliser la commande
      </h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* ===================== Colonne formulaire ===================== */}
        <div className="space-y-6">
          {/* Coordonnées */}
          <section className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Vos coordonnées
            </p>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Nom complet *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                />
                {errors.name && <p className="mt-1.5 pl-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="Téléphone * (ex : 77 123 45 67)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputClass}
                />
                {errors.phone ? (
                  <p className="mt-1.5 pl-1 text-xs text-red-500">{errors.phone}</p>
                ) : (
                  <p className="mt-1.5 pl-1 text-xs text-[var(--text-dark)]/40">
                    Nous vous contacterons sur ce numéro (WhatsApp)
                  </p>
                )}
              </div>

              <input
                type="email"
                placeholder="Email (optionnel)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
              />
            </div>
          </section>

          {/* Livraison */}
          <section className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Livraison
            </p>

            {/* Zone */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              {(
                [
                  { key: "dakar", label: "Dakar", fee: deliveryFeeDakar },
                  { key: "regions", label: "Régions", fee: deliveryFeeRegions },
                ] as const
              ).map((z) => {
                const selected = zone === z.key;
                return (
                  <button
                    key={z.key}
                    type="button"
                    onClick={() => setZone(z.key)}
                    className={`rounded-2xl border-2 p-4 text-left transition-all ${
                      selected
                        ? "border-[var(--gold)] bg-[var(--ivory)]/50"
                        : "border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-[var(--text-dark)]">
                      {z.label}
                    </span>
                    <span className="text-xs text-[var(--text-dark)]/50 tabular-nums">
                      {formatFCFA(z.fee)} FCFA
                    </span>
                  </button>
                );
              })}
            </div>

            <div>
              <textarea
                placeholder="Adresse de livraison * (quartier, ville, points de repère)"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={2}
                className={`${inputClass} resize-none`}
              />
              {errors.address && (
                <p className="mt-1.5 pl-1 text-xs text-red-500">{errors.address}</p>
              )}
            </div>

            <input
              type="text"
              placeholder="Instructions de livraison (optionnel)"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className={`${inputClass} mt-3`}
            />
          </section>

          {/* Paiement */}
          <section className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Mode de paiement
            </p>

            <div className="space-y-3">
              {/* Wave (défaut) */}
              <button
                type="button"
                onClick={() => setPayment("wave")}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  payment === "wave"
                    ? "border-[var(--gold)] bg-[var(--ivory)]/50"
                    : "border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                }`}
              >
                <span className="text-[#1DC8E9]">
                  <WaveMarkIcon className="h-9 w-9" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--text-dark)]">Payer avec Wave</span>
                    <span className="rounded-full bg-[var(--gold)]/15 px-2 py-0.5 text-[10px] font-bold text-[var(--gold-dark)]">
                      Recommandé
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--text-dark)]/50">
                    Vous payez juste après, via un lien sécurisé
                  </span>
                </span>
                {payment === "wave" && <CheckCircleIcon className="h-6 w-6 text-[var(--gold)]" />}
              </button>

              {/* Livraison */}
              <button
                type="button"
                onClick={() => setPayment("cash_on_delivery")}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                  payment === "cash_on_delivery"
                    ? "border-[var(--gold)] bg-[var(--ivory)]/50"
                    : "border-[var(--gold)]/15 hover:border-[var(--gold)]/40"
                }`}
              >
                <span className="text-[var(--gold-dark)]">
                  <TruckIcon className="h-9 w-9" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-[var(--text-dark)]">
                    Paiement à la livraison
                  </span>
                  <span className="mt-0.5 block text-xs text-[var(--text-dark)]/50">
                    Vous réglez en espèces à la réception
                  </span>
                </span>
                {payment === "cash_on_delivery" && (
                  <CheckCircleIcon className="h-6 w-6 text-[var(--gold)]" />
                )}
              </button>
            </div>
          </section>
        </div>

        {/* ===================== Récapitulatif ===================== */}
        <aside className="lg:sticky lg:top-24">
          <section className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
              Votre commande
            </p>

            {/* Lignes */}
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--ivory)]/70">
                    {l.imageUrl ? (
                      <img src={l.imageUrl} alt={l.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gold)]/40">◆</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text-dark)]">{l.name}</p>
                    <p className="text-xs text-[var(--text-dark)]/45 tabular-nums">
                      {l.quantity} × {formatFCFA(l.price)} F
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(l.lineTotal)} F
                  </span>
                </div>
              ))}
            </div>

            {hasAdjustments && (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                Certaines quantités ont été ajustées au stock disponible.
              </p>
            )}

            {/* Totaux */}
            <div className="mt-5 space-y-2 border-t border-[var(--gold)]/15 pt-5">
              <div className="flex justify-between text-sm text-[var(--text-dark)]/55">
                <span>Sous-total</span>
                <span className="tabular-nums">{formatFCFA(subtotal)} F</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-dark)]/55">
                <span>Livraison ({zone === "dakar" ? "Dakar" : "Régions"})</span>
                <span className="tabular-nums">{formatFCFA(deliveryFee)} F</span>
              </div>
              <div className="flex items-baseline justify-between pt-2">
                <span className="text-base font-bold text-[var(--text-dark)]">Total</span>
                <span className="text-xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                  {formatFCFA(total)} FCFA
                </span>
              </div>
            </div>

            {errors.submit && (
              <p className="mt-4 text-center text-xs text-red-500">{errors.submit}</p>
            )}

            {/* Bouton (desktop) */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 hidden w-full rounded-full bg-[var(--gold)] py-4 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 lg:block"
            >
              {submitting
                ? "Traitement..."
                : payment === "wave"
                  ? `Commander et payer · ${formatFCFA(total)} F`
                  : `Confirmer la commande · ${formatFCFA(total)} F`}
            </button>

            <p className="mt-3 hidden text-center text-xs leading-relaxed text-[var(--text-dark)]/40 lg:block">
              {payment === "wave"
                ? "Vous serez guidée pour le paiement Wave à l'étape suivante."
                : "Nous vous appellerons pour confirmer votre commande."}
            </p>
          </section>
        </aside>
      </div>

      {/* ===== Bouton MOBILE fixe ===== */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--gold)]/15 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex h-13 w-full items-center justify-center rounded-full bg-[var(--gold)] py-4 text-sm font-bold text-[#241B14] shadow-lg transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {submitting
            ? "Traitement..."
            : payment === "wave"
              ? `Commander et payer · ${formatFCFA(total)} F`
              : `Confirmer · ${formatFCFA(total)} F`}
        </button>
      </div>
    </div>
  );
}