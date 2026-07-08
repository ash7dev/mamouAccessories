import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

// POST /api/cart/products - Récupérer plusieurs produits par leurs IDs
export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'IDs de produits invalides' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        category:categories(name)
      `)
      .in('id', productIds);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des produits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
