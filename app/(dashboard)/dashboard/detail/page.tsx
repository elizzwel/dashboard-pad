"use client";

import { useState, Suspense, Fragment } from "react";
import { HeroBanner } from "@/components/shared/hero-banner";
import { KPICard } from "@/components/shared/kpi-card";
import { DetailRealisasiTable } from "@/components/tables/detail-realisasi-table";
import { SektorCard } from "@/components/cards/sektor-card";
import { padSummary } from "@/lib/data";
import { formatCompact } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Clock, ChevronDown } from "lucide-react";

export default function DashboardDetailPage() {
    const [viewMode, setViewMode] = useState<"card" | "table">("table");
    const [cardPage, setCardPage] = useState<Record<string, number>>({});

    const getCardPage = (id: string) => cardPage[id] || 1;
    const setCardPageFor = (id: string, page: number) =>
        setCardPage((prev) => ({ ...prev, [id]: page }));

    const CARDS_PER_PAGE = 6;

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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KPICard
                    label="Total Target"
                    value={formatCompact(padSummary.totalTarget)}
                    subtitle="↓ 5,2% vs 2024"
                    subtitleColor="text-red-500"
                />
                <KPICard
                    label="Realisasi S/D Kemarin"
                    value={formatCompact(padSummary.realisasiKemarin)}
                    subtitle={`⏱ ${padSummary.lastUpdate} Progres`}
                    subtitleColor="text-amber-500"
                />
                <KPICard
                    label="Realisasi Hari Ini"
                    value={formatCompact(padSummary.realisasiHariIni)}
                    highlight
                    subtitle={`⏱ Terakhir update: ${padSummary.lastUpdate}`}
                    subtitleColor="text-gray-400"
                />
                <KPICard
                    label="Realisasi S/D Hari Ini"
                    value={formatCompact(padSummary.realisasiSdHariIni)}
                />
                <KPICard
                    label="Sisa Target"
                    value={formatCompact(padSummary.sisaTarget)}
                    subtitle={`⏱ ${((padSummary.sisaTarget / padSummary.totalTarget) * 100).toFixed(1)}% Lagi`}
                    subtitleColor="text-red-500"
                />
            </div>

            {/* Content */}
            <Suspense
                fallback={
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-40 rounded-xl" />
                        ))}
                    </div>
                }
            >
                {viewMode === "table" ? (
                    <DetailRealisasiTable />
                ) : (
                    /* Card View - Grid by Kategori PAD */
                    <div className="space-y-8">
                        {padSummary.kelompok.map((kelompok) => {
                            const currentPage = getCardPage(kelompok.id);
                            const totalPages = Math.ceil(
                                kelompok.children.length / CARDS_PER_PAGE
                            );
                            const shownCards = kelompok.children.slice(
                                (currentPage - 1) * CARDS_PER_PAGE,
                                currentPage * CARDS_PER_PAGE
                            );

                            return (
                                <div key={kelompok.id}>
                                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                        <span className="text-brand-blue">📊</span>
                                        Breakdown per Kategori {kelompok.nama}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {shownCards.map((item) => (
                                            <SektorCard key={item.id} item={item} />
                                        ))}
                                    </div>

                                    {/* Card Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-xs text-gray-400">
                                                Menampilkan {Math.min(CARDS_PER_PAGE, shownCards.length)} dari{" "}
                                                {kelompok.children.length} Sektor
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() =>
                                                        setCardPageFor(
                                                            kelompok.id,
                                                            Math.max(1, currentPage - 1)
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className="px-2.5 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-40"
                                                >
                                                    ‹
                                                </button>
                                                {Array.from(
                                                    { length: totalPages },
                                                    (_, i) => i + 1
                                                ).map((p) => (
                                                    <button
                                                        key={p}
                                                        onClick={() =>
                                                            setCardPageFor(kelompok.id, p)
                                                        }
                                                        className={`px-2.5 py-1.5 text-xs rounded-md ${currentPage === p
                                                                ? "bg-brand-blue text-white"
                                                                : "text-gray-500 hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() =>
                                                        setCardPageFor(
                                                            kelompok.id,
                                                            Math.min(totalPages, currentPage + 1)
                                                        )
                                                    }
                                                    disabled={currentPage === totalPages}
                                                    className="px-2.5 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-100 disabled:opacity-40"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Suspense>
        </div>
    );
}
