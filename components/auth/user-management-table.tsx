"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Pencil, Trash2, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { ROLE_LABELS, type Role } from "@/lib/auth/roles";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  nama: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

async function fetchUsers(): Promise<User[]> {
  const res = await fetch("/api/auth/users", { credentials: "include" });
  if (!res.ok) throw new Error("Gagal memuat pengguna");
  const { users } = await res.json();
  return users;
}

const userFormSchema = z.object({
  username: z.string().min(3).max(50),
  nama: z.string().min(1).max(100),
  role: z.enum(["super_admin", "admin", "operator", "viewer"]),
  password: z.string().min(8).optional().or(z.literal("")),
});
type UserFormData = z.infer<typeof userFormSchema>;

const roleColors: Record<Role, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  operator: "bg-amber-100 text-amber-700",
  viewer: "bg-gray-100 text-gray-600",
};

const columnHelper = createColumnHelper<User>();

export function UserManagementTable() {
  const queryClient = useQueryClient();
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<UserFormData>({
      resolver: zodResolver(userFormSchema),
    });

  const createMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(typeof error === "string" ? error : "Gagal membuat pengguna");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil ditambahkan");
      setDialogMode(null);
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const body: Partial<UserFormData> = { nama: data.nama, role: data.role };
      if (data.password) body.password = data.password;
      const res = await fetch(`/api/auth/users/${selectedUser!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(typeof error === "string" ? error : "Gagal memperbarui pengguna");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil diperbarui");
      setDialogMode(null);
      reset();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(typeof error === "string" ? error : "Gagal menghapus pengguna");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Pengguna berhasil dinonaktifkan");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSubmit = (data: UserFormData) => {
    if (dialogMode === "create") createMutation.mutate(data);
    else updateMutation.mutate(data);
  };

  const openCreate = () => {
    reset({ username: "", nama: "", role: "viewer", password: "" });
    setSelectedUser(null);
    setDialogMode("create");
  };

  const openEdit = (user: User) => {
    reset({ username: user.username, nama: user.nama, role: user.role, password: "" });
    setSelectedUser(user);
    setDialogMode("edit");
  };

  const columns = [
    columnHelper.accessor("nama", { header: "Nama", cell: (i) => i.getValue() }),
    columnHelper.accessor("username", { header: "Username", cell: (i) => (
      <span className="font-mono text-sm text-gray-600">@{i.getValue()}</span>
    )}),
    columnHelper.accessor("role", { header: "Role", cell: (i) => (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", roleColors[i.getValue()])}>
        {ROLE_LABELS[i.getValue()]}
      </span>
    )}),
    columnHelper.accessor("is_active", { header: "Status", cell: (i) => (
      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium",
        i.getValue() ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
        {i.getValue() ? "Aktif" : "Nonaktif"}
      </span>
    )}),
    columnHelper.display({
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => openEdit(row.original)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Edit pengguna"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm(`Nonaktifkan pengguna "${row.original.nama}"?`)) {
                deleteMutation.mutate(row.original.id);
              }
            }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Nonaktifkan pengguna"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({ data: users, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ShieldCheck className="w-4 h-4" />
          <span>{users.length} pengguna terdaftar</span>
        </div>
        <button
          id="btn-tambah-pengguna"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#0f2d5e] text-white text-sm font-medium rounded-xl hover:bg-[#0a1f42] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-4 py-3 text-left font-medium text-gray-600">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={(o) => !o && setDialogMode(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            {dialogMode === "create" && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input
                  {...register("username")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/30"
                  placeholder="min. 3 karakter"
                />
                {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                {...register("nama")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/30"
                placeholder="Nama lengkap pengguna"
              />
              {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/30"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password {dialogMode === "edit" && <span className="text-gray-400">(kosongkan jika tidak diubah)</span>}
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2d5e]/30"
                placeholder={dialogMode === "create" ? "min. 8 karakter" : "••••••••"}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <DialogFooter className="gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDialogMode(null)}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {(isSubmitting || createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Simpan
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
