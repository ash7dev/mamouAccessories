import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export const DEFAULT_DELIVERY_FEES = {
  delivery_fee_zone1: 2000,
  delivery_fee_zone2: 2500,
  delivery_fee_zone3: 3500,
  delivery_fee_zone4: 3500,
  delivery_fee_zone5: 3500,
  delivery_fee_dakar: 2000,
  delivery_fee_regions: 3500,
};

// GET /api/settings/delivery-fees - Récupérer les frais de livraison (public)
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value');

    const fees = { ...DEFAULT_DELIVERY_FEES };

    if (!error && settings) {
      settings.forEach((setting) => {
        if (setting.key in fees) {
          const val = parseInt(setting.value, 10);
          if (!isNaN(val) && val >= 0) {
            (fees as any)[setting.key] = val;
          }
        }
      });
    }

    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    console.error('Unexpected error fetching delivery fees:', error);
    return NextResponse.json(DEFAULT_DELIVERY_FEES, { status: 200 });
  }
}

