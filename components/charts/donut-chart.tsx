"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import type { PieRealisasiPersen } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

interface DonutChartProps {
    data?: PieRealisasiPersen[];
    isLoading?: boolean;
}

export function DonutChart({ data, isLoading }: DonutChartProps) {
    if (isLoading || !data) {
        return <Skeleton className="h-[380px] rounded-xl" />;
    }

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
                <h3 className="text-base font-semibold text-gray-800 mb-6">Total Realisasi PAD</h3>
                <ChartEmptyState />
            </div>
        );
    }

    const chartData = data.map((d) => ({
        name: d.label,
        value: Number(d.persentase),
        color: d.label === "Total Realisasi" ? "#3b82f6" : "#FBBF24",
    }));

    const tahun = data[0]?.tahun ?? new Date().getFullYear();

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <h3 className="text-base font-semibold text-gray-800 mb-6">
                Total Realisasi PAD
            </h3>
            <div className="relative w-full flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            animationDuration={600}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value}%`, ""]}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900">{tahun}</span>
                </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
                {chartData.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: d.color }}
                        />
                        <span className="text-xs text-gray-600">
                            {d.value}% {d.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
