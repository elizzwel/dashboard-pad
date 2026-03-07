import { cn } from "@/lib/utils";
import type { StatusType } from "@/lib/format";
import { getStatusLabel } from "@/lib/format";

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
}

const statusStyles: Record<StatusType, string> = {
    "on-track": "bg-green-100 text-green-700",
    approaching: "bg-amber-100 text-amber-700",
    "below-target": "bg-red-100 text-red-600",
    critical: "bg-red-600 text-white font-bold animate-pulse-red",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold",
                statusStyles[status],
                className
            )}
        >
            {getStatusLabel(status)}
        </span>
    );
}
