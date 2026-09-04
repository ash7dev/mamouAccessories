import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// GET /api/admin/reels - List all reels for admin (returns real DB state)
export async function GET() {
  try {
    const supabase = createServiceRoleClient();

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
          stock
        )
      `)
      .order("order_index", { ascending: true });

    if (error || !rawReels) {
      // Table missing or empty -> return empty array for admin
      return NextResponse.json({ reels: [] }, { status: 200 });
    }

    const reels = rawReels.map((reel: any) => ({
      id: reel.id,
      title: reel.title,
      videoUrl: reel.video_url,
      thumbnailUrl: reel.thumbnail_url,
      durationSeconds: reel.duration_seconds || 15,
      productId: reel.product_id,
      productName: reel.products?.name || "Bijou",
      productSlug: reel.products?.slug || "boutique",
      productPrice: Number(reel.products?.price ?? 0),
      productComparePrice: reel.products?.compare_at_price ? Number(reel.products.compare_at_price) : null,
      productStock: Number(reel.products?.stock ?? 0),
      isActive: Boolean(reel.is_active),
      orderIndex: reel.order_index ?? 0,
      createdAt: reel.created_at,
    }));

    return NextResponse.json({ reels }, { status: 200 });
  } catch (err) {
    console.error("Admin Reels GET error:", err);
    return NextResponse.json({ reels: [] }, { status: 200 });
  }
}

// POST /api/admin/reels - Create a new video reel
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const { title, videoUrl, thumbnailUrl, durationSeconds, productId, isActive = true, orderIndex = 0 } = body;

    if (!videoUrl || !productId) {
      return NextResponse.json(
        { error: "L'URL de la vidéo et le produit associé sont obligatoires." },
        { status: 400 }
      );
    }

    // Validation max 45 secondes
    if (durationSeconds && durationSeconds > 45) {
      return NextResponse.json(
        { error: "La durée maximale d'une vidéo Reel est limitée à 45 secondes." },
        { status: 400 }
      );
    }

    const { data: newReel, error } = await supabase
      .from("reels")
      .insert({
        title: title || "Nouveau Reel",
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        duration_seconds: durationSeconds || 15,
        product_id: productId,
        is_active: isActive,
        order_index: orderIndex,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert reel error:", error);
      return NextResponse.json(
        { error: `Erreur lors de l'enregistrement : ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ reel: newReel }, { status: 201 });
  } catch (err) {
    console.error("Admin Reels POST error:", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du Reel." },
      { status: 500 }
    );
  }
}
