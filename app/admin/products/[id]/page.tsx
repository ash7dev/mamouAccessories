import { ProductDetail } from "@/components/admin/products/product-detail";
import { getProductById } from "@/lib/api/products";
import type { ProductDetailData } from "@/components/admin/products/product-detail";

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !publicId) return null;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

function mapProductToDetail(product: any): ProductDetailData {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryName: product.category?.name ?? "Sans catégorie",
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    compareAtPrice: product.compare_at_price ?? null,
    stock: Number(product.stock ?? 0),
    imageOrientation: product.image_orientation ?? "portrait",
    isFeatured: Boolean(product.is_featured),
    isActive: Boolean(product.is_active),
    createdAt: product.created_at,
    images: (product.images ?? []).map((image: any) => ({
      id: image.id,
      url: buildCloudinaryImageUrl(image.cloudinary_public_id) ?? "/placeholder-product.jpg",
    })),
    stats: {
      unitsSold: 0,
      revenue: 0,
      avgRating: null,
      reviewsCount: 0,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  return (
    <div className="p-6 lg:p-8">
      <ProductDetail product={mapProductToDetail(product)} />
    </div>
  );
}
