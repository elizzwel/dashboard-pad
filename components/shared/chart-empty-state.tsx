import { BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartEmptyStateProps {
    message?: string;
    className?: string;
}

export function ChartEmptyState({
    message = "Tidak ada data untuk periode ini",
    className,
}: ChartEmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center gap-3 py-16 text-center",
                className
            )}
        >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-gray-300" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{message}</p>
                <p className="text-xs text-gray-300 mt-0.5">
                    Coba pilih tahun anggaran yang berbeda
                </p>
            </div>
        </div>
    );
}
