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
import { yearlyRealisasi } from "@/lib/data";

export function MultiYearBarChart() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800">
                    Realisasi per Kelompok PAD 2022 s/d 2026
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                        Periode <span className="text-gray-400">▼</span>
                    </span>
                    <span className="px-2 py-1 bg-gray-50 rounded-md">2025-01-01</span>
                    <span className="text-gray-400">s/d</span>
                    <span className="px-2 py-1 bg-gray-50 rounded-md">2025-01-30</span>
                </div>
            </div>

            <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={yearlyRealisasi}
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
                        />
                        <Tooltip
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
                        <Bar
                            dataKey="pajakDaerah"
                            name="Pajak Daerah"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                        <Bar
                            dataKey="retribusi"
                            name="Retribusi"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                        <Bar
                            dataKey="hasilKekayaan"
                            name="Hak Pengelolaan Kekayaan"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                        <Bar
                            dataKey="lainLain"
                            name="Lain-lain PAD Sah"
                            fill="#ef4444"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
