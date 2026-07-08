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
      className={`group relative overflow-hidden rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--gold)]/30 hover:shadow-[0_2px_4px_rgba(43,33,24,0.05),0_16px_32px_-12px_rgba(43,33,24,0.18)] ${className}`}
    >
      {/* Ornement : cercles concentriques qui se révèlent au survol */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="h-28 w-28 rounded-full border border-[var(--gold)]/15" />
        <div className="absolute inset-4 rounded-full border border-[var(--gold)]/20" />
        <div className="absolute inset-8 rounded-full bg-[var(--gold)]/10" />
      </div>

      <div className="relative">
        {/* Ligne du haut : label en petites capitales + icône en pastille */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <p className="pt-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--text-dark)]/45">
            {title}
          </p>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ivory)] text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/20 transition-colors group-hover:bg-[var(--gold)]/15 [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </span>
        </div>

        {/* Valeur + tendance sur la même ligne de base */}
        <div className="flex flex-wrap items-baseline gap-2.5">
          <p className="text-3xl font-bold leading-none tracking-tight text-[var(--text-dark)] tabular-nums">
            {value}
          </p>

          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
                trend.isPositive
                  ? "bg-emerald-600/10 text-emerald-700"
                  : "bg-red-600/10 text-red-600"
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
          <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-dark)]/45">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}