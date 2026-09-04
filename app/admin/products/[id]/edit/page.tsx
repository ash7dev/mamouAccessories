import { ProductForm } from "@/components/admin/products/product-form";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { notFound } from "next/navigation";

// Force dynamic rendering & zero cache for edit page
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductById(id: string) {
  const supabase = createServiceRoleClient();

  const { data: product, error } = await supabase
    .from("products")
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
    .eq("id", id)
    .single();

  if (error || !product) {
    console.error("Error fetching product for edit:", error);
    notFound();
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
          compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : null,
          stock: Number(product.stock ?? 0),
          imageOrientation: (product.image_orientation ?? "portrait") as "portrait" | "landscape",
          isFeatured: Boolean(product.is_featured),
          isActive: Boolean(product.is_active),
          images: (product.product_images ?? [])
            .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
            .map((image: any) => ({
              id: image.id,
              url: resolveProductImageUrl(image.cloudinary_public_id),
              cloudinaryPublicId: image.cloudinary_public_id ?? "",
            })),
        }}
      />
    </div>
  );
}
