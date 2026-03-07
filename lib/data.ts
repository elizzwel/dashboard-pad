import type {
    PADSummary,
    TrendData,
    YearlyRealisasi,
    TopContributor,
    TargetAnggaran,
    AnalyticsSummary,
    VarianceData,
    PerformerData,
} from "./types";

// ===== Mock Data =====

export const padSummary: PADSummary = {
    tahun: 2024,
    totalTarget: 495_002_802_871,
    totalRealisasi: 210_500_000_000,
    realisasiKemarin: 210_500_000_000,
    realisasiHariIni: 1_200_000_000,
    realisasiSdHariIni: 211_700_000_000,
    sisaTarget: 238_300_000_000,
    lastUpdate: "14:30 WIB",
    kelompok: [
        {
            id: "k1",
            kode: "4.1.01",
            nama: "Pajak Daerah",
            target: 298_331_879_386,
            realisasi: 700_000_000,
            realisasiKemarin: 650_000_000,
            realisasiHariIni: 50_000_000,
            jumlahMataAnggaran: 77,
            children: [
                { id: "m1-1", kode: "4.1.01.01", nama: "Pajak PBB", target: 85_200_000_000, realisasi: 28_000_000_000, realisasiKemarin: 27_500_000_000, realisasiHariIni: 500_000_000 },
                { id: "m1-2", kode: "4.1.01.02", nama: "BPHTB", target: 112_500_000_000, realisasi: 68_200_000_000, realisasiKemarin: 67_800_000_000, realisasiHariIni: 400_000_000 },
                { id: "m1-3", kode: "4.1.01.03", nama: "Pajak PBJT", target: 45_800_000_000, realisasi: 12_300_000_000, realisasiKemarin: 12_100_000_000, realisasiHariIni: 200_000_000 },
                { id: "m1-4", kode: "4.1.01.04", nama: "Pajak Air Tanah", target: 8_400_000_000, realisasi: 4_100_000_000, realisasiKemarin: 4_050_000_000, realisasiHariIni: 50_000_000 },
                { id: "m1-5", kode: "4.1.01.05", nama: "Pajak Barang Walet", target: 2_150_000_000, realisasi: 1_800_000_000, realisasiKemarin: 1_780_000_000, realisasiHariIni: 20_000_000 },
                { id: "m1-6", kode: "4.1.01.06", nama: "Pajak Reklame", target: 15_600_000_000, realisasi: 7_100_000_000, realisasiKemarin: 7_050_000_000, realisasiHariIni: 50_000_000 },
                { id: "m1-7", kode: "4.1.01.07", nama: "Opsen PKB", target: 12_000_000_000, realisasi: 5_500_000_000, realisasiKemarin: 5_450_000_000, realisasiHariIni: 50_000_000 },
                { id: "m1-8", kode: "4.1.01.08", nama: "Opsen BBNKB", target: 8_000_000_000, realisasi: 3_200_000_000, realisasiKemarin: 3_150_000_000, realisasiHariIni: 50_000_000 },
            ],
        },
        {
            id: "k2",
            kode: "4.1.02",
            nama: "Retribusi Daerah",
            target: 175_380_676_267,
            realisasi: 0,
            realisasiKemarin: 0,
            realisasiHariIni: 0,
            jumlahMataAnggaran: 66,
            children: [
                { id: "m2-1", kode: "4.1.02.01", nama: "Retribusi Daerah", target: 85_200_000_000, realisasi: 28_400_000_000, realisasiKemarin: 28_100_000_000, realisasiHariIni: 300_000_000 },
                { id: "m2-2", kode: "4.1.02.02", nama: "Retribusi Jasa Umum", target: 45_000_000_000, realisasi: 0, realisasiKemarin: 0, realisasiHariIni: 0 },
                { id: "m2-3", kode: "4.1.02.03", nama: "Retribusi Jasa Usaha", target: 22_500_000_000, realisasi: 8_700_000_000, realisasiKemarin: 8_650_000_000, realisasiHariIni: 50_000_000 },
                { id: "m2-4", kode: "4.1.02.04", nama: "Retribusi Perizinan", target: 12_680_676_267, realisasi: 4_200_000_000, realisasiKemarin: 4_180_000_000, realisasiHariIni: 20_000_000 },
                { id: "m2-5", kode: "4.1.02.05", nama: "Retribusi Pasar", target: 5_000_000_000, realisasi: 2_100_000_000, realisasiKemarin: 2_080_000_000, realisasiHariIni: 20_000_000 },
                { id: "m2-6", kode: "4.1.02.06", nama: "Retribusi LDS", target: 5_000_000_000, realisasi: 1_800_000_000, realisasiKemarin: 1_780_000_000, realisasiHariIni: 20_000_000 },
            ],
        },
        {
            id: "k3",
            kode: "4.1.03",
            nama: "Hasil Pengelolaan Kekayaan Daerah yang Dipisahkan",
            target: 19_261_992_499,
            realisasi: 0,
            realisasiKemarin: 0,
            realisasiHariIni: 0,
            jumlahMataAnggaran: 4,
            children: [
                { id: "m3-1", kode: "4.1.03.01", nama: "Perusda Aneka Usaha", target: 85_200_000_000, realisasi: 28_400_000_000, realisasiKemarin: 28_100_000_000, realisasiHariIni: 300_000_000 },
                { id: "m3-2", kode: "4.1.03.02", nama: "Perusda Aneka Usaha", target: 112_500_000_000, realisasi: 68_200_000_000, realisasiKemarin: 67_800_000_000, realisasiHariIni: 400_000_000 },
                { id: "m3-3", kode: "4.1.03.03", nama: "Perusda Aneka Usaha", target: 45_800_000_000, realisasi: 12_300_000_000, realisasiKemarin: 12_100_000_000, realisasiHariIni: 200_000_000 },
            ],
        },
        {
            id: "k4",
            kode: "4.1.04",
            nama: "Lain-lain PAD yang Sah",
            target: 2_028_253_719,
            realisasi: 0,
            realisasiKemarin: 0,
            realisasiHariIni: 0,
            jumlahMataAnggaran: 63,
            children: [
                { id: "m4-1", kode: "4.1.04.01", nama: "Hasil Kerja Sama Daerah", target: 85_200_000_000, realisasi: 28_400_000_000, realisasiKemarin: 28_100_000_000, realisasiHariIni: 300_000_000 },
                { id: "m4-2", kode: "4.1.04.02", nama: "Hasil Kerja Sama Daerah", target: 112_500_000_000, realisasi: 68_200_000_000, realisasiKemarin: 67_800_000_000, realisasiHariIni: 400_000_000 },
                { id: "m4-3", kode: "4.1.04.03", nama: "Hasil Kerja Sama Daerah", target: 45_800_000_000, realisasi: 12_300_000_000, realisasiKemarin: 12_100_000_000, realisasiHariIni: 200_000_000 },
                { id: "m4-4", kode: "4.1.04.04", nama: "Hasil Kerja Sama Daerah", target: 8_400_000_000, realisasi: 4_100_000_000, realisasiKemarin: 4_050_000_000, realisasiHariIni: 50_000_000 },
                { id: "m4-5", kode: "4.1.04.05", nama: "Hasil Kerja Sama Daerah", target: 2_150_000_000, realisasi: 1_800_000_000, realisasiKemarin: 1_780_000_000, realisasiHariIni: 20_000_000 },
                { id: "m4-6", kode: "4.1.04.06", nama: "Hasil Kerja Sama Daerah", target: 15_600_000_000, realisasi: 7_100_000_000, realisasiKemarin: 7_050_000_000, realisasiHariIni: 50_000_000 },
            ],
        },
    ],
};

