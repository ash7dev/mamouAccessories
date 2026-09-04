"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { AdminOrderNotifier } from "./admin-order-notifier";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--porcelaine,#F1ECE3)] text-[var(--obsidienne,#0E0B09)] selection:bg-[var(--laiton,#B9793E)] selection:text-white">
      <AdminOrderNotifier />
      <Sidebar />
      <div className="lg:pl-64">
        <main className="pb-24 lg:pb-12 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
