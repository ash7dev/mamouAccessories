import { ProductsHeader } from "@/components/admin/products/products-header";
import { ProductsList } from "@/components/admin/products/products-list";
import { getProducts } from "@/lib/api/products";

// Force dynamic rendering - ne pas pré-rendre au build
export const dynamic = 'force-dynamic';

function buildCloudinaryImageUrl(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName || !publicId) return null;

  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

export default async function ProductsPage() {
  const products = await getProducts();

  const mappedProducts = (products ?? []).map((product: any) => ({
    id: product.id,
    name: product.name,
    categoryName: product.category?.name ?? "Sans catégorie",
    price: Number(product.price ?? 0),
    compareAtPrice: product.compare_at_price ?? null,
    stock: Number(product.stock ?? 0),
    imageUrl: buildCloudinaryImageUrl(product.images?.[0]?.cloudinary_public_id) ?? null,
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
