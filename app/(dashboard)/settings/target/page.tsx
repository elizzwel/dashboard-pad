"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/format";
import { Pencil, Trash2, Plus, Search, Loader2, AlertTriangle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

const CURRENT_YEAR = new Date().getFullYear();
const TAHUN_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

// ── Types ──────────────────────────────────────────────────────────────────
type MasterPajakOption = { id: number; nama_pajak: string; kelompok: string };

type TargetRow = {
    id: number;
    id_pajak: number | null;
    tahun: number;
    target_rp: number;
    nama_pajak: string;
    kelompok: string;
};

type FormData = {
    id_pajak: string;
    target_rp: string;
    tahun: string;
};

const EMPTY_FORM: FormData = { id_pajak: "", target_rp: "", tahun: String(CURRENT_YEAR) };

const PER_PAGE = 10;

// ── Component ──────────────────────────────────────────────────────────────
export default function SettingsTargetPage() {
    const [selectedTahun, setSelectedTahun] = useState(String(CURRENT_YEAR));
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    // Data state
    const [rows, setRows] = useState<TargetRow[]>([]);
    const [masterPajak, setMasterPajak] = useState<MasterPajakOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

    // Delete confirm state
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // ── Fetch data ────────────────────────────────────────────────────────
    const fetchRows = useCallback(async (tahun: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/pad/target?tahun=${tahun}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setRows(data);
        } catch (err) {
            toast.error("Gagal memuat data target");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMasterPajak = useCallback(async () => {
        try {
            const res = await fetch("/api/pad/master-pajak");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMasterPajak(data);
        } catch {
            toast.error("Gagal memuat daftar mata anggaran");
        }
    }, []);

    useEffect(() => { fetchMasterPajak(); }, [fetchMasterPajak]);
    useEffect(() => { fetchRows(selectedTahun); setPage(1); }, [selectedTahun, fetchRows]);

    // ── Filtering ─────────────────────────────────────────────────────────
    const filtered = rows.filter((r) =>
        r.nama_pajak.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.kelompok.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const totalAnggaran = filtered.reduce((sum, r) => sum + r.target_rp, 0);

    // ── CRUD handlers ─────────────────────────────────────────────────────
    const openAdd = () => {
        setEditingId(null);
        setFormData({ ...EMPTY_FORM, tahun: selectedTahun });
        setDialogOpen(true);
    };

    const openEdit = (row: TargetRow) => {
        setEditingId(row.id);
        setFormData({
            id_pajak: String(row.id_pajak ?? ""),
            target_rp: String(row.target_rp),
            tahun: String(row.tahun),
        });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.id_pajak || !formData.target_rp || !formData.tahun) {
            toast.error("Semua field harus diisi");
            return;
        }
        setSaving(true);
        const body = {
            id_pajak: Number(formData.id_pajak),
            tahun: Number(formData.tahun),
            target_rp: Number(formData.target_rp),
        };

        try {
            const res = editingId
                ? await fetch(`/api/pad/target/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                : await fetch("/api/pad/target", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(editingId ? "Target berhasil diperbarui" : "Target berhasil ditambahkan");
            setDialogOpen(false);
            fetchRows(selectedTahun);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/pad/target/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success("Target berhasil dihapus");
            setDeleteId(null);
            fetchRows(selectedTahun);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal menghapus");
        }
    };

    // Group master_pajak by kelompok for Select
    const grouped = masterPajak.reduce<Record<string, MasterPajakOption[]>>((acc, mp) => {
        (acc[mp.kelompok] ??= []).push(mp);
        return acc;
    }, {});

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Hero */}
            <div className="relative rounded-xl sm:rounded-2xl p-5 sm:p-8 overflow-hidden bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a]">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <p className="text-blue-200/80 text-xs sm:text-sm mb-2">Setting › Tambah Target</p>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Nilai Anggaran</h1>
                        <p className="text-blue-200/70 text-xs sm:text-sm max-w-lg">
                            Kelola nilai anggaran target per tahun secara efisien dan transparan.
                        </p>
                    </div>
                    <div className="shrink-0">
                        <Button
                            onClick={openAdd}
                            className="bg-brand-gold hover:bg-amber-500 text-white font-semibold shadow-lg shadow-amber-500/25 gap-2 w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Nilai Anggaran
                        </Button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Filter Tahun Anggaran</label>
                        <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TAHUN_OPTIONS.map((y) => (
                                    <SelectItem key={y} value={String(y)}>Tahun {y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Cari Nama / Kelompok PAD</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Cari mata anggaran atau kelompok..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Kelompok PAD</th>
                                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Mata Anggaran</th>
                                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Target (Rp)</th>
                                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-t border-gray-50">
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-32 ml-auto" /></td>
                                        <td className="px-6 py-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                                    </tr>
                                ))
                            ) : shown.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                                        {searchQuery ? "Tidak ada data yang cocok dengan pencarian" : `Belum ada data target untuk tahun ${selectedTahun}`}
                                    </td>
                                </tr>
                            ) : (
                                shown.map((row) => (
                                    <tr key={row.id} className="border-t border-gray-50 hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-semibold text-brand-blue bg-blue-50 px-2 py-0.5 rounded-full">
                                                {row.kelompok}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{row.nama_pajak}</td>
                                        <td className="px-6 py-4 text-sm text-right font-mono font-bold text-gray-900">
                                            {formatCurrency(row.target_rp).replace("Rp", "").trim()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => openEdit(row)}
                                                    className="p-2 rounded-lg text-brand-blue hover:bg-blue-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(row.id)}
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                        Menampilkan {shown.length} dari {filtered.length} entri
                    </p>
                    {totalPages > 1 && (
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
                                    className={`px-2.5 py-1.5 text-xs rounded-md ${page === p ? "bg-brand-blue text-white" : "text-gray-500 hover:bg-gray-50 border border-gray-200"}`}
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
                    )}
                </div>
            </div>

            {/* Total Footer */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">📋</div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Total Anggaran Target PAD</p>
                        <p className="text-xs text-gray-400">Tahun Anggaran {selectedTahun}</p>
                    </div>
                </div>
                <p className="text-xl md:text-2xl font-bold text-brand-blue">{formatCurrency(totalAnggaran)}</p>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Target Anggaran" : "Tambah Nilai Anggaran"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Tahun */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Tahun Anggaran</label>
                            <Select
                                value={formData.tahun}
                                onValueChange={(v) => setFormData((prev) => ({ ...prev, tahun: v }))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {TAHUN_OPTIONS.map((y) => (
                                        <SelectItem key={y} value={String(y)}>Tahun {y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mata Anggaran (id_pajak dropdown) */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mata Anggaran</label>
                            <Select
                                value={formData.id_pajak}
                                onValueChange={(v) => setFormData((prev) => ({ ...prev, id_pajak: v }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih mata anggaran..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {Object.entries(grouped).map(([kelompok, items]) => (
                                        <div key={kelompok}>
                                            <div className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                                                {kelompok}
                                            </div>
                                            {items.map((mp) => (
                                                <SelectItem key={mp.id} value={String(mp.id)}>
                                                    {mp.nama_pajak}
                                                </SelectItem>
                                            ))}
                                        </div>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Target */}
                        <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nilai Target (Rp)</label>
                            <Input
                                type="number"
                                value={formData.target_rp}
                                onChange={(e) => setFormData((prev) => ({ ...prev, target_rp: e.target.value }))}
                                placeholder="Contoh: 298331879386"
                                min={0}
                            />
                            {formData.target_rp && Number(formData.target_rp) > 0 && (
                                <p className="text-xs text-gray-400 mt-1">
                                    {formatCurrency(Number(formData.target_rp))}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="text-red-600 border-red-200 hover:bg-red-50">
                            Batal
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteId !== null} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Hapus Target Anggaran?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Tindakan ini tidak dapat dibatalkan. Data target anggaran ini akan dihapus permanen dari database.
                    </p>
                    <DialogFooter className="gap-2 mt-2">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Batal</Button>
                        <Button
                            onClick={() => deleteId && handleDelete(deleteId)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
