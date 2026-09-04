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

  return (
    <section className="bg-white rounded-3xl p-6 border border-[var(--laiton,#B9793E)]/25 shadow-[0_8px_30px_-6px_rgba(14,11,9,0.06)] h-full flex flex-col justify-between relative overflow-hidden">
      {/* Gold Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--laiton,#B9793E)]/10 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[var(--laiton,#B9793E)] text-xs font-serif">✦</span>
            <p className="text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[var(--laiton,#B9793E)]">
              Priorités
            </p>
          </div>
          <h2 className="font-serif text-lg font-semibold tracking-tight text-[var(--obsidienne,#0E0B09)] mt-0.5">
            {isEmpty || actualActions.length === 0 ? "Aucune action urgente" : `${actualActions.length} action(s) requise(s)`}
          </h2>
        </div>

        {!isEmpty && actualActions.length > 0 ? (
          <Link
            href="/admin/orders?filter=pending"
            className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:text-[var(--obsidienne,#0E0B09)] transition-colors group"
          >
            <span>Traiter les commandes</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] group-hover:bg-[var(--obsidienne,#0E0B09)] group-hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ✦ À jour
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {isEmpty || actualActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--porcelaine,#F1ECE3)]/60 to-white border border-[var(--laiton,#B9793E)]/20 p-6 text-center shadow-xs">
            <div className="relative mb-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--obsidienne,#0E0B09)] text-[var(--laiton-clair,#D9AE78)] border border-[var(--laiton,#B9793E)]/40 shadow-md">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            </div>

            <h3 className="font-serif text-base font-semibold text-[var(--obsidienne,#0E0B09)] mb-1">
              Tout est sous contrôle !
            </h3>
            <p className="text-xs font-sans text-[var(--obsidienne,#0E0B09)]/60 max-w-xs leading-relaxed">
              Toutes les commandes reçues et vérifications Wave ont été traitées avec succès.
            </p>

            <Link
              href="/admin/orders"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-sans font-bold text-[var(--laiton,#B9793E)] hover:underline"
            >
              Consulter l'historique complet →
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {actualActions.map((action) => {
              const isHigh = action.priority === "high";

              return (
                <Link
                  key={action.id}
                  href={action.href}
                  className="group relative flex items-center justify-between p-3.5 rounded-2xl border border-[var(--laiton,#B9793E)]/15 bg-gradient-to-r from-[var(--porcelaine,#F1ECE3)]/30 to-white hover:from-white hover:to-white hover:border-[var(--laiton,#B9793E)]/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Left Accent Glow Bar */}
                  <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full transition-opacity duration-300 ${isHigh ? "bg-red-500" : "bg-[var(--laiton,#B9793E)]"} opacity-0 group-hover:opacity-100`} />

                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isHigh
                        ? "bg-red-50 text-red-600 border-red-200 group-hover:bg-red-600 group-hover:text-white"
                        : "bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--porcelaine,#F1ECE3)]"
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-mono text-xs font-bold text-[var(--obsidienne,#0E0B09)] group-hover:text-[var(--laiton,#B9793E)] transition-colors truncate">
                          {action.title}
                        </h3>
                        {isHigh && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                            Urgent
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
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
