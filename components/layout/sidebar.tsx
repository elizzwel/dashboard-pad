"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings/target", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white text-[#475569] flex flex-col border-r border-[#475569]/10">
            {/* Logo */}
            <div className="flex items-center gap-4 px-3 py-4">
                <Image
                    src="/pict.png"
                    alt="Logo Kabupaten Klaten"
                    width={60}
                    height={60}
                    className="rounded-full"
                />
                <div>
                    <h1 className="font-bold text-base leading-tight">PAD Klaten</h1>
                    <p className="text-xs text-[#475569]">Kabupaten Klaten</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-brand-blue text-white shadow-lg shadow-blue-500/25"
                                    : "text-[#475569] hover:bg-[#475569]/5 hover:text-[#475569]"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/10">
                <p className="text-xs text-blue-200/40">© 2024 PAD Klaten</p>
            </div>
        </aside>
    );
}
