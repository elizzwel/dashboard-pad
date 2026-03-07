"use client";

import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TopBar() {
    return (
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8">
            <h2 className="text-base font-semibold text-gray-800">
                Pendapatan Asli Daerah (PAD)
            </h2>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search data..."
                        className="pl-9 w-56 h-9 text-sm bg-gray-50 border-gray-200 rounded-lg focus:ring-brand-blue"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Avatar */}
                <button className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                    <User className="w-4 h-4 text-white" />
                </button>
            </div>
        </header>
    );
}
