"use client";

import { useState, Suspense } from "react";
import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { DetailRealisasiTable } from "@/components/tables/detail-realisasi-table";
import { formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
    useDashboardSummary,
    useDetailMataAnggaran,
} from "@/lib/hooks/use-pad";

export default function DashboardDetailPage() {
    const [viewMode, setViewMode] = useState<"card" | "table">("table");
    const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
    const { data: detailData, isLoading: detailLoading } = useDetailMataAnggaran();

    const totalTarget = Number(summary?.total_target ?? 0);
    const totalRealisasi = Number(summary?.total_realisasi ?? 0);
    const capaian = Number(summary?.persentase_capaian ?? 0);
    const sisaTarget = totalTarget - totalRealisasi;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <HeroBanner
                breadcrumb="Dashboard › Detail"
                title="Dashboard PAD Kabupaten Klaten"
                subtitle="Pantau realisasi Pendapatan Asli Daerah (PAD) secara real-time untuk mendukung pembangunan Klaten yang lebih mandiri."
            />

            {/* View Toggle */}
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => setViewMode("card")}
                    className={cn(
                        "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        viewMode === "card"
                            ? "bg-white text-gray-800 shadow-md border border-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Card View
                </button>
                <button
                    onClick={() => setViewMode("table")}
                    className={cn(
                        "px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5",
                        viewMode === "table"
                            ? "bg-white text-gray-800 shadow-md border border-gray-200"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    Table View
                </button>
            </div>

            {/* KPI Row - 5 cards */}
            {summaryLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <KPICard
                        label="Total Target"
                        value={formatCompact(totalTarget)}
                        subtitle={summary?.growth_target_persen != null ? `↑ ${summary.growth_target_persen}% vs Tahun Lalu` : "—"}
                        subtitleColor="text-green-500"
                    />
                    <KPICard
                        label="Total Realisasi"
                        value={formatCompact(totalRealisasi)}
                        subtitle={`Data Per: ${summary?.data_per_tanggal ? new Date(summary.data_per_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}`}
                        subtitleColor="text-gray-400"
                    />
                    <KPICard
                        label="Capaian"
                        value={`${capaian.toFixed(1)}%`}
                        highlight
                    />
                    <KPICard
                        label="Sisa Target"
                        value={formatCompact(sisaTarget)}
                        subtitle={totalTarget > 0 ? `${((sisaTarget / totalTarget) * 100).toFixed(1)}% Lagi` : "—"}
                        subtitleColor="text-red-500"
                    />
                    <KPICard
                        label="Jumlah Kelompok"
                        value={String(detailData?.head?.length ?? 0)}
                        subtitle="Kelompok PAD"
                        subtitleColor="text-gray-400"
                    />
                </div>
            )}

            {/* Content */}
            {viewMode === "table" ? (
                <DetailRealisasiTable data={detailData} isLoading={detailLoading} />
            ) : (
                /* Card View - Simplified using head data */
                <div className="space-y-8">
                    {detailLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <Skeleton key={i} className="h-40 rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        detailData?.head?.map((kelompok) => {
                            const children = detailData.detail.filter(
                                (d) => d.kelompok_pad === kelompok.kelompok_pad
                            );

                            return (
                                <div key={kelompok.kelompok_pad}>
                                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-brand-blue">📊</span>
                                        {kelompok.kelompok_pad}
                                        <span className="text-xs text-gray-400 font-normal">
                                            ({kelompok.jumlah_mata_anggaran} mata anggaran)
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {children.map((item, idx) => {
                                            const achievement = Number(item.achievement);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">
                                                            {item.mata_anggaran}
                                                        </h4>
                                                        <span className={cn(
                                                            "text-xs font-medium px-2 py-0.5 rounded-full",
                                                            achievement >= 80 ? "bg-green-100 text-green-700" :
                                                            achievement >= 50 ? "bg-amber-100 text-amber-700" :
                                                            "bg-red-100 text-red-600"
                                                        )}>
                                                            {achievement.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target</p>
                                                            <p className="text-lg font-bold text-gray-900">{formatCompact(Number(item.target))}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Realisasi</p>
                                                            <p className="text-sm font-semibold text-gray-700">{formatCompact(Number(item.realisasi))}</p>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                            <div
                                                                className={cn(
                                                                    "h-1.5 rounded-full transition-all duration-500",
                                                                    achievement >= 80 ? "bg-green-500" :
                                                                    achievement >= 50 ? "bg-amber-500" :
                                                                    "bg-red-500"
                                                                )}
                                                                style={{ width: `${Math.min(100, achievement)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
