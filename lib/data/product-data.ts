import { createClient } from '@/lib/supabase/server';
import { resolveProductImageUrl } from '@/lib/utils/image-helpers';
import type { PublicProduct } from '@/components/boutique/productsdetail';

/**
 * Récupère un produit par son slug pour la page détails
 */
export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  const supabase = await createClient();

  // Récupérer le produit
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      compare_at_price,
      stock,
      image_orientation,
      categories!inner(name)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return null;
  }

  // Récupérer toutes les images du produit
  const { data: images } = await supabase
    .from('product_images')
    .select('id, cloudinary_public_id')
    .eq('product_id', product.id)
    .order('position', { ascending: true });

  // Transformer les images avec résolveur universel
  const productImages: Array<{ id: string; url: string }> = (images || []).map((img) => {
    const url = resolveProductImageUrl(img.cloudinary_public_id);
    return { id: img.id, url };
  });

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : 'Bijoux',
    description: product.description || '',
    price: product.price,
    compareAtPrice: product.compare_at_price,
    stock: product.stock,
    imageOrientation: product.image_orientation || 'portrait',
    images: productImages,
  };
}

/**
 * Récupère des produits similaires/recommandés pour la fiche produit
 */
export async function getRelatedProducts(currentProductId: string, limit = 4) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      price,
      compare_at_price,
      stock,
      image_orientation,
      categories!inner(name)
    `)
    .eq('is_active', true)
    .neq('id', currentProductId)
    .limit(limit * 2);

  if (error || !data) {
    console.error('Error fetching related products:', error);
    return [];
  }

  // Sélectionner aléatoirement
  const shuffled = (data || []).sort(() => Math.random() - 0.5).slice(0, limit);

  const productsWithImages = await Promise.all(
    shuffled.map(async (product) => {
      const { data: images } = await supabase
        .from('product_images')
        .select('cloudinary_public_id')
        .eq('product_id', product.id)
        .order('position', { ascending: true })
        .limit(1);

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        categoryName: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : 'Bijoux',
        price: product.price,
        compareAtPrice: product.compare_at_price,
        stock: product.stock,
        imageUrl: images?.[0]?.cloudinary_public_id
          ? resolveProductImageUrl(images[0].cloudinary_public_id)
          : null,
        imageOrientation: product.image_orientation || 'portrait',
      };
    })
  );

  return productsWithImages;
}
