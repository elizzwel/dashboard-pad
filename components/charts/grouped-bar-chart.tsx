"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact } from "@/lib/format";
import { useState, useRef, useEffect, useCallback } from "react";
import type { RealisasiVsTargetBar } from "@/lib/types/pad";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartEmptyState } from "@/components/shared/chart-empty-state";

const CURRENT_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

interface YearDropdownProps {
    tahun: number;
    onChange: (year: number) => void;
}

function YearDropdown({ tahun, onChange }: YearDropdownProps) {
    const [open, setOpen] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        if (!open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
        setOpen((v) => !v);
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (btnRef.current && btnRef.current.contains(e.target as Node)) return;
            setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={handleToggle}
                className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                    "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
                )}
            >
                <span>📅</span>
                {tahun}
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-200", open && "rotate-180")} />
            </button>

            {open && rect && (
                <div
                    className="fixed z-9999 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[140px] animate-in fade-in slide-in-from-top-2 duration-150"
                    style={{ top: rect.bottom + 6, left: rect.left }}
                >
                    <div className="px-3 py-1.5 border-b border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Periode</p>
                    </div>
                    {TAHUN_OPTIONS.map((year) => (
                        <button
                            key={year}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => { onChange(year); setOpen(false); }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm font-medium transition-colors flex items-center justify-between gap-2",
                                year === tahun ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {year}
                            {year === tahun && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export function GroupedBarChart() {
    const [selectedTahun, setSelectedTahun] = useState(CURRENT_YEAR);
    const [chartData, setChartData] = useState<{ nama: string; target: number; realisasi: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch(`/api/pad/realisasi-target?tahun=${selectedTahun}`)
            .then((res) => res.json())
            .then((data: RealisasiVsTargetBar[]) => {
                setChartData(
                    data.map((d) => ({
                        nama: d.kelompok_pad,
                        target: Number(d.total_target),
                        realisasi: Number(d.total_realisasi),
                    }))
                );
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [selectedTahun]);

    if (isLoading) {
        return <Skeleton className="h-[380px] rounded-xl" />;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-800">
                    Realisasi vs Target per Kelompok PAD
                </h3>
                <YearDropdown tahun={selectedTahun} onChange={setSelectedTahun} />
            </div>

            {chartData.length === 0 ? (
                <ChartEmptyState />
            ) : (
            <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        barGap={4}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="nama"
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(v) => formatCompact(v)}
                        />
                        <Tooltip
                            formatter={(value) => [formatCompact(Number(value ?? 0)), ""]}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                fontSize: "12px",
                            }}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
                        />
                        <Bar
                            dataKey="target"
                            name="Target"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                        <Bar
                            dataKey="realisasi"
                            name="Realisasi"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            animationDuration={600}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            )}
        </div>
    );
}
