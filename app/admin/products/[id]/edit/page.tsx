import { ProductForm } from "@/components/admin/products/product-form";
import { getProductById } from "@/lib/api/products";

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
          images: (product.images ?? []).map((image: any) => ({
            id: image.id,
            url: image.cloudinary_public_id
              ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${image.cloudinary_public_id}`
              : "/placeholder-product.jpg",
            cloudinaryPublicId: image.cloudinary_public_id,
          })),
        }}
      />
    </div>
  );
}
