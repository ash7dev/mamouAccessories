"use client";

import { useState, useEffect, useMemo } from "react";
import { ReelsHeader, ReelStatusFilter } from "@/components/admin/reels/reels-header";
import { ReelsList } from "@/components/admin/reels/reels-list";
import { ReelFormModal } from "@/components/admin/reels/reel-form-modal";
import type { Reel, CreateReelInput } from "@/lib/types/reel";

export default function AdminReelsPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<Reel | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReelStatusFilter>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reelsRes, productsRes] = await Promise.all([
        fetch("/api/admin/reels"),
        fetch("/api/products"),
      ]);

      if (reelsRes.ok) {
        const data = await reelsRes.json();
        setReels(data.reels || []);
      }

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Error loading admin reels data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const activeCount = useMemo(() => reels.filter((r) => r.isActive).length, [reels]);

  const filteredReels = useMemo(() => {
    return reels.filter((reel) => {
      // Filter by status
      if (statusFilter === "active" && !reel.isActive) return false;
      if (statusFilter === "inactive" && reel.isActive) return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = reel.title.toLowerCase().includes(query);
        const matchesProduct = reel.productName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProduct) return false;
      }

      return true;
    });
  }, [reels, statusFilter, searchQuery]);

  const handleCreateOrUpdate = async (input: CreateReelInput) => {
    try {
      if (editingReel) {
        const res = await fetch(`/api/admin/reels/${editingReel.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Erreur lors de la mise à jour");
        }
      } else {
        const res = await fetch("/api/admin/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Erreur lors de la création");
        }
      }

      await loadData();
    } catch (err) {
      console.error("Error saving reel:", err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette vidéo Reel ?")) return;

    try {
      const res = await fetch(`/api/admin/reels/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReels((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Error deleting reel:", err);
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      // Optimistic update
      setReels((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isActive: !currentState } : r))
      );

      await fetch(`/api/admin/reels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentState }),
      });
    } catch (err) {
      console.error("Error toggling reel status:", err);
      await loadData();
    }
  };

  return (
    <div className="space-y-8 pb-12 overflow-x-hidden">
      <ReelsHeader
        totalCount={reels.length}
        activeCount={activeCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onAddReel={() => {
          setEditingReel(null);
          setIsModalOpen(true);
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ReelsList
          reels={filteredReels}
          isLoading={isLoading}
          onEdit={(reel) => {
            setEditingReel(reel);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </div>

      <ReelFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReel(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingReel}
        products={products}
      />
    </div>
  );
}
