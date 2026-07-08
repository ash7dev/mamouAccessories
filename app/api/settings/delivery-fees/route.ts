import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/settings/delivery-fees - Récupérer les frais de livraison (public)
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['delivery_fee_dakar', 'delivery_fee_regions']);

    if (error) {
      console.error('Error fetching delivery fees:', error);
      return NextResponse.json(
        {
          delivery_fee_dakar: 1500,
          delivery_fee_regions: 3000
        },
        { status: 200 }
      );
    }

    const fees = {
      delivery_fee_dakar: 1500,
      delivery_fee_regions: 3000,
    };

    settings?.forEach((setting) => {
      if (setting.key === 'delivery_fee_dakar') {
        fees.delivery_fee_dakar = parseInt(setting.value, 10) || 1500;
      } else if (setting.key === 'delivery_fee_regions') {
        fees.delivery_fee_regions = parseInt(setting.value, 10) || 3000;
      }
    });

    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      {
        delivery_fee_dakar: 1500,
        delivery_fee_regions: 3000
      },
      { status: 200 }
    );
  }
}
