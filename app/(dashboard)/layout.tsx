"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { usePADStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sidebarCollapsed } = usePADStore();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    // Mobile: no margin (sidebar is overlay)
                    "ml-0",
                    // Desktop: margin matches sidebar width
                    sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
                )}
            >
                <TopBar />
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
