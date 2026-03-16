"use client";

import { Bell, Search, User, Menu, LogOut, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePADStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS } from "@/lib/auth/roles";

export function TopBar() {
    const { setSidebarMobileOpen } = usePADStore();
    const { user, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

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

                {/* Avatar Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 p-1 pl-2 pr-2 sm:pr-3 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/20">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#0f2d5e] to-[#1a4a8a] flex items-center justify-center shadow-md shadow-[#0f2d5e]/20">
                                {user?.nama ? (
                                    <span className="text-sm font-semibold text-white">
                                        {user.nama.charAt(0).toUpperCase()}
                                    </span>
                                ) : (
                                    <User className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className="hidden md:flex flex-col items-start pr-1">
                                <span className="text-sm font-semibold text-gray-800 leading-none">
                                    {user?.nama || "User"}
                                </span>
                                <span className="text-xs text-gray-500 mt-1 leading-none">
                                    {user ? ROLE_LABELS[user.role] : "Role"}
                                </span>
                            </div>
                            <ChevronDown className="hidden md:block w-4 h-4 text-gray-500" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl shadow-lg border-gray-100">
                        {user && (
                            <>
                                <DropdownMenuLabel className="font-normal py-3 px-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <p className="text-sm font-medium leading-none text-gray-900">{user.nama}</p>
                                        <p className="text-xs leading-none text-gray-500">
                                            @{user.username}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-gray-100" />
                            </>
                        )}
                        <DropdownMenuItem
                            className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer py-2.5 px-4 rounded-lg m-1"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span className="font-medium">Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
