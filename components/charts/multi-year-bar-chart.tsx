"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { RealisasiKelompok5Thn } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

interface MultiYearBarChartProps {
    data?: RealisasiKelompok5Thn[];
    isLoading?: boolean;
}

const KELOMPOK_COLORS: Record<string, string> = {
    "Pajak Daerah": "#22c55e",
    "Retribusi": "#3b82f6",
    "Hak Pengelolaan Kekayaan": "#f59e0b",
    "Lain-lain PAD Sah": "#ef4444",
};

export function MultiYearBarChart({ data, isLoading }: MultiYearBarChartProps) {
    if (isLoading || !data) {
        return <Skeleton className="h-[380px] rounded-xl" />;
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Realisasi per Kelompok PAD (5 Tahun)</h3>
                <ChartEmptyState />
            </div>
        );
    }

    // Pivot: group by tahun, spread kelompok_pad as keys
    const tahunMap = new Map<number, Record<string, number>>();
    const kelompokSet = new Set<string>();

    for (const row of data) {
        const tahun = Number(row.tahun);
        const kelompok = row.kelompok_pad;
        kelompokSet.add(kelompok);
        if (!tahunMap.has(tahun)) {
            tahunMap.set(tahun, { tahun });
        }
        tahunMap.get(tahun)![kelompok] = Number(row.total_realisasi);
    }

    const chartData = Array.from(tahunMap.values()).sort(
        (a, b) => (a.tahun as number) - (b.tahun as number)
    );
    const kelompokList = Array.from(kelompokSet);

    const tahunFirst = chartData[0]?.tahun ?? "";
    const tahunLast = chartData[chartData.length - 1]?.tahun ?? "";

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800">
                    Realisasi per Kelompok PAD {tahunFirst} s/d {tahunLast}
                </h3>
            </div>

            <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="tahun"
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => formatCompact(v)}
                        />
                        <Tooltip
                            formatter={(value) => [formatCompact(Number(value ?? 0)), ""]}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                            }}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                        />
                        {kelompokList.map((kelompok) => (
                            <Bar
                                key={kelompok}
                                dataKey={kelompok}
                                name={kelompok}
                                fill={KELOMPOK_COLORS[kelompok] ?? "#94a3b8"}
                                radius={[4, 4, 0, 0]}
                                animationDuration={600}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
