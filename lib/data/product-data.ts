import { createClient } from '@/lib/supabase/server';
import { buildImageUrl } from '@/lib/cloudinary';
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

  // Transformer les images avec Cloudinary URLs
  const productImages = (images || [])
    .map((img) => ({
      id: img.id,
      url: buildImageUrl(img.cloudinary_public_id, {
        width: 1200,
        height: 1600,
        crop: 'fill',
        quality: 'auto',
      }),
    }))
    .filter((img): img is { id: string; url: string } => img.url !== null);

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
    images: productImages.length > 0 ? productImages : [],
  };
}
