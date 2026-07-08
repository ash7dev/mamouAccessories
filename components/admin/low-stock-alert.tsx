import Link from "next/link";

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  threshold: number;
}

interface LowStockAlertProps {
  isEmpty?: boolean;
}

export function LowStockAlert({ isEmpty = true }: LowStockAlertProps) {
  // Mock data
  const products: LowStockProduct[] = isEmpty
    ? []
    : [
        {
          id: "1",
          name: "Collier perles naturelles",
          stock: 2,
          threshold: 5,
        },
        {
          id: "2",
          name: "Bague solitaire diamant",
          stock: 1,
          threshold: 5,
        },
        {
          id: "3",
          name: "Bracelet cuir tressé",
          stock: 3,
          threshold: 5,
        },
      ];

  const getStockStatusColor = (stock: number) => {
    if (stock === 0) return "text-red-600 bg-red-50";
    if (stock <= 2) return "text-orange-600 bg-orange-50";
    return "text-yellow-600 bg-yellow-50";
  };

  const getStockStatusLabel = (stock: number) => {
    if (stock === 0) return "Rupture";
    if (stock <= 2) return "Critique";
    return "Faible";
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Alerte stock
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Stock OK" : `${products.length} produit(s) en alerte`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/products?filter=low-stock"
            className="text-xs font-medium text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Gérer
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {isEmpty ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="text-center">
              {/* Empty state icon */}
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              {/* Empty state text */}
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
                Tout va bien !
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Tous vos produits ont un stock suffisant
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Alert icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
                    <svg
                      className="h-4 w-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getStockStatusColor(
                          product.stock
                        )}`}
                      >
                        {getStockStatusLabel(product.stock)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.stock} en stock
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-0.5"
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
