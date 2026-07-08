import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { deleteImages } from '@/lib/cloudinary';
import type { CreateProductInput, ProductFilters } from '@/lib/types/product';

// GET /api/products - Récupérer tous les produits avec filtres
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);

    // Extraire les filtres depuis les query params
    const filters: ProductFilters = {
      category_id: searchParams.get('category_id') || undefined,
      is_featured: searchParams.get('is_featured') === 'true' ? true : undefined,
      is_active: searchParams.get('is_active') === 'true' ? true : undefined,
      search: searchParams.get('search') || undefined,
      min_price: searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!) : undefined,
    };

    // Construire la requête
    let query = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .order('created_at', { ascending: false });

    // Appliquer les filtres
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured);
    }
    if (filters.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }
    if (filters.min_price !== undefined) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price !== undefined) {
      query = query.lte('price', filters.max_price);
    }

    const { data: products, error } = await query;

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

// POST /api/products - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body: CreateProductInput = await request.json();

    // Validation des champs requis
    if (!body.name || !body.slug || !body.category_id || body.price === undefined) {
      return NextResponse.json(
        { error: 'Les champs name, slug, category_id et price sont requis' },
        { status: 400 }
      );
    }

    // Vérifier que le slug est unique
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', body.slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 409 }
      );
    }

    // Créer le produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        category_id: body.category_id,
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        price: body.price,
        compare_at_price: body.compare_at_price || null,
        stock: body.stock,
        image_orientation: body.image_orientation || 'portrait',
        is_featured: body.is_featured || false,
        is_active: body.is_active !== undefined ? body.is_active : true,
      })
      .select()
      .single();

    if (productError) {
      console.error('Error creating product:', productError);
      return NextResponse.json(
        { error: 'Erreur lors de la création du produit' },
        { status: 500 }
      );
    }

    // Ajouter les images si fournies
    if (body.cloudinary_public_ids && body.cloudinary_public_ids.length > 0) {
      const images = body.cloudinary_public_ids.map((publicId, index) => ({
        product_id: product.id,
        cloudinary_public_id: publicId,
        position: index,
      }));

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(images);

      if (imagesError) {
        console.error('Error adding images:', imagesError);
        // Ne pas échouer la requête, juste logger l'erreur
      }
    }

    // Récupérer le produit avec ses images
    const { data: productWithImages } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*)
      `)
      .eq('id', product.id)
      .single();

    return NextResponse.json(
      { product: productWithImages },
      { status: 201 }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Erreur inattendue' },
      { status: 500 }
    );
  }
}
