import { PromotionHeader } from "@/components/admin/promotions/promotion-header";
import { PromotionList } from "@/components/admin/promotions/promotion-list";
import type { PromotionListItem } from "@/components/admin/promotions/promotion-list";

async function getPromotions(): Promise<PromotionListItem[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/promotions`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch promotions');
  }
  const data = await response.json();
  return data.promotions || [];
}

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <div className="p-6 lg:p-8">
      <PromotionHeader />
      <PromotionList promotions={promotions} />
    </div>
  );
}
