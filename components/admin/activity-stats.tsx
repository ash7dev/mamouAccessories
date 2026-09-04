"use client";

import Link from "next/link";

interface ActivityStatsProps {
  totalProducts?: number;
  totalOrders?: number;
  totalClients?: number;
}

function ProductIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

function OrderIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

function ClientsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

const stats = [
  { key: "products", label: "Produits", icon: ProductIcon, href: "/admin/products" },
  { key: "orders", label: "Commandes", icon: OrderIcon, href: "/admin/orders" },
  { key: "clients", label: "Clientes", icon: ClientsIcon, href: "/admin/customers" },
] as const;

export function ActivityStats({
  totalProducts = 0,
  totalOrders = 0,
  totalClients = 0,
}: ActivityStatsProps) {
  const values: Record<(typeof stats)[number]["key"], number> = {
    products: totalProducts,
    orders: totalOrders,
    clients: totalClients,
  };

  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl border border-[var(--laiton,#B9793E)]/30 bg-white p-5 shadow-md lg:hidden font-sans">
      {/* Halo décoratif doré */}
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10">
        <div className="h-36 w-36 rounded-full border border-[var(--laiton,#B9793E)]/15" />
        <div className="absolute inset-5 rounded-full border border-[var(--laiton,#B9793E)]/20" />
        <div className="absolute inset-10 rounded-full border border-[var(--laiton,#B9793E)]/25" />
        <div className="absolute inset-[3.75rem] rounded-full bg-[var(--laiton,#B9793E)]/10" />
      </div>

      {/* En-tête */}
      <div className="relative mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[var(--laiton,#B9793E)]">
            Activité Boutique
          </span>
          <h2 className="mt-0.5 font-serif text-lg font-bold tracking-tight text-[var(--obsidienne,#0E0B09)]">
            Indicateurs Clefs
          </h2>
        </div>
      </div>

      {/* Statistiques : séparées par de fins filets dorés */}
      <div className="relative grid grid-cols-3 divide-x divide-[var(--laiton,#B9793E)]/20">
        {stats.map(({ key, label, icon: Icon, href }) => (
          <Link
            key={key}
            href={href}
            className="group flex flex-col items-center gap-1.5 px-2 py-1 transition-transform active:scale-[0.97]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--porcelaine,#F1ECE3)] text-[var(--laiton,#B9793E)] border border-[var(--laiton,#B9793E)]/25 transition-colors group-hover:bg-[var(--laiton,#B9793E)] group-hover:text-[var(--obsidienne,#0E0B09)] shadow-2xs">
              <Icon />
            </span>
            <span className="font-mono text-2xl font-bold tracking-tight text-[var(--obsidienne,#0E0B09)] tabular-nums">
              {new Intl.NumberFormat("fr-FR").format(values[key])}
            </span>
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[var(--obsidienne,#0E0B09)]/60">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}