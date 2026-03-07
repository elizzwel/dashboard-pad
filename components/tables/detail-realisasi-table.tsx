"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { padSummary } from "@/lib/data";
import { formatCurrency, calcAchievement, calcVariance, formatCompact } from "@/lib/format";
import { AchievementBadge } from "@/components/shared/achievement-badge";
import { cn } from "@/lib/utils";

export function DetailRealisasiTable() {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
        const allIds = new Set(padSummary.kelompok.map((k) => k.id));
        setExpandedRows(allIds);
    };

    const collapseAll = () => {
        setExpandedRows(new Set());
    };

    const totalRealisasi = padSummary.kelompok.reduce(
        (sum, k) => sum + k.children.reduce((s, c) => s + c.realisasi, 0),
        0
    );

    const [page, setPage] = useState(1);
    const perPage = 5;
    const totalPages = Math.ceil(padSummary.kelompok.length / perPage);
    const shownKelompok = padSummary.kelompok.slice(
        (page - 1) * perPage,
        page * perPage
    );

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
                            const isExpanded = expandedRows.has(kelompok.id);
                            const achievement = calcAchievement(
                                kelompok.children.reduce((s, c) => s + c.realisasi, 0),
                                kelompok.target
                            );
                            const variance = calcVariance(
                                kelompok.children.reduce((s, c) => s + c.realisasi, 0),
                                kelompok.target
                            );
                            const kontribusi = totalRealisasi > 0
                                ? ((kelompok.children.reduce((s, c) => s + c.realisasi, 0) / totalRealisasi) * 100)
                                : 0;

                            return (
                                <Fragment key={kelompok.id}>
                                    {/* Parent row */}
                                    <tr
                                        className="border-t border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors"
                                        onClick={() => toggleRow(kelompok.id)}
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
                                                        {kelompok.nama}
                                                    </span>
                                                    <span className="text-xs text-gray-400 ml-2">
                                                        ({kelompok.jumlahMataAnggaran} mata anggaran)
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                                            {formatCurrency(kelompok.target)}
                                        </td>
                                        <td className="px-4 py-4 text-right text-sm text-gray-600 font-mono">
                                            {formatCurrency(kelompok.children.reduce((s, c) => s + c.realisasi, 0))}
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
                                            {kontribusi.toFixed(2)}%
                                        </td>
                                    </tr>

                                    {/* Child rows */}
                                    {isExpanded &&
                                        kelompok.children.map((child) => {
                                            const childAchievement = calcAchievement(child.realisasi, child.target);
                                            const childVariance = calcVariance(child.realisasi, child.target);
                                            const childKontribusi = totalRealisasi > 0
                                                ? ((child.realisasi / totalRealisasi) * 100)
                                                : 0;

                                            return (
                                                <tr
                                                    key={child.id}
                                                    className="border-t border-gray-50 bg-gray-50/30 hover:bg-blue-50/20 transition-colors"
                                                >
                                                    <td className="pl-14 pr-6 py-3 border-l-2 border-brand-blue">
                                                        <span className="text-sm text-gray-600">
                                                            {child.nama}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500 font-mono">
                                                        {formatCurrency(child.target)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500 font-mono">
                                                        {formatCurrency(child.realisasi)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <AchievementBadge value={childAchievement} />
                                                    </td>
                                                    <td className={cn(
                                                        "px-4 py-3 text-right text-sm font-mono",
                                                        childVariance < 0 ? "text-red-500" : "text-green-600"
                                                    )}>
                                                        {childVariance >= 0 ? "+" : ""}{formatCompact(childVariance)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                                                        {childKontribusi.toFixed(2)}%
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
                    Menampilkan {shownKelompok.length} dari {padSummary.kelompok.length} Sektor
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

// Need to add Fragment import
import { Fragment } from "react";
