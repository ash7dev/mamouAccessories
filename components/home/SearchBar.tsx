"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/boutique?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="px-4 py-3 mt-24 md:hidden">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher des bijoux..."
          className="w-full rounded-full border border-white/30 bg-white/30 backdrop-blur-xl px-4 py-3 pl-11 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] focus:border-[var(--gold)]/50 focus:bg-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 transition-all duration-300"
        />
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold)]/60" />
      </form>
    </div>
  );
}
