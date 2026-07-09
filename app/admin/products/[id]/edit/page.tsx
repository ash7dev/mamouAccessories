import { ProductForm } from "@/components/admin/products/product-form";
import { buildImageUrl } from '@/lib/cloudinary';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 30;

async function getProductById(id: string) {
  const supabase = createServiceRoleClient();

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
      is_active,
      is_featured,
      category_id,
      product_images (
        id,
        cloudinary_public_id,
        position
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    throw new Error('Product not found');
  }

  return product;
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div className="p-6 lg:p-8">
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug ?? "",
          categoryId: product.category_id ?? "",
          description: product.description ?? "",
          price: Number(product.price ?? 0),
          compareAtPrice: product.compare_at_price ?? null,
          stock: Number(product.stock ?? 0),
          imageOrientation: product.image_orientation ?? "portrait",
          isFeatured: Boolean(product.is_featured),
          isActive: Boolean(product.is_active),
          images: (product.product_images ?? [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((image: any) => ({
              id: image.id,
              url: buildImageUrl(image.cloudinary_public_id) ?? "/placeholder-product.svg",
              cloudinaryPublicId: image.cloudinary_public_id,
            })),
        }}
      />
    </div>
  );
}
