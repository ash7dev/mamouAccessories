"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Sparkles, ChevronRight, ShoppingBag } from "lucide-react";

/* ============================================================
   Liste des commandes — /admin/orders
   ============================================================ */

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded";

export interface OrderListItem {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "wave" | "cash_on_delivery";
  paymentStatus: PaymentStatus;
  createdAt: string;
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "hier";
  return `il y a ${days} j`;
}

function isStale(order: OrderListItem) {
  const hours = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
  return order.status === "pending" && hours >= 24;
}

/* ---------- Badges Haute Joaillerie ---------- */

const statusConfig: Record<OrderStatus, { label: string; className: string; dotColor: string }> = {
  pending: { label: "À traiter", className: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25", dotColor: "bg-amber-500" },
  confirmed: { label: "Confirmée", className: "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25", dotColor: "bg-emerald-500" },
  shipped: { label: "Expédiée", className: "bg-sky-500/10 text-sky-800 dark:text-sky-300 border border-sky-500/25", dotColor: "bg-sky-500" },
  delivered: { label: "Livrée", className: "bg-[var(--porcelaine,#F1ECE3)] text-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/25", dotColor: "bg-[var(--laiton,#B9793E)]" },
  cancelled: { label: "Annulée", className: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20", dotColor: "bg-rose-500" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-sans font-medium ${c.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dotColor}`} />
      {c.label}
    </span>
  );
}

function PaymentBadge({ order }: { order: OrderListItem }) {
  if (order.paymentStatus === "pending_verification") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--laiton,#B9793E)]/15 px-2.5 py-0.5 text-[11px] font-sans font-medium text-[var(--laiton,#B9793E)] border border-[var(--laiton,#B9793E)]/35">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--laiton,#B9793E)]" />
        Wave · à vérifier
      </span>
    );
  }
  if (order.paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-sans font-medium text-emerald-800 border border-emerald-500/25">
        ✓ {order.paymentMethod === "wave" ? "Wave" : "Espèces"}
      </span>
    );
  }
  if (order.paymentStatus === "refunded") {
    return (
      <span className="inline-flex rounded-full bg-[var(--porcelaine,#F1ECE3)] px-2.5 py-0.5 text-[11px] font-sans font-medium text-[var(--obsidienne,#0E0B09)]/60 border border-[var(--laiton,#B9793E)]/20">
        Remboursée
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-sans font-medium text-neutral-600 border border-neutral-200">
      {order.paymentMethod === "wave" ? "Wave · non payé" : "À la livraison"}
    </span>
  );
}

function StaleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-sans font-semibold text-rose-700 border border-rose-500/25">
      ⏱ +24 h
    </span>
  );
}

/* ---------- Icône WhatsApp ---------- */

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function whatsAppUrl(order: OrderListItem) {
  if (!order.customerPhone) return "#";
  const phone = order.customerPhone.replace(/[^\d]/g, "");
  let message: string;

  if (order.paymentStatus === "pending_verification" || (order.status === "pending" && order.paymentMethod === "wave")) {
    message = `Bonjour ${order.customerName} 🌸 Nous avons bien reçu votre commande ${order.orderNumber}. Avez-vous pu effectuer le paiement Wave de ${formatFCFA(order.total)} FCFA ?`;
  } else if (order.status === "pending") {
    message = `Bonjour ${order.customerName} 🌸 Merci pour votre commande ${order.orderNumber} (${formatFCFA(order.total)} FCFA) ! Nous vous contactons pour confirmer la livraison.`;
  } else {
    message = `Bonjour ${order.customerName} 🌸 Au sujet de votre commande ${order.orderNumber} :`;
  }

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* ---------- État vide Haute Joaillerie ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-12 lg:p-16 text-center shadow-xs">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/25 shadow-inner">
        <Sparkles className="h-8 w-8 stroke-[1.5]" />
      </div>
      <h3 className="font-serif mb-2 text-xl font-normal text-[var(--obsidienne,#0E0B09)]">
        Aucune commande trouvée
      </h3>
      <p className="max-w-sm text-xs font-sans leading-relaxed text-[var(--obsidienne,#0E0B09)]/60">
        Les commandes correspondant à ce filtre apparaîtront dans cette liste.
      </p>
    </div>
  );
}

/* ---------- Composant principal ---------- */

