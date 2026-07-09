/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Link from "next/link";

/* ============================================================
   Liste des commandes — /admin/orders

   S'affiche sous <CommandeHeader /> (le parent filtre selon
   l'onglet actif et la recherche, puis passe `orders` ici).

   - Mobile  : cartes empilées
   - Desktop : rangées détaillées
   - Toute la carte/rangée est cliquable → fiche commande
   - Bouton WhatsApp direct sur chaque commande
   ============================================================ */

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "unpaid" | "pending_verification" | "paid" | "refunded";

export interface OrderListItem {
  id: string;
  orderNumber: string; // ex : CMD-2026-0042
  customerName: string;
  customerPhone: string; // +221XXXXXXXXX
  itemsCount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "wave" | "cash_on_delivery";
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO
}

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/** "il y a 5 min", "il y a 3 h", "hier", "il y a 4 j" */
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
  // Commande en attente depuis plus de 24 h → à relancer
  const hours = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
  return order.status === "pending" && hours >= 24;
}

/* ---------- Badges ---------- */

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "À traiter", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmée", className: "bg-emerald-600/10 text-emerald-700" },
  shipped: { label: "Expédiée", className: "bg-sky-600/10 text-sky-700" },
  delivered: { label: "Livrée", className: "bg-[var(--text-dark)]/8 text-[var(--text-dark)]/60" },
  cancelled: { label: "Annulée", className: "bg-red-600/10 text-red-600" },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const c = statusConfig[status];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${c.className}`}>
      {c.label}
    </span>
  );
}

function PaymentBadge({ order }: { order: OrderListItem }) {
  // Le paiement à vérifier est LA priorité : badge doré bien visible
  if (order.paymentStatus === "pending_verification") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)]/15 px-2.5 py-1 text-[11px] font-bold text-[var(--gold-dark)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--gold-dark)]" />
        Wave · à vérifier
      </span>
    );
  }
  if (order.paymentStatus === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        ✓ {order.paymentMethod === "wave" ? "Wave" : "Espèces"}
      </span>
    );
  }
  if (order.paymentStatus === "refunded") {
    return (
      <span className="inline-flex rounded-full bg-[var(--text-dark)]/8 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-dark)]/50">
        Remboursée
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-[var(--text-dark)]/8 px-2.5 py-1 text-[11px] font-medium text-[var(--text-dark)]/55">
      {order.paymentMethod === "wave" ? "Wave · non payé" : "À la livraison"}
    </span>
  );
}

function StaleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-600/10 px-2 py-0.5 text-[10px] font-bold text-red-600">
      ⏱ +24 h
    </span>
  );
}

/* ---------- Icônes ---------- */

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InboxIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
    </svg>
  );
}

/* ---------- WhatsApp : message pré-rempli selon le contexte ---------- */

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

function WhatsAppButton({ order, className = "" }: { order: OrderListItem; className?: string }) {
  return (
    <a
      href={whatsAppUrl(order)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white ${className}`}
      title={`Écrire à ${order.customerName} sur WhatsApp`}
    >
      <WhatsAppIcon />
    </a>
  );
}

/* ---------- État vide ---------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-[var(--gold)]/15 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
      <div className="relative mb-5">
        <div aria-hidden className="absolute -inset-3 rounded-full border border-[var(--gold)]/15" />
        <div aria-hidden className="absolute -inset-1.5 rounded-full border border-[var(--gold)]/25" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/25">
          <InboxIcon />
        </div>
      </div>
      <h3 className="mb-1 text-base font-bold text-[var(--text-dark)]">Aucune commande ici</h3>
      <p className="max-w-sm text-sm leading-relaxed text-[var(--text-dark)]/50">
        Les commandes correspondant à ce filtre apparaîtront dans cette liste.
      </p>
    </div>
  );
}

/* ---------- Composant principal ---------- */

export function CommandesList({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) return <EmptyState />;

  return (
    <div className="mx-auto max-w-5xl">
      {/* ===================== MOBILE : cartes ===================== */}
      <div className="space-y-3 lg:hidden">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => window.location.href = `/admin/orders/${order.id}`}
            className="cursor-pointer block rounded-3xl border border-[var(--gold)]/15 bg-white p-4 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] transition-transform active:scale-[0.99]"
          >
            {/* Ligne 1 : n° + heure + urgence */}
            <div className="mb-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-dark)]">
                  {order.orderNumber}
                </span>
                {isStale(order) && <StaleBadge />}
              </div>
              <span className="text-xs text-[var(--text-dark)]/40">{timeAgo(order.createdAt)}</span>
            </div>

            {/* Ligne 2 : cliente + WhatsApp */}
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-dark)]">
                  {order.customerName}
                </p>
                <p className="text-xs text-[var(--text-dark)]/45 tabular-nums">
                  {order.customerPhone} · {order.itemsCount} article{order.itemsCount > 1 ? "s" : ""}
                </p>
              </div>
              <WhatsAppButton order={order} className="shrink-0" />
            </div>

            {/* Ligne 3 : badges + total */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                <StatusBadge status={order.status} />
                <PaymentBadge order={order} />
              </div>
              <span className="text-base font-bold text-[var(--text-dark)] tabular-nums">
                {formatFCFA(order.total)} F
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===================== DESKTOP : rangées ===================== */}
      <div className="hidden overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] lg:block">
        <div className="grid grid-cols-[150px_1fr_90px_120px_170px_120px_56px] items-center gap-4 border-b border-[var(--gold)]/10 bg-[var(--ivory)]/40 px-6 py-3">
          {["Commande", "Cliente", "Articles", "Total", "Paiement", "Statut", ""].map((h, i) => (
            <span
              key={i}
              className={`text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-dark)]/40 ${
                i === 2 || i === 3 ? "text-right" : ""
              }`}
            >
              {h}
            </span>
          ))}
        </div>

        <div className="divide-y divide-[var(--gold)]/8">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => window.location.href = `/admin/orders/${order.id}`}
              className="group grid grid-cols-[150px_1fr_90px_120px_170px_120px_56px] items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[var(--ivory)]/30 cursor-pointer"
            >
              {/* Commande */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-[var(--text-dark)]">
                    {order.orderNumber}
                  </span>
                  {isStale(order) && <StaleBadge />}
                </div>
                <span className="text-xs text-[var(--text-dark)]/40">{timeAgo(order.createdAt)}</span>
              </div>

              {/* Cliente */}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-dark)]">
                  {order.customerName}
                </p>
                <p className="text-xs text-[var(--text-dark)]/45 tabular-nums">{order.customerPhone}</p>
              </div>

              {/* Articles */}
              <span className="text-right text-sm text-[var(--text-dark)]/60 tabular-nums">
                {order.itemsCount}
              </span>

              {/* Total */}
              <span className="text-right text-sm font-bold text-[var(--text-dark)] tabular-nums">
                {formatFCFA(order.total)} F
              </span>

              {/* Paiement */}
              <div>
                <PaymentBadge order={order} />
              </div>

              {/* Statut */}
              <div>
                <StatusBadge status={order.status} />
              </div>

              {/* WhatsApp */}
              <WhatsAppButton
                order={order}
                className="ml-auto opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}