"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";
import {
  updateOrderStatus,
  markPaymentVerified,
  markPaymentNotReceived,
  saveAdminNote,
  updatePaymentStatus,
} from "@/app/admin/orders/[id]/actions";
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  ShieldCheck,
  Truck,
  PackageCheck,
  AlertTriangle,
  XCircle,
  ExternalLink,
  MapPin,
  User,
  ShoppingBag,
  FileText,
  Sparkles,
  ChevronRight,
  Copy,
  Printer,
  Share2,
  Check,
  Send,
  CreditCard,
  History,
} from "lucide-react";

/* ============================================================
   Fiche commande Haute Joaillerie — /admin/orders/[id]
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
  customerOrdersCount?: number;
  customerTotalSpent?: number;
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
  "Injoignable / Ne répond pas",
  "Paiement Wave non reçu",
  "Rupture de stock",
  "Demande de la cliente",
  "Commande en double / Erreur",
  "Autre raison",
];

/* ---------- Sub-components ---------- */

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(14,11,9,0.06)] transition-all hover:border-[var(--laiton,#B9793E)]/35 ${className}`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-[var(--laiton,#B9793E)] stroke-[2]" />}
        <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
          {children}
        </p>
      </div>
    </div>
  );
}

/** Badges de Statut Luxe */
const statusBadgeConfig: Record<OrderStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
  pending: { label: "À Traiter", bg: "bg-amber-500/10", text: "text-amber-800 dark:text-amber-300", border: "border-amber-500/30", dot: "bg-amber-500" },
  confirmed: { label: "Confirmée", bg: "bg-emerald-500/10", text: "text-emerald-800 dark:text-emerald-300", border: "border-emerald-500/30", dot: "bg-emerald-500" },
  shipped: { label: "Expédiée", bg: "bg-sky-500/10", text: "text-sky-800 dark:text-sky-300", border: "border-sky-500/30", dot: "bg-sky-500" },
  delivered: { label: "Livrée avec Succès", bg: "bg-[var(--porcelaine,#F1ECE3)]", text: "text-[var(--obsidienne,#0E0B09)]", border: "border-[var(--laiton,#B9793E)]/30", dot: "bg-[var(--laiton,#B9793E)]" },
  cancelled: { label: "Annulée", bg: "bg-rose-500/10", text: "text-rose-700 dark:text-rose-300", border: "border-rose-500/30", dot: "bg-rose-500" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusBadgeConfig[status] || statusBadgeConfig.pending;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text} border ${cfg.border} shadow-2xs`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}

function PaymentStatusBadge({ order }: { order: OrderDetailData }) {
  if (order.paymentStatus === "pending_verification") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-500/30 shadow-2xs">
        <ShieldCheck className="h-3.5 w-3.5 text-amber-600 animate-bounce" />
        Wave · Preuve à Vérifier
      </span>
    );
  }
  if (order.paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-500/30 shadow-2xs">
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        Payé ({order.paymentMethod === "wave" ? "Wave" : "Espèces"})
      </span>
    );
  }
  if (order.paymentStatus === "refunded") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 border border-neutral-300 shadow-2xs">
        Remboursé
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--porcelaine,#F1ECE3)] px-3 py-1 text-xs font-semibold text-[var(--obsidienne,#0E0B09)]/70 border border-[var(--laiton,#B9793E)]/20 shadow-2xs">
      <CreditCard className="h-3.5 w-3.5 text-[var(--laiton,#B9793E)]" />
      {order.paymentMethod === "wave" ? "Wave · Non payé" : "Paiement à la livraison"}
    </span>
  );
}

/** Stepper Simple & Épuré Haute Joaillerie */
function StatusStepper({ status }: { status: OrderStatus }) {
  const steps: { key: OrderStatus; label: string; icon: any }[] = [
    { key: "pending", label: "Reçue", icon: Clock },
    { key: "confirmed", label: "Confirmée", icon: CheckCircle2 },
    { key: "shipped", label: "Expédiée", icon: Truck },
    { key: "delivered", label: "Livrée", icon: PackageCheck },
  ];

  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 border border-rose-200 text-xs">
        <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
        <div>
          <span className="font-bold text-rose-900">Commande Annulée</span>
          <span className="text-rose-700 ml-2">— Cette commande est archivée.</span>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="w-full font-sans">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className={`flex items-center gap-3 rounded-2xl p-3 sm:p-3.5 border transition-all ${
                current
                  ? "bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] border-[var(--laiton,#B9793E)] shadow-md ring-1 ring-[var(--laiton,#B9793E)]/30"
                  : done
                  ? "bg-[var(--porcelaine,#F1ECE3)] text-[var(--obsidienne,#0E0B09)] border-[var(--laiton,#B9793E)]/25"
                  : "bg-white text-neutral-400 border-neutral-200"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-transform ${
                  current
                    ? "bg-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] shadow-xs scale-105"
                    : done
                    ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {done ? "✓" : <StepIcon className="h-4.5 w-4.5" />}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold truncate leading-tight">{step.label}</p>
                <p className="text-[10px] font-sans opacity-70 truncate mt-0.5">
                  {done ? "Complété" : current ? "En cours" : "À venir"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeWaTemplate, setActiveWaTemplate] = useState<string | null>(null);

  const phone = order.customerPhone.replace(/[^\d]/g, "");

  /* --- Templates de message WhatsApp pré-remplis --- */
  const waTemplates = [
    {
      id: "confirm",
      label: "🌸 Confirmation",
      text: `Bonjour ${order.customerName} 🌸 Merci pour votre commande ${order.orderNumber} chez Mamou's Accessories ! Votre commande est bien confirmée et en cours de préparation.`,
    },
    {
      id: "wave_verify",
      label: "💳 Relance Wave",
      text: `Bonjour ${order.customerName} 🌸 Nous avons bien reçu votre commande ${order.orderNumber}. Avez-vous pu effectuer le transfert Wave de ${formatFCFA(order.total)} FCFA afin d'expédier votre colis ?`,
    },
    {
      id: "shipped",
      label: "🚚 Expédition",
      text: `Bonjour ${order.customerName} 🌸 Bonne nouvelle ! Votre commande ${order.orderNumber} a été remise au livreur. Elle vous sera livrée très prochainement à : ${order.deliveryAddress}.`,
    },
    {
      id: "delivered",
      label: "📦 Livraison",
      text: `Bonjour ${order.customerName} 🌸 Votre commande ${order.orderNumber} a été livrée ! Merci infiniment pour votre confiance envers Mamou's Accessories ✨`,
    },
  ];

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  /* --- Transitions avec Server Actions --- */

  const transition = async (next: OrderStatus, extra?: Partial<OrderDetailData>) => {
    setBusy(true);
    const toastId = toast.loading("Mise à jour du statut en cours...");
    try {
      const result = await updateOrderStatus(order.id, next, {
        adminNote: extra?.adminNote ?? undefined,
        paymentStatus: extra?.paymentStatus,
        cancelReason: extra?.cancelReason ?? undefined,
      });

      if (!result.success) {
        toast.error(result.error || "Erreur lors de la mise à jour", { id: toastId });
        return;
      }

      setOrder((o) => ({ ...o, status: next, ...extra }));

      if (next === "cancelled") {
        toast.success("Commande refusée/annulée. Le stock des bijoux a été réapprovisionné !", { id: toastId });
      } else if (next === "confirmed") {
        toast.success("Commande confirmée avec succès !", { id: toastId });
      } else if (next === "shipped") {
        toast.success("Commande marquée comme expédiée !", { id: toastId });
      } else if (next === "delivered") {
        toast.success("Commande marquée comme livrée !", { id: toastId });
      } else {
        toast.success("Statut de la commande mis à jour.", { id: toastId });
      }

      router.refresh();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Erreur inattendue lors de la mise à jour", { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const verifyPayment = async (received: boolean) => {
    setBusy(true);
    const toastId = toast.loading("Vérification du paiement...");
    try {
      if (received) {
        const result = await markPaymentVerified(order.id);
        if (!result.success) {
          toast.error(result.error || "Erreur lors de la vérification", { id: toastId });
          return;
        }
        setOrder((o) => ({ ...o, paymentStatus: "paid", status: "confirmed" }));
        toast.success("Paiement Wave validé ! Commande confirmée.", { id: toastId });
      } else {
        const result = await markPaymentNotReceived(order.id);
        if (!result.success) {
          toast.error(result.error || "Erreur lors de la mise à jour", { id: toastId });
          return;
        }
        setOrder((o) => ({ ...o, paymentStatus: "unpaid" }));
        toast.info("Paiement marqué comme non reçu.", { id: toastId });
      }
      router.refresh();
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Erreur inattendue", { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const changePaymentStatus = async (newStatus: PaymentStatus) => {
    setBusy(true);
    const toastId = toast.loading("Mise à jour du statut de paiement...");
    try {
      const result = await updatePaymentStatus(order.id, newStatus);
      if (!result.success) {
        toast.error(result.error || "Erreur lors de la mise à jour du paiement", { id: toastId });
        return;
      }
      setOrder((o) => ({
        ...o,
        paymentStatus: newStatus,
        status: newStatus === "paid" && o.status === "pending" ? "confirmed" : o.status,
      }));
      toast.success("Statut de paiement mis à jour !", { id: toastId });
      router.refresh();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Erreur inattendue", { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const confirmCancel = async () => {
    const reason = cancelReason || "Refusée par l'administrateur";
    await transition("cancelled", {
      cancelReason: reason,
      paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
    });
    setCancelOpen(false);
    setCancelReason(null);
  };

  const saveNote = async () => {
    try {
      await saveAdminNote(order.id, adminNote);
      toast.success("Note interne enregistrée");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Erreur d'enregistrement de la note");
    }
  };

  const canCancel = order.status !== "delivered" && order.status !== "cancelled";
  const needsPaymentCheck =
    order.paymentMethod === "wave" && order.paymentStatus === "pending_verification";

  const customerInitials = order.customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="-mx-6 -mt-6 lg:-mx-8 lg:-mt-8 pb-28 sm:pb-16 font-sans">
      {/* ===================== HERO EXECUTIVE BANNER ===================== */}
      <div className="relative overflow-hidden rounded-b-[2.5rem] sm:rounded-b-[3.5rem] bg-gradient-to-r from-[var(--obsidienne,#0E0B09)] via-[var(--obsidienne-soft,#17120D)] to-[var(--obsidienne,#0E0B09)] px-5 pb-8 pt-8 sm:px-10 sm:pb-12 sm:pt-10 shadow-2xl border-b border-[var(--laiton,#B9793E)]/35 text-[var(--porcelaine,#F1ECE3)]">
        {/* Halos dorés d'ambiance */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[var(--laiton,#B9793E)]/25 via-[#D9AE78]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--laiton,#B9793E)]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Top Bar : Back Link + Action Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--laiton,#B9793E)]/35 bg-white/10 px-4 py-2 text-xs font-sans font-semibold tracking-wider text-[var(--porcelaine,#F1ECE3)] backdrop-blur-md transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] shadow-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2]" />
              <span>Toutes les commandes</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyOrderNumber}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                title="Copier le numéro"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copié !" : "Copier N°"}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
                title="Imprimer la fiche"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>

          {/* Heading Info */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--laiton,#B9793E)]/25">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--laiton,#B9793E)]/25 border border-[var(--laiton,#B9793E)]/40 px-3.5 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-[var(--laiton-clair,#D9AE78)] backdrop-blur-md">
                  <Sparkles className="h-3 w-3 stroke-[2]" />
                  Fiche Commande Éditoriale
                </span>
                <StatusBadge status={order.status} />
                <PaymentStatusBadge order={order} />
              </div>

              <h1 className="font-mono text-3xl sm:text-5xl font-bold tracking-tight text-[var(--porcelaine,#F1ECE3)] mt-2">
                {order.orderNumber}
              </h1>

              <p className="mt-1.5 text-xs sm:text-sm text-[var(--porcelaine,#F1ECE3)]/70 font-sans">
                Passée le {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>

            {/* Quick Contact & Total Hero Block */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-white/10 border border-[var(--laiton,#B9793E)]/30 backdrop-blur-md">
                <span className="text-[9px] uppercase tracking-widest text-[var(--laiton-clair,#D9AE78)] font-bold block">
                  Montant Total
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[var(--porcelaine,#F1ECE3)] tabular-nums mt-0.5 block">
                  {formatFCFA(order.total)} <span className="text-xs font-sans font-normal opacity-75">FCFA</span>
                </span>
              </div>

              <a
                href={`https://wa.me/${phone}?text=${encodeURIComponent(waTemplates[0].text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-xs font-bold text-white shadow-xl transition-all hover:bg-emerald-500 active:scale-95 uppercase tracking-wider shrink-0"
              >
                <MessageCircle className="h-4 w-4 stroke-[2]" />
                <span>WhatsApp Client</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 pt-6 sm:px-8 sm:pt-8">
        {/* ===================== PROGRESSION STEPPER ===================== */}
        <Card>
          <Eyebrow icon={Sparkles}>Traçabilité & Progression de la Commande</Eyebrow>
          <StatusStepper status={order.status} />
          {order.status === "cancelled" && order.cancelReason && (
            <p className="mt-4 text-xs sm:text-sm text-neutral-600 font-sans bg-rose-50 p-3 rounded-xl border border-rose-200">
              Motif d&apos;annulation enregistré : <span className="font-bold text-rose-800">{order.cancelReason}</span>
            </p>
          )}
        </Card>

        {/* ===================== BLOC VÉRIFICATION WAVE ===================== */}
        {needsPaymentCheck && (
          <section className="overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/40 bg-gradient-to-b from-amber-500/10 via-white to-white shadow-xl">
            <div className="bg-[var(--obsidienne,#0E0B09)] px-6 py-4 border-b border-[var(--laiton,#B9793E)]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <ShieldCheck className="h-5 w-5 text-amber-400 animate-pulse" />
                <span>Validation du Paiement Wave Requise</span>
              </div>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Action Prioritaire
              </span>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2 items-center">
              {/* Preuve de paiement */}
              <div>
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/70">
                  Reçu de transfert transmis par la cliente :
                </p>
                {order.paymentProofUrl ? (
                  <div className="relative group cursor-pointer" onClick={() => setProofModalOpen(true)}>
                    <img
                      src={resolveProductImageUrl(order.paymentProofUrl)}
                      alt="Preuve de paiement Wave"
                      className="max-h-72 w-full rounded-2xl border border-[var(--laiton,#B9793E)]/30 object-contain bg-neutral-900 p-1.5 shadow-md transition-transform group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-2">
                      <ExternalLink className="h-4 w-4" /> Cliquer pour agrandir
                    </div>
                  </div>
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-xs text-[var(--obsidienne,#0E0B09)]/60 border border-dashed border-[var(--laiton,#B9793E)]/30 p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500 mb-2" />
                    Aucune capture d&apos;écran transmise
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-2xl bg-[var(--porcelaine,#F1ECE3)] p-5 border border-[var(--laiton,#B9793E)]/25">
                  <p className="text-xs text-[var(--obsidienne,#0E0B09)]/70">
                    Veuillez vérifier la réception exacte du paiement sur votre compte Wave :
                  </p>
                  <p className="mt-2 font-mono text-3xl font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                    {formatFCFA(order.total)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-[var(--laiton,#B9793E)]">
                    Titulaire : {order.customerName} ({order.customerPhone})
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => verifyPayment(true)}
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-xs font-bold text-white shadow-lg transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 uppercase tracking-wider"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Paiement Reçu — Confirmer la Commande
                  </button>
                  <button
                    type="button"
                    onClick={() => verifyPayment(false)}
                    disabled={busy}
                    className="rounded-2xl border border-rose-300 bg-rose-50 py-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50"
                  >
                    Paiement Introuvable — Repasser en non payé
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Modal pour agrandir la preuve de paiement */}
        {proofModalOpen && order.paymentProofUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setProofModalOpen(false)}
          >
            <div className="relative max-w-3xl max-h-[90vh] bg-neutral-900 p-2 rounded-3xl overflow-hidden border border-[var(--laiton,#B9793E)]/40">
              <img
                src={resolveProductImageUrl(order.paymentProofUrl)}
                alt="Preuve de paiement Wave grand format"
                className="max-h-[85vh] w-auto object-contain rounded-2xl mx-auto"
              />
              <button
                type="button"
                onClick={() => setProofModalOpen(false)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-sm backdrop-blur-md hover:bg-white/40"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ===================== GESTION STATUT DE PAIEMENT (HAUTE JOAILLERIE) ===================== */}
        <Card className="bg-gradient-to-br from-white via-sky-50/20 to-[var(--porcelaine,#F1ECE3)]/40 border border-[var(--laiton,#B9793E)]/30 shadow-md font-sans">
          <Eyebrow icon={CreditCard}>Statut & Contrôle du Paiement</Eyebrow>

          <div className="grid gap-6 lg:grid-cols-12 items-center">
            {/* Colonne gauche : Logo Wave + Statut Actuel */}
            <div className="lg:col-span-6 flex items-start sm:items-center gap-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-sky-200 bg-white p-1 shadow-md flex items-center justify-center">
                {order.paymentMethod === "wave" ? (
                  <img src="/wavelogo.jpeg" alt="Wave" className="h-full w-full object-contain rounded-xl" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] font-bold text-xl">
                    💵
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[var(--obsidienne,#0E0B09)]">Mode :</span>
                  <span className="font-semibold text-xs text-[var(--obsidienne,#0E0B09)]">
                    {order.paymentMethod === "wave" ? "Wave Sénégal" : "Espèces à la livraison"}
                  </span>
                  <PaymentStatusBadge order={order} />
                </div>
                
                <p className="text-xs text-[var(--obsidienne,#0E0B09)]/70 leading-relaxed font-sans">
                  {order.paymentStatus === "paid"
                    ? "✓ Règlement de la commande encaissé et validé."
                    : order.paymentStatus === "pending_verification"
                    ? "⚠️ Capture d'écran transmise par la cliente. Veuillez vérifier votre solde."
                    : order.paymentStatus === "refunded"
                    ? "↩️ Le montant de cette commande a été remboursé."
                    : "⏳ En attente du règlement par Wave ou à la livraison."}
                </p>
                
                <div className="pt-1 flex items-center gap-3 text-[11px] text-[var(--obsidienne,#0E0B09)]/60 font-mono">
                  <span>Montant : <strong className="text-[var(--obsidienne,#0E0B09)]">{formatFCFA(order.total)} FCFA</strong></span>
                  <span>•</span>
                  <span>Tél : <strong className="text-[var(--obsidienne,#0E0B09)]">{order.customerPhone}</strong></span>
                </div>
              </div>
            </div>

            {/* Colonne droite : Actions de changement de statut */}
            <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-[var(--laiton,#B9793E)]/20 pt-4 lg:pt-0 lg:pl-6 space-y-2.5">
              <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] block">
                Actions Rapides Admin
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => changePaymentStatus("paid")}
                  disabled={busy || order.paymentStatus === "paid"}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all shadow-xs ${
                    order.paymentStatus === "paid"
                      ? "bg-emerald-600 text-white ring-2 ring-emerald-600/30 cursor-default"
                      : "bg-emerald-500/10 text-emerald-800 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white active:scale-95"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Marquer Payé</span>
                </button>

                <button
                  type="button"
                  onClick={() => changePaymentStatus("pending_verification")}
                  disabled={busy || order.paymentStatus === "pending_verification"}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-3 text-xs font-bold transition-all shadow-xs ${
                    order.paymentStatus === "pending_verification"
                      ? "bg-amber-500 text-white ring-2 ring-amber-500/30 cursor-default"
                      : "bg-amber-500/10 text-amber-800 border border-amber-500/30 hover:bg-amber-500 hover:text-white active:scale-95"
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Wave à Vérifier</span>
                </button>

                <button
                  type="button"
                  onClick={() => changePaymentStatus("unpaid")}
                  disabled={busy || order.paymentStatus === "unpaid"}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    order.paymentStatus === "unpaid"
                      ? "bg-neutral-800 text-white cursor-default"
                      : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-800 hover:text-white active:scale-95"
                  }`}
                >
                  <span>Marquer Non Payé</span>
                </button>

                <button
                  type="button"
                  onClick={() => changePaymentStatus("refunded")}
                  disabled={busy || order.paymentStatus === "refunded"}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    order.paymentStatus === "refunded"
                      ? "bg-rose-600 text-white cursor-default"
                      : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white active:scale-95"
                  }`}
                >
                  <span>Marquer Remboursé</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* ===================== ACTIONS CONTEXTUELLES DESKTOP ===================== */}
        {!needsPaymentCheck && order.status !== "delivered" && order.status !== "cancelled" && (
          <Card className="hidden sm:block">
            <Eyebrow icon={ChevronRight}>Actions d'Administration</Eyebrow>
            <div className="flex flex-wrap items-center gap-3">
              {order.status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => transition("confirmed")}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 text-white border border-emerald-500 px-6 py-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmer la commande
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-300 px-6 py-4 text-xs font-bold uppercase tracking-wider text-rose-700 shadow-xs transition-all hover:bg-rose-600 hover:text-white active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Refuser la commande
                  </button>
                </>
              )}
              {order.status === "confirmed" && (
                <>
                  <button
                    type="button"
                    onClick={() => transition("shipped")}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)] px-6 py-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:bg-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] active:scale-95 disabled:opacity-50"
                  >
                    <Truck className="h-4 w-4 text-[var(--laiton-clair,#D9AE78)]" />
                    Marquer comme expédiée
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-300 px-5 py-4 text-xs font-bold uppercase tracking-wider text-rose-700 shadow-xs transition-all hover:bg-rose-600 hover:text-white active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Refuser / Annuler
                  </button>
                </>
              )}
              {order.status === "shipped" && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      transition("delivered", {
                        paymentStatus:
                          order.paymentMethod === "cash_on_delivery" ? "paid" : order.paymentStatus,
                      })
                    }
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-6 py-4 text-xs font-bold uppercase tracking-wider shadow-md transition-all hover:bg-emerald-500 active:scale-95 disabled:opacity-50"
                  >
                    <PackageCheck className="h-4 w-4" />
                    Marquer comme livrée{order.paymentMethod === "cash_on_delivery" ? " et payée" : ""}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    disabled={busy}
                    className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-300 px-5 py-4 text-xs font-bold uppercase tracking-wider text-rose-700 shadow-xs transition-all hover:bg-rose-600 hover:text-white active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" />
                    Annuler la commande
                  </button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* ===================== GRILLE PRODUITS & INFOS ===================== */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Col 1 & 2 : Produits + Totaux */}
          <Card className="lg:col-span-2 space-y-5">
            <Eyebrow icon={ShoppingBag}>
              Articles Commandés ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </Eyebrow>

            <div className="divide-y divide-[var(--laiton,#B9793E)]/15">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4 first:pt-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/25 shadow-2xs">
                    {item.imageUrl ? (
                      <img
                        src={resolveProductImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xl text-[var(--laiton,#B9793E)]">
                        💎
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {item.productId ? (
                      <Link
                        href={`/admin/products/${item.productId}`}
                        className="truncate text-sm font-semibold text-[var(--obsidienne,#0E0B09)] hover:text-[var(--laiton,#B9793E)] transition-colors block"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      <p className="truncate text-sm font-semibold text-[var(--obsidienne,#0E0B09)]/60">
                        {item.productName}
                        <span className="ml-1 text-xs font-normal text-neutral-400">(produit archivé)</span>
                      </p>
                    )}
                    <p className="text-xs font-mono text-[var(--obsidienne,#0E0B09)]/60 tabular-nums mt-1">
                      {item.quantity} × {formatFCFA(item.unitPrice)} FCFA
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                      {formatFCFA(item.quantity * item.unitPrice)}{" "}
                      <span className="text-[10px] font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totaux financier */}
            <div className="rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 p-5 border border-[var(--laiton,#B9793E)]/20 space-y-2.5">
              <div className="flex justify-between text-xs font-sans text-[var(--obsidienne,#0E0B09)]/70">
                <span>Sous-total articles</span>
                <span className="font-mono font-medium tabular-nums">{formatFCFA(order.subtotal)} FCFA</span>
              </div>
              <div className="flex justify-between text-xs font-sans text-[var(--obsidienne,#0E0B09)]/70">
                <span>Frais de livraison</span>
                <span className="font-mono font-medium tabular-nums">
                  {order.deliveryFee > 0 ? `${formatFCFA(order.deliveryFee)} FCFA` : "Offerts"}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-[var(--laiton,#B9793E)]/25">
                <span className="text-sm font-bold text-[var(--obsidienne,#0E0B09)]">Total de la commande</span>
                <span className="font-mono text-xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] tabular-nums">
                  {formatFCFA(order.total)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/70">FCFA</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Col 3 : Client & Livraison */}
          <div className="space-y-6">
            {/* Infos client */}
            <Card>
              <Eyebrow icon={User}>Fiche Cliente VIP</Eyebrow>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--obsidienne,#0E0B09)] text-[var(--laiton-clair,#D9AE78)] font-serif font-bold text-base border border-[var(--laiton,#B9793E)]/30 shadow-md">
                  {customerInitials}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold text-[var(--obsidienne,#0E0B09)] truncate">{order.customerName}</p>
                  <p className="text-xs font-mono text-[var(--obsidienne,#0E0B09)]/65 tabular-nums">
                    {order.customerPhone}
                  </p>
                </div>
              </div>

              {order.customerOrdersCount && order.customerOrdersCount > 1 && (
                <div className="mb-4 rounded-xl bg-[var(--laiton,#B9793E)]/10 border border-[var(--laiton,#B9793E)]/25 p-2.5 text-center">
                  <span className="text-[11px] font-sans font-bold text-[var(--laiton,#B9793E)]">
                    ★ Cliente Fidèle ({order.customerOrdersCount} commandes · {formatFCFA(order.customerTotalSpent || 0)} FCFA)
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-[var(--laiton,#B9793E)]/30 bg-white py-2.5 text-xs font-semibold text-[var(--obsidienne,#0E0B09)] transition-colors hover:bg-[var(--porcelaine,#F1ECE3)] shadow-2xs"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--laiton,#B9793E)]" />
                  Appeler
                </a>
                <a
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(waTemplates[0].text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 py-2.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white shadow-2xs"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--laiton,#B9793E)]/15">
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[var(--laiton,#B9793E)]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--laiton,#B9793E)]">
                      Adresse de Livraison
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--laiton,#B9793E)] font-semibold hover:underline flex items-center gap-1"
                  >
                    Google Maps <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
                <p className="text-xs leading-relaxed font-sans text-[var(--obsidienne,#0E0B09)] bg-[var(--porcelaine,#F1ECE3)]/60 p-3 rounded-xl border border-[var(--laiton,#B9793E)]/15">
                  {order.deliveryAddress}
                </p>
                {order.deliveryNote && (
                  <p className="mt-2 text-xs italic text-[var(--obsidienne,#0E0B09)]/70 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    « {order.deliveryNote} »
                  </p>
                )}
              </div>
            </Card>

            {/* Note interne */}
            <Card>
              <Eyebrow icon={FileText}>Note interne privée</Eyebrow>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                onBlur={saveNote}
                placeholder="Notes réservées à la gestion administrative..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-[var(--laiton,#B9793E)]/25 bg-[var(--porcelaine,#F1ECE3)]/40 p-3.5 text-xs text-[var(--obsidienne,#0E0B09)] placeholder:text-[var(--obsidienne,#0E0B09)]/40 focus:border-[var(--laiton,#B9793E)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--laiton,#B9793E)]/20"
              />
            </Card>

            {/* Annulation */}
            {canCancel && (
              <Card className="border-rose-200 bg-rose-50/30">
                {!cancelOpen ? (
                  <button
                    type="button"
                    onClick={() => setCancelOpen(true)}
                    className="w-full rounded-2xl border border-rose-300 bg-white py-3 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 shadow-2xs"
                  >
                    Annuler la commande
                  </button>
                ) : (
                  <div>
                    <p className="mb-2.5 text-xs font-semibold text-[var(--obsidienne,#0E0B09)]">
                      Motif de l&apos;annulation :
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {cancelReasons.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setCancelReason(reason)}
                          className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${
                            cancelReason === reason
                              ? "bg-rose-600 text-white shadow-xs"
                              : "border border-rose-200 bg-white text-rose-700 hover:bg-rose-50"
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCancelOpen(false);
                          setCancelReason(null);
                        }}
                        className="flex-1 rounded-xl border border-neutral-300 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-white"
                      >
                        Retour
                      </button>
                      <button
                        type="button"
                        onClick={confirmCancel}
                        disabled={!cancelReason || busy}
                        className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-40"
                      >
                        Confirmer
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>

        {/* ===================== TEMPLATES WHATSAPP PRE-REMPLIS (FIN DE PAGE) ===================== */}
        <Card className="bg-gradient-to-r from-emerald-950/5 via-white to-white">
          <Eyebrow icon={Send}>Messages WhatsApp Pré-rédigés pour la Cliente</Eyebrow>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {waTemplates.map((tpl) => (
              <a
                key={tpl.id}
                href={`https://wa.me/${phone}?text=${encodeURIComponent(tpl.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-between rounded-2xl border border-emerald-500/25 bg-emerald-50/40 p-3.5 transition-all hover:bg-emerald-500 hover:text-white group shadow-2xs"
              >
                <div>
                  <span className="font-sans text-xs font-bold text-emerald-950 group-hover:text-white block mb-1">
                    {tpl.label}
                  </span>
                  <p className="text-[11px] font-sans text-emerald-900/70 group-hover:text-white/90 line-clamp-3 leading-relaxed">
                    {tpl.text}
                  </p>
                </div>
                <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-700 group-hover:text-white inline-flex items-center gap-1">
                  Envoyer <ChevronRight className="h-3 w-3" />
                </span>
              </a>
            ))}
          </div>
        </Card>
      </div>

      {/* ===================== FLOATING EXECUTIVE GLASS CAPSULE (MOBILE STICKY BAR) ===================== */}
      <div className="sm:hidden fixed bottom-4 inset-x-3 z-50 rounded-[2rem] border border-[var(--laiton,#B9793E)]/40 bg-[var(--obsidienne,#0E0B09)]/95 backdrop-blur-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ring-1 ring-white/10 space-y-2">
        {/* Contact direct cliente : Appeler & WhatsApp */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.customerPhone}`}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--laiton,#B9793E)]/35 bg-white/10 py-2.5 px-3 text-xs font-semibold text-[var(--porcelaine,#F1ECE3)] active:scale-95 transition-all backdrop-blur-md shadow-inner"
          >
            <Phone className="h-3.5 w-3.5 text-[var(--laiton-clair,#D9AE78)]" />
            <span>Appeler</span>
          </a>
          <a
            href={`https://wa.me/${phone}?text=${encodeURIComponent(waTemplates[0].text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 px-3 text-xs font-bold text-white shadow-md active:scale-95 transition-all"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Action statut principale (si applicable) */}
        {!needsPaymentCheck && order.status !== "delivered" && order.status !== "cancelled" && (
          <div className="flex items-center gap-2">
            {order.status === "pending" && (
              <>
                <button
                  type="button"
                  onClick={() => transition("confirmed")}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-3 text-xs font-extrabold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                  <span>Confirmer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCancelOpen(true)}
                  disabled={busy}
                  className="flex items-center justify-center gap-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 px-3.5 py-3 text-xs font-bold uppercase tracking-wider active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Refuser</span>
                </button>
              </>
            )}
            {order.status === "confirmed" && (
              <>
                <button
                  type="button"
                  onClick={() => transition("shipped")}
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--laiton,#B9793E)] via-[#D9AE78] to-[var(--laiton,#B9793E)] text-[var(--obsidienne,#0E0B09)] py-3 text-xs font-extrabold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Truck className="h-4 w-4 stroke-[2.5]" />
                  <span>Expédier</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCancelOpen(true)}
                  disabled={busy}
                  className="flex items-center justify-center gap-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 px-3.5 py-3 text-xs font-bold uppercase tracking-wider active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Annuler</span>
                </button>
              </>
            )}
            {order.status === "shipped" && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    transition("delivered", {
                      paymentStatus:
                        order.paymentMethod === "cash_on_delivery" ? "paid" : order.paymentStatus,
                    })
                  }
                  disabled={busy}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 text-white py-3 text-xs font-extrabold uppercase tracking-wider shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <PackageCheck className="h-4 w-4 stroke-[2.5]" />
                  <span>Livrée</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCancelOpen(true)}
                  disabled={busy}
                  className="flex items-center justify-center gap-1 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 px-3.5 py-3 text-xs font-bold uppercase tracking-wider active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 text-rose-400" />
                  <span>Annuler</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===================== MODAL DE REFUS / ANNULATION DE COMMANDE ===================== */}
      {cancelOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setCancelOpen(false)}
          />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-rose-100">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                  <XCircle className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900">
                    Refuser la commande
                  </h3>
                  <p className="text-xs text-neutral-500 font-sans">
                    Commande {order.orderNumber} ({order.customerName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCancelOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4 font-sans">
              <p className="text-xs font-semibold text-neutral-700">
                Sélectionnez le motif du refus (le stock des bijoux sera réapprovisionné) :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cancelReasons.map((reason) => {
                  const isSelected = cancelReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setCancelReason(reason)}
                      className={`rounded-2xl border p-3 text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? "border-rose-600 bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30"
                          : "border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-rose-300 hover:bg-rose-50/50"
                      }`}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 leading-relaxed">
                ℹ️ <strong>Impact automatique :</strong> Le refus annulera la commande et rajoutera les articles au stock disponible.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setCancelOpen(false);
                    setCancelReason(null);
                  }}
                  className="rounded-full px-5 py-2.5 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmCancel}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-rose-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {busy ? "Traitement..." : "Confirmer le refus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}