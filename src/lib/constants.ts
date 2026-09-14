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
    label: 'Tier A • Very Good Quality',
    qualityLabel: 'Very Good Quality',
    description: 'Kondisi sangat prima (Very Good Quality), tanpa noda/cacat, warna pekat. Khusus kaos, crop top, oversized: hak bersih Rp 25.000 – Rp 45.000 (celana, kemeja, tas, sepatu fleksibel dinilai kurator)',
    floorPriceRange: 'Rp 25.000 – Rp 45.000',
    minFloor: 25000,
    maxFloor: 45000,
    defaultTargetLive: 49000,
    liveSchedule: 'Weekend / Malam (20.00–22.00)',
    badgeColor: 'bg-linen-100 text-espresso-800 border-linen-300',
  },
  tier_b: {
    label: 'Tier B • Good Quality',
    qualityLabel: 'Good Quality tapi tidak sebagus A',
    description: 'Kondisi bagus layak pakai (Good Quality), warna dan serat kain baik. Khusus kaos, crop top, oversized: hak bersih Rp 15.000 – Rp 35.000',
    floorPriceRange: 'Rp 15.000 – Rp 35.000',
    minFloor: 15000,
    maxFloor: 35000,
    defaultTargetLive: 35000,
    liveSchedule: 'Harian Sore (16.00–18.00)',
    badgeColor: 'bg-terracotta-50 text-terracotta-800 border-terracotta-200',
  },
  tier_c: {
    label: 'Tier C • Minor Dikit',
    qualityLabel: 'Ada minor dikit',
    description: 'Ada cacat minor ringan (noda samar/kancing lepas/wash wear). Khusus kaos, crop top, oversized: hak bersih Rp 5.000 – Rp 15.000',
    floorPriceRange: 'Rp 5.000 – Rp 15.000',
    minFloor: 5000,
    maxFloor: 15000,
    defaultTargetLive: 15000,
    liveSchedule: 'Flash Sale Siang (14.00–16.00)',
    badgeColor: 'bg-sage-50 text-sage-800 border-sage-500/20',
  },
};

export const COMMISSION_CONFIG = {
  categories: [
    { id: 'celana', label: 'Celana (Jeans/Chino/Kulot/Pants)' },
    { id: 'rok', label: 'Rok (Midi/Maxi/Plisket/Skirt)' },
    { id: 'jaket', label: 'Jaket / Outerwear / Blazer / Hoodie' },
    { id: 'tas', label: 'Tas / Ransel / Handbag / Totebag' },
    { id: 'sepatu', label: 'Sepatu / Sneakers / Heels / Flat' },
    { id: 'kemeja', label: 'Kemeja / Blouse Formal' },
    { id: 'lainnya', label: 'Kategori Lainnya' },
  ],
  defaultCommissionPercent: 15,
  availableCommissionRates: [10, 15],
  calculateCommissionSplit: (consignorAskingPrice: number, commissionPercent: number = 15) => {
    const commissionFee = Math.round((consignorAskingPrice * commissionPercent) / 100);
    const floorPrice = consignorAskingPrice - commissionFee;
    return {
      targetLivePrice: consignorAskingPrice, // Harga jual umum = harga pemilik barang
      commissionFee,                         // 10-15% ke PindahTangan
      floorPrice,                            // Hak bersih dasar pemilik barang
      consignorNetAfterSteam: Math.max(0, floorPrice - 2500), // Transfer bersih setelah uap
    };
  },
};

export const SPECIAL_CATEGORY_NOTE =
  'Untuk celana, rok, jaket, tas, sepatu, kemeja dll: Harga jual ke umum mengikuti harga yang ditentukan pemilik barang, dipotong 10% – 15% komisi untuk PindahTangan.';

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
