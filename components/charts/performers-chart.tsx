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
import type { PerformerData } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

interface PerformersChartProps {
    topData?: PerformerData[];
    bottomData?: PerformerData[];
    isLoading?: boolean;
}

export function PerformersChart({ topData, bottomData, isLoading }: PerformersChartProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[320px] rounded-xl" />
                <Skeleton className="h-[320px] rounded-xl" />
            </div>
        );
    }

    const topEmpty = !topData || topData.length === 0;
    const bottomEmpty = !bottomData || bottomData.length === 0;

    const topChartData = (topData ?? []).map((d) => ({
        nama: d.nama_pajak,
        target: Number(d.target_rp),
        realisasi: Number(d.realisasi_rp),
    }));

    const bottomChartData = (bottomData ?? []).map((d) => ({
        nama: d.nama_pajak,
        target: Number(d.target_rp),
        realisasi: Number(d.realisasi_rp),
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Performers */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Top 5 Performers
                </h3>
                {topEmpty ? (
                    <ChartEmptyState message="Belum ada data top performers" />
                ) : (
                <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topChartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                            barGap={4}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="nama"
                                tick={{ fontSize: 10, fill: "#64748b" }}
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
                                    fontSize: "12px",
                                }}
                            />
                            <Legend
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: "12px" }}
                            />
                            <Bar
                                dataKey="target"
                                name="Target"
                                fill="#f59e0b"
                                radius={[4, 4, 0, 0]}
                                animationDuration={600}
                            />
                            <Bar
                                dataKey="realisasi"
                                name="Realisasi"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                animationDuration={600}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                )}
            </div>

            {/* Bottom 5 At-Risk */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Bottom 5 At-Risk
                </h3>
                {bottomEmpty ? (
                    <ChartEmptyState message="Belum ada data at-risk" />
                ) : (
                    <div style={{ height: 250 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={bottomChartData}
                                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                                barGap={4}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="nama"
                                    tick={{ fontSize: 10, fill: "#64748b" }}
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
                                        fontSize: "12px",
                                    }}
                                />
                                <Legend
                                    iconType="circle"
                                    iconSize={8}
                                    wrapperStyle={{ fontSize: "12px" }}
                                />
                                <Bar
                                    dataKey="target"
                                    name="Target"
                                    fill="#ef4444"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={600}
                                />
                                <Bar
                                    dataKey="realisasi"
                                    name="Realisasi"
                                    fill="#3b82f6"
                                    radius={[4, 4, 0, 0]}
                                    animationDuration={600}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
