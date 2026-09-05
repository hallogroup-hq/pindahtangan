// =================================================================
// PINDAHTANGAN BUSINESS CONSTANTS & SYSTEM CONFIG
// Grounded in PRD v1.0 Sections 4, 5, 9
// =================================================================

export const BUSINESS_RULES = {
  MINIMUM_CONSIGNMENT_ITEMS: 10,
  FREE_PICKUP_THRESHOLD: 20, // >= 20 pcs: Gratis jemput lemari Sukabumi
  STEAM_FEE_PER_PIECE: 2500, // Rp 2.500 deduktif saat laku
  HOST_BASE_FEE_PER_SHIFT: 60000, // Rp 60.000 per 2 jam
  HOST_COMMISSION_PER_PIECE: 2000, // Rp 2.000 per pcs laku
  BUYOUT_OBRAL_PRICE: 10000, // Rp 10.000 beli putus setelah 30 hari
  CONSIGNMENT_DURATION_DAYS: 30,
  WEEKLY_PAYOUT_DAY: 'Jumat',
  WEEKLY_PAYOUT_TIME: '16:00 WIB',
};

export const TIER_CONFIG = {
  tier_a: {
    label: 'Tier A • Branded & Pesta',
    description: 'Brand mall (Zara, Mango, Uniqlo), Gamis kondangan, Gaun pesta, Outer knit',
    floorPriceRange: 'Rp 50.000 – Rp 120.000',
    minFloor: 50000,
    maxFloor: 120000,
    defaultTargetLive: 85000,
    liveSchedule: 'Weekend / Malam (20.00–22.00)',
    badgeColor: 'bg-linen-100 text-espresso-800 border-linen-300',
  },
  tier_b: {
    label: 'Tier B • Casual & Kerja',
    description: 'Kemeja kerja, blouse katun, kulot linen, tunik harian',
    floorPriceRange: 'Rp 25.000 – Rp 45.000',
    minFloor: 25000,
    maxFloor: 45000,
    defaultTargetLive: 49000,
    liveSchedule: 'Harian Sore (16.00–18.00)',
    badgeColor: 'bg-terracotta-50 text-terracotta-800 border-terracotta-200',
  },
  tier_c: {
    label: 'Tier C • Mass Market',
    description: 'Kaos basic, cardigan tipis, celana rumahan, obral ceban',
    floorPriceRange: 'Rp 10.000 – Rp 20.000',
    minFloor: 10000,
    maxFloor: 20000,
    defaultTargetLive: 25000,
    liveSchedule: 'Flash Sale Siang (14.00–16.00)',
    badgeColor: 'bg-sage-50 text-sage-800 border-sage-500/20',
  },
};

export const SUKABUMI_DISTRICTS = [
  'Kecamatan Cikole',
  'Kecamatan Citamiang',
  'Kecamatan Gunungpuyuh',
  'Kecamatan Warudoyong',
  'Kecamatan Baros',
  'Kecamatan Lembursitu',
  'Kecamatan Cibeureum',
];

export const BANK_OPTIONS = [
  { id: 'bca', name: 'Bank Central Asia (BCA)' },
  { id: 'mandiri', name: 'Bank Mandiri' },
  { id: 'bri', name: 'Bank Rakyat Indonesia (BRI)' },
  { id: 'bni', name: 'Bank Negara Indonesia (BNI)' },
  { id: 'gopay', name: 'GoPay' },
  { id: 'ovo', name: 'OVO' },
  { id: 'dana', name: 'DANA' },
];

export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  in_steam: {
    label: 'Cuci Uap',
    color: 'bg-linen-100 text-espresso-700 border-linen-300',
  },
  ready_for_live: {
    label: 'Siap Live',
    color: 'bg-linen-100 text-espresso-900 border-linen-300 font-medium',
  },
  in_live_queue: {
    label: 'On Air',
    color: 'bg-terracotta-500 text-white border-terracotta-600',
  },
  sold: {
    label: 'Terjual (Menunggu Transfer)',
    color: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  },
  packed: {
    label: 'Dikemas',
    color: 'bg-linen-100 text-espresso-700 border-linen-300',
  },
  shipped: {
    label: 'Dikirim',
    color: 'bg-espresso-900 text-linen-100 border-espresso-900',
  },
  paid_out: {
    label: 'Payout Selesai',
    color: 'bg-linen-200 text-espresso-800 border-linen-300',
  },
  rejected: {
    label: 'Tidak Lolos QC',
    color: 'bg-rose-50 text-rose-900 border-rose-200',
  },
  bought_out: {
    label: 'Beli Putus Ceban',
    color: 'bg-amber-50 text-amber-900 border-amber-200',
  },
};
