"use client";

import { cn } from "@/lib/utils";
import building from "@/public/building.svg";
import Image from "next/image";
import { usePADStore } from "@/lib/store";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

interface HeroBannerProps {
    breadcrumb: string;
    title: string;
    subtitle: string;
}

// Generate last 5 years up to current year
const CURRENT_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

interface DropdownPortalProps {
    anchor: DOMRect;
    tahun: number;
    options: number[];
    onSelect: (year: number) => void;
    onClose: () => void;
}

function DropdownPortal({ anchor, tahun, options, onSelect, onClose }: DropdownPortalProps) {
    const top = anchor.bottom + window.scrollY + 8;
    const left = anchor.left + window.scrollX;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            onClose();
        }
        // Delay so the toggle click doesn't immediately close it
        const timer = setTimeout(() => {
            document.addEventListener("mousedown", handleClickOutside);
        }, 50);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return createPortal(
        <div
            className="fixed z-9999 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[180px] animate-in fade-in slide-in-from-top-2 duration-150"
            style={{ top, left }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                    Pilih Tahun Anggaran
                </p>
            </div>
            {options.map((year) => (
                <button
                    key={year}
                    onClick={() => {
                        onSelect(year);
                        onClose();
                    }}
                    className={cn(
                        "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors",
                        "flex items-center justify-between gap-3",
                        year === tahun
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                    )}
                >
                    <span>{year}</span>
                    {year === tahun && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                </button>
            ))}
        </div>,
        document.body
    );
}

export function HeroBanner({ breadcrumb, title, subtitle }: HeroBannerProps) {
    const { tahun, setTahun } = usePADStore();
    const [open, setOpen] = useState(false);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleToggle = useCallback(() => {
        if (!open && buttonRef.current) {
            setAnchorRect(buttonRef.current.getBoundingClientRect());
        }
        setOpen((v) => !v);
    }, [open]);

    return (
        <div
            className={cn(
                "relative rounded-xl sm:rounded-2xl p-5 sm:p-8 overflow-hidden",
                "bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a]"
            )}
        >
            {/* Decorative icon */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-100 hidden md:block">
                <div className="w-40 h-40 rounded-2xl flex items-center justify-center">
                    <Image src={building} alt="Building" />
                </div>
            </div>

            <div className="relative z-10">
                <p className="text-blue-200/80 text-xs sm:text-sm mb-2">{breadcrumb}</p>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                    {title}
                </h1>
                <p className="text-blue-200/70 text-xs sm:text-sm max-w-lg">{subtitle}</p>

                {/* Year Filter Button */}
                <div className="mt-4 sm:mt-5 inline-block">
                    <button
                        ref={buttonRef}
                        onClick={handleToggle}
                        className={cn(
                            "inline-flex items-center gap-2 bg-brand-gold text-white text-xs sm:text-sm font-semibold",
                            "px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-amber-500/25",
                            "hover:bg-amber-500 active:scale-95 transition-all duration-150"
                        )}
                        aria-haspopup="listbox"
                        aria-expanded={open}
                    >
                        <span>📅</span>
                        Tahun Anggaran {tahun}
                        <ChevronDown
                            className={cn(
                                "w-3.5 h-3.5 transition-transform duration-200",
                                open && "rotate-180"
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Dropdown rendered via portal to escape overflow-hidden */}
            {open && anchorRect && (
                <DropdownPortal
                    anchor={anchorRect}
                    tahun={tahun}
                    options={TAHUN_OPTIONS}
                    onSelect={setTahun}
                    onClose={() => setOpen(false)}
                />
            )}
        </div>
    );
}
