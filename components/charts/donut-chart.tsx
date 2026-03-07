"use client";

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const data = [
    { name: "Realisasi", value: 63, color: "#3b82f6" },
    { name: "Belum Terealisasi", value: 37, color: "#FBBF24" },
];

export function DonutChart() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-6">
                Total Realisasi PAD
            </h3>
            <div className="relative w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            animationDuration={600}
                            stroke="none"
                        >
                            {data.map((entry, index) => (
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
                    <span className="text-2xl font-bold text-gray-900">2025</span>
                </div>
            </div>
            {/* <div className="flex items-center justify-center gap-6">
                <div className="grid grid-rows-2 items-center gap-2">
                    <span className="text-xs text-gray-600">Total Target</span>
                    <span className="text-xs text-gray-600">Rp 1.234.567.890</span>
                </div>
            </div> */}
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-brand-blue" />
                    <span className="text-xs text-gray-600">{data[0].value}% Total Realisasi</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
                    <span className="text-xs text-gray-600">{data[1].value}% Belum Terealisasi</span>
                </div>
            </div>
        </div>
    );
}
