"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { TrenAkumulasi } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

interface TrendAreaChartProps {
    data?: TrenAkumulasi[];
    isLoading?: boolean;
}

const KELOMPOK_CONFIG: Record<string, { color: string; gradientId: string }> = {
    "Pajak Daerah": { color: "#22c55e", gradientId: "colorPajak" },
    "Retribusi": { color: "#3b82f6", gradientId: "colorRetribusi" },
    "Hak Pengelolaan Kekayaan": { color: "#f59e0b", gradientId: "colorKekayaan" },
    "Lain-lain PAD Sah": { color: "#ef4444", gradientId: "colorLainlain" },
};

export function TrendAreaChart({ data, isLoading }: TrendAreaChartProps) {
    if (isLoading || !data) {
        return <Skeleton className="h-[420px] rounded-xl" />;
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Tren Akumulasi Realisasi PAD</h3>
                <ChartEmptyState />
            </div>
        );
    }

    // Pivot: group by bulan, spread kelompok_pad as keys
    const bulanMap = new Map<string, Record<string, number | string>>();
    const kelompokSet = new Set<string>();
    const bulanOrder: string[] = [];

    for (const row of data) {
        const bulan = row.bulan?.trim() ?? "";
        const kelompok = row.kelompok_pad;
        kelompokSet.add(kelompok);
        if (!bulanMap.has(bulan)) {
            bulanMap.set(bulan, { bulan });
            bulanOrder.push(bulan);
        }
        bulanMap.get(bulan)![kelompok] = Number(row.akumulasi_realisasi);
    }

    // Maintain month order from DB (already ordered by bulan_angka)
    const chartData = bulanOrder.map((b) => bulanMap.get(b)!);
    const kelompokList = Array.from(kelompokSet);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800">
                    Tren Realisasi Pendapatan per Bulan (Berdasarkan Kelompok PAD)
                </h3>
            </div>

            <div className="flex items-center gap-4 mb-4">
                {kelompokList.map((kelompok) => {
                    const cfg = KELOMPOK_CONFIG[kelompok];
                    return (
                        <div key={kelompok} className="flex items-center gap-1.5">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: cfg?.color ?? "#94a3b8" }}
                            />
                            <span className="text-xs text-gray-500">{kelompok}</span>
                        </div>
                    );
                })}
            </div>

            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {kelompokList.map((kelompok) => {
                                const cfg = KELOMPOK_CONFIG[kelompok];
                                const id = cfg?.gradientId ?? `color-${kelompok.replace(/\s/g, "")}`;
                                const color = cfg?.color ?? "#94a3b8";
                                return (
                                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                );
                            })}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="bulan"
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
                        {kelompokList.map((kelompok) => {
                            const cfg = KELOMPOK_CONFIG[kelompok];
                            const id = cfg?.gradientId ?? `color-${kelompok.replace(/\s/g, "")}`;
                            const color = cfg?.color ?? "#94a3b8";
                            return (
                                <Area
                                    key={kelompok}
                                    type="monotone"
                                    dataKey={kelompok}
                                    name={kelompok}
                                    stroke={color}
                                    fill={`url(#${id})`}
                                    strokeWidth={2}
                                    animationDuration={600}
                                />
                            );
                        })}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
