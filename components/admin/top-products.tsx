import Link from "next/link";

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string | null;
  rank: number;
}

interface TopProductsProps {
  products?: Product[];
  isEmpty?: boolean;
}

export function TopProducts({ products = [], isEmpty = false }: TopProductsProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const actualProducts = isEmpty ? [] : products.slice(0, 5);

  return (
    <section className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/25 shadow-[0_8px_30px_-6px_rgba(14,11,9,0.06)] h-full flex flex-col justify-between relative overflow-hidden">
      {/* Top Gold Accent Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--laiton,#B9793E)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--laiton,#B9793E)] text-xs font-serif">✦</span>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[var(--laiton,#B9793E)]">
              Performance Produits
            </p>
          </div>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)] mt-0.5">
            {isEmpty ? "Vitrine catalogue" : "Meilleures ventes & Tendance"}
          </h2>
        </div>

        {!isEmpty && actualProducts.length > 0 && (
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] transition-colors group"
          >
            <span>Catalogue</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] group-hover:bg-[var(--obsidienne,#0E0B09)] group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        )}
      </div>

      {/* Content List */}
      <div className="flex-1 flex flex-col justify-center">
        {isEmpty || actualProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/50 border border-[var(--laiton)]/15 py-10 px-4 text-center">
            <div className="relative mb-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20 shadow-xs">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </div>
            </div>

            <h3 className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-1">
              Catalogue en cours de création
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 mb-5 max-w-xs leading-relaxed">
              Ajoutez vos premiers produits pour suivre leurs performances.
            </p>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)] rounded-full text-xs font-sans font-bold tracking-wider uppercase shadow-md hover:bg-[var(--laiton,#B9793E)] transition-colors active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {actualProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-gradient-to-r from-[var(--porcelaine,#F1ECE3)]/30 to-white hover:from-white hover:to-white hover:border-[var(--laiton,#B9793E)]/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                {/* Left Accent Glow */}
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--laiton,#B9793E)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank badge */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-transform group-hover:scale-105 ${
                    product.rank === 1
                      ? 'bg-gradient-to-br from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] shadow-xs'
                      : product.rank === 2
                        ? 'bg-[var(--obsidienne,#0E0B09)] text-[var(--porcelaine,#F1ECE3)]'
                        : product.rank === 3
                          ? 'bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/30'
                          : 'bg-gray-100 text-gray-600'
                  }`}>
                    #{product.rank}
                  </div>

                  {/* Product thumbnail */}
                  <div className="h-11 w-11 shrink-0 rounded-xl overflow-hidden bg-[var(--porcelaine,#F1ECE3)] border border-[var(--laiton,#B9793E)]/25 shadow-xs group-hover:border-[var(--laiton)] transition-colors">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[var(--laiton,#B9793E)]/60 text-xs">
                        💎
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <h3 className="font-serif text-xs font-semibold text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate mb-0.5">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center text-[10px] font-sans font-bold text-[var(--laiton,#B9793E)] bg-[var(--porcelaine,#F1ECE3)] px-2 py-0.5 rounded-full border border-[var(--laiton,#B9793E)]/20">
                        {product.sales > 0 ? `${product.sales} vente${product.sales > 1 ? "s" : ""}` : "Vitrine"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <span className="block font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] tabular-nums tracking-tight">
                      {formatAmount(product.revenue)}{" "}
                      <span className="text-[9px] font-sans text-[var(--laiton,#B9793E)] font-bold">FCFA</span>
                    </span>
                  </div>

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--obsidienne,#0E0B09)]/40 transition-all duration-300 group-hover:bg-[var(--laiton,#B9793E)] group-hover:text-white group-hover:translate-x-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
