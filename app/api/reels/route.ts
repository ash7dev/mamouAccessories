import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { resolveProductImageUrl } from "@/lib/utils/image-helpers";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();

    // Query active reels from Supabase if table exists
    const { data: rawReels, error } = await supabase
      .from("reels")
      .select(`
        *,
        products (
          id,
          name,
          slug,
          price,
          compare_at_price,
          stock,
          images:product_images(cloudinary_public_id, position)
        )
      `)
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error || !rawReels || rawReels.length === 0) {
      // Return empty array when no reels are published yet
      return NextResponse.json({ reels: [] }, { status: 200 });
    }

    const reels = rawReels.map((reel: any) => {
      const product = reel.products || {};
      const sortedImages = (product.images || []).sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0));
      const firstImagePublicId = sortedImages[0]?.cloudinary_public_id;
      const resolvedImage = resolveProductImageUrl(firstImagePublicId);

      return {
        id: reel.id,
        title: reel.title || product.name || "Reel Bijou",
        videoUrl: reel.video_url,
        thumbnailUrl: reel.thumbnail_url || resolvedImage,
        durationSeconds: reel.duration_seconds || 15,
        productId: product.id || reel.product_id,
        productName: product.name || "Bijou Mamou",
        productSlug: product.slug || "boutique",
        productPrice: Number(product.price ?? 0),
        productComparePrice: product.compare_at_price ? Number(product.compare_at_price) : null,
        productImageUrl: resolvedImage,
        productStock: Number(product.stock ?? 0),
        isActive: Boolean(reel.is_active),
        orderIndex: reel.order_index ?? 0,
        createdAt: reel.created_at,
      };
    });

    return NextResponse.json({ reels }, { status: 200 });
  } catch (err) {
    console.error("Reels API Error:", err);
    return NextResponse.json({ reels: [] }, { status: 200 });
  }
}
