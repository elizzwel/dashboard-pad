import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    const [headResult, detailResult] = await Promise.all([
      supabase.from("v_head_mata_anggaran_realisasi").select("*"),
      supabase.from("v_detail_mata_anggaran_realisasi").select("*"),
    ]);

    if (headResult.error) {
      return NextResponse.json(
        { error: headResult.error.message },
        { status: 500 }
      );
    }
    if (detailResult.error) {
      return NextResponse.json(
        { error: detailResult.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      head: headResult.data,
      detail: detailResult.data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
