import { ReactNode } from "react";

interface SettingsSectionProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function SettingsSection({ icon, title, subtitle, children }: SettingsSectionProps) {
  return (
    <div className="rounded-3xl border border-[var(--gold)]/15 bg-white p-6 shadow-[0_-8px_24px_-12px_rgba(43,33,24,0.25)]">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#241B14]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--text-dark)]">{title}</h3>
          <p className="mt-0.5 text-sm text-[var(--text-dark)]/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
