import Link from "next/link";

interface RequiredAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  href: string;
  icon: React.ReactNode;
}

interface RequiredActionsProps {
  isEmpty?: boolean;
}

export function RequiredActions({ isEmpty = true }: RequiredActionsProps) {
  // Mock data - will be replaced with real data later
  const actions: RequiredAction[] = isEmpty
    ? []
    : [
        {
          id: "1",
          title: "Commande #1234 en attente",
          description: "Nouvelle commande à traiter",
          priority: "high",
          href: "/admin/orders/1234",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          ),
        },
      ];

  const priorityStyles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--text-dark)]">
            Actions requises
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isEmpty ? "Aucune action en attente" : `${actions.length} action(s)`}
          </p>
        </div>

        {!isEmpty && (
          <Link
            href="/admin/orders"
            className="text-xs font-medium text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors"
          >
            Tout voir
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <div className="text-center py-8">
            {/* Empty state icon */}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            {/* Empty state text */}
            <h3 className="text-sm font-semibold text-[var(--text-dark)] mb-1">
              Tout est à jour !
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Aucune action n'est requise pour le moment. Vous serez notifié des nouvelles tâches.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {actions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group block p-3 rounded-xl border border-gray-100 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Priority badge */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                      priorityStyles[action.priority]
                    }`}
                  >
                    {action.icon}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 shrink-0 text-gray-400 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-0.5 mt-1"
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
