// ===== PAD Data Types =====

export interface MataAnggaran {
    id: string;
    kode: string;
    nama: string;
    target: number;
    realisasi: number;
    realisasiKemarin: number;
    realisasiHariIni: number;
    children?: MataAnggaran[];
}

export interface KelompokPAD {
    id: string;
    kode: string;
    nama: string;
    target: number;
    realisasi: number;
    realisasiKemarin: number;
    realisasiHariIni: number;
    jumlahMataAnggaran: number;
    children: MataAnggaran[];
}

export interface PADSummary {
    tahun: number;
    totalTarget: number;
    totalRealisasi: number;
    realisasiKemarin: number;
    realisasiHariIni: number;
    realisasiSdHariIni: number;
    sisaTarget: number;
    lastUpdate: string;
    kelompok: KelompokPAD[];
}

export interface TrendData {
    bulan: string;
    pajakDaerah: number;
    retribusi: number;
    hasilKekayaan: number;
    lainLain: number;
}

export interface YearlyRealisasi {
    tahun: number;
    pajakDaerah: number;
    retribusi: number;
    hasilKekayaan: number;
    lainLain: number;
}

export interface TopContributor {
    nama: string;
    target: number;
    realisasi: number;
    icon: string;
    persentaseTarget: number;
    persentaseRealisasi: number;
}

export interface TargetAnggaran {
    id: string;
    kode: string;
    nama: string;
    target: number;
    tahun: number;
}

export interface AnalyticsSummary {
    target: number;
    realisasi: number;
    achievement: number;
    variance: number;
    proyeksi: number | null;
    status: "on-track" | "approaching" | "below-target" | "critical";
}

export interface VarianceData {
    nama: string;
    variance: number;
    color: string;
}

export interface PerformerData {
    nama: string;
    target: number;
    realisasi: number;
}
