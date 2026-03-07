/**
 * Format currency with full digits: Rp 298.331.879.386
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format currency in compact form: Rp 1,25 T / Rp 982,5 M / Rp 450,0 B
 */
export function formatCompact(value: number): string {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (abs >= 1e12) {
        return `${sign}Rp ${(abs / 1e12).toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} T`;
    }
    if (abs >= 1e9) {
        return `${sign}Rp ${(abs / 1e9).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} B`;
    }
    if (abs >= 1e6) {
        return `${sign}Rp ${(abs / 1e6).toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} M`;
    }
    return formatCurrency(value);
}

/**
 * Format percentage: 78.6%
 */
export function formatPercent(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Calculate achievement
 */
export function calcAchievement(realisasi: number, target: number): number {
    if (target === 0) return 0;
    return (realisasi / target) * 100;
}

/**
 * Calculate variance
 */
export function calcVariance(realisasi: number, target: number): number {
    return realisasi - target;
}

/**
 * Get status based on achievement threshold
 */
export type StatusType = "on-track" | "approaching" | "below-target" | "critical";

export function getStatus(achievement: number): StatusType {
    if (achievement >= 90) return "on-track";
    if (achievement >= 70) return "approaching";
    if (achievement >= 50) return "below-target";
    return "critical";
}

export function getStatusLabel(status: StatusType): string {
    const labels: Record<StatusType, string> = {
        "on-track": "SESUAI TARGET",
        approaching: "MENDEKATI",
        "below-target": "DI BAWAH TARGET",
        critical: "KRITIS",
    };
    return labels[status];
}

/**
 * Format number with dot separator (Indonesian)
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat("id-ID").format(value);
}
