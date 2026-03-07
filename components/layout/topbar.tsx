"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePADStore } from "@/lib/store";

export function TopBar() {
    const { setSidebarMobileOpen } = usePADStore();

    return (
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={() => setSidebarMobileOpen(true)}
                    className="p-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>

                <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                    Pendapatan Asli Daerah (PAD)
                </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                {/* Search — hidden on small screens */}
                <div className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search data..."
                        className="pl-9 w-40 md:w-56 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg focus:ring-brand-blue"
                    />
                </div>

                {/* Mobile search icon */}
                <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors sm:hidden">
                    <Search className="w-5 h-5 text-gray-500" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Avatar */}
                <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                    <User className="w-4 h-4 text-white" />
                </button>
            </div>
        </header>
    );
}
