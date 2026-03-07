"use client";

import { Suspense } from "react";
import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { TrendAreaChart } from "@/components/charts/trend-area-chart";
import { VarianceBarChart } from "@/components/charts/variance-bar-chart";
import { PerformersChart } from "@/components/charts/performers-chart";
import { DetailRealisasiTable } from "@/components/tables/detail-realisasi-table";
import { analyticsSummary } from "@/lib/data";
import { formatCompact, formatPercent, getStatusLabel } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/status-badge";

function KPISkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
        </div>
    );
}

function ChartSkeleton() {
    return <Skeleton className="h-80 rounded-xl" />;
}

export default function AnalyticsPage() {
    const { target, realisasi, achievement, variance, proyeksi, status } =
        analyticsSummary;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <HeroBanner
                breadcrumb="Dashboard › Analisa Data"
                title="Dashboard PAD Kabupaten Klaten"
                subtitle="Pantau realisasi Pendapatan Asli Daerah (PAD) secara real-time untuk mendukung pembangunan Klaten yang lebih mandiri."
            />

            {/* KPI Row - 6 cards */}
            <Suspense fallback={<KPISkeleton />}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <KPICard
                        label="Target"
                        value={formatCompact(target)}
                        subtitle="↑ 8%"
                        subtitleColor="text-green-500"
                    />
                    <KPICard
                        label="Realisasi"
                        value={formatCompact(realisasi)}
                        subtitle="↑ 5%"
                        subtitleColor="text-green-500"
                    />
                    <KPICard
                        label="Achievement"
                        value={formatPercent(achievement)}
                    />
                    <KPICard
                        label="Variance"
                        value={formatCompact(variance)}
                        subtitle="↓ 98.9%"
                        subtitleColor="text-red-500"
                    />
                    <KPICard
                        label="Proyeksi"
                        value={proyeksi !== null ? formatCompact(proyeksi) : "0"}
                        subtitle="Belum ada estimasi"
                        subtitleColor="text-gray-400"
                    />
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Status
                        </p>
                        <div className="mt-2">
                            <StatusBadge status={status} />
                        </div>
                        <p className="text-xs text-red-500 mt-2 font-medium">
                            Memerlukan aksi segera
                        </p>
                    </div>
                </div>
            </Suspense>

            {/* Trend + Variance row */}
            <Suspense fallback={<ChartSkeleton />}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <TrendAreaChart />
                    </div>
                    <VarianceBarChart />
                </div>
            </Suspense>

            {/* Top/Bottom performers */}
            <Suspense fallback={<ChartSkeleton />}>
                <PerformersChart />
            </Suspense>

            {/* Detail Table */}
            <Suspense fallback={<ChartSkeleton />}>
                <DetailRealisasiTable />
            </Suspense>
        </div>
    );
}
