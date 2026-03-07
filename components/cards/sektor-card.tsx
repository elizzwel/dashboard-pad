"use client";

import { formatCurrency, formatCompact, calcAchievement, getStatus } from "@/lib/format";
import { StatusBadge } from "@/components/shared/status-badge";
import { Progress } from "@/components/ui/progress";
import type { MataAnggaran } from "@/lib/types";

interface SektorCardProps {
    item: MataAnggaran;
}

export function SektorCard({ item }: SektorCardProps) {
    const achievement = calcAchievement(item.realisasi, item.target);
    const status = getStatus(achievement);

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                    {item.nama}
                </h4>
                <StatusBadge status={status} />
            </div>

            <div className="space-y-3">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        Total Target
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                        {formatCompact(item.target)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">
                            Realisasi s/d Kemarin
                        </p>
                        <p className="text-xs font-semibold text-gray-700">
                            {formatCompact(item.realisasiKemarin)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 mb-0.5">
                            Realisasi Hari Ini
                        </p>
                        <p className="text-xs font-semibold text-brand-blue">
                            {formatCompact(item.realisasiHariIni)}
                        </p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400">Sisa Target</span>
                        <span className="text-[10px] font-medium text-gray-500">
                            {achievement.toFixed(1)}% Capaian
                        </span>
                    </div>
                    <Progress value={Math.min(100, achievement)} className="h-1.5 bg-gray-100" />
                </div>
            </div>
        </div>
    );
}
