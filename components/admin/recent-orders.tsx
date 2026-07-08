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
    color: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200/50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  confirmed: {
    label: "Confirmée",
    color: "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200/50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  shipped: {
    label: "Expédiée",
    color: "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200/50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
      </svg>
    ),
  },
  delivered: {
    label: "Livrée",
    color: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/50",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  cancelled: {
    label: "Annulée",
    color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200/50",
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

  const actualOrders = isEmpty ? [] : orders.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
            Commandes
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
            {isEmpty ? "Aucune commande" : "Commandes récentes"}
          </h2>
          {!isEmpty && actualOrders.length > 0 && (
            <p className="text-xs text-[var(--text-dark)]/50 mt-1">
              {actualOrders.length} dernière{actualOrders.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!isEmpty && actualOrders.length > 0 && (
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors group"
          >
            <span>Voir tout</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty || actualOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            {/* Empty state icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ivory)] to-[var(--gold)]/10 ring-1 ring-inset ring-[var(--gold)]/20">
              <svg
                className="h-8 w-8 text-[var(--gold-dark)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            {/* Empty state text */}
            <h3 className="text-base font-bold text-[var(--text-dark)] mb-2">
              Aucune commande
            </h3>
            <p className="text-sm text-[var(--text-dark)]/50 mb-6 max-w-xs mx-auto leading-relaxed">
              Les nouvelles commandes apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {actualOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="group block p-4 rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/25 bg-white hover:bg-gradient-to-br hover:from-[var(--ivory)]/40 hover:to-transparent transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  {/* Status icon with color */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate">
                        {order.order_number}
                      </h3>
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${statusConfig[order.status].color}`}
                      >
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-dark)]/60 mb-1.5 truncate font-medium">
                      {order.customer_name}
                    </p>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[var(--text-dark)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-sm font-bold text-[var(--gold-dark)]">
                          {formatAmount(order.total)} FCFA
                        </span>
                      </div>
                      <span className="text-[var(--text-dark)]/15 hidden sm:inline">•</span>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[var(--text-dark)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-medium text-[var(--text-dark)]/60">
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-5 w-5 shrink-0 text-[var(--text-dark)]/25 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
