import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const tahun = request.nextUrl.searchParams.get("tahun");
    const supabase = createServerClient();

    let query = supabase.from("v_pie_realisasi_persen").select("*");
    if (tahun) {
      query = query.eq("tahun", Number(tahun));
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
