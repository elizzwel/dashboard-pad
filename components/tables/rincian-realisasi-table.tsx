"use client";

import { formatCurrency } from "@/lib/format";
import { rincianRealisasi } from "@/lib/data";
import { StatusBadge } from "@/components/shared/status-badge";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function RincianRealisasiTable() {
    const [page, setPage] = useState(1);
    const perPage = 5;
    const totalPages = Math.ceil(rincianRealisasi.length / perPage);
    const shown = rincianRealisasi.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-base font-semibold text-gray-800">
                    Rincian Realisasi Pendapatan
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <Filter className="w-3.5 h-3.5" />
                        Filter
                    </Button>
                    <Button size="sm" className="text-xs gap-1.5 bg-brand-blue hover:bg-blue-600">
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50/80">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                                Nama Sektor
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                                Target (Rp)
                            </th>
                            <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                                Realisasi (Rp)
                            </th>
                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                                Persentase
                            </th>
                            <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((item, i) => (
                            <tr
                                key={i}
                                className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    {item.nama}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 text-right font-mono">
                                    {formatCurrency(item.target)}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 text-right font-mono">
                                    {formatCurrency(item.realisasi)}
                                </td>
                                <td className="px-6 py-4 text-sm text-center">
                                    <span className="text-brand-blue font-semibold">
                                        {item.persentase.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={item.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    Menampilkan {shown.length} dari {rincianRealisasi.length} Sektor
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
