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
    if (stock === 0) return "text-rose-700 bg-rose-500/10 border-rose-500/20";
    if (stock <= 2) return "text-amber-700 bg-amber-500/10 border-amber-500/20";
    return "text-[var(--laiton,#B9793E)] bg-[var(--laiton)]/10 border-[var(--laiton)]/20";
  };

  const getStockStatusLabel = (stock: number) => {
    if (stock === 0) return "Rupture";
    if (stock <= 2) return "Critique";
    return "Faible";
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/20 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] mb-1">
            Inventaire
          </p>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)]">
            {isEmpty ? "Stock conforme" : "Alertes de réapprovisionnement"}
          </h2>
        </div>

        {!isEmpty && actualProducts.length > 0 && (
          <Link
            href="/admin/products?filter=low-stock"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--laiton-clair,#D9AE78)] transition-colors group"
          >
            <span>Réassort</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty || actualProducts.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h3 className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-1">
              Stocks optimaux
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 max-w-xs mx-auto">
              Tous vos produits disposent d&apos;un niveau de stock suffisant.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {actualProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group block p-3 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-[var(--porcelaine,#F1ECE3)]/30 hover:border-[var(--laiton)]/40 hover:bg-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton)]/20 shadow-xs">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--laiton,#B9793E)]/40">
                        ◆
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xs font-medium text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold border ${getStockStatusColor(
                          product.stock
                        )}`}
                      >
                        {getStockStatusLabel(product.stock)}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[var(--obsidienne,#0E0B09)]/60 tabular-nums">
                        {product.stock} pièce{product.stock > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <svg
                    className="h-4 w-4 shrink-0 text-[var(--laiton,#B9793E)]/40 transition-all group-hover:text-[var(--laiton)] group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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
