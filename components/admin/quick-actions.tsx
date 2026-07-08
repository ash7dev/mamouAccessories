import Link from "next/link";

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const actions: QuickAction[] = [
  {
    title: "Ajouter un produit",
    description: "Créer un nouveau bijou",
    href: "/admin/products/new",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: "Gérer les commandes",
    description: "Voir les commandes récentes",
    href: "/admin/orders",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
  {
    title: "Créer une promotion",
    description: "Ajouter un code promo",
    href: "/admin/promotions/new",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
  },
  {
    title: "Gérer les catégories",
    description: "Organiser les produits",
    href: "/admin/categories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--text-dark)] mb-1">
          Actions rapides
        </h2>
        <p className="text-xs text-gray-500">
          Accès direct aux fonctionnalités
        </p>
      </div>

      {/* Actions Stack */}
      <div className="flex-1 space-y-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group block relative overflow-hidden rounded-xl border border-gray-100 transition-all hover:border-[var(--gold)]/30 hover:shadow-md hover:bg-[var(--ivory)]/30"
          >
            <div className="relative p-3 transition-all">
              <div className="flex items-center gap-3">
                {/* Icon - Single gold color */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--ivory)] text-[var(--gold-dark)] transition-all group-hover:bg-[var(--gold-dark)] group-hover:text-white">
                  {action.icon}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {action.description}
                  </p>
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
            </div>
          </Link>
        ))}
      </div>

      {/* Footer tip */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-start gap-2 p-2.5 bg-[var(--ivory)] rounded-lg">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--gold)]/20">
            <svg className="h-3.5 w-3.5 text-[var(--gold-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 text-xs">
            <p className="font-medium text-[var(--text-dark)] mb-0.5">
              Astuce du jour
            </p>
            <p className="text-gray-600 text-[11px] leading-tight">
              Ajoutez des photos de haute qualité pour augmenter vos ventes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
