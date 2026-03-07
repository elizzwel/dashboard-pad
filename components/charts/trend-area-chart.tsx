"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { trendData } from "@/lib/data";

export function TrendAreaChart() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800">
                    Tren Realisasi Pendapatan per Bulan (Berdasarkan Kelompok PAD)
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                        Periode <span className="text-gray-400">▼</span>
                    </span>
                    <span className="px-2 py-1 bg-gray-50 rounded-md">2025-03-01</span>
                    <span className="text-gray-400">s/d</span>
                    <span className="px-2 py-1 bg-gray-50 rounded-md">2025-03-30</span>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
                {[
                    { label: "Pajak Daerah", color: "#22c55e" },
                    { label: "Retribusi", color: "#3b82f6" },
                    { label: "Hak Pengelolaan Kekayaan", color: "#f59e0b" },
                    { label: "Lain-lain PAD Sah", color: "#ef4444" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                ))}
            </div>

            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={trendData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPajak" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorRetribusi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorKekayaan" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLainlain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
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
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="pajakDaerah"
                            name="Pajak Daerah"
                            stroke="#22c55e"
                            fill="url(#colorPajak)"
                            strokeWidth={2}
                            animationDuration={600}
                        />
                        <Area
                            type="monotone"
                            dataKey="retribusi"
                            name="Retribusi"
                            stroke="#3b82f6"
                            fill="url(#colorRetribusi)"
                            strokeWidth={2}
                            animationDuration={600}
                        />
                        <Area
                            type="monotone"
                            dataKey="hasilKekayaan"
                            name="Hak Pengelolaan Kekayaan"
                            stroke="#f59e0b"
                            fill="url(#colorKekayaan)"
                            strokeWidth={2}
                            animationDuration={600}
                        />
                        <Area
                            type="monotone"
                            dataKey="lainLain"
                            name="Lain-lain PAD Sah"
                            stroke="#ef4444"
                            fill="url(#colorLainlain)"
                            strokeWidth={2}
                            animationDuration={600}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
