"use client";

import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { GroupedBarChart } from "@/components/charts/grouped-bar-chart";
import { MultiYearBarChart } from "@/components/charts/multi-year-bar-chart";
import { TopContributors } from "@/components/charts/top-contributors";
import { RincianRealisasiTable } from "@/components/tables/rincian-realisasi-table";
import { padSummary } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function KPISkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
        </div>
    );
}

function ChartSkeleton() {
    return <Skeleton className="h-80 rounded-xl" />;
}

export default function DashboardGrafikPage() {
    const capaian =
        ((padSummary.realisasiSdHariIni / padSummary.totalTarget) * 100).toFixed(1);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <HeroBanner
                breadcrumb="Dashboard › Grafik"
                title="Dashboard PAD Kabupaten Klaten"
                subtitle="Pantau realisasi Pendapatan Asli Daerah (PAD) secara real-time untuk mendukung pembangunan Klaten yang lebih mandiri."
            />

            {/* KPI Row */}
            <Suspense fallback={<KPISkeleton />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard
                        label="Total Target"
                        value={formatCompact(padSummary.totalTarget)}
                        icon="/target.svg"
                        subtitle="↑ 4,2% vs Tahun Lalu"
                        subtitleColor="text-green-500"
                        href="/dashboard/detail"
                        className="border-l-4 border-brand-blue"
                    />
                    <KPICard
                        label="Total Realisasi"
                        value={formatCompact(padSummary.realisasiSdHariIni)}
                        icon="/realisasi.svg"
                        subtitle={`Data Per: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`}
                        subtitleColor="text-gray-400"
                        href="/dashboard/detail"
                        className="border-l-4 border-green-500"
                    />
                    <KPICard
                        label="Capaian"
                        value={`${capaian}%`}
                        iconReactNode={
                            <div className="relative w-12 h-12">
                                <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.5"
                                        fill="none"
                                        stroke="#dfdede81"
                                        strokeWidth="3"
                                    />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.5"
                                        fill="none"
                                        stroke="#FBBF24"
                                        strokeWidth="3"
                                        strokeDasharray={`${parseFloat(capaian)} ${100 - parseFloat(capaian)}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#FBBF24]">
                                    {Math.round(parseFloat(capaian))}%
                                </span>
                            </div>
                        }
                        subtitle="On-Track Sasaran Tahunan"
                        subtitleColor="text-[#FBBF24]"
                        href="/dashboard/detail"
                        className="border-l-4 border-yellow-500"
                    />
                </div>
            </Suspense>

            {/* Charts Row 1 */}
            <Suspense fallback={<ChartSkeleton />}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                        <DonutChart />
                    </div>
                    <div className="lg:col-span-2">
                        <GroupedBarChart />
                    </div>
                </div>
            </Suspense>

            {/* Charts Row 2 */}
            <Suspense fallback={<ChartSkeleton />}>
                <MultiYearBarChart />
            </Suspense>

            {/* Top Contributors */}
            <Suspense fallback={<ChartSkeleton />}>
                <TopContributors />
            </Suspense>

            {/* Rincian Realisasi Table */}
            <Suspense fallback={<ChartSkeleton />}>
                <RincianRealisasiTable />
            </Suspense>
        </div>
    );
}
