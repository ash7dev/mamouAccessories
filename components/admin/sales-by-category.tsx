import Link from "next/link";

interface CategorySales {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
  color: string;
}

interface SalesByCategoryProps {
  isEmpty?: boolean;
}

export function SalesByCategory({ isEmpty = true }: SalesByCategoryProps) {
  // Mock data
  const categories: CategorySales[] = isEmpty
    ? []
    : [
        {
          id: "1",
          name: "Colliers",
          sales: 45,
          revenue: 1250000,
          percentage: 35,
          color: "bg-[var(--gold)]",
        },
        {
          id: "2",
          name: "Boucles d'oreilles",
          sales: 38,
          revenue: 980000,
          percentage: 28,
          color: "bg-blue-500",
        },
        {
          id: "3",
          name: "Bracelets",
          sales: 32,
          revenue: 850000,
          percentage: 24,
          color: "bg-purple-500",
        },
        {
          id: "4",
          name: "Bagues",
          sales: 18,
          revenue: 450000,
          percentage: 13,
          color: "bg-green-500",
        },
      ];

  const formatRevenue = (amount: number) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + "M FCFA";
    }
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
  };

  const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Ventes par catégorie
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucune vente" : `${formatRevenue(totalRevenue)} au total`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/categories"
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>

              {/* Empty state text */}
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
                Pas encore de ventes
              </h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Les statistiques par catégorie apparaîtront après les premières ventes
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/admin/categories/${category.id}`}
                className="group block"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`h-3 w-3 rounded-full ${category.color} shrink-0`} />
                    <span className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-600 ml-2">
                    {category.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full ${category.color} transition-all group-hover:opacity-80`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {category.sales} vente{category.sales > 1 ? "s" : ""}
                  </span>
                  <span className="font-medium text-[var(--gold-dark)]">
                    {formatRevenue(category.revenue)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
