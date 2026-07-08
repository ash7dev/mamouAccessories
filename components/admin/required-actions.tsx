import Link from "next/link";

interface RequiredAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  href: string;
}

interface RequiredActionsProps {
  actions?: RequiredAction[];
  isEmpty?: boolean;
}

export function RequiredActions({ actions = [], isEmpty = false }: RequiredActionsProps) {
  const actualActions = isEmpty ? [] : actions.slice(0, 5);

  const priorityStyles = {
    high: "bg-red-50 text-red-700 border-red-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
    low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const getOrderIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
      />
    </svg>
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-[var(--gold)]/15 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)] mb-1">
            Actions requises
          </p>
          <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
            {isEmpty ? "Aucune action en attente" : `${actualActions.length} commande(s) à confirmer`}
          </h2>
        </div>

        {!isEmpty && actualActions.length > 0 && (
          <Link
            href="/admin/orders?filter=pending"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--gold-dark)] hover:text-[var(--gold)] transition-colors group"
          >
            <span>Tout voir</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        {isEmpty || actualActions.length === 0 ? (
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
            <p className="text-xs text-[var(--text-dark)]/50 max-w-xs mx-auto">
              Aucune commande n'est en attente de confirmation.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-3">
            {actualActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group block p-3 rounded-2xl border border-[var(--gold)]/10 hover:border-[var(--gold)]/30 hover:bg-[var(--ivory)]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Priority badge */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      priorityStyles[action.priority]
                    }`}
                  >
                    {getOrderIcon()}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-dark)] group-hover:text-[var(--gold-dark)] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-[var(--text-dark)]/50 truncate mt-0.5">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <svg
                    className="h-4 w-4 shrink-0 text-[var(--text-dark)]/30 transition-all group-hover:text-[var(--gold-dark)] group-hover:translate-x-0.5 mt-1"
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
