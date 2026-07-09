"use client";

import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export function AdminFooterButton() {
  const router = useRouter();

  const handleLogin = () => {
    // Redirect to admin login
    router.push("/admin/login");
  };

  return (
    <button
      onClick={handleLogin}
      className="group flex flex-col items-center gap-1 opacity-30 hover:opacity-100 transition-all duration-300 py-1"
      title="Connexion admin"
    >
      <Shield className="w-4 h-4 text-[#F4EFE6]/40 group-hover:text-[var(--gold)] transition-colors" />
      <span className="text-[8px] text-[#F4EFE6]/40 group-hover:text-[var(--gold)] transition-colors uppercase tracking-wider">
        •
      </span>
    </button>
  );
}
