"use client";

import { useState, useEffect, useMemo } from "react";
import { PromotionHeader, PromotionFilter } from "@/components/admin/promotions/promotion-header";
import { PromotionList } from "@/components/admin/promotions/promotion-list";
import type { PromotionListItem } from "@/components/admin/promotions/promotion-list";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionListItem[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<PromotionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PromotionFilter>("all");

  useEffect(() => {
    async function loadPromotions() {
      try {
        const response = await fetch('/api/admin/promotions');
        const data = await response.json();

        if (data.promotions) {
          setPromotions(data.promotions);
        }
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPromotions();
  }, []);

  // Calculate counts for each filter
  const counts = useMemo(() => {
    const now = new Date();

    return {
      all: promotions.length,
      active: promotions.filter(p => {
        const start = p.start_date ? new Date(p.start_date) : null;
        const end = p.end_date ? new Date(p.end_date) : null;
        return p.is_active && (!start || start <= now) && (!end || end >= now);
      }).length,
      upcoming: promotions.filter(p => {
        const start = p.start_date ? new Date(p.start_date) : null;
        return start && start > now;
      }).length,
      expired: promotions.filter(p => {
        const end = p.end_date ? new Date(p.end_date) : null;
        return end && end < now;
      }).length,
    };
  }, [promotions]);

  useEffect(() => {
    let filtered = [...promotions];
    const now = new Date();

    // Filter based on active filter
    if (activeFilter === "active") {
      filtered = filtered.filter(p => {
        const start = p.start_date ? new Date(p.start_date) : null;
        const end = p.end_date ? new Date(p.end_date) : null;
        return p.is_active && (!start || start <= now) && (!end || end >= now);
      });
    } else if (activeFilter === "upcoming") {
      filtered = filtered.filter(p => {
        const start = p.start_date ? new Date(p.start_date) : null;
        return start && start > now;
      });
    } else if (activeFilter === "expired") {
      filtered = filtered.filter(p => {
        const end = p.end_date ? new Date(p.end_date) : null;
        return end && end < now;
      });
    }

    setFilteredPromotions(filtered);
  }, [activeFilter, promotions]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--gold)] border-t-transparent" />
            <p className="text-sm text-[var(--text-dark)]/60">Chargement des promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <PromotionHeader
        counts={counts}
        onFilterChange={setActiveFilter}
      />
      <PromotionList promotions={filteredPromotions} />
    </div>
  );
}
