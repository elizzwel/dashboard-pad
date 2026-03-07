import { cn } from "@/lib/utils";

interface AchievementBadgeProps {
    value: number;
    className?: string;
}

export function AchievementBadge({ value, className }: AchievementBadgeProps) {
    const colorClass =
        value >= 80
            ? "bg-green-100 text-green-700"
            : value >= 50
                ? "bg-blue-100 text-blue-700"
                : value >= 1
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-600";

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold min-w-[48px]",
                colorClass,
                className
            )}
        >
            {value.toFixed(1)}%
        </span>
    );
}
