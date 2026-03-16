import { UserManagementTable } from "@/components/auth/user-management-table";
import { Shield } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a] rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-white/60 mb-1">Pengaturan</p>
          <h1 className="text-2xl font-bold mb-1">Manajemen Pengguna</h1>
          <p className="text-white/70 text-sm">
            Kelola akun pengguna dan hak akses sistem
          </p>
        </div>
        {/* Decorative icon */}
        <Shield
          className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 text-white/5"
          strokeWidth={1}
        />
      </div>

      {/* Table */}
      <UserManagementTable />
    </div>
  );
}
