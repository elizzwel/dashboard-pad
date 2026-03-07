"use client";

import { formatCurrency, formatCompact } from "@/lib/format";
import { topContributorsNominal, topContributorsPersentase } from "@/lib/data";
import { Progress } from "@/components/ui/progress";

export function TopContributors() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Nominal */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-800">
                        Top 3 Kontributor Berdasarkan Nominal
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-50 rounded-md">Tahun ▼</span>
                        <span className="px-2 py-1 bg-gray-50 rounded-md">2025 ▼</span>
                    </div>
                </div>
                <div className="space-y-5">
                    {topContributorsNominal.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {item.nama}
                                    </span>
                                    <span className="text-xs text-gray-400">•••</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                    <span>Realisasi: {formatCompact(item.realisasi)}</span>
                                    <span>Target: {formatCurrency(item.target)}</span>
                                </div>
                                <Progress
                                    value={item.persentaseTarget}
                                    className="h-1.5 bg-gray-100"
                                />
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Sisa Target: {item.persentaseTarget.toFixed(1)}%
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Realisasi: {item.persentaseRealisasi.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* By Percentage */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-800">
                        Top 3 Kontributor Berdasarkan Persentase
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-50 rounded-md">Tahun ▼</span>
                        <span className="px-2 py-1 bg-gray-50 rounded-md">2025 ▼</span>
                    </div>
                </div>
                <div className="space-y-5">
                    {topContributorsPersentase.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {item.nama}
                                    </span>
                                    <span className="text-xs text-gray-400">•••</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                    <span>Target: {formatCurrency(item.target)}</span>
                                    <span>Realisasi: {formatCurrency(item.realisasi)}</span>
                                </div>
                                <Progress
                                    value={item.persentaseRealisasi}
                                    className="h-1.5 bg-gray-100"
                                />
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Sisa Target: {(100 - item.persentaseRealisasi).toFixed(1)}%
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Realisasi: {item.persentaseRealisasi.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
