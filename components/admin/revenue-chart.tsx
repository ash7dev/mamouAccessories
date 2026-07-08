"use client";

import { useState } from "react";
import Link from "next/link";

type Period = "day" | "week" | "month" | "year";

interface RevenuePoint {
  label: string; // ex : "01 juil.", "S27", "Juil.", "2026"
  value: number; // montant encaissé en FCFA
}

interface RevenueChartProps {
  /** Points du graphique pour la période courante. Vide ou absent = état vide. */
  data?: RevenuePoint[];
  /** Total encaissé sur la période affichée (FCFA). */
  currentTotal?: number;
  onPeriodChange?: (period: Period) => void;
}

const periods: { key: Period; label: string }[] = [
  { key: "day", label: "Jour" },
  { key: "week", label: "Semaine" },
  { key: "month", label: "Mois" },
  { key: "year", label: "Année" },
];

const formatFCFA = (n: number) => new Intl.NumberFormat("fr-FR").format(n);

/** Construit un chemin SVG lissé (courbe monotone simple) à partir des points. */
function buildPaths(data: RevenuePoint[], width: number, height: number, pad: number) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = (width - pad * 2) / Math.max(data.length - 1, 1);
  const pts = data.map((d, i) => ({
    x: pad + i * stepX,
    y: pad + (1 - d.value / max) * (height - pad * 2),
  }));

  let line = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cx = (prev.x + curr.x) / 2;
    line += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const area = `${line} L ${pts[pts.length - 1].x} ${height - pad} L ${pts[0].x} ${height - pad} Z`;
  return { line, area, last: pts[pts.length - 1] };
}

function ChartIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

export function RevenueChart({ data = [], currentTotal = 0, onPeriodChange }: RevenueChartProps) {
  const [period, setPeriod] = useState<Period>("month");
  const isEmpty = data.length < 2;

  const W = 600;
  const H = 220;
  const PAD = 16;
  const paths = !isEmpty ? buildPaths(data, W, H, PAD) : null;

  const handlePeriod = (p: Period) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

  const periodLabel =
    period === "day" ? "Aujourd'hui" : period === "week" ? "Cette semaine" : period === "month" ? "Ce mois" : "Cette année";

  return (
    <section className="flex h-full flex-col rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_1px_2px_rgba(43,33,24,0.04),0_8px_24px_-12px_rgba(43,33,24,0.12)]">
      {/* En-tête */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
            Revenus
          </p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[var(--text-dark)]">
            Évolution des encaissements
          </h2>
        </div>

        {/* Segmented control en pilule */}
        <div className="flex items-center gap-0.5 rounded-full bg-[var(--ivory)] p-1">
          {periods.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handlePeriod(tab.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                period === tab.key
                  ? "bg-[var(--text-dark)] text-white shadow-sm"
                  : "text-[var(--text-dark)]/60 hover:text-[var(--text-dark)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Total de la période */}
      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-[var(--text-dark)] tabular-nums">
          {formatFCFA(currentTotal)}
        </span>
        <span className="text-sm font-medium text-[var(--text-dark)]/40">
          FCFA · {periodLabel}
        </span>
      </div>

      {/* Zone graphique */}
      <div className="flex flex-1 items-center justify-center">
        {isEmpty ? (
          /* État vide : panneau ivoire doux, pas de pointillés */
          <div className="flex w-full flex-col items-center rounded-2xl bg-[var(--ivory)]/60 px-6 py-10 text-center">
            <div className="relative mb-4">
              <div className="absolute -inset-2 rounded-full border border-[var(--gold)]/20" aria-hidden />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--gold-dark)] ring-1 ring-inset ring-[var(--gold)]/25">
                <ChartIcon />
              </div>
            </div>

            <h3 className="mb-1 text-sm font-semibold text-[var(--text-dark)]">
              Aucun encaissement pour l'instant
            </h3>
            <p className="mb-5 max-w-xs text-xs leading-relaxed text-[var(--text-dark)]/50">
              La courbe apparaîtra dès votre première commande payée.
            </p>

            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--text-dark)] px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:bg-[var(--text-dark)]/90 active:scale-95"
            >
              <PlusIcon />
              Ajouter un produit
            </Link>
          </div>
        ) : (
          /* Graphique en aire, dégradé doré */
          <div className="w-full">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Courbe des revenus encaissés">
              <defs>
                <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Lignes de repère horizontales */}
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1={PAD}
                  x2={W - PAD}
                  y1={PAD + f * (H - PAD * 2)}
                  y2={PAD + f * (H - PAD * 2)}
                  stroke="#2B2118"
                  strokeOpacity="0.06"
                  strokeDasharray="2 6"
                />
              ))}

              <path d={paths!.area} fill="url(#revenue-fill)" />
              <path d={paths!.line} fill="none" stroke="var(--gold-dark)" strokeWidth="2.5" strokeLinecap="round" />

              {/* Dernier point mis en valeur */}
              <circle cx={paths!.last.x} cy={paths!.last.y} r="8" fill="var(--gold)" fillOpacity="0.25" />
              <circle cx={paths!.last.x} cy={paths!.last.y} r="4" fill="var(--gold-dark)" stroke="white" strokeWidth="2" />
            </svg>

            {/* Libellés des extrémités */}
            <div className="mt-2 flex justify-between px-1 text-[10px] font-medium uppercase tracking-wider text-[var(--text-dark)]/35">
              <span>{data[0].label}</span>
              <span>{data[data.length - 1].label}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}