"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { varianceData } from "@/lib/data";
import { formatCompact } from "@/lib/format";

export function VarianceBarChart() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-6">
                Variance by Kelompok PAD
            </h3>
            <div className="space-y-4">
                {varianceData.map((item, i) => {
                    const absVariance = Math.abs(item.variance);
                    const maxVariance = Math.max(...varianceData.map(d => Math.abs(d.variance)));
                    const widthPercent = (absVariance / maxVariance) * 100;

                    return (
                        <div key={i} className="flex items-center gap-3">
                            <span className="text-xs text-gray-600 w-44 text-right shrink-0">
                                {item.nama}
                            </span>
                            <div className="flex-1 relative h-5">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-r-md transition-all duration-500"
                                    style={{
                                        width: `${widthPercent}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>
                            <span className="text-xs font-semibold text-gray-700 w-20 text-right shrink-0">
                                {formatCompact(item.variance)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
