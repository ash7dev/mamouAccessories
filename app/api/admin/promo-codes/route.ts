import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// POST /api/admin/promo-codes - Créer un nouveau code promo
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    // Validation des champs requis
    if (!body.code || !body.discount_type || !body.discount_value || !body.start_date || !body.end_date) {
      return NextResponse.json(
        { error: 'Les champs code, discount_type, discount_value, start_date et end_date sont requis' },
        { status: 400 }
      );
    }

    // Valider le format du code (majuscules, pas d'espaces)
    const code = body.code.toUpperCase().trim().replace(/\s+/g, '');
    if (!/^[A-Z0-9]+$/.test(code)) {
      return NextResponse.json(
        { error: 'Le code promo doit contenir uniquement des lettres et des chiffres' },
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

    // Créer le code promo
    const { data: promoCode, error: promoCodeError } = await supabase
      .from('promo_codes')
      .insert({
        code,
        description: body.description || null,
        discount_type: body.discount_type,
        discount_value: body.discount_value,
        start_date: body.start_date,
        end_date: body.end_date,
        applies_to: body.applies_to || 'all_products',
        category_id: body.category_id || null,
        min_purchase_amount: body.min_purchase_amount || 0,
        max_discount_amount: body.max_discount_amount || null,
        usage_limit: body.usage_limit || null,
        usage_limit_per_customer: body.usage_limit_per_customer || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single();

    if (promoCodeError) {
      console.error('Error creating promo code:', promoCodeError);

      // Code déjà existant
      if (promoCodeError.code === '23505') {
        return NextResponse.json(
          { error: 'Ce code promo existe déjà' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'Erreur lors de la création du code promo' },
        { status: 500 }
      );
    }

    // Si produits spécifiques, créer les liaisons
    if (body.applies_to === 'specific_products' && body.product_ids && body.product_ids.length > 0) {
      const productLinks = body.product_ids.map((productId: string) => ({
        promo_code_id: promoCode.id,
        product_id: productId,
      }));

      const { error: linkError } = await supabase
        .from('promo_code_products')
        .insert(productLinks);

      if (linkError) {
        console.error('Error linking products to promo code:', linkError);
        // Ne pas échouer si la liaison échoue, le code promo est déjà créé
      }
    }

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}

// GET /api/admin/promo-codes - Récupérer tous les codes promo
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    const { data: promoCodes, error } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching promo codes:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des codes promo' },
        { status: 500 }
      );
    }

    return NextResponse.json({ promoCodes }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
