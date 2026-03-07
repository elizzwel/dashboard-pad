"use client";

import { varianceData } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { Info } from "lucide-react";

export function VarianceBarChart() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-4 sm:mb-6">
                Variance by Kelompok PAD
            </h3>
            <div className="space-y-4">
                {varianceData.map((item, i) => {
                    const absVariance = Math.abs(item.variance);
                    const maxVariance = Math.max(...varianceData.map(d => Math.abs(d.variance)));
                    const widthPercent = (absVariance / maxVariance) * 100;

                    return (
                        <div key={i}>
                            {/* Mobile: stacked label + bar */}
                            <div className="flex items-center justify-between mb-1.5 sm:hidden">
                                <span className="text-xs text-gray-600 truncate mr-2">
                                    {item.nama}
                                </span>
                                <span className="text-xs font-semibold text-gray-700 shrink-0">
                                    {formatCompact(item.variance)}
                                </span>
                            </div>
                            <div className="sm:hidden relative h-5">
                                <div
                                    className="absolute left-0 top-0 h-full rounded-r-md transition-all duration-500"
                                    style={{
                                        width: `${widthPercent}%`,
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>

                            {/* Desktop: inline label + bar + value */}
                            <div className="hidden sm:flex items-center gap-3">
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
                        </div>
                    );
                })}
            </div>
            {/* Info box */}
            <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4 flex gap-3">
                <div className="shrink-0 mt-0.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <Info className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Angka variance menunjukkan selisih antara target tahunan dengan
                    realisasi berjalan. Perlu diperhatikan percepatan penagihan pada
                    sektor Pajak Daerah.
                </p>
            </div>
        </div>
    );
}
