"use client";

import { useState, Fragment } from "react";
import { HeroBanner } from "@/components/shared/hero-banner";
import { usePADStore } from "@/lib/store";
import { formatCurrency } from "@/lib/format";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsTargetPage() {
    const { targets, addTarget, updateTarget, deleteTarget } = usePADStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTahun, setSelectedTahun] = useState("2024");
    const [page, setPage] = useState(1);
    const perPage = 4;

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        kode: "",
        nama: "",
        target: "",
        tahun: "2024",
    });

    const filtered = targets.filter(
        (t) =>
            t.tahun.toString() === selectedTahun &&
            (t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.kode.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const shown = filtered.slice((page - 1) * perPage, page * perPage);
    const totalAnggaran = filtered.reduce((sum, t) => sum + t.target, 0);

    const openAdd = () => {
        setEditingId(null);
        setFormData({ kode: "", nama: "", target: "", tahun: selectedTahun });
        setDialogOpen(true);
    };

    const openEdit = (id: string) => {
        const target = targets.find((t) => t.id === id);
        if (!target) return;
        setEditingId(id);
        setFormData({
            kode: target.kode,
            nama: target.nama,
            target: target.target.toString(),
            tahun: target.tahun.toString(),
        });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.kode || !formData.nama || !formData.target) {
            toast.error("Semua field harus diisi");
            return;
        }

        if (editingId) {
            updateTarget(editingId, {
                kode: formData.kode,
                nama: formData.nama,
                target: Number(formData.target),
                tahun: Number(formData.tahun),
            });
            toast.success("Target berhasil diperbarui");
        } else {
            addTarget({
                id: Date.now().toString(),
                kode: formData.kode,
                nama: formData.nama,
                target: Number(formData.target),
                tahun: Number(formData.tahun),
            });
            toast.success("Target berhasil ditambahkan");
        }
        setDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        deleteTarget(id);
        toast.success("Target berhasil dihapus");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <div
                className="relative rounded-2xl p-8 overflow-hidden bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a]"
            >
                <div className="relative z-10">
                    <p className="text-blue-200/80 text-sm mb-2">Setting › Tambah Target</p>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        Nilai Anggaran
                    </h1>
                    <p className="text-blue-200/70 text-sm max-w-lg">
                        Kelola nilai anggaran target per tahun secara efisien dan transparan
                        untuk Kabupaten Klaten.
                    </p>
                </div>
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Button
                        onClick={openAdd}
                        className="bg-brand-gold hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/25 gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Nilai Anggaran
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Filter Tahun Anggaran
                        </label>
                        <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[2022, 2023, 2024, 2025, 2026].map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        Tahun {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Cari Kode / Nama Anggaran
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Masukkan kode atau nama mata anggaran..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                                        ID / Kode
                                    </th>
                                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                                        Mata Anggaran
                                    </th>
                                    <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                                        Target (Rp)
                                    </th>
                                    <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {shown.map((target) => (
                                    <tr
                                        key={target.id}
                                        className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-semibold text-brand-blue">
                                                {target.kode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-700">
                                            {target.nama}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-right font-mono font-bold text-gray-900">
                                            {formatCurrency(target.target).replace("Rp", "").trim()}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(target.id)}
                                                    className="p-2 rounded-lg text-brand-blue hover:bg-blue-50 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(target.id)}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {shown.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-12 text-center text-sm text-gray-400"
                                        >
                                            Tidak ada data ditemukan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Menampilkan {shown.length} dari {filtered.length} entri
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-40 border border-gray-200"
                            >
                                Sebelumnya
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-2.5 py-1.5 text-xs rounded-md ${page === p
                                            ? "bg-brand-blue text-white"
                                            : "text-gray-500 hover:bg-gray-50 border border-gray-200"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 disabled:opacity-40 border border-gray-200"
                            >
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </Suspense>

            {/* Total Footer */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        📋
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            Total Anggaran Target PAD
                        </p>
                        <p className="text-xs text-gray-400">Tahun Anggaran {selectedTahun}</p>
                    </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-brand-blue">
                    {formatCurrency(totalAnggaran)}
                </p>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingId ? "Edit Target Anggaran" : "Tambah Nilai Anggaran"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Tahun Anggaran
                            </label>
                            <Select
                                value={formData.tahun}
                                onValueChange={(v) =>
                                    setFormData((prev) => ({ ...prev, tahun: v }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2022, 2023, 2024, 2025, 2026].map((y) => (
                                        <SelectItem key={y} value={y.toString()}>
                                            Tahun {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Kode Anggaran
                            </label>
                            <Input
                                value={formData.kode}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, kode: e.target.value }))
                                }
                                placeholder="Contoh: 4.1.05"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Nama Mata Anggaran
                            </label>
                            <Input
                                value={formData.nama}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, nama: e.target.value }))
                                }
                                placeholder="Contoh: Pajak Daerah"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                                Nilai Target (Rp)
                            </label>
                            <Input
                                type="number"
                                value={formData.target}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, target: e.target.value }))
                                }
                                placeholder="Contoh: 298331879386"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
