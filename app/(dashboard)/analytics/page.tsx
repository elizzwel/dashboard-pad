"use client";

import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { TrendAreaChart } from "@/components/charts/trend-area-chart";
import { VarianceBarChart } from "@/components/charts/variance-bar-chart";
import { PerformersChart } from "@/components/charts/performers-chart";
import { DetailRealisasiTable } from "@/components/tables/detail-realisasi-table";
import { formatCompact, formatPercent } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import {
    useAnalyticsSummary,
    useTrenAkumulasi,
    useVarianceKelompok,
    useTopPerformers,
    useBottomPerformers,
    useDetailMataAnggaran,
} from "@/lib/hooks/use-pad";

function KPISkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
        </div>
    );
}

function mapStatusToVariant(label: string): "on-track" | "approaching" | "below-target" | "critical" {
    switch (label) {
        case "AMAN":
            return "on-track";
        case "WASPADA":
            return "approaching";
        case "KRITIS":
            return "critical";
        default:
            return "below-target";
    }
}

export default function AnalyticsPage() {
    const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
    const { data: trenData, isLoading: trenLoading } = useTrenAkumulasi();
    const { data: varianceData, isLoading: varianceLoading } = useVarianceKelompok();
    const { data: topData, isLoading: topLoading } = useTopPerformers();
    const { data: bottomData, isLoading: bottomLoading } = useBottomPerformers();
    const { data: detailData, isLoading: detailLoading } = useDetailMataAnggaran();

    const target = Number(summary?.total_target ?? 0);
    const realisasi = Number(summary?.total_realisasi ?? 0);
    const achievement = Number(summary?.achievement_percent ?? 0);
    const variance = Number(summary?.variance_nominal ?? 0);
    const proyeksi = Number(summary?.proyeksi ?? 0);
    const statusLabel = summary?.status_label ?? "—";
    const statusNote = summary?.status_note ?? "";
    const growthTarget = summary?.growth_target;
    const growthRealisasi = summary?.growth_realisasi;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <HeroBanner
                breadcrumb="Dashboard › Analisa Data"
                title="Dashboard PAD Kabupaten Klaten"
                subtitle="Pantau realisasi Pendapatan Asli Daerah (PAD) secara real-time untuk mendukung pembangunan Klaten yang lebih mandiri."
            />

            {/* KPI Row - 6 cards */}
            {summaryLoading ? (
                <KPISkeleton />
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <KPICard
                        label="Target"
                        value={formatCompact(target)}
                        subtitle={growthTarget != null ? `↑ ${growthTarget}%` : "—"}
                        subtitleColor="text-green-500"
                    />
                    <KPICard
                        label="Realisasi"
                        value={formatCompact(realisasi)}
                        subtitle={growthRealisasi != null ? `↑ ${growthRealisasi}%` : "—"}
                        subtitleColor="text-green-500"
                    />
                    <KPICard
                        label="Achievement"
                        value={formatPercent(achievement)}
                    />
                    <KPICard
                        label="Variance"
                        value={formatCompact(variance)}
                        subtitle={summary?.variance_percent != null ? `${Number(summary.variance_percent) >= 0 ? "↑" : "↓"} ${Math.abs(Number(summary.variance_percent))}%` : "—"}
                        subtitleColor={variance < 0 ? "text-red-500" : "text-green-500"}
                    />
                    <KPICard
                        label="Proyeksi"
                        value={proyeksi !== 0 ? formatCompact(proyeksi) : "0"}
                        subtitle="Belum ada estimasi"
                        subtitleColor="text-gray-400"
                    />
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Status
                        </p>
                        <div className="mt-2">
                            <StatusBadge status={mapStatusToVariant(statusLabel)} />
                        </div>
                        <p className="text-xs text-red-500 mt-2 font-medium">
                            {statusNote}
                        </p>
                    </div>
                </div>
            )}

            {/* Trend + Variance row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <TrendAreaChart data={trenData} isLoading={trenLoading} />
                </div>
                <VarianceBarChart data={varianceData} isLoading={varianceLoading} />
            </div>

            {/* Top/Bottom performers */}
            <PerformersChart
                topData={topData}
                bottomData={bottomData}
                isLoading={topLoading || bottomLoading}
            />

            {/* Detail Table */}
            <DetailRealisasiTable data={detailData} isLoading={detailLoading} />
        </div>
    );
}
