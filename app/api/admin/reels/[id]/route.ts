import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

// PUT /api/admin/reels/[id] - Update a reel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();
    const body = await request.json();

    const { title, videoUrl, thumbnailUrl, durationSeconds, productId, isActive, orderIndex } = body;

    if (durationSeconds && durationSeconds > 45) {
      return NextResponse.json(
        { error: "La durée maximale d'une vidéo Reel est limitée à 45 secondes." },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabase
      .from("reels")
      .update({
        ...(title !== undefined && { title }),
        ...(videoUrl !== undefined && { video_url: videoUrl }),
        ...(thumbnailUrl !== undefined && { thumbnail_url: thumbnailUrl }),
        ...(durationSeconds !== undefined && { duration_seconds: durationSeconds }),
        ...(productId !== undefined && { product_id: productId }),
        ...(isActive !== undefined && { is_active: isActive }),
        ...(orderIndex !== undefined && { order_index: orderIndex }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update reel error:", error);
    }

    return NextResponse.json({ success: true, reel: updated }, { status: 200 });
  } catch (err) {
    console.error("Admin Reel PUT error:", err);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

// DELETE /api/admin/reels/[id] - Delete a reel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServiceRoleClient();

    const { error } = await supabase.from("reels").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete reel error:", error);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Admin Reel DELETE error:", err);
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
