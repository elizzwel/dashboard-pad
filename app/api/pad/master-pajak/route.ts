import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

type MasterPajak = { id: number; nama_pajak: string; type_id: number };
type MasterTypePajak = { id: number; nama_type: string };

export async function GET() {
  try {
    const supabase = createServerClient();

    const { data: pajakRaw, error: pErr } = await supabase
      .from("master_pajak")
      .select("*")
      .order("nama_pajak");
    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 });
    const pajak = (pajakRaw ?? []) as MasterPajak[];

    const { data: typesRaw, error: tErr } = await supabase
      .from("master_type_pajak")
      .select("*");
    if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });
    const types = (typesRaw ?? []) as MasterTypePajak[];

    const typeMap = new Map(types.map((t) => [t.id, t.nama_type]));

    const result = pajak.map((p) => ({
      id: p.id,
      nama_pajak: p.nama_pajak,
      kelompok: typeMap.get(p.type_id) ?? "Lainnya",
    }));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
