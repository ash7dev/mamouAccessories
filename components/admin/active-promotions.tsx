import Link from "next/link";

interface Promotion {
  id: string;
  name: string;
  code?: string;
  discount: number;
  type: "percentage" | "fixed";
  uses: number;
  maxUses?: number;
  expiresAt: string;
  daysLeft: number;
}

interface ActivePromotionsProps {
  isEmpty?: boolean;
}

export function ActivePromotions({ isEmpty = true }: ActivePromotionsProps) {
  // Mock data
  const promotions: Promotion[] = isEmpty
    ? []
    : [
        {
          id: "1",
          name: "Soldes d'été",
          code: "ETE2024",
          discount: 20,
          type: "percentage",
          uses: 45,
          maxUses: 100,
          expiresAt: "31 Juillet",
          daysLeft: 15,
        },
        {
          id: "2",
          name: "Nouveau client",
          code: "BIENVENUE",
          discount: 10,
          type: "percentage",
          uses: 12,
          maxUses: 50,
          expiresAt: "31 Décembre",
          daysLeft: 178,
        },
        {
          id: "3",
          name: "Promo flash",
          discount: 5000,
          type: "fixed",
          uses: 8,
          expiresAt: "15 Juillet",
          daysLeft: 2,
        },
      ];

  const formatDiscount = (discount: number, type: string) => {
    return type === "percentage" ? `-${discount}%` : `-${discount} FCFA`;
  };

  const getExpiryColor = (daysLeft: number) => {
    if (daysLeft <= 3) return "text-red-600 bg-red-50";
    if (daysLeft <= 7) return "text-orange-600 bg-orange-50";
    return "text-green-600 bg-green-50";
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Promotions actives
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucune promotion" : `${promotions.length} promotion(s)`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/promotions"
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
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>

              {/* Empty state text */}
              <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
                Aucune promotion active
              </h3>
              <p className="text-xs text-gray-500 mb-3 max-w-xs mx-auto">
                Créez des promotions pour booster vos ventes
              </p>

              {/* CTA Button */}
              <Link
                href="/admin/promotions/new"
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
                Créer une promotion
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {promotions.map((promo) => (
              <Link
                key={promo.id}
                href={`/admin/promotions/${promo.id}`}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors">
                        {promo.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--gold)]/10 text-[var(--gold-dark)]">
                        {formatDiscount(promo.discount, promo.type)}
                      </span>
                    </div>

                    {promo.code && (
                      <div className="flex items-center gap-2 mb-1.5">
                        <code className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-mono font-semibold text-gray-700">
                          {promo.code}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-3 w-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="text-gray-600">
                      {promo.uses}
                      {promo.maxUses ? `/${promo.maxUses}` : ""} utilisations
                    </span>
                  </div>

                  <span className="text-gray-300">•</span>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getExpiryColor(promo.daysLeft)}`}>
                    {promo.daysLeft} jour{promo.daysLeft > 1 ? "s" : ""} restant{promo.daysLeft > 1 ? "s" : ""}
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
