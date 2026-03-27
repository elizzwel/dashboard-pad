// ===== PAD Database View Types =====
// These types match the columns returned by the PostgreSQL views

export interface CardDashboard {
  total_target: number;
  growth_target_persen: number | null;
  total_realisasi: number;
  data_per_tanggal: string;
  persentase_capaian: number;
}

export interface CardAnalytical {
  total_target: number;
  growth_target: number | null;
  total_realisasi: number;
  growth_realisasi: number | null;
  achievement_percent: number;
  variance_nominal: number;
  variance_percent: number;
  proyeksi: number;
  status_label: string;
  status_note: string;
}

export interface PieRealisasiPersen {
  tahun: number;
  label: string;
  persentase: number;
  nilai_nominal: number;
}

export interface RealisasiVsTargetBar {
  kelompok_pad: string;
  tahun: number;
  total_target: number;
  total_realisasi: number;
}

export interface RealisasiKelompok5Thn {
  kelompok_pad: string;
  tahun: number;
  total_realisasi: number;
}

export interface TopKontributor {
  nama_pajak: string;
  realisasi_rp: number;
  target_rp: number;
  persentase_realisasi: number;
  persentase_sisa_target: number;
  tahun: number;
}

export interface RincianRealisasi {
  nama_sektor: string;
  target: number;
  realisasi: number;
  persentase: number;
  status: string;
}

export interface PersentaseRealisasi {
  nama_pajak: string;
  target_rp: number;
  realisasi_rp: number;
  persentase: string;
}

export interface TrenAkumulasi {
  kelompok_pad: string;
  bulan: string;
  akumulasi_realisasi: number;
}

export interface VarianceKelompok {
  kelompok_pad: string;
  variance_nominal: number;
}

export interface PerformerData {
  nama_pajak: string;
  realisasi_rp: number;
  target_rp: number;
  persentase_realisasi: number;
  persentase_sisa_target?: number;
}

export interface HeadMataAnggaran {
  kelompok_pad: string;
  jumlah_mata_anggaran: number;
  total_target: number;
  total_realisasi: number;
  achievement: number;
  variance: number;
  kontribusi: number;
}

export interface DetailMataAnggaran {
  kelompok_pad: string;
  mata_anggaran: string;
  target: number;
  realisasi: number;
  achievement: number;
  variance: number;
  kontribusi_per_kelompok: number;
}

export interface DetailMataAnggaranResponse {
  head: HeadMataAnggaran[];
  detail: DetailMataAnggaran[];
}
