---
trigger: manual
---

# PAD Klaten — Context & Rules (Antigravity)

## Project Overview
**App:** Dashboard PAD (Pendapatan Asli Daerah) Kabupaten Klaten  
**Purpose:** Real-time monitoring realisasi penerimaan daerah vs target anggaran tahunan  
**Language UI:** Bahasa Indonesia | **Codebase:** TypeScript

---

## Tech Stack

| Layer | Library | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x strict |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | latest |
| Charts | Recharts | 2.x |
| Data Fetching | TanStack Query | v5 |
| State | Zustand | 5.x |
| Forms | React Hook Form + Zod | latest |
| Table | TanStack Table | v8 |
| Icons | Lucide React | latest |
| Toast | Sonner | latest |
| Dates | date-fns + locale `id` | 4.x |
| Utils | clsx + tailwind-merge | latest |

---

## Design Tokens (`globals.css`)

```css
@theme {
  --color-brand-navy: #0f2d5e;
  --color-brand-navy-dark: #0a1f42;
  --color-brand-gold: #f59e0b;
  --color-brand-blue: #3b82f6;
  --color-status-on-track: #10b981;
  --color-status-approaching: #f59e0b;
  --color-status-critical: #ef4444;
  --color-chart-pajak: #22c55e;
  --color-chart-retribusi: #3b82f6;
  --color-chart-kekayaan: #f59e0b;
  --color-chart-lainlain: #ef4444;
}
```

---

## Layout

```
RootLayout
├── Sidebar (w-64, bg #0a1f42) — Logo + Nav: Dashboard / Analytics / Settings
├── TopBar (h-16, sticky) — Page title + Search + Bell + Avatar
└── Page (ml-64) — Hero Banner → KPI Row → Content
```

**Hero Banner** (semua halaman):
- `bg-gradient-to-r from-[#0f2d5e] to-[#1a4a8a]`, rounded-2xl, p-8
- Konten: breadcrumb, H1, subtitle, TahunAnggaranBadge (gold), ikon gedung dekoratif kanan

---

## Pages & Routes

### `/dashboard` — Grafik Utama
- KPI (3 card): Total Target `Rp 1,25 T` | Total Realisasi `Rp 982,5 M` | Capaian `78.6%`
- DonutChart — realisasi vs belum terealisasi, label center "2025"
- GroupedBarChart — Realisasi vs Target per Kelompok PAD (amber=Target, blue=Realisasi)
- MultiBarChart — Realisasi per Kelompok 2022–2026
- Top 3 Kontributor by Nominal & Persentase (dengan year filter)
- Tabel Rincian Realisasi + filter + Export CSV

### `/dashboard/detail` — Card / Table Toggle
- KPI (5 card): Total Target | Realisasi s/d Kemarin | Realisasi Hari Ini | Realisasi s/d Hari Ini | Sisa Target
- Toggle `Card View` ↔ `Table View`
- **Card View:** Grid 3 kolom SektorCard per kategori PAD, paginasi per seksi
- **Table View:** DetailRealisasiTable dengan Expand All / Collapse All

### `/analytics` — Analitik
- KPI (6 card): Target | Realisasi | Achievement | Variance | Proyeksi | Status (KRITIS)
- AreaChart — Tren Realisasi per Bulan (4 series, date range picker)
- VarianceBarChart — Variance by Kelompok PAD (horizontal)
- BarChart — Top 5 Performers & Bottom 5 At-Risk
- DetailRealisasiTable di bawah

### `/settings/target` — Nilai Anggaran
- Filter Tahun + Search kode/nama
- Tabel: ID/Kode | Mata Anggaran | Target (Rp) | Aksi (edit/delete)
- Footer: Total Anggaran Target PAD
- Modal: Tambah/Edit Target (Tahun, Kode, Nilai)

---

## Komponen Utama

### StatusBadge
```
on-track      → bg-green-100 text-green-700
approaching   → bg-amber-100 text-amber-700
below-target  → bg-red-100 text-red-600
critical      → bg-red-600 text-white font-bold animate-pulse
```

### AchievementBadge
```
>= 80%  → green | 50–79% → blue | 1–49% → amber | 0% → red
```

### SektorCard (Card View)
Nama + StatusBadge | Target bold besar | Realisasi s/d Kemarin | Realisasi Hari Ini (biru) | Progress bar

### DetailRealisasiTable
Kolom: Kelompok PAD / Mata Anggaran | Target | Realisasi | Achievement | Variance | Kontribusi
Expanded child rows: indent `pl-8` + `border-l-2 border-blue-500`

### Modal Target
Field: Tahun Anggaran (select) | Kode Anggaran (select) | Nilai Target Rp
Actions: Batal (red) | Simpan (green)

---

## Business Logic

```
Achievement  = (Realisasi / Target) x 100     → 0% jika target = 0
Variance     = Realisasi - Target              → negatif = merah
Sisa Target  = Target - Realisasi
Kontribusi   = (Realisasi Sektor / Total) x 100
Proyeksi     = avg bulanan x 12               → null jika data < 3 bulan

Status threshold:
  >= 90%  → SESUAI TARGET (green)
  70–89%  → MENDEKATI (amber)
  50–69%  → DI BAWAH TARGET (red)
  < 50%   → KRITIS (red, bold, pulse)
```

---

## Formatting

```typescript
// Currency full: Rp 298.331.879.386
new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 })

// Compact: Rp 1,25 T / Rp 982,5 M
if value >= 1e12 → `Rp ${(v/1e12).toFixed(2)} T`
if value >= 1e9  → `Rp ${(v/1e9).toFixed(1)} B`
if value >= 1e6  → `Rp ${(v/1e6).toFixed(1)} M`
```

---

## Chart Defaults (Recharts)

```
margin: { top: 10, right: 20, left: 0, bottom: 0 }
animationDuration: 600
barRadius: [4, 4, 0, 0]
areaFillOpacity: 0.15–0.3
colors: pajak #22c55e | retribusi #3b82f6 | kekayaan #f59e0b | lain-lain #ef4444
```

---

## API Endpoints

```
GET  /api/pad/summary?tahun=
GET  /api/pad/trend?tahun=&dari=&sd=
GET  /api/pad/sektor?tahun=&page=&kategori=
GET  /api/pad/target?tahun=
POST /api/pad/target
PUT  /api/pad/target/:id
DEL  /api/pad/target/:id
```

---

## Rules

- Server Components default; `"use client"` hanya jika butuh hooks/interaktivitas
- Gunakan `cn()` untuk semua conditional className
- Semua angka diformat via helper — tidak hardcode string Rupiah
- State global via Zustand; tidak ada `localStorage`
- Fetching via TanStack Query — tidak ada `useEffect` untuk fetch
- Semua modal via `<Dialog>` shadcn/ui
- Strict TypeScript — tidak ada `any`
- KPI, chart, tabel wajib ada Suspense skeleton + error boundary