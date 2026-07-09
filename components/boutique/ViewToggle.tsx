"use client";

import { Grid3x3, List } from "lucide-react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-[var(--gold)]/20 bg-white p-1 shadow-sm">
      <button
        onClick={() => onViewChange("grid")}
        className={`flex items-center justify-center rounded-lg px-3 py-2 transition-all ${
          view === "grid"
            ? "bg-[var(--gold)]/15 text-[var(--gold-dark)]"
            : "text-[var(--text-dark)]/50 hover:text-[var(--text-dark)]/70 hover:bg-[var(--ivory)]/60"
        }`}
        title="Vue grille"
      >
        <Grid3x3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`flex items-center justify-center rounded-lg px-3 py-2 transition-all ${
          view === "list"
            ? "bg-[var(--gold)]/15 text-[var(--gold-dark)]"
            : "text-[var(--text-dark)]/50 hover:text-[var(--text-dark)]/70 hover:bg-[var(--ivory)]/60"
        }`}
        title="Vue liste"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}
