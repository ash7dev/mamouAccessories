import { ProductsHeader } from "@/components/admin/products/products-header";
import { ProductsList } from "@/components/admin/products/products-list";
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering - ne pas pré-rendre au build
export const dynamic = 'force-dynamic';

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !publicId) return null;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

async function getProducts() {
  const supabase = createServiceRoleClient();

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      compare_at_price,
      stock,
      is_active,
      is_featured,
      categories (
        id,
        name
      ),
      product_images (
        cloudinary_public_id,
        position
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products || [];
}

export default async function ProductsPage() {
  const products = await getProducts();

  const mappedProducts = products.map((product: any) => ({
    id: product.id,
    name: product.name,
    categoryName: product.categories?.name ?? "Sans catégorie",
    price: Number(product.price ?? 0),
    compareAtPrice: product.compare_at_price ?? null,
    stock: Number(product.stock ?? 0),
    imageUrl: buildCloudinaryImageUrl(
      product.product_images?.find((img: any) => img.position === 0)?.cloudinary_public_id
    ) ?? null,
    isActive: Boolean(product.is_active),
    isFeatured: Boolean(product.is_featured),
    unitsSold: 0,
  }));

  return (
    <div className="p-6 lg:p-8">
      <ProductsHeader />
      <ProductsList products={mappedProducts} />
    </div>
  );
}
