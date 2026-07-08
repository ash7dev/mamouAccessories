/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  updateOrderStatus,
  markPaymentVerified,
  markPaymentNotReceived,
  saveAdminNote,
} from "@/app/admin/orders/[id]/actions";

/* ============================================================
   Fiche commande — /admin/orders/[id]

   L'écran le plus important de l'admin : c'est ici que se joue
   toute la logique métier (vérification Wave, transitions de
   statut, règles de stock, annulation motivée).

   Usage :
     const order = await getOrderDetail(params.id);
     <CommandeDetail order={order} />
   ============================================================ */

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded";

export interface OrderDetailData {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: "wave" | "cash_on_delivery";
  paymentStatus: PaymentStatus;
  paymentProofUrl: string | null;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: string;
  deliveryNote: string | null;
  subtotal: number;
  deliveryFee: number;
  total: number;
  adminNote: string | null;
  cancelReason: string | null;
  items: {
    id: string;
    productId: string | null;
    productName: string;
    imageUrl: string | null;
    quantity: number;
    unitPrice: number;
  }[];
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

const cancelReasons = [
  "Injoignable",
  "Paiement non reçu",
  "Rupture de stock",
  "Demande de la cliente",
  "Autre",
];

/* ---------- Icônes ---------- */

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ---------- Sous-composants ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
      {children}
    </p>
  );
}

