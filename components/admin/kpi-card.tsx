import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}: KpiCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/20 bg-white p-6 shadow-[0_4px_20px_-4px_rgba(14,11,9,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--laiton)]/40 hover:shadow-[0_10px_30px_-5px_rgba(185,121,62,0.15)] ${className}`}
    >
      {/* Ornement d'angle laiton survol */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="h-28 w-28 rounded-full border border-[var(--laiton,#B9793E)]/15" />
        <div className="absolute inset-4 rounded-full border border-[var(--laiton,#B9793E)]/20" />
        <div className="absolute inset-8 rounded-full bg-[var(--laiton,#B9793E)]/10" />
      </div>

      <div className="relative z-10">
        {/* Ligne du haut : label en petites capitales + icône laiton */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <p className="pt-1 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[var(--laiton,#B9793E)]">
            {title}
          </p>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--laiton,#B9793E)]/10 text-[var(--laiton,#B9793E)] border border-[var(--laiton)]/20 transition-all group-hover:bg-[var(--laiton)] group-hover:text-white [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        </div>

        {/* Valeur + tendance */}
        <div className="flex flex-wrap items-baseline gap-2.5">
          <p className="font-heading text-3xl lg:text-4xl font-extrabold leading-none tracking-tight text-[var(--obsidienne,#0E0B09)] tabular-nums">
            {value}
          </p>

          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold tabular-nums ${
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-700 border border-rose-500/20"
              }`}
            >
              <svg
                className={`h-3 w-3 ${trend.isPositive ? "" : "rotate-180"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              {Math.abs(trend.value)}&nbsp;%
            </span>
          )}
        </div>

        {/* Sous-titre */}
        {subtitle && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--obsidienne,#0E0B09)]/60 font-sans font-medium">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--laiton,#B9793E)]" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}