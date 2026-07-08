import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

interface TopProductsProps {
  isEmpty?: boolean;
}

export function TopProducts({ isEmpty = true }: TopProductsProps) {
  // Mock data - will be replaced with real data later
  const products: Product[] = isEmpty
    ? []
    : [
        {
          id: "1",
          name: "Collier en or 18k",
          sales: 24,
          revenue: 480000,
          image: "/placeholder.jpg",
        },
        {
          id: "2",
          name: "Boucles d'oreilles diamant",
          sales: 18,
          revenue: 360000,
          image: "/placeholder.jpg",
        },
        {
          id: "3",
          name: "Bracelet argent",
          sales: 15,
          revenue: 225000,
          image: "/placeholder.jpg",
        },
      ];

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Top produits
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucune vente" : "Meilleures ventes du mois"}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/products"
            className="text-xs font-medium text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Voir tout
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center py-8">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            {/* Empty state text */}
            <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
              Aucune vente pour le moment
            </h3>
            <p className="text-xs text-gray-500 mb-3 max-w-xs mx-auto">
              Ajoutez vos premiers produits pour commencer à vendre.
            </p>

            {/* CTA Button */}
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gold-dark)] hover:bg-[var(--gold)] text-white rounded-lg text-xs font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Ajouter un produit
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {products.map((product, index) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  {/* Rank badge */}
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--ivory)] text-xs font-bold text-[var(--gold-dark)]">
                    #{index + 1}
                  </div>

                  {/* Product image placeholder */}
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500">
                        {product.sales} vente{product.sales > 1 ? "s" : ""}
                      </p>
                      <span className="text-xs text-gray-300">•</span>
                      <p className="text-xs font-medium text-[var(--gold-dark)]">
                        {formatRevenue(product.revenue)}
                      </p>
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
