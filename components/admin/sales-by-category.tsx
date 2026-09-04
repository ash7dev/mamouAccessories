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
  const categories: CategorySales[] = isEmpty
    ? []
    : [
        {
          id: "1",
          name: "Colliers",
          sales: 45,
          revenue: 1250000,
          percentage: 35,
          color: "bg-[var(--emeraude,#2F5233)]",
        },
        {
          id: "2",
          name: "Bagues",
          sales: 38,
          revenue: 980000,
          percentage: 28,
          color: "bg-[var(--grenat,#7A2E32)]",
        },
        {
          id: "3",
          name: "Bracelets & Boucles",
          sales: 32,
          revenue: 850000,
          percentage: 24,
          color: "bg-[var(--saphir,#24425F)]",
        },
        {
          id: "4",
          name: "Ensembles",
          sales: 18,
          revenue: 450000,
          percentage: 13,
          color: "bg-[var(--laiton,#B9793E)]",
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
    <div className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/20 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] mb-0.5">
            Répartition
          </p>
          <h2 className="font-serif text-lg font-semibold text-[var(--obsidienne,#0E0B09)]">
            Ventes par catégorie
          </h2>
          {!isEmpty && (
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/60 mt-0.5">
              Total : <span className="font-mono font-bold text-[var(--laiton,#B9793E)] tabular-nums">{formatRevenue(totalRevenue)}</span>
            </p>
          )}
        </div>

        {!isEmpty && (
          <Link
            href="/admin/categories"
            className="text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--laiton-clair,#D9AE78)] transition-colors"
          >
            Gérer
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center py-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
              </svg>
            </div>

            <h3 className="font-serif text-sm font-medium text-[var(--obsidienne,#0E0B09)] mb-1">
              Statistiques à venir
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 max-w-xs mx-auto">
              La répartition par catégorie de produit s&apos;affichera au fil des commandes.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-3.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/admin/categories/${category.id}`}
                className="group block"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`h-2.5 w-2.5 rounded-full ${category.color} shrink-0`} />
                    <span className="font-serif text-xs font-medium text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] ml-2 tabular-nums">
                    {category.percentage}%
                  </span>
                </div>

                <div className="h-2 bg-[var(--porcelaine,#F1ECE3)] rounded-full overflow-hidden mb-1">
                  <div
                    className={`h-full ${category.color} transition-all group-hover:opacity-90`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-sans text-[var(--obsidienne,#0E0B09)]/50">
                    {category.sales} vente{category.sales > 1 ? "s" : ""}
                  </span>
                  <span className="font-mono font-bold text-[var(--laiton,#B9793E)] tabular-nums">
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
