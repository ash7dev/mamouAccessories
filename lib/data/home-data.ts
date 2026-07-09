import { createClient } from '@/lib/supabase/server';
import type { HomeCategory } from '@/components/home/CategoryRail';
import type { PublicProductCard } from '@/components/home/ProductCard';
import type { HomeReview } from '@/components/home/Testimonials';

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'utngoden';

  if (!publicId) {
    console.error('No publicId provided to buildCloudinaryImageUrl');
    return null;
  }

  // Simple URL sans transformations pour éviter les 404
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
  console.log('Building simple image URL:', url);
  return url;
}

/**
 * Récupère les catégories pour la page d'accueil
 */
export async function getHomeCategories(): Promise<HomeCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Mapping des catégories aux images dans le dossier public
  const categoryImageMap: Record<string, string> = {
    'ensembles': '/ensemble.jpg',
    'bracelets': '/bracelets.jpg',
    'chaines': '/chaines.jpg',
    'boucles d\'oreilles': '/boucleoreille.jpg',
    'oreilles': '/boucleoreille.jpg',
    'bague': '/bracelets.jpg', // Réutiliser bracelets.jpg pour bague
    'bagues': '/bracelets.jpg', // Réutiliser bracelets.jpg pour bagues
    'montres': '/montres.jpg',
    'collier': '/chaines.jpg', // Réutiliser chaines.jpg pour collier
    'colliers': '/chaines.jpg', // Réutiliser chaines.jpg pour colliers
  };

  const getImageForCategory = (name: string): string => {
    const normalizedName = name.toLowerCase();
    // Chercher une correspondance exacte ou partielle
    for (const [key, image] of Object.entries(categoryImageMap)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return image;
      }
    }
    // Image par défaut si aucune correspondance
    return '/ensemble.jpg';
  };

  return (data || []).map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    imageUrl: getImageForCategory(cat.name),
  }));
}

/**
 * Récupère les produits en vedette (featured)
 */
export async function getFeaturedProducts(): Promise<PublicProductCard[]> {
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
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  // Récupérer les images séparément pour chaque produit
  const productsWithImages = await Promise.all(
    (data || []).map(async (product) => {
      const { data: images, error: imageError } = await supabase
        .from('product_images')
        .select('cloudinary_public_id')
        .eq('product_id', product.id)
        .order('position', { ascending: true })
        .limit(1);

      if (imageError) {
        console.error('Error fetching images for product', product.id, imageError);
      }

      if (!images || images.length === 0) {
        console.log('Product', product.name, 'has no images');
      } else {
        console.log('Product:', product.name, 'Image ID:', images[0].cloudinary_public_id);
      }

      return {
        ...product,
        firstImage: images?.[0]?.cloudinary_public_id || null,
      };
    })
  );

  return productsWithImages.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : 'Bijoux',
    price: product.price,
    compareAtPrice: product.compare_at_price,
    stock: product.stock,
    imageUrl: product.firstImage
      ? buildCloudinaryImageUrl(product.firstImage)
      : null,
    imageOrientation: product.image_orientation || 'portrait',
  }));
}

/**
 * Récupère les nouveaux arrivages
 */
export async function getNewArrivals(): Promise<PublicProductCard[]> {
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
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }

  // Récupérer les images séparément pour chaque produit
  const productsWithImages = await Promise.all(
    (data || []).map(async (product) => {
      const { data: images, error: imageError } = await supabase
        .from('product_images')
        .select('cloudinary_public_id')
        .eq('product_id', product.id)
        .order('position', { ascending: true })
        .limit(1);

      if (imageError) {
        console.error('Error fetching images for product', product.id, imageError);
      }

      if (!images || images.length === 0) {
        console.log('Product', product.name, 'has no images');
      } else {
        console.log('Product:', product.name, 'Image ID:', images[0].cloudinary_public_id);
      }

      return {
        ...product,
        firstImage: images?.[0]?.cloudinary_public_id || null,
      };
    })
  );

  return productsWithImages.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : 'Bijoux',
    price: product.price,
    compareAtPrice: product.compare_at_price,
    stock: product.stock,
    imageUrl: product.firstImage
      ? buildCloudinaryImageUrl(product.firstImage)
      : null,
    imageOrientation: product.image_orientation || 'portrait',
  }));
}

/**
 * Récupère les avis approuvés
 */
export async function getApprovedReviews(limit = 6): Promise<HomeReview[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      author_name,
      rating,
      content,
      product:products(name)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return (data || []).map((review) => ({
    id: review.id,
    authorName: review.author_name,
    rating: review.rating,
    content: review.content,
    productName: Array.isArray(review.product) && review.product.length > 0 ? review.product[0].name : undefined,
    location: 'Dakar',
  }));
}

/**
 * Récupère la promotion active (si existe)
 */
export async function getActivePromo(): Promise<{ isActive: boolean } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'active_promo')
    .single();

  if (error || !data) {
    return null;
  }

  try {
    const promo = JSON.parse(data.value);
    return promo.isActive ? promo : null;
  } catch {
    return null;
  }
}

/**
 * Récupère des produits recommandés (aléatoires)
 */
export async function getRecommendedProducts(): Promise<PublicProductCard[]> {
  const supabase = await createClient();

  // Récupérer tous les produits actifs
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
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products for recommendations:', error);
    return [];
  }

  // Mélanger aléatoirement et prendre 8 produits
  const shuffled = (data || []).sort(() => Math.random() - 0.5);
  const randomProducts = shuffled.slice(0, 8);

  // Récupérer les images séparément pour chaque produit
  const productsWithImages = await Promise.all(
    randomProducts.map(async (product) => {
      const { data: images, error: imageError } = await supabase
        .from('product_images')
        .select('cloudinary_public_id')
        .eq('product_id', product.id)
        .order('position', { ascending: true })
        .limit(1);

      if (imageError) {
        console.error('Error fetching images for product', product.id, imageError);
      }

      return {
        ...product,
        firstImage: images?.[0]?.cloudinary_public_id || null,
      };
    })
  );

  return productsWithImages.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: Array.isArray(product.categories) && product.categories.length > 0 ? product.categories[0].name : 'Bijoux',
    price: product.price,
    compareAtPrice: product.compare_at_price,
    stock: product.stock,
    imageUrl: product.firstImage
      ? buildCloudinaryImageUrl(product.firstImage)
      : null,
    imageOrientation: product.image_orientation || 'portrait',
  }));
}
