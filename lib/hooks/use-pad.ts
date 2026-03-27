import { useQuery } from "@tanstack/react-query";
import { usePADStore } from "@/lib/store";
import type {
  CardDashboard,
  CardAnalytical,
  PieRealisasiPersen,
  RealisasiVsTargetBar,
  RealisasiKelompok5Thn,
  TopKontributor,
  RincianRealisasi,
  TrenAkumulasi,
  VarianceKelompok,
  PerformerData,
  DetailMataAnggaranResponse,
} from "@/lib/types/pad";

async function fetchPAD<T>(endpoint: string, tahun?: number): Promise<T> {
  const url = new URL(`/api/pad/${endpoint}`, window.location.origin);
  if (tahun) url.searchParams.set("tahun", String(tahun));
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to fetch /api/pad/${endpoint}`);
  }
  return res.json();
}

// ===== Dashboard Page hooks =====

export function useDashboardSummary() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "summary", tahun],
    queryFn: () => fetchPAD<CardDashboard>("summary", tahun),
    staleTime: 30_000,
  });
}

export function usePieRealisasi() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "realisasi-persen", tahun],
    queryFn: () => fetchPAD<PieRealisasiPersen[]>("realisasi-persen", tahun),
    staleTime: 30_000,
  });
}

export function useRealisasiVsTarget() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "realisasi-target", tahun],
    queryFn: () => fetchPAD<RealisasiVsTargetBar[]>("realisasi-target", tahun),
    staleTime: 30_000,
  });
}

export function useRealisasi5Tahun() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "realisasi-5thn", tahun],
    queryFn: () => fetchPAD<RealisasiKelompok5Thn[]>("realisasi-5thn", tahun),
    staleTime: 30_000,
  });
}

export function useTopKontributorNominal() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "top-kontributor-nominal", tahun],
    queryFn: () => fetchPAD<TopKontributor[]>("top-kontributor-nominal", tahun),
    staleTime: 30_000,
  });
}

export function useTopKontributorPersen() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "top-kontributor-persen", tahun],
    queryFn: () => fetchPAD<TopKontributor[]>("top-kontributor-persen", tahun),
    staleTime: 30_000,
  });
}

export function useRincianRealisasi() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "rincian", tahun],
    queryFn: () => fetchPAD<RincianRealisasi[]>("rincian", tahun),
    staleTime: 30_000,
  });
}

// ===== Analytics Page hooks =====

export function useAnalyticsSummary() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "analytics", tahun],
    queryFn: () => fetchPAD<CardAnalytical>("analytics", tahun),
    staleTime: 30_000,
  });
}

export function useTrenAkumulasi() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "tren", tahun],
    queryFn: () => fetchPAD<TrenAkumulasi[]>("tren", tahun),
    staleTime: 30_000,
  });
}

export function useVarianceKelompok() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "variance", tahun],
    queryFn: () => fetchPAD<VarianceKelompok[]>("variance", tahun),
    staleTime: 30_000,
  });
}

export function useTopPerformers() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "top-performers", tahun],
    queryFn: () => fetchPAD<PerformerData[]>("top-performers", tahun),
    staleTime: 30_000,
  });
}

export function useBottomPerformers() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "bottom-performers", tahun],
    queryFn: () => fetchPAD<PerformerData[]>("bottom-performers", tahun),
    staleTime: 30_000,
  });
}

export function useDetailMataAnggaran() {
  const tahun = usePADStore((s) => s.tahun);
  return useQuery({
    queryKey: ["pad", "detail-mata-anggaran", tahun],
    queryFn: () =>
      fetchPAD<DetailMataAnggaranResponse>("detail-mata-anggaran", tahun),
    staleTime: 30_000,
  });
}
