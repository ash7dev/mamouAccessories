import { PromotionDetail } from "@/components/admin/promotions/promotion-detail";
import type { PromotionDetailData } from "@/components/admin/promotions/promotion-detail";
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPromotionById(id: string): Promise<any> {
  const supabase = createServiceRoleClient();

  const { data: promotion, error } = await supabase
    .from('promotions')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching promotion:', error);
    throw new Error('Promotion not found');
  }

  return promotion;
}

function mapPromotionToDetail(promotion: any): PromotionDetailData {
  return {
    id: promotion.id,
    name: promotion.name,
    description: promotion.description,
    discount_type: promotion.discount_type,
    discount_value: promotion.discount_value,
    start_date: promotion.start_date,
    end_date: promotion.end_date,
    applies_to: promotion.applies_to,
    category_id: promotion.category_id,
    category_name: promotion.category?.name || null,
    min_purchase_amount: promotion.min_purchase_amount,
    max_discount_amount: promotion.max_discount_amount,
    is_active: promotion.is_active,
    usage_count: promotion.usage_count,
    created_at: promotion.created_at,
    updated_at: promotion.updated_at,
  };
}

export default async function PromotionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const promotion = await getPromotionById(id);

  return (
    <div className="p-6 lg:p-8">
      <PromotionDetail promotion={mapPromotionToDetail(promotion)} />
    </div>
  );
}
