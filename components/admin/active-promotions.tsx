import Link from "next/link";

interface RawPromotion {
  id: string;
  name: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string;
  end_date: string;
  applies_to: "all_products" | "specific_category" | "specific_products";
  min_purchase_amount: number;
  max_discount_amount: number | null;
  is_active: boolean;
  usage_count: number;
  created_at: string;
}

interface ActivePromotionsProps {
  promotions: RawPromotion[];
  isEmpty?: boolean;
}

export function ActivePromotions({ promotions, isEmpty = false }: ActivePromotionsProps) {
  const formatDiscount = (value: number, type: string) => {
    if (type === "percentage") {
      return `-${value}%`;
    }
    return `-${new Intl.NumberFormat("fr-FR").format(value)} FCFA`;
  };

  const calculateDaysLeft = (endDate: string): number => {
    const end = new Date(endDate);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getExpiryConfig = (daysLeft: number) => {
    if (daysLeft <= 3) {
      return {
        color: "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200/50",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    }
    if (daysLeft <= 7) {
      return {
        color: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200/50",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    }
    return {
      color: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200/50",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  };

  const getAppliesToLabel = (appliesTo: string) => {
    switch (appliesTo) {
      case "all_products":
        return "Tous les produits";
      case "specific_category":
        return "Catégorie spécifique";
      case "specific_products":
        return "Produits spécifiques";
      default:
        return appliesTo;
    }
  };

  const actualPromotions = isEmpty ? [] : promotions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
            Promotions
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
            {isEmpty || actualPromotions.length === 0 ? "Aucune promotion active" : "Promotions actives"}
          </h2>
          {!isEmpty && actualPromotions.length > 0 && (
            <p className="text-xs text-[var(--text-dark)]/50 mt-1">
              {actualPromotions.length} active{actualPromotions.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {!isEmpty && actualPromotions.length > 0 && (
          <Link
            href="/admin/promotions"
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
      <div className="flex-1 flex items-center justify-center">
        {isEmpty || actualPromotions.length === 0 ? (
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
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>

            {/* Empty state text */}
            <h3 className="text-base font-bold text-[var(--text-dark)] mb-2">
              Aucune promotion active
            </h3>
            <p className="text-sm text-[var(--text-dark)]/50 mb-6 max-w-xs mx-auto leading-relaxed">
              Créez des promotions pour booster vos ventes
            </p>

            {/* CTA Button */}
            <Link
              href="/admin/promotions/new"
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
              Créer une promotion
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {actualPromotions.map((promo) => {
              const daysLeft = calculateDaysLeft(promo.end_date);
              const expiryConfig = getExpiryConfig(daysLeft);

              return (
                <Link
                  key={promo.id}
                  href={`/admin/promotions/${promo.id}`}
                  className="group block p-4 rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/25 bg-white hover:bg-gradient-to-br hover:from-[var(--ivory)]/40 hover:to-transparent transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    {/* Promo icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--gold)]/20 to-[var(--gold)]/10 ring-1 ring-inset ring-[var(--gold)]/20 transition-transform group-hover:scale-105">
                      <svg className="w-5 h-5 text-[var(--gold-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-bold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors truncate">
                          {promo.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[var(--gold)]/15 to-[var(--gold)]/10 text-[var(--gold-dark)] border border-[var(--gold)]/20">
                          {formatDiscount(promo.discount_value, promo.discount_type)}
                        </span>
                      </div>

                      {promo.description && (
                        <p className="text-xs text-[var(--text-dark)]/60 mb-2 line-clamp-1">
                          {promo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2.5 flex-wrap text-xs">
                        {/* Scope */}
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[var(--text-dark)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          <span className="text-[var(--text-dark)]/60 font-medium">
                            {getAppliesToLabel(promo.applies_to)}
                          </span>
                        </div>

                        <span className="text-[var(--text-dark)]/15 hidden sm:inline">•</span>

                        {/* Usage */}
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-[var(--text-dark)]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-[var(--text-dark)]/60 font-medium">
                            {promo.usage_count} utilisation{promo.usage_count > 1 ? "s" : ""}
                          </span>
                        </div>

                        <span className="text-[var(--text-dark)]/15 hidden sm:inline">•</span>

                        {/* Expiry */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${expiryConfig.color}`}>
                          {expiryConfig.icon}
                          <span className="font-semibold">
                            {daysLeft === 0 ? "Expire aujourd'hui" : `${daysLeft} jour${daysLeft > 1 ? "s" : ""}`}
                          </span>
                        </div>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
