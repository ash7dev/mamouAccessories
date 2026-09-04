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
        color: "bg-rose-500/10 text-rose-700 border-rose-500/20",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    }
    if (daysLeft <= 7) {
      return {
        color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
        icon: (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    }
    return {
      color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
  };

  const actualPromotions = isEmpty ? [] : promotions.slice(0, 5);

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/20 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)] mb-1">
            Offres Spéciales
          </p>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)]">
            {isEmpty || actualPromotions.length === 0 ? "Aucune promotion" : "Promotions actives"}
          </h2>
        </div>

        {!isEmpty && actualPromotions.length > 0 && (
          <Link
            href="/admin/promotions"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--laiton-clair,#D9AE78)] transition-colors group"
          >
            <span>Gérer</span>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty || actualPromotions.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
            </div>

            <h3 className="font-serif text-base font-medium text-[var(--obsidienne,#0E0B09)] mb-1.5">
              Aucune promotion en cours
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/50 mb-6 max-w-xs mx-auto leading-relaxed">
              Créez des offres privilégiées pour stimuler vos ventes sur la boutique.
            </p>

            <Link
              href="/admin/promotions/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[var(--laiton,#B9793E)] to-[#D9AE78] text-[var(--obsidienne,#0E0B09)] rounded-full text-xs font-sans font-bold tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 uppercase"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Créer une offre
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
                  className="group block p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-[var(--porcelaine,#F1ECE3)]/30 hover:border-[var(--laiton)]/40 hover:bg-white transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--laiton,#B9793E)]/10 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-serif text-xs font-medium text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate">
                          {promo.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-[var(--laiton,#B9793E)]/15 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20 tabular-nums">
                          {formatDiscount(promo.discount_value, promo.discount_type)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${expiryConfig.color} tabular-nums`}>
                          {expiryConfig.icon}
                          {daysLeft === 0 ? "Expire aujourd'hui" : `${daysLeft}j restant${daysLeft > 1 ? "s" : ""}`}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
