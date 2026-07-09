import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { stock } = await request.json();

    // Validate stock
    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { error: "Invalid stock value" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Update stock
    const { data, error } = await supabase
      .from("products")
      .update({ stock })
      .eq("id", id)
      .select("stock")
      .single();

    if (error) {
      console.error("Error updating stock:", error);
      return NextResponse.json(
        { error: "Failed to update stock" },
        { status: 500 }
      );
    }

    return NextResponse.json({ stock: data.stock });
  } catch (error) {
    console.error("Stock update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
