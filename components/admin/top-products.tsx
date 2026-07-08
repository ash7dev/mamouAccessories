import Link from "next/link";
import Image from "next/image";

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
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      maximumFractionDigits: 0
    }).format(amount);
  };

  const actualProducts = isEmpty ? [] : products.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--gold)]/15 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
            Top produits
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
            {isEmpty ? "Aucune vente" : "Meilleures ventes du mois"}
          </h2>
        </div>

        {!isEmpty && actualProducts.length > 0 && (
          <Link
            href="/admin/products"
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
        {isEmpty || actualProducts.length === 0 ? (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            {/* Empty state text */}
            <h3 className="text-base font-bold text-[var(--text-dark)] mb-2">
              Aucune vente pour le moment
            </h3>
            <p className="text-sm text-[var(--text-dark)]/50 mb-6 max-w-xs mx-auto leading-relaxed">
              Ajoutez vos premiers produits pour commencer à vendre.
            </p>

            {/* CTA Button */}
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--gold-dark)] hover:bg-[var(--gold)] text-white rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {actualProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group block p-4 rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/25 bg-white hover:bg-gradient-to-br hover:from-[var(--ivory)]/40 hover:to-transparent transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  {/* Rank badge with medal icons for top 3 */}
                  <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-transform group-hover:scale-105 ${
                    product.rank === 1
                      ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white shadow-md'
                      : product.rank === 2
                        ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8] text-white shadow-md'
                        : product.rank === 3
                          ? 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D] text-white shadow-md'
                          : 'bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/20'
                  }`}>
                    {product.rank <= 3 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ) : (
                      <span>#{product.rank}</span>
                    )}
                  </div>

                  {/* Product image */}
                  <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-[var(--ivory)]/50 shadow-sm ring-1 ring-inset ring-[var(--gold)]/10 transition-transform group-hover:scale-105">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          className="h-7 w-7 text-[var(--gold)]/25"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-[var(--text-dark)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="text-xs font-medium text-[var(--text-dark)]/60">
                          {product.sales} vente{product.sales > 1 ? "s" : ""}
                        </p>
                      </div>
                      <span className="text-[var(--text-dark)]/15">•</span>
                      <p className="text-sm font-bold text-[var(--gold-dark)]">
                        {formatRevenue(product.revenue)} FCFA
                      </p>
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
