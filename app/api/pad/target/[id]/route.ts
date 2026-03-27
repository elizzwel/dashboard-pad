import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// PATCH /api/pad/target/[id] — Update
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);
    const body = await request.json();
    const { id_pajak, tahun, target_rp } = body;

    if (!id_pajak || !tahun || target_rp == null) {
      return NextResponse.json({ error: "id_pajak, tahun, dan target_rp wajib diisi" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("target_pajak")
      .update({ id_pajak: Number(id_pajak), tahun: Number(tahun), target_rp: Number(target_rp) } as never)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/pad/target/[id]
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await context.params;
    const id = Number(idStr);
    const supabase = createServerClient();
    const { error } = await supabase
      .from("target_pajak")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
