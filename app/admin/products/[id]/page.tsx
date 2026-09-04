import { ProductDetail } from "@/components/admin/products/product-detail";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getProductDetailData(id: string) {
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
      created_at,
      categories (
        id,
        name
      ),
      product_images (
        id,
        cloudinary_public_id,
        position
      )
    `)
    .eq("id", id)
    .single();

  if (error || !product) {
    console.error("Error fetching product:", error);
    notFound();
  }

  // Real-time sales stats calculation from order_items
  let unitsSold = 0;
  let revenue = 0;
  try {
    const { data: items } = await supabase
      .from("order_items")
      .select("quantity, price")
      .eq("product_id", id);

    if (items && items.length > 0) {
      unitsSold = items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
      revenue = items.reduce(
        (acc, item) => acc + (Number(item.quantity) || 0) * (Number(item.price) || 0),
        0
      );
    }
  } catch (err) {
    console.error("Error fetching product sales stats:", err);
  }

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: (product.categories as any)?.name ?? "Sans catégorie",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    compareAtPrice: product.compare_at_price ? Number(product.compare_at_price) : null,
    stock: Number(product.stock ?? 0),
    imageOrientation: (product.image_orientation ?? "portrait") as "portrait" | "landscape",
    isFeatured: Boolean(product.is_featured),
    isActive: Boolean(product.is_active),
    createdAt: product.created_at,
    images: (product.product_images ?? [])
      .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
      .map((image: any) => ({
        id: image.id,
        url: resolveProductImageUrl(image.cloudinary_public_id),
      })),
    stats: {
      unitsSold,
      revenue,
      avgRating: null,
      reviewsCount: 0,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productData = await getProductDetailData(id);

  return <ProductDetail product={productData} />;
}
