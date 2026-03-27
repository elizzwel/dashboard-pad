"use client";

import { useState, Fragment } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { formatCurrency, formatCompact } from "@/lib/format";
import { AchievementBadge } from "@/components/shared/achievement-badge";
import { cn } from "@/lib/utils";
import type { HeadMataAnggaran, DetailMataAnggaran, DetailMataAnggaranResponse } from "@/lib/types/pad";
import { Skeleton } from "@/components/ui/skeleton";

interface DetailRealisasiTableProps {
    data?: DetailMataAnggaranResponse;
    isLoading?: boolean;
}

export function DetailRealisasiTable({ data, isLoading }: DetailRealisasiTableProps) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const perPage = 5;

    if (isLoading || !data) {
        return <Skeleton className="h-[400px] rounded-xl" />;
    }

    const { head, detail } = data;

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const expandAll = () => {
        const allIds = new Set(head.map((k) => k.kelompok_pad));
        setExpandedRows(allIds);
    };

    const collapseAll = () => {
        setExpandedRows(new Set());
    };

    const totalPages = Math.ceil(head.length / perPage);
    const shownKelompok = head.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Detail Realisasi per Mata Anggaran
                </h3>
                <div className="flex items-center gap-3 text-xs">
                    <button
                        onClick={expandAll}
                        className="text-brand-blue hover:underline font-medium"
                    >
                        Expand All
                    </button>
                    <button
                        onClick={collapseAll}
                        className="text-gray-500 hover:underline font-medium"
                    >
                        Collapse All
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 w-[35%]">
                                Kelompok PAD / Mata Anggaran
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Target
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Realisasi
                            </th>
                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Achievement
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Variance
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                                Kontribusi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shownKelompok.map((kelompok) => {
                            const isExpanded = expandedRows.has(kelompok.kelompok_pad);
                            const children = detail.filter(
                                (d) => d.kelompok_pad === kelompok.kelompok_pad
                            );
                            const achievement = Number(kelompok.achievement);
                            const variance = Number(kelompok.variance);

                            return (
                                <Fragment key={kelompok.kelompok_pad}>
                                    {/* Parent row */}
                                    <tr
                                        className="border-t border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                                        onClick={() => toggleRow(kelompok.kelompok_pad)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4 text-brand-blue" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                )}
                                                <div>
                                                    <span className="text-sm font-semibold text-brand-blue hover:underline">
                                                        {kelompok.kelompok_pad}
                                                    </span>
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        ({kelompok.jumlah_mata_anggaran} mata anggaran)
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                                            {formatCurrency(Number(kelompok.total_target))}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                                            {formatCurrency(Number(kelompok.total_realisasi))}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <AchievementBadge value={achievement} />
                                        </td>
                                        <td className={cn(
                                            "px-4 py-4 text-right text-sm font-mono font-semibold",
                                            variance < 0 ? "text-red-500" : "text-green-600"
                                        )}>
                                            {variance >= 0 ? "+" : ""}{formatCompact(variance)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600">
                                            {Number(kelompok.kontribusi).toFixed(2)}%
                                        </td>
                                    </tr>

                                    {/* Child rows */}
                                    {isExpanded &&
                                        children.map((child, idx) => {
                                            const childVariance = Number(child.variance);

                                            return (
                                                <tr
                                                    key={`${kelompok.kelompok_pad}-${idx}`}
                                                    className="border-t border-gray-50 bg-gray-50/30 hover:bg-blue-50/20 transition-colors"
                                                >
                                                    <td className="pl-14 pr-6 py-3 border-l-2 border-brand-blue">
                                                        <span className="text-sm text-gray-600">
                                                            {child.mata_anggaran}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500 font-mono">
                                                        {formatCurrency(Number(child.target))}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500 font-mono">
                                                        {formatCurrency(Number(child.realisasi))}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <AchievementBadge value={Number(child.achievement)} />
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-3 text-right text-sm font-mono",
                                                        childVariance < 0 ? "text-red-500" : "text-green-600"
                                                    )}>
                                                        {childVariance >= 0 ? "+" : ""}{formatCompact(childVariance)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                                                        {Number(child.kontribusi_per_kelompok).toFixed(2)}%
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Menampilkan {shownKelompok.length} dari {head.length} Kelompok
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-2.5 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-40"
                    >
                        ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-2.5 py-1.5 text-xs rounded-md ${page === p
                                    ? "bg-brand-blue text-white"
                                    : "text-gray-500 hover:bg-gray-50"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-2.5 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-40"
                    >
                        ›
                    </button>
                </div>
            </div>
        </div>
    );
}
