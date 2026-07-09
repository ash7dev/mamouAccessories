import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// POST /api/admin/promotions - Créer une nouvelle promotion
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Validation des champs requis
    if (!body.name || !body.discount_type || !body.discount_value || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { error: 'Les champs name, discount_type, discount_value, start_date et end_date sont requis' },
        { status: 400 }
      );
    }

    // Validation des valeurs
    if (body.discount_value <= 0) {
      return NextResponse.json(
        { error: 'La valeur de réduction doit être positive' },
        { status: 400 }
      );
    }

    if (body.discount_type === 'percentage' && (body.discount_value < 1 || body.discount_value > 100)) {
      return NextResponse.json(
        { error: 'Le pourcentage doit être entre 1 et 100' },
        { status: 400 }
      );
    }

    if (new Date(body.end_date) <= new Date(body.start_date)) {
      return NextResponse.json(
        { error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    if (body.applies_to === 'specific_category' && !body.category_id) {
      return NextResponse.json(
        { error: 'category_id est requis lorsque applies_to est specific_category' },
        { status: 400 }
      );
    }

    // Créer la promotion
    const { data: promotion, error: promotionError } = await supabase
      .from('promotions')
      .insert({
        name: body.name,
        description: body.description || null,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        start_date: body.start_date,
        end_date: body.end_date,
        applies_to: body.applies_to || 'all_products',
        category_id: body.category_id || null,
        min_purchase_amount: body.min_purchase_amount || 0,
        max_discount_amount: body.max_discount_amount || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single();

    if (promotionError) {
      console.error('Error creating promotion:', promotionError);
      return NextResponse.json(
        { error: 'Erreur lors de la création de la promotion' },
        { status: 500 }
      );
    }

    revalidatePath('/');
    revalidatePath('/admin/promotions');
    revalidatePath('/admin');

    return NextResponse.json({ promotion }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// GET /api/admin/promotions - Récupérer toutes les promotions
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { data: promotions, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promotions:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des promotions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ promotions }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