export const trendData: TrendData[] = [
    { bulan: "Jan", pajakDaerah: 15, retribusi: 10, hasilKekayaan: 8, lainLain: 5 },
    { bulan: "Feb", pajakDaerah: 28, retribusi: 18, hasilKekayaan: 12, lainLain: 8 },
    { bulan: "Mar", pajakDaerah: 42, retribusi: 30, hasilKekayaan: 18, lainLain: 12 },
    { bulan: "Apr", pajakDaerah: 55, retribusi: 38, hasilKekayaan: 24, lainLain: 15 },
    { bulan: "May", pajakDaerah: 68, retribusi: 48, hasilKekayaan: 30, lainLain: 20 },
    { bulan: "Jun", pajakDaerah: 80, retribusi: 55, hasilKekayaan: 35, lainLain: 25 },
    { bulan: "Jul", pajakDaerah: 95, retribusi: 65, hasilKekayaan: 42, lainLain: 30 },
];

export const yearlyRealisasi: YearlyRealisasi[] = [
    { tahun: 2022, pajakDaerah: 75, retribusi: 60, hasilKekayaan: 45, lainLain: 30 },
    { tahun: 2023, pajakDaerah: 82, retribusi: 68, hasilKekayaan: 50, lainLain: 35 },
    { tahun: 2024, pajakDaerah: 88, retribusi: 72, hasilKekayaan: 55, lainLain: 40 },
    { tahun: 2025, pajakDaerah: 65, retribusi: 48, hasilKekayaan: 35, lainLain: 25 },
    { tahun: 2026, pajakDaerah: 20, retribusi: 15, hasilKekayaan: 10, lainLain: 8 },
];

