import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// GET /api/admin/settings - Récupérer les paramètres
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    const { data: settings, error } = await supabase
      .from('settings')
      .select('key, value');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Convertir le format clé-valeur en objet
    const settingsObj: Record<string, string> = {};
    settings?.forEach(({ key, value }) => {
      settingsObj[key] = value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/settings - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Mettre à jour chaque clé individuellement avec upsert
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    const { error } = await supabase
      .from('settings')
      .upsert(updates, { onConflict: 'key' });

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Retourner les settings mis à jour
    const { data: updatedSettings } = await supabase
      .from('settings')
      .select('key, value');

    const settingsObj: Record<string, string> = {};
    updatedSettings?.forEach(({ key, value }) => {
      settingsObj[key] = value;
    });

    return NextResponse.json({ settings: settingsObj });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
