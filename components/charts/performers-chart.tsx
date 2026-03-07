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
import { topPerformers, bottomPerformers } from "@/lib/data";

export function PerformersChart() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top 5 Performers */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Top 5 Performers
                </h3>
                <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topPerformers}
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
                            />
                            <Tooltip
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
            </div>

            {/* Bottom 5 At-Risk */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                    Bottom 5 At-Risk
                </h3>
                <div style={{ height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={bottomPerformers}
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
                            />
                            <Tooltip
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
            </div>
        </div>
    );
}