/** Stepper horizontal : pending → confirmed → shipped → delivered */
function StatusStepper({ status }: { status: OrderStatus }) {
  const steps: { key: OrderStatus; label: string }[] = [
    { key: "pending", label: "Reçue" },
    { key: "confirmed", label: "Confirmée" },
    { key: "shipped", label: "Expédiée" },
    { key: "delivered", label: "Livrée" },
  ];

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-600/8 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/15 text-red-600">
          ✕
        </span>
        <p className="text-sm font-semibold text-red-600">Commande annulée</p>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <div key={step.key} className={`flex items-center ${i > 0 ? "flex-1" : ""}`}>
            {i > 0 && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full ${
                  done || current ? "bg-[var(--gold)]" : "bg-[var(--text-dark)]/10"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-[var(--gold)] text-[#241B14]"
                    : current
                      ? "bg-[var(--text-dark)] text-white ring-4 ring-[var(--gold)]/20"
                      : "bg-[var(--text-dark)]/8 text-[var(--text-dark)]/35"
                }`}
              >
                {done ? <CheckIcon className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  current ? "text-[var(--text-dark)]" : "text-[var(--text-dark)]/40"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Composant principal ---------- */

export function CommandeDetail({ order: initialOrder }: { order: OrderDetailData }) {
  const router = useRouter();
  const [order, setOrder] = useState(initialOrder);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
  const [busy, setBusy] = useState(false);

  const phone = order.customerPhone.replace(/[^\d]/g, "");
  const waMessage = encodeURIComponent(
    `Bonjour ${order.customerName} 🌸 Au sujet de votre commande ${order.orderNumber} :`
  );

  /* --- Transitions avec Server Actions --- */

  const transition = async (next: OrderStatus, extra?: Partial<OrderDetailData>) => {
    setBusy(true);
    try {
      const result = await updateOrderStatus(order.id, next, {
        adminNote: extra?.adminNote ?? undefined,
        paymentStatus: extra?.paymentStatus,
        cancelReason: extra?.cancelReason ?? undefined,
      });

      if (!result.success) {
        alert(result.error || "Erreur lors de la mise à jour");
        return;
      }

      // Mise à jour optimiste de l'UI
      setOrder((o) => ({ ...o, status: next, ...extra }));
      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Erreur inattendue");
    } finally {
      setBusy(false);
    }
  };

  const verifyPayment = async (received: boolean) => {
    setBusy(true);
    try {
      if (received) {
        const result = await markPaymentVerified(order.id);
        if (!result.success) {
          alert(result.error || "Erreur lors de la vérification");
          return;
        }
        setOrder((o) => ({ ...o, paymentStatus: "paid", status: "confirmed" }));
      } else {
        const result = await markPaymentNotReceived(order.id);
        if (!result.success) {
          alert(result.error || "Erreur lors de la mise à jour");
          return;
        }
        setOrder((o) => ({ ...o, paymentStatus: "unpaid" }));
      }
      router.refresh();
    } catch (error) {
      console.error("Error verifying payment:", error);
      alert("Erreur inattendue");
    } finally {
      setBusy(false);
    }
  };

  const confirmCancel = async () => {
    if (!cancelReason) return;
    await transition("cancelled", {
      cancelReason,
      paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
    });
    setCancelOpen(false);
  };

  const saveNote = async () => {
    try {
      await saveAdminNote(order.id, adminNote);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const canCancel = order.status !== "delivered" && order.status !== "cancelled";
  const needsPaymentCheck =
    order.paymentMethod === "wave" && order.paymentStatus === "pending_verification";

  return (
    <div className="min-h-screen">
      {/* ===== Header compact ===== */}
      <div className="sticky top-0 z-10 border-b border-[var(--gold)]/15 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--text-dark)]/50 transition-colors hover:text-[var(--text-dark)] shrink-0"
              >
                <ChevronLeftIcon />
                <span className="hidden sm:inline">Commandes</span>
              </Link>
              <div className="h-4 w-px bg-[var(--gold)]/20 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base font-bold text-[var(--text-dark)] lg:text-lg truncate">
                  {order.orderNumber}
                </h1>
              </div>
            </div>

            <a
              href={`https://wa.me/${phone}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-2 rounded-full bg-emerald-500 px-4 text-xs font-bold text-white shadow-md transition-transform hover:brightness-105 active:scale-95 shrink-0 lg:h-10 lg:text-sm"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-4 px-4 py-4 lg:px-6 lg:py-6 lg:space-y-6">
        {/* ===== Info rapide ===== */}
        <div className="rounded-2xl bg-[var(--ivory)]/40 px-4 py-2 text-xs text-[var(--text-dark)]/60">
          Passée le{" "}
          {new Date(order.createdAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        {/* ===== Progression ===== */}
        <Card>
          <Eyebrow>Progression</Eyebrow>
          <StatusStepper status={order.status} />
          {order.status === "cancelled" && order.cancelReason && (
            <p className="mt-3 text-sm text-[var(--text-dark)]/50">
              Motif : <span className="font-medium text-[var(--text-dark)]/70">{order.cancelReason}</span>
            </p>
          )}
        </Card>

        {/* ===== Vérification du paiement Wave — LE bloc prioritaire ===== */}
        {needsPaymentCheck && (
          <section className="overflow-hidden rounded-3xl border-2 border-[var(--gold)]/40 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.18)]">
            <div className="bg-[var(--gold)]/12 px-6 py-3">
              <p className="flex items-center gap-2 text-sm font-bold text-[var(--gold-dark)]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--gold-dark)]" />
                Paiement Wave à vérifier
              </p>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* Preuve de paiement */}
              <div>
                <p className="mb-2 text-xs font-medium text-[var(--text-dark)]/50">
                  Capture envoyée par la cliente :
                </p>
                {order.paymentProofUrl ? (
                  <a href={order.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={order.paymentProofUrl}
                      alt="Preuve de paiement Wave"
                      className="max-h-72 w-full rounded-2xl border border-[var(--gold)]/15 object-contain transition-opacity hover:opacity-90"
                    />
                  </a>
                ) : (
                  <div className="flex h-40 items-center justify-center rounded-2xl bg-[var(--ivory)]/60 text-sm text-[var(--text-dark)]/40">
                    Aucune capture envoyée
                  </div>
                )}
              </div>

              {/* Instructions + actions */}
              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-2xl bg-[var(--ivory)]/60 p-4">
                  <p className="text-xs leading-relaxed text-[var(--text-dark)]/60">
                    Ouvrez votre app Wave et vérifiez la réception de :
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(order.total)} <span className="text-base font-medium text-[var(--text-dark)]/40">FCFA</span>
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-dark)]/45">
                    de {order.customerName} · {order.customerPhone}
                  </p>
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => verifyPayment(true)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                  >
                    <CheckIcon />
                    Paiement reçu — confirmer la commande
                  </button>
                  <button
                    onClick={() => verifyPayment(false)}
                    disabled={busy}
                    className="rounded-full border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                  >
                    Paiement introuvable — repasser en non payé
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== Actions contextuelles selon le statut ===== */}
        {!needsPaymentCheck && order.status !== "delivered" && order.status !== "cancelled" && (
          <Card>
            <Eyebrow>Action suivante</Eyebrow>
            <div className="flex flex-wrap gap-3">
              {order.status === "pending" && (
                <button
                  onClick={() => transition("confirmed")}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95 disabled:opacity-50"
                >
                  <CheckIcon />
                  Confirmer la commande
                </button>
              )}
              {order.status === "confirmed" && (
                <button
                  onClick={() => transition("shipped")}
                  disabled={busy}
                  className="rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95 disabled:opacity-50"
                >
                  Marquer comme expédiée
                </button>
              )}
              {order.status === "shipped" && (
                <button
                  onClick={() =>
                    transition("delivered", {
                      paymentStatus:
                        order.paymentMethod === "cash_on_delivery" ? "paid" : order.paymentStatus,
                    })
                  }
                  disabled={busy}
                  className="rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-bold text-[#241B14] shadow-lg transition-transform hover:brightness-105 active:scale-95 disabled:opacity-50"
                >
                  Marquer comme livrée{order.paymentMethod === "cash_on_delivery" ? " et payée" : ""}
                </button>
              )}
            </div>

            {order.status === "pending" && (
              <p className="mt-3 text-xs text-[var(--text-dark)]/45">
                La confirmation réserve le stock des articles. Pour une commande à la livraison,
                appelez d&apos;abord la cliente pour confirmer.
              </p>
            )}
          </Card>
        )}

        {/* ===== Grille : articles (2/3) + infos (1/3) ===== */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Articles + totaux */}
          <Card className="lg:col-span-2">
            <Eyebrow>
              Articles ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </Eyebrow>

            <div className="divide-y divide-[var(--gold)]/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--ivory)]/70">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-lg text-[var(--gold)]/40">
                        ◆
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {item.productId ? (
                      <Link
                        href={`/admin/products/${item.productId}`}
                        className="truncate text-sm font-semibold text-[var(--text-dark)] underline-offset-2 hover:underline"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="truncate text-sm font-semibold text-[var(--text-dark)]/70">
                        {item.productName}
                        <span className="ml-1.5 text-xs font-normal text-[var(--text-dark)]/40">(supprimé)</span>
                      </p>
                    )}
                    <p className="text-xs text-[var(--text-dark)]/45 tabular-nums">
                      {item.quantity} × {formatFCFA(item.unitPrice)} F
                    </p>
                  </div>
                  <span className="text-sm font-bold text-[var(--text-dark)] tabular-nums">
                    {formatFCFA(item.quantity * item.unitPrice)} F
                  </span>
                </div>
              ))}
            </div>

            {/* Totaux */}
            <div className="mt-4 space-y-2 border-t border-[var(--gold)]/15 pt-4">
              <div className="flex justify-between text-sm text-[var(--text-dark)]/55">
                <span>Sous-total</span>
                <span className="tabular-nums">{formatFCFA(order.subtotal)} F</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--text-dark)]/55">
                <span>Livraison</span>
                <span className="tabular-nums">
                  {order.deliveryFee > 0 ? `${formatFCFA(order.deliveryFee)} F` : "Offerte"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-bold text-[var(--text-dark)]">Total</span>
                <span className="text-xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
                  {formatFCFA(order.total)} FCFA
                </span>
              </div>
            </div>
          </Card>

          {/* Colonne infos */}
          <div className="space-y-6">
            {/* Cliente */}
            <Card>
              <Eyebrow>Cliente</Eyebrow>
              <p className="text-sm font-semibold text-[var(--text-dark)]">{order.customerName}</p>
              <p className="mt-0.5 text-sm text-[var(--text-dark)]/55 tabular-nums">
                {order.customerPhone}
              </p>
              {order.customerEmail && (
                <p className="mt-0.5 truncate text-sm text-[var(--text-dark)]/55">{order.customerEmail}</p>
              )}

              <div className="mt-4 flex gap-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--gold)]/25 py-2.5 text-xs font-semibold text-[var(--text-dark)]/70 transition-colors hover:bg-[var(--ivory)]/60"
                >
                  <PhoneIcon />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${phone}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-emerald-600/10 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </div>

              <div className="mt-4 border-t border-[var(--gold)]/10 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-dark)]/40">
                  Livraison
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-dark)]/70">
                  {order.deliveryAddress}
                </p>
                {order.deliveryNote && (
                  <p className="mt-2 rounded-xl bg-[var(--ivory)]/60 px-3 py-2 text-xs italic leading-relaxed text-[var(--text-dark)]/55">
                    « {order.deliveryNote} »
                  </p>
                )}
              </div>
            </Card>

            {/* Note interne */}
            <Card>
              <Eyebrow>Note interne</Eyebrow>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                onBlur={saveNote}
                placeholder="Visible uniquement par vous..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-[var(--gold)]/20 bg-[var(--ivory)]/40 px-4 py-3 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/30 focus:border-[var(--gold)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/25"
              />
            </Card>

            {/* Annulation */}
            {canCancel && (
              <Card className="border-red-100">
                {!cancelOpen ? (
                  <button
                    onClick={() => setCancelOpen(true)}
                    className="w-full rounded-full border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                  >
                    Annuler la commande
                  </button>
                ) : (
                  <div>
                    <p className="mb-3 text-sm font-semibold text-[var(--text-dark)]">
                      Motif de l&apos;annulation :
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {cancelReasons.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => setCancelReason(reason)}
                          className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                            cancelReason === reason
                              ? "bg-red-600 text-white shadow-md"
                              : "border border-red-200 bg-white text-red-600/70 hover:bg-red-50"
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    {(order.status === "confirmed" || order.status === "shipped") && (
                      <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                        Le stock des articles sera automatiquement remis en vente.
                      </p>
                    )}
                    {order.paymentStatus === "paid" && (
                      <p className="mb-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                        Cette commande est payée : pensez à rembourser {formatFCFA(order.total)} FCFA
                        via Wave. Elle sera marquée « Remboursée ».
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCancelOpen(false);
                          setCancelReason(null);
                        }}
                        className="flex-1 rounded-full border border-[var(--gold)]/25 py-2.5 text-xs font-semibold text-[var(--text-dark)]/60 transition-colors hover:bg-[var(--ivory)]/60"
                      >
                        Retour
                      </button>
                      <button
                        onClick={confirmCancel}
                        disabled={!cancelReason || busy}
                        className="flex-1 rounded-full bg-red-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Confirmer l&apos;annulation
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}