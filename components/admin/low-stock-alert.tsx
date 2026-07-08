import Link from "next/link";

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  image?: string | null;
}

interface LowStockAlertProps {
  products?: LowStockProduct[];
  isEmpty?: boolean;
}

export function LowStockAlert({ products = [], isEmpty = false }: LowStockAlertProps) {
  const actualProducts = isEmpty ? [] : products.slice(0, 5);

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
    <div className="bg-white rounded-3xl p-6 border border-[var(--gold)]/15 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
            Alerte stock
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
            {isEmpty ? "Stock OK" : `${actualProducts.length} produit(s) en alerte`}
          </h2>
        </div>

        {!isEmpty && actualProducts.length > 0 && (
          <Link
            href="/admin/products?filter=low-stock"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors group"
          >
            <span>Gérer</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {isEmpty || actualProducts.length === 0 ? (
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
              <p className="text-xs text-[var(--text-dark)]/50 max-w-xs mx-auto">
                Tous vos produits ont un stock suffisant
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {actualProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group block p-3 rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Alert icon */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50">
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

                  {/* Product image */}
                  <div className="h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-[var(--ivory)]/70 shadow-sm">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          className="h-6 w-6 text-[var(--gold)]/30"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    )}
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
                      <span className="text-xs text-[var(--text-dark)]/50">
                        {product.stock} en stock
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 shrink-0 text-[var(--text-dark)]/30 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-0.5"
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
