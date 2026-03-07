import { cn } from "@/lib/utils";

import building from "@/public/building.svg"
import Image from "next/image";

interface HeroBannerProps {
    breadcrumb: string;
    title: string;
    subtitle: string;
}

export function HeroBanner({ breadcrumb, title, subtitle }: HeroBannerProps) {
    return (
        <div
            className={cn(
                "relative rounded-2xl p-8 overflow-hidden",
                "bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a]"
            )}
        >
            {/* Decorative icon */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-100">
                <div className="w-40 h-40 rounded-2xl flex items-center justify-center">
                    <Image src={building} alt="Building" />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-blue-200/80 text-sm mb-2">{breadcrumb}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {title}
                </h1>
                <p className="text-blue-200/70 text-sm max-w-lg">{subtitle}</p>
                <div className="mt-5 inline-flex items-center gap-2 bg-brand-gold text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-amber-500/25">
                    <span>📅</span>
                    Tahun Anggaran 2024
                </div>
            </div>
        </div>
    );
}
