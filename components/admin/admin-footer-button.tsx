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
      className="group inline-flex items-center gap-1 opacity-20 hover:opacity-100 transition-opacity duration-300"
      title="Connexion admin"
    >
      <Shield className="w-3 h-3 text-[#F4EFE6]/40 group-hover:text-[var(--gold)] transition-colors" />
      <span className="text-[9px] text-[#F4EFE6]/30 group-hover:text-[var(--gold)] transition-colors">
        admin
      </span>
    </button>
  );
}
