import { PromotionFormDynamic } from "@/components/admin/promotions/promotion-form-dynamic";
import type { PromotionDetailData } from "@/components/admin/promotions/promotion-detail";

async function getPromotionById(id: string): Promise<PromotionDetailData> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/promotions/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to fetch promotion');
  }
  const data = await response.json();
  return data.promotion;
}

function mapPromotionToForm(promotion: PromotionDetailData) {
  return {
    id: promotion.id,
    promotionType: 'automatic' as const, // Les promotions existantes sont automatiques
    name: promotion.name,
    description: promotion.description,
    discount_type: promotion.discount_type,
    discount_value: promotion.discount_value,
    start_date: promotion.start_date,
    end_date: promotion.end_date,
    applies_to: promotion.applies_to,
    category_id: promotion.category_id,
    min_purchase_amount: promotion.min_purchase_amount,
    max_discount_amount: promotion.max_discount_amount,
    usage_limit: null,
    usage_limit_per_customer: null,
    is_active: promotion.is_active,
  };
}

export default async function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promotion = await getPromotionById(id);

  return (
    <div className="p-6 lg:p-8">
      <PromotionFormDynamic promotion={mapPromotionToForm(promotion)} />
    </div>
  );
}
