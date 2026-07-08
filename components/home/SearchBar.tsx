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
          className="w-full rounded-full border border-[var(--gold)]/20 bg-white px-4 py-3 pl-11 text-sm text-[var(--text-dark)] placeholder:text-[var(--text-dark)]/40 shadow-sm focus:border-[var(--gold)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20"
        />
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--gold)]/60" />
      </form>
    </div>
  );
}
