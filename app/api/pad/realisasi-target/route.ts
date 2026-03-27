import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// Explicit row types to work around supabase-js type inference returning 'never'
type MasterPajak = { id: number; nama_pajak: string; type_id: number };
type MasterTypePajak = { id: number; nama_type: string };
type TargetPajakRow = { id: number; id_pajak: number | null; tahun: number; target_rp: number };
type RealisasiPajakRow = { id: number; id_pajak: number | null; tahun: number; realisasi_rp: number; tanggal_input: string | null };

export async function GET(request: NextRequest) {
  try {
    const tahunParam = request.nextUrl.searchParams.get("tahun");
    const tahun = tahunParam ? Number(tahunParam) : new Date().getFullYear();

    const supabase = createServerClient();

    const { data: targetsRaw, error: tErr } = await supabase
      .from("target_pajak")
      .select("*")
      .eq("tahun", tahun);
    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
    const targets = (targetsRaw ?? []) as TargetPajakRow[];

    const { data: realisasiRaw, error: rErr } = await supabase
      .from("realisasi_pajak")
      .select("*")
      .eq("tahun", tahun);
    if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });
    const realisasi = (realisasiRaw ?? []) as RealisasiPajakRow[];

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

    // Build lookup maps
    const pajakTypeMap = new Map(pajak.map((p) => [p.id, p.type_id]));
    const typeNameMap = new Map(types.map((t) => [t.id, t.nama_type]));

    // Aggregate by kelompok_pad
    const kelompokMap = new Map<string, { total_target: number; total_realisasi: number }>();

    for (const t of targets) {
      if (t.id_pajak == null) continue;
      const typeId = pajakTypeMap.get(t.id_pajak);
      if (!typeId) continue;
      const nama = typeNameMap.get(typeId) ?? "Lainnya";
      const existing = kelompokMap.get(nama) ?? { total_target: 0, total_realisasi: 0 };
      existing.total_target += Number(t.target_rp);
      kelompokMap.set(nama, existing);
    }

    for (const r of realisasi) {
      if (r.id_pajak == null) continue;
      const typeId = pajakTypeMap.get(r.id_pajak);
      if (!typeId) continue;
      const nama = typeNameMap.get(typeId) ?? "Lainnya";
      const existing = kelompokMap.get(nama) ?? { total_target: 0, total_realisasi: 0 };
      existing.total_realisasi += Number(r.realisasi_rp);
      kelompokMap.set(nama, existing);
    }

    const result = Array.from(kelompokMap.entries())
      .map(([kelompok_pad, vals]) => ({
        kelompok_pad,
        tahun,
        total_target: vals.total_target,
        total_realisasi: vals.total_realisasi,
      }))
      .sort((a, b) => b.total_target - a.total_target);

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