export function CommandesList({ orders }: { orders: OrderListItem[] }) {
  const router = useRouter();

  if (orders.length === 0) return <EmptyState />;

  const handleRowClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-3">
      {/* ===================== MOBILE : Cartes en Grille 2 Colonnes ===================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleRowClick(order.id)}
            className="group relative overflow-hidden rounded-2xl border border-[var(--laiton,#B9793E)]/20 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[var(--laiton,#B9793E)]/50 hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            {/* Direct Link Accent Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--laiton,#B9793E)]/10 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Top row */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tracking-tight group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                  {order.orderNumber}
                </span>
                {isStale(order) && <StaleBadge />}
              </div>
              <span className="text-[11px] font-sans text-[var(--obsidienne,#0E0B09)]/45 shrink-0">{timeAgo(order.createdAt)}</span>
            </div>

            {/* Customer details */}
            <div className="mb-3 flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold text-[var(--obsidienne,#0E0B09)] truncate">
                  {order.customerName}
                </p>
                <p className="text-xs font-mono text-[var(--obsidienne,#0E0B09)]/55 tabular-nums truncate">
                  {order.customerPhone}
                </p>
              </div>

              <a
                href={whatsAppUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white shadow-2xs"
                title="Contacter sur WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>

            {/* Badges + Total */}
            <div className="pt-3 border-t border-[var(--laiton,#B9793E)]/15 flex flex-col gap-2">
              <div className="flex flex-wrap gap-1.5 items-center">
                <StatusBadge status={order.status} />
                <PaymentBadge order={order} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[var(--obsidienne,#0E0B09)]/60">
                  <ShoppingBag className="h-3.5 w-3.5 text-[var(--laiton,#B9793E)]" />
                  {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}
                </span>
                <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                  {formatFCFA(order.total)} <span className="text-[10px] font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== DESKTOP : Liste Éditoriale Haute Joaillerie ===================== */}
      <div className="hidden lg:block space-y-2.5">
        {/* En-tête des colonnes */}
        <div className="grid grid-cols-[150px_1fr_90px_140px_170px_130px_80px] items-center gap-4 px-6 py-2 text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
          <span>Commande</span>
          <span>Cliente</span>
          <span>Produits</span>
          <span>Total</span>
          <span>Paiement</span>
          <span>Statut</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Lignes de commandes */}
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleRowClick(order.id)}
            className="group relative grid grid-cols-[150px_1fr_90px_140px_170px_130px_80px] items-center gap-4 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-white px-6 py-4 shadow-2xs transition-all duration-200 hover:border-[var(--laiton,#B9793E)]/40 hover:shadow-md cursor-pointer"
          >
            {/* Commande */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-[var(--obsidienne,#0E0B09)] tracking-tight group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                  {order.orderNumber}
                </span>
                {isStale(order) && <StaleBadge />}
              </div>
              <span className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/45 block mt-0.5">{timeAgo(order.createdAt)}</span>
            </div>

            {/* Cliente */}
            <div className="min-w-0">
              <p className="truncate font-sans text-sm font-semibold text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors">
                {order.customerName}
              </p>
              <p className="text-xs font-mono text-[var(--obsidienne,#0E0B09)]/50 tabular-nums">{order.customerPhone}</p>
            </div>

            {/* Produits */}
            <div>
              <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums bg-[var(--porcelaine,#F1ECE3)] px-3 py-1 rounded-full border border-[var(--laiton,#B9793E)]/20 shadow-2xs">
                {order.itemsCount}
              </span>
            </div>

            {/* Total */}
            <div>
              <span className="font-mono text-base font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums">
                {formatFCFA(order.total)} <span className="text-xs font-sans font-normal text-[var(--obsidienne,#0E0B09)]/60">FCFA</span>
              </span>
            </div>

            {/* Paiement */}
            <div>
              <PaymentBadge order={order} />
            </div>

            {/* Statut */}
            <div>
              <StatusBadge status={order.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5">
              <Link
                href={`/admin/orders/${order.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[var(--laiton,#B9793E)]/25 bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] transition-all hover:bg-[var(--laiton,#B9793E)] hover:scale-105 shadow-2xs"
                title="Voir la fiche"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="h-3.5 w-3.5 stroke-[1.5]" />
              </Link>
              <a
                href={whatsAppUrl(order)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 transition-all hover:bg-emerald-600 hover:text-white hover:scale-105 shadow-2xs"
                title="WhatsApp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}