import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt: string;
}

interface RecentOrdersProps {
  isEmpty?: boolean;
}

const statusConfig = {
  pending: {
    label: "En attente",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "Confirmée",
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  delivered: {
    label: "Livrée",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Annulée",
    color: "bg-red-50 text-red-700 border-red-200",
  },
};

export function RecentOrders({ isEmpty = true }: RecentOrdersProps) {
  // Mock data
  const orders: Order[] = isEmpty
    ? []
    : [
        {
          id: "1",
          orderNumber: "CMD-2024-001",
          customerName: "Fatou Diallo",
          amount: 125000,
          status: "pending",
          createdAt: "Il y a 2 heures",
        },
        {
          id: "2",
          orderNumber: "CMD-2024-002",
          customerName: "Aminata Sow",
          amount: 85000,
          status: "confirmed",
          createdAt: "Il y a 5 heures",
        },
        {
          id: "3",
          orderNumber: "CMD-2024-003",
          customerName: "Moussa Ndiaye",
          amount: 200000,
          status: "delivered",
          createdAt: "Hier",
        },
      ];

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Commandes récentes
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucune commande" : `${orders.length} dernière(s) commande(s)`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Voir tout
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="text-center">
              {/* Empty state icon */}
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ivory)]">
                <svg
                  className="h-6 w-6 text-[var(--gold-dark)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              {/* Empty state text */}
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
                Aucune commande
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Les nouvelles commandes apparaîtront ici
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                          statusConfig[order.status].color
                        }`}
                      >
                        {statusConfig[order.status].label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {order.customerName}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-[var(--gold-dark)]">
                        {formatAmount(order.amount)}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-400">{order.createdAt}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-0.5 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
