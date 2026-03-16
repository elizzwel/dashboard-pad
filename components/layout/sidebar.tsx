"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    ChevronsLeft,
    ChevronsRight,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePADStore } from "@/lib/store";
import { useEffect } from "react";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/settings/target", label: "Settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const {
        sidebarCollapsed,
        toggleSidebar,
        sidebarMobileOpen,
        setSidebarMobileOpen,
    } = usePADStore();

    // Close mobile sidebar on route change
    useEffect(() => {
        setSidebarMobileOpen(false);
    }, [pathname, setSidebarMobileOpen]);

    // Close mobile sidebar on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarMobileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setSidebarMobileOpen]);

    const sidebarContent = (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-white text-[#475569] flex flex-col border-r border-[#475569]/10 transition-all duration-300 ease-in-out",
                // Desktop: collapsed or expanded
                "max-lg:hidden",
                sidebarCollapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo */}
            <div
                className={cn(
                    "flex items-center gap-3 py-4 transition-all duration-300",
                    sidebarCollapsed ? "px-3 justify-center" : "px-3"
                )}
            >
                <Image
                    src="/pict.png"
                    alt="Logo Kabupaten Klaten"
                    width={sidebarCollapsed ? 40 : 60}
                    height={sidebarCollapsed ? 40 : 60}
                    className="rounded-full shrink-0 transition-all duration-300"
                    unoptimized
                />
                {!sidebarCollapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-base leading-tight whitespace-nowrap">
                            PAD Klaten
                        </h1>
                        <p className="text-xs text-[#475569] whitespace-nowrap">
                            Kabupaten Klaten
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={cn("flex-1 py-6 space-y-1", sidebarCollapsed ? "px-2" : "px-4")}>
                {navItems.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={sidebarCollapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
                                sidebarCollapsed
                                    ? "px-0 py-3 justify-center"
                                    : "px-4 py-3",
                                isActive
                                    ? "bg-brand-blue text-white shadow-lg shadow-blue-500/25"
                                    : "text-[#475569] hover:bg-[#475569]/5 hover:text-[#475569]"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            {!sidebarCollapsed && (
                                <span className="whitespace-nowrap">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="px-2 py-2 border-t border-gray-100">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
                >
                    {sidebarCollapsed ? (
                        <ChevronsRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronsLeft className="w-4 h-4" />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Footer */}
            <div
                className={cn(
                    "py-4 border-t border-gray-100",
                    sidebarCollapsed ? "px-2 text-center" : "px-6"
                )}
            >
                {!sidebarCollapsed && (
                    <p className="text-xs text-gray-300">© 2024 PAD Klaten</p>
                )}
            </div>
        </aside>
    );

    // Mobile sidebar overlay
    const mobileSidebar = (
        <>
            {/* Backdrop */}
            {sidebarMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarMobileOpen(false)}
                />
            )}

            {/* Mobile sidebar panel */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-72 bg-white text-[#475569] flex flex-col border-r border-[#475569]/10 transition-transform duration-300 ease-in-out lg:hidden",
                    sidebarMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                )}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/pict.png"
                            alt="Logo Kabupaten Klaten"
                            width={44}
                            height={44}
                            className="rounded-full"
                            unoptimized
                        />
                        <div>
                            <h1 className="font-bold text-base leading-tight">
                                PAD Klaten
                            </h1>
                            <p className="text-xs text-[#475569]">
                                Kabupaten Klaten
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarMobileOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Mobile nav */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");
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

                <div className="px-6 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-300">© 2024 PAD Klaten</p>
                </div>
            </aside>
        </>
    );

    return (
        <>
            {sidebarContent}
            {mobileSidebar}
        </>
    );
}