export const topContributorsNominal: TopContributor[] = [
    { nama: "PBB", target: 85_200_000_000, realisasi: 28_000_000_000, icon: "🏠", persentaseTarget: 28.5, persentaseRealisasi: 32.9 },
    { nama: "PBJT", target: 45_800_000_000, realisasi: 12_300_000_000, icon: "🏢", persentaseTarget: 15.4, persentaseRealisasi: 26.9 },
    { nama: "BPHTB", target: 112_500_000_000, realisasi: 68_200_000_000, icon: "📋", persentaseTarget: 37.7, persentaseRealisasi: 60.6 },
];

export const topContributorsPersentase: TopContributor[] = [
    { nama: "PBJT", target: 45_800_000_000, realisasi: 40_700_000_000, icon: "🏢", persentaseTarget: 88.9, persentaseRealisasi: 88.9 },
    { nama: "PBB", target: 85_200_000_000, realisasi: 72_400_000_000, icon: "🏠", persentaseTarget: 85.0, persentaseRealisasi: 85.0 },
    { nama: "BPHTB", target: 112_500_000_000, realisasi: 90_000_000_000, icon: "📋", persentaseTarget: 80.0, persentaseRealisasi: 80.0 },
];

export const targetAnggaranData: TargetAnggaran[] = [
    { id: "1", kode: "4.1.01", nama: "Pajak Daerah", target: 298_331_879_386, tahun: 2024 },
    { id: "2", kode: "4.1.02", nama: "Retribusi Daerah", target: 175_380_676_267, tahun: 2024 },
    { id: "3", kode: "4.1.03", nama: "Hasil Pengelolaan Kekayaan Daerah yang Dipisahkan", target: 19_261_992_499, tahun: 2024 },
    { id: "4", kode: "4.1.04", nama: "Lain-lain PAD yang Sah", target: 2_028_253_719, tahun: 2024 },
];

export const analyticsSummary: AnalyticsSummary = {
    target: 507_000_000,
    realisasi: 5_700_000,
    achievement: 1.1,
    variance: -501_300_000,
    proyeksi: null,
    status: "critical",
};

export const varianceData: VarianceData[] = [
    { nama: "Pajak Daerah", variance: -342_100_000, color: "#ef4444" },
    { nama: "Retribusi Daerah", variance: -124_500_000, color: "#ef4444" },
    { nama: "Hasil Kekayaan Dipisahkan", variance: -30_200_000, color: "#ef4444" },
    { nama: "Lain-lain PAD yang Sah", variance: -4_500_000, color: "#ef4444" },
];

export const topPerformers: PerformerData[] = [
    { nama: "PBB", target: 60, realisasi: 55 },
    { nama: "BPHTB", target: 50, realisasi: 48 },
    { nama: "OPSEN BBNKB", target: 40, realisasi: 32 },
    { nama: "PBJT", target: 35, realisasi: 28 },
    { nama: "Air Tanah", target: 20, realisasi: 12 },
];

export const bottomPerformers: PerformerData[] = [
    { nama: "Retribusi Pasar", target: 80, realisasi: 5 },
    { nama: "OPSEN MBL B", target: 75, realisasi: 4 },
    { nama: "OPSEN PKB", target: 60, realisasi: 3 },
    { nama: "Retribusi LDS", target: 50, realisasi: 2 },
    { nama: "Hotel", target: 40, realisasi: 1 },
];

// Detailed data for rincian realisasi table (analytics & settings)
export const rincianRealisasi = [
    { nama: "Pajak Bumi dan Bangunan (PBB)", target: 450_000_000_000, realisasi: 382_500_000_000, persentase: 85.0, status: "on-track" as const },
    { nama: "Pajak Kendaraan Bermotor", target: 320_000_000_000, realisasi: 240_000_000_000, persentase: 75.0, status: "approaching" as const },
    { nama: "Retribusi Sampah", target: 85_000_000_000, realisasi: 78_200_000_000, persentase: 92.0, status: "on-track" as const },
    { nama: "Pajak Air Tanah", target: 42_000_000_000, realisasi: 18_900_000_000, persentase: 45.0, status: "below-target" as const },
    { nama: "Hasil Perusahaan Daerah", target: 120_000_000_000, realisasi: 96_000_000_000, persentase: 80.0, status: "on-track" as const },
];
