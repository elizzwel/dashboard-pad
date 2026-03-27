"use client";

import { formatCurrency, formatCompact } from "@/lib/format";
import { Progress } from "@/components/ui/progress";
import type { TopKontributor } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

const ICONS = ["🏢", "🏠", "📋", "💰", "🎯"];

interface TopContributorsProps {
    nominalData?: TopKontributor[];
    persenData?: TopKontributor[];
    isLoading?: boolean;
}

export function TopContributors({ nominalData, persenData, isLoading }: TopContributorsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-[320px] rounded-xl" />
                <Skeleton className="h-[320px] rounded-xl" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Nominal */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-800">
                        Top 3 Kontributor Berdasarkan Nominal
                    </h3>
                </div>
                <div className="space-y-5">
                    {(nominalData ?? []).length === 0 ? (
                        <ChartEmptyState />
                    ) : (
                        (nominalData ?? []).map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                                {ICONS[i] ?? "💵"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-gray-800">
                                        {item.nama_pajak}
                                    </span>
                                    <span className="text-xs text-gray-400">•••</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                    <span>Realisasi: {formatCompact(Number(item.realisasi_rp))}</span>
                                    <span>Target: {formatCurrency(Number(item.target_rp))}</span>
                                </div>
                                <Progress
                                    value={Number(item.persentase_realisasi)}
                                    className="h-1.5 bg-yellow-500"
                                />
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Sisa Target: {Number(item.persentase_sisa_target).toFixed(1)}%
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        Persentase Realisasi: {Number(item.persentase_realisasi).toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            {/* By Percentage */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-800">
                        Top 3 Kontributor Berdasarkan Persentase
                    </h3>
                </div>
                <div className="space-y-5">
                    {(persenData ?? []).length === 0 ? (
                        <ChartEmptyState />
                    ) : (
                        (persenData ?? []).map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-lg">
                                    {ICONS[i] ?? "💵"}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {item.nama_pajak}
                                        </span>
                                        <span className="text-xs text-gray-400">•••</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>Target: {formatCurrency(Number(item.target_rp))}</span>
                                        <span>Realisasi: {formatCurrency(Number(item.realisasi_rp))}</span>
                                    </div>
                                    <Progress
                                        value={Number(item.persentase_realisasi)}
                                        className="h-1.5 bg-yellow-500"
                                    />
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-[10px] text-gray-400">
                                            Persentase Sisa Target: {Number(item.persentase_sisa_target).toFixed(1)}%
                                        </span>
                                        <span className="text-[10px] text-gray-400">
                                            Persentase Realisasi: {Number(item.persentase_realisasi).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
