import { create } from "zustand";
import type { TargetAnggaran } from "./types";
import { targetAnggaranData } from "./data";

interface PADStore {
    tahun: number;
    setTahun: (tahun: number) => void;
    viewMode: "card" | "table";
    setViewMode: (mode: "card" | "table") => void;
    targets: TargetAnggaran[];
    addTarget: (target: TargetAnggaran) => void;
    updateTarget: (id: string, data: Partial<TargetAnggaran>) => void;
    deleteTarget: (id: string) => void;
}

export const usePADStore = create<PADStore>((set) => ({
    tahun: 2024,
    setTahun: (tahun) => set({ tahun }),
    viewMode: "table",
    setViewMode: (viewMode) => set({ viewMode }),
    targets: targetAnggaranData,
    addTarget: (target) =>
        set((state) => ({ targets: [...state.targets, target] })),
    updateTarget: (id, data) =>
        set((state) => ({
            targets: state.targets.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
    deleteTarget: (id) =>
        set((state) => ({ targets: state.targets.filter((t) => t.id !== id) })),
}));
