import { Sidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--ivory)]">
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
