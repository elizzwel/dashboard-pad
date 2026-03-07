"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { ReactNode } from "react";

interface KPICardProps {
    label: string;
    value: string;
    icon?: string;
    iconReactNode?: ReactNode;
    subtitle?: string;
    subtitleColor?: string;
    highlight?: boolean;
    className?: string;
    href?: string;
}

export function KPICard({
    label,
    value,
    icon,
    iconReactNode,
    subtitle,
    subtitleColor,
    highlight = false,
    className,
    href,
}: KPICardProps) {
    const router = useRouter();

    return (
        <div
            onClick={href ? () => router.push(href) : undefined}
            role={href ? "link" : undefined}
            tabIndex={href ? 0 : undefined}
            onKeyDown={
                href
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") router.push(href);
                    }
                    : undefined
            }
            className={cn(
                "bg-white rounded-xl border border-gray-100 p-5 shadow-sm transition-all duration-300",
                href &&
                "cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]",
                !href && "hover:shadow-md",
                highlight && "ring-2 ring-brand-blue/20",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "text-xl md:text-2xl font-bold",
                            highlight ? "text-brand-blue" : "text-gray-900"
                        )}
                    >
                        {value}
                    </p>
                    {subtitle && (
                        <p
                            className={cn(
                                "text-xs mt-1",
                                subtitleColor || "text-gray-400"
                            )}
                        >
                            {subtitle}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="text-gray-300 mt-2">
                        <Image src={icon} alt="icon" width={48} height={48} />
                    </div>
                )}
                {iconReactNode && (
                    <div className="text-gray-300 mt-2">
                        {iconReactNode}
                    </div>
                )}
            </div>
        </div>
    );
}
