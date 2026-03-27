import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

type TargetPajakRow = { id: number; id_pajak: number | null; tahun: number; target_rp: number };
type MasterPajak = { id: number; nama_pajak: string; type_id: number };
type MasterTypePajak = { id: number; nama_type: string };

// GET /api/pad/target?tahun=2026
export async function GET(request: NextRequest) {
  try {
    const tahunParam = request.nextUrl.searchParams.get("tahun");
    const tahun = tahunParam ? Number(tahunParam) : new Date().getFullYear();
    const supabase = createServerClient();

    const { data: targetsRaw, error: tErr } = await supabase
      .from("target_pajak")
      .select("*")
      .eq("tahun", tahun)
      .order("id");
    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
    const targets = (targetsRaw ?? []) as TargetPajakRow[];

    const { data: pajakRaw, error: pErr } = await supabase
      .from("master_pajak")
      .select("*");
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
    const pajak = (pajakRaw ?? []) as MasterPajak[];

    const { data: typesRaw, error: tyErr } = await supabase
      .from("master_type_pajak")
      .select("*");
    if (tyErr) return NextResponse.json({ error: tyErr.message }, { status: 500 });
    const types = (typesRaw ?? []) as MasterTypePajak[];

    const pajakMap = new Map(pajak.map((p) => [p.id, p]));
    const typeMap = new Map(types.map((t) => [t.id, t.nama_type]));

    const result = targets.map((t) => {
      const mp = t.id_pajak != null ? pajakMap.get(t.id_pajak) : undefined;
      return {
        id: t.id,
        id_pajak: t.id_pajak,
        tahun: t.tahun,
        target_rp: t.target_rp,
        nama_pajak: mp?.nama_pajak ?? "—",
        kelompok: mp ? (typeMap.get(mp.type_id) ?? "—") : "—",
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/pad/target — Create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id_pajak, tahun, target_rp } = body;

    if (!id_pajak || !tahun || target_rp == null) {
      return NextResponse.json({ error: "id_pajak, tahun, dan target_rp wajib diisi" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("target_pajak")
      .upsert(
        { id_pajak: Number(id_pajak), tahun: Number(tahun), target_rp: Number(target_rp) } as never,
        { onConflict: "id_pajak,tahun" }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
