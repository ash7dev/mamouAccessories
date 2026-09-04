import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

const actions: QuickAction[] = [
  {
    title: "Nouveau produit",
    description: "Ajouter un produit d'exception au catalogue",
    href: "/admin/products/new",
    badge: "Prioritaire",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    title: "Commandes & Ventes",
    description: "Vérifier et traiter les encaissements",
    href: "/admin/orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    title: "Offres & Codes Promo",
    description: "Lancer des remises et privilèges",
    href: "/admin/promotions/new",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      </svg>
    ),
  },
  {
    title: "Catégories & Collections",
    description: "Organiser et structurer la vitrine",
    href: "/admin/categories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Paramètres Boutique",
    description: "Lien Wave, livraison & WhatsApp",
    href: "/admin/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export function QuickActions() {
  return (
    <section className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/25 shadow-[0_8px_30px_-6px_rgba(14,11,9,0.06)] h-full flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Gold Accent Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--laiton,#B9793E)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--laiton,#B9793E)] text-xs font-serif">✦</span>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[var(--laiton,#B9793E)]">
              Raccourcis
            </p>
          </div>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)] mt-0.5">
            Actions rapides
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold text-[var(--laiton,#B9793E)] bg-[var(--porcelaine,#F1ECE3)] px-2.5 py-1 rounded-full border border-[var(--laiton,#B9793E)]/20">
          5 Accès
        </span>
      </div>

      {/* Actions Stack */}
      <div className="flex-1 space-y-2.5">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-gradient-to-r from-[var(--porcelaine,#F1ECE3)]/40 to-white hover:from-white hover:to-white hover:border-[var(--laiton,#B9793E)]/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Left accent bar on hover */}
            <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[var(--laiton,#B9793E)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--obsidienne,#0E0B09)] border border-[var(--laiton,#B9793E)]/20 shadow-xs transition-all duration-300 group-hover:bg-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--porcelaine,#F1ECE3)] group-hover:border-[var(--obsidienne)] group-hover:scale-105">
                {action.icon}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-serif font-semibold text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate">
                    {action.title}
                  </h3>
                  {action.badge && (
                    <span className="hidden sm:inline-flex text-[9px] font-sans font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                      {action.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-sans text-[var(--obsidienne,#0E0B09)]/60 truncate mt-0.5">
                  {action.description}
                </p>
              </div>
            </div>

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)]/60 text-[var(--obsidienne,#0E0B09)]/40 transition-all duration-300 group-hover:bg-[var(--laiton,#B9793E)] group-hover:text-white group-hover:translate-x-0.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
