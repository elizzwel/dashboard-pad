"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { usePADStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { sidebarCollapsed } = usePADStore();
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Show nothing while verifying auth (middleware already handles most cases)
    if (isLoading || !isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div
                className={cn(
                    "transition-all duration-300 ease-in-out",
                    "ml-0",
                    sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
                )}
            >
                <TopBar />
                <main className="p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
