import { PromotionHeader } from "@/components/admin/promotions/promotion-header";
import { PromotionList } from "@/components/admin/promotions/promotion-list";
import type { PromotionListItem } from "@/components/admin/promotions/promotion-list";
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPromotions(): Promise<PromotionListItem[]> {
  const supabase = createServiceRoleClient();

  const { data: promotions, error } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching promotions:', error);
    return [];
  }

  return promotions || [];
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
