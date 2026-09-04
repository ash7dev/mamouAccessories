import Link from "next/link";

interface RawOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
}

interface RecentOrdersProps {
  orders: RawOrder[];
  isEmpty?: boolean;
}

const statusConfig = {
  pending: {
    label: "En attente",
    bg: "bg-amber-50 text-amber-800 border-amber-200/80",
    dot: "bg-amber-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  confirmed: {
    label: "Confirmée",
    bg: "bg-sky-50 text-sky-800 border-sky-200/80",
    dot: "bg-sky-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  shipped: {
    label: "Expédiée",
    bg: "bg-purple-50 text-purple-800 border-purple-200/80",
    dot: "bg-purple-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  delivered: {
    label: "Livrée",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    dot: "bg-emerald-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  cancelled: {
    label: "Annulée",
    bg: "bg-rose-50 text-rose-800 border-rose-200/80",
    dot: "bg-rose-500",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
};

export function RecentOrders({ orders, isEmpty = false }: RecentOrdersProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getInitials = (name: string) => {
    if (!name) return "MA";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const actualOrders = isEmpty ? [] : orders.slice(0, 5);

  return (
    <section className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/25 shadow-[0_8px_30px_-6px_rgba(14,11,9,0.06)] h-full flex flex-col justify-between relative overflow-hidden">
      {/* Top Gold Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--laiton,#B9793E)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--laiton,#B9793E)] text-xs font-serif">✦</span>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[var(--laiton,#B9793E)]">
              Activité Ventes
            </p>
          </div>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)] mt-0.5">
            {isEmpty ? "Aucune commande" : "Commandes récentes"}
          </h2>
        </div>

        {!isEmpty && actualOrders.length > 0 && (
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] transition-colors group"
          >
            <span>Voir tout</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] group-hover:bg-[var(--obsidienne,#0E0B09)] group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        )}
      </div>

      {/* List / Content */}
      <div className="flex-1 flex flex-col justify-center">
        {isEmpty || actualOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/50 border border-[var(--laiton)]/15 py-10 px-4 text-center">
            <div className="relative mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20 shadow-xs">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
            </div>

            <h3 className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-1">
              Aucune commande enregistrée
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 max-w-xs leading-relaxed">
              Les achats de vos clientes apparaîtront ici dès leur enregistrement.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {actualOrders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const initials = getInitials(order.customer_name);

              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-gradient-to-r from-[var(--porcelaine,#F1ECE3)]/30 to-white hover:from-white hover:to-white hover:border-[var(--laiton,#B9793E)]/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Left Accent Glow */}
                  <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--laiton,#B9793E)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Customer Avatar Circle */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] font-serif font-bold text-xs shadow-xs border border-[var(--laiton,#B9793E)]/30 group-hover:border-[var(--laiton)] group-hover:scale-105 transition-all">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--laiton,#B9793E)] tracking-wider">
                          {order.order_number}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-sans font-bold border ${statusInfo.bg}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </div>
                      
                      <p className="text-xs font-serif font-medium text-[var(--obsidienne,#0E0B09)] truncate mt-0.5">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <span className="block font-mono text-sm font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums tracking-tight">
                        {formatAmount(order.total)}{" "}
                        <span className="text-[10px] font-sans text-[var(--laiton,#B9793E)] font-bold">FCFA</span>
                      </span>
                      <span className="block text-[10px] font-sans font-semibold text-[var(--obsidienne,#0E0B09)]/40">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--obsidienne,#0E0B09)]/40 transition-all duration-300 group-hover:bg-[var(--laiton,#B9793E)] group-hover:text-white group-hover:translate-x-0.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
