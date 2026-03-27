"use client";

import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { DonutChart } from "@/components/charts/donut-chart";
import { GroupedBarChart } from "@/components/charts/grouped-bar-chart";
import { MultiYearBarChart } from "@/components/charts/multi-year-bar-chart";
import { TopContributors } from "@/components/charts/top-contributors";
import { RincianRealisasiTable } from "@/components/tables/rincian-realisasi-table";
import { formatCompact } from "@/lib/format";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useDashboardSummary,
    usePieRealisasi,
    useRealisasi5Tahun,
    useTopKontributorNominal,
    useTopKontributorPersen,
    useRincianRealisasi,
} from "@/lib/hooks/use-pad";

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
    const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
    const { data: pieData, isLoading: pieLoading } = usePieRealisasi();
    const { data: multiYearData, isLoading: multiYearLoading } = useRealisasi5Tahun();
    const { data: topNominal, isLoading: topNominalLoading } = useTopKontributorNominal();
    const { data: topPersen, isLoading: topPersenLoading } = useTopKontributorPersen();
    const { data: rincianData, isLoading: rincianLoading } = useRincianRealisasi();

    const totalTarget = Number(summary?.total_target ?? 0);
    const totalRealisasi = Number(summary?.total_realisasi ?? 0);
    const capaian = Number(summary?.persentase_capaian ?? 0).toFixed(1);
    const growthTarget = summary?.growth_target_persen;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <HeroBanner
                breadcrumb="Dashboard › Grafik"
                title="Dashboard PAD Kabupaten Klaten"
                subtitle="Pantau realisasi Pendapatan Asli Daerah (PAD) secara real-time untuk mendukung pembangunan Klaten yang lebih mandiri."
            />

            {/* KPI Row */}
            {summaryLoading ? (
                <KPISkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <KPICard
                        label="Total Target"
                        value={formatCompact(totalTarget)}
                        icon="/target.svg"
                        subtitle={growthTarget != null ? `↑ ${growthTarget}% vs Tahun Lalu` : "—"}
                        subtitleColor="text-green-500"
                        href="/dashboard/detail"
                        className="border-l-4 border-brand-blue"
                    />
                    <KPICard
                        label="Total Realisasi"
                        value={formatCompact(totalRealisasi)}
                        icon="/realisasi.svg"
                        subtitle={`Data Per: ${summary?.data_per_tanggal ? new Date(summary.data_per_tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "—"}`}
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
            )}

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                <div className="h-full">
                    <DonutChart data={pieData} isLoading={pieLoading} />
                </div>
                <div className="lg:col-span-2 h-full">
                    <GroupedBarChart />
                </div>
            </div>

            {/* Charts Row 2 */}
            <MultiYearBarChart data={multiYearData} isLoading={multiYearLoading} />

            {/* Top Contributors */}
            <TopContributors
                nominalData={topNominal}
                persenData={topPersen}
                isLoading={topNominalLoading || topPersenLoading}
            />

            {/* Rincian Realisasi Table */}
            <RincianRealisasiTable data={rincianData} isLoading={rincianLoading} />
        </div>
    );
}
