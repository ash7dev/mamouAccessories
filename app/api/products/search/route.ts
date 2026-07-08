import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/products/search?q=collier&limit=10
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const supabase = await createClient();

    // Recherche par nom de produit (insensible à la casse)
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        stock,
        categories!inner(name),
        images:product_images(cloudinary_public_id)
      `)
      .ilike('name', `%${query}%`)
      .eq('is_active', true)
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      return NextResponse.json(
        { error: 'Erreur lors de la recherche des produits' },
        { status: 500 }
      );
    }

    // Formater les résultats
    const formattedProducts = (products || []).map((product: any) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      categoryName: product.categories?.name || 'Sans catégorie',
      imageUrl: product.images?.[0]?.cloudinary_public_id || null,
    }));

    return NextResponse.json({ products: formattedProducts }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
