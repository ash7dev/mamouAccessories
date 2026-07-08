import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/settings - Récupérer les paramètres
export async function GET() {
  try {
    const supabase = createServiceRoleClient();
    
    const { data: settings, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
    
    return NextResponse.json({ settings: settings || {} });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('id')
      .single();
    
    let result;
    
    if (existingSettings) {
      // Update existing
      result = await supabase
        .from('settings')
        .update({
          wave_link: body.wave_link,
          delivery_fee: body.delivery_fee,
          delivery_days: body.delivery_days,
          whatsapp_number: body.whatsapp_number,
          store_name: body.store_name,
          store_description: body.store_description,
          notifications_orders: body.notifications_orders,
          notifications_low_stock: body.notifications_low_stock,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Create new
      result = await supabase
        .from('settings')
        .insert({
          wave_link: body.wave_link,
          delivery_fee: body.delivery_fee,
          delivery_days: body.delivery_days,
          whatsapp_number: body.whatsapp_number,
          store_name: body.store_name,
          store_description: body.store_description,
          notifications_orders: body.notifications_orders,
          notifications_low_stock: body.notifications_low_stock,
        })
        .select()
        .single();
    }
    
    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
    
    return NextResponse.json({ settings: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
