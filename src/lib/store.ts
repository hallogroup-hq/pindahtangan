// =================================================================
// PINDAHTANGAN UNIVERSAL REACTIVE DATA STORE & LOCAL ENGINE
// Sukabumi Pilot Simulation & Local Persistence
// =================================================================

import {
  Profile,
  IntakeBatch,
  ClothesItem,
  LiveSession,
  Order,
  Payout,
  ItemStatusLog,
  UserRole,
  RejectAction,
  ShippingStatus,
  UnitEconomicsSummary,
  AdminTier,
  RunSheetItem,
  FulfillmentScanResult,
  HostShiftSummary,
  TierCategory,
} from './types';
import { BUSINESS_RULES } from './constants';
import {
  generateBatchCode,
  generateSKU,
  generateOrderNumber,
  generatePayoutCode,
  formatIDR,
} from './utils';

const STORAGE_KEY = 'pindahtangan_store_v1';

// Seed Profiles
export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-ratna-01',
    full_name: 'Ibu Ratna Dewi',
    phone_number: '0812-8899-7711',
    address: 'Jl. Surya Kencana No. 45, RT 02/RW 04',
    city: 'Kota Sukabumi',
    bank_name: 'BCA',
    bank_account_number: '0281928471',
    bank_account_holder: 'Ratna Dewi',
    role: 'consignor',
    created_at: '2026-08-20T08:00:00Z',
  },
  {
    id: 'user-rina-02',
    full_name: 'Ibu Rina Setyowati',
    phone_number: '0813-1122-3344',
    address: 'Perumahan Baros Indah Blok C2 No. 12',
    city: 'Kota Sukabumi',
    bank_name: 'Mandiri',
    bank_account_number: '1320098271625',
    bank_account_holder: 'Rina Setyowati',
    role: 'consignor',
    created_at: '2026-08-22T10:00:00Z',
  },
  {
    id: 'user-siti-host',
    full_name: 'Siti Host TikTok (Talent)',
    phone_number: '0857-9988-1122',
    address: 'Jl. R.E. Martadinata No. 88',
    city: 'Kota Sukabumi',
    bank_name: 'BCA',
    bank_account_number: '0289918273',
    bank_account_holder: 'Siti Nurhaliza',
    role: 'host',
    created_at: '2026-08-15T09:00:00Z',
  },
  {
    id: 'user-admin-studio',
    full_name: 'Studio & QC Lead (Kang Asep)',
    phone_number: '0811-2233-4455',
    address: 'Studio PindahTangan Hub, Jl. Siliwangi No. 102',
    city: 'Kota Sukabumi',
    role: 'admin',
    admin_tier: 'studio_lead',
    is_active_staff: true,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'user-admin-finance',
    full_name: 'Dewi Kartika (Finance Admin)',
    phone_number: '0812-3344-5566',
    address: 'Studio PindahTangan Finance, Jl. Siliwangi No. 102',
    city: 'Kota Sukabumi',
    role: 'admin',
    admin_tier: 'finance',
    is_active_staff: true,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'user-admin-logistics',
    full_name: 'Budi Santoso (Logistics & Packer)',
    phone_number: '0878-1122-3344',
    address: 'Studio PindahTangan Dispatch Hub, Jl. Siliwangi No. 102',
    city: 'Kota Sukabumi',
    role: 'admin',
    admin_tier: 'logistics',
    is_active_staff: true,
    created_at: '2026-08-01T08:00:00Z',
  },
  {
    id: 'user-admin-super',
    full_name: 'Akmal Irsyad (Owner & Superadmin)',
    phone_number: '0811-9988-7766',
    address: 'PindahTangan HQ Sukabumi',
    city: 'Kota Sukabumi',
    role: 'admin',
    admin_tier: 'superadmin',
    is_active_staff: true,
    created_at: '2026-08-01T08:00:00Z',
  },
];

// Seed Intake Batches
export const SEED_BATCHES: IntakeBatch[] = [
  {
    id: 'batch-001',
    consignor_id: 'user-ratna-01',
    batch_code: 'BATCH-202609-001',
    pickup_address: 'Jl. Surya Kencana No. 45, Kec. Cikole',
    district: 'Kecamatan Cikole',
    pickup_date: '2026-09-01',
    estimated_count: 25,
    actual_count: 24,
    status: 'completed',
    notes: 'Baju kerja dan gamis pesta, lemari penuh sesak.',
    created_at: '2026-09-01T09:30:00Z',
  },
  {
    id: 'batch-002',
    consignor_id: 'user-rina-02',
    batch_code: 'BATCH-202609-002',
    pickup_address: 'Perumahan Baros Indah Blok C2 No. 12, Kec. Baros',
    district: 'Kecamatan Baros',
    pickup_date: '2026-09-03',
    estimated_count: 20,
    actual_count: 20,
    status: 'in_qc',
    notes: 'Sebagian besar blouse dan kulot santai.',
    created_at: '2026-09-03T11:00:00Z',
  },
];

// Seed Live Sessions
export const SEED_SESSIONS: LiveSession[] = [
  {
    id: 'session-live-01',
    host_id: 'user-siti-host',
    session_title: 'TikTok Live Sore: OOTD Casual Chic Sukabumi & Mall Brands',
    platform: 'tiktok',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    total_items_sold: 4,
    total_gmv: 240000,
    host_base_fee: 60000,
    host_commission_earned: 8000,
    is_active: true,
  },
];

// Seed Clothes Items
export const SEED_ITEMS: ClothesItem[] = [
  {
    id: 'item-01',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    sku: 'PT-SM-001-001',
    hangtag_number: 1,
    title: 'Zara Floral Blouse Katun Premium',
    brand: 'Zara',
    size: 'M',
    chest_width_cm: 96,
    category_tier: 'tier_a',
    floor_price: 65000,
    target_live_price: 95000,
    steam_fee: 2500,
    status: 'in_live_queue',
    photo_url: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:00:00Z',
  },
  {
    id: 'item-02',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    sku: 'PT-SM-001-002',
    hangtag_number: 2,
    title: 'Uniqlo Rayon Long Sleeve Work Shirt',
    brand: 'Uniqlo',
    size: 'L',
    chest_width_cm: 102,
    category_tier: 'tier_b',
    floor_price: 40000,
    target_live_price: 65000,
    steam_fee: 2500,
    status: 'in_live_queue',
    photo_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:10:00Z',
  },
  {
    id: 'item-03',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    sku: 'PT-SM-001-003',
    hangtag_number: 3,
    title: 'Mango Pleated Midi Skirt Terakota',
    brand: 'Mango',
    size: 'M',
    chest_width_cm: 72,
    category_tier: 'tier_a',
    floor_price: 55000,
    target_live_price: 85000,
    steam_fee: 2500,
    status: 'in_live_queue',
    photo_url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:20:00Z',
  },
  {
    id: 'item-04',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    sku: 'PT-SM-001-004',
    hangtag_number: 4,
    title: 'H&M Knit Cardigan Sage Green',
    brand: 'H&M',
    size: 'S/M',
    chest_width_cm: 94,
    category_tier: 'tier_b',
    floor_price: 35000,
    target_live_price: 55000,
    steam_fee: 2500,
    status: 'in_live_queue',
    photo_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:30:00Z',
  },
  {
    id: 'item-05',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    order_id: 'ord-001',
    sku: 'PT-SM-001-005',
    hangtag_number: 5,
    title: 'Cotton On Oversized Striped Tee',
    brand: 'Cotton On',
    size: 'L',
    chest_width_cm: 104,
    category_tier: 'tier_c',
    floor_price: 20000,
    target_live_price: 35000,
    sold_price: 35000,
    steam_fee: 2500,
    net_payout_amount: 17500, // 20000 - 2500
    status: 'sold',
    photo_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:40:00Z',
  },
  {
    id: 'item-06',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    live_session_id: 'session-live-01',
    order_id: 'ord-002',
    sku: 'PT-SM-001-006',
    hangtag_number: 6,
    title: 'Gamis Brokat Kondangan Dusty Pink',
    brand: 'Lokal Butik',
    size: 'All Size',
    chest_width_cm: 100,
    category_tier: 'tier_a',
    floor_price: 80000,
    target_live_price: 110000,
    sold_price: 110000,
    steam_fee: 2500,
    net_payout_amount: 77500, // 80000 - 2500
    status: 'sold',
    photo_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T14:50:00Z',
  },
  {
    id: 'item-07',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    sku: 'PT-SM-001-007',
    hangtag_number: 7,
    title: 'Celana Kulot Linen Espresso',
    brand: 'Executive',
    size: 'M',
    chest_width_cm: 74,
    category_tier: 'tier_b',
    floor_price: 35000,
    target_live_price: 55000,
    steam_fee: 2500,
    status: 'in_steam',
    photo_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T15:00:00Z',
  },
  {
    id: 'item-08-reject',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    sku: 'PT-SM-001-008',
    hangtag_number: 8,
    title: 'Blouse Putih Satin Kerah Ruffle',
    brand: 'Stradivarius',
    size: 'S',
    category_tier: 'tier_b',
    floor_price: 35000,
    target_live_price: 50000,
    steam_fee: 2500,
    status: 'rejected',
    photo_url: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=800&q=80',
    defect_photo_url: 'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80',
    defect_notes: 'Ditemukan noda minyak pekat dan bekas tinta pada kerah belakang bagian dalam yang tidak luntur setelah spot-cleaning uap panas.',
    reject_resolution: null, // Belum dipilih oleh pemilik: donasi atau retur
    consignment_start_date: '2026-09-01',
    aging_expiry_date: '2026-10-01',
    created_at: '2026-09-01T15:10:00Z',
  },
  {
    id: 'item-09-old',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    sku: 'PT-SM-001-009',
    hangtag_number: 9,
    title: 'Rok Span Katun Motif Tartan',
    brand: 'Minimal',
    size: 'M',
    category_tier: 'tier_b',
    floor_price: 30000,
    target_live_price: 45000,
    steam_fee: 2500,
    status: 'ready_for_live',
    photo_url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&q=80',
    consignment_start_date: '2026-08-04',
    aging_expiry_date: '2026-09-03', // Expired / Menjelang 30 hari
    created_at: '2026-08-04T10:00:00Z',
  },
  {
    id: 'item-10-settled',
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    order_id: 'ord-prev-01',
    payout_id: 'payout-prev-01',
    sku: 'PT-SM-001-010',
    hangtag_number: 10,
    title: 'Kemeja Linen Sage Oversized',
    brand: 'Zara Men/Women',
    size: 'M',
    category_tier: 'tier_a',
    floor_price: 60000,
    target_live_price: 90000,
    sold_price: 90000,
    steam_fee: 2500,
    net_payout_amount: 57500,
    status: 'paid_out',
    photo_url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
    consignment_start_date: '2026-08-20',
    aging_expiry_date: '2026-09-19',
    created_at: '2026-08-20T11:00:00Z',
  },
];

// Seed Orders
export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-001',
    live_session_id: 'session-live-01',
    order_number: 'ORD-202609-1011',
    buyer_handle: '@siti_ootd',
    buyer_name: 'Siti Rahmawati',
    buyer_phone: '0812-9988-2233',
    shipping_address: 'Jl. Dago Asri No. 12',
    shipping_city: 'Kota Bandung',
    courier_name: 'J&T Express',
    tracking_number: 'JT9283719283',
    shipping_status: 'shipped',
    subtotal_amount: 35000,
    shipping_fee: 12000,
    total_paid: 47000,
    created_at: '2026-09-05T16:20:00Z',
  },
  {
    id: 'ord-002',
    live_session_id: 'session-live-01',
    order_number: 'ORD-202609-1012',
    buyer_handle: '@putri_sukabumi',
    buyer_name: 'Putri Ayu',
    buyer_phone: '0856-7788-9900',
    shipping_address: 'Jl. Bhayangkara No. 19, Kec. Gunungpuyuh',
    shipping_city: 'Kota Sukabumi',
    courier_name: 'Gosend Instant Sukabumi',
    tracking_number: 'GS-SKB-8821',
    shipping_status: 'pending_pack',
    subtotal_amount: 110000,
    shipping_fee: 10000,
    total_paid: 120000,
    created_at: '2026-09-05T16:45:00Z',
  },
];

// Seed Payouts
export const SEED_PAYOUTS: Payout[] = [
  {
    id: 'payout-prev-01',
    consignor_id: 'user-ratna-01',
    payout_code: 'PAY-20260829-001',
    period_start: '2026-08-22',
    period_end: '2026-08-27',
    total_gross_floor: 60000,
    total_steam_deduction: 2500,
    total_net_payout: 57500,
    items_count: 1,
    destination_bank: 'BCA',
    destination_account_number: '0281928471',
    destination_account_holder: 'Ratna Dewi',
    status: 'transferred',
    transfer_receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    transferred_at: '2026-08-29T16:00:00Z',
    created_at: '2026-08-29T15:30:00Z',
  },
];

export const SEED_LOGS: ItemStatusLog[] = [
  {
    id: 'log-01',
    item_id: 'item-05',
    changed_by: 'user-siti-host',
    from_status: 'in_live_queue',
    to_status: 'sold',
    notes: 'Terjual di TikTok Live kepada @siti_ootd seharga Rp 35.000',
    created_at: '2026-09-05T16:20:00Z',
  },
  {
    id: 'log-02',
    item_id: 'item-06',
    changed_by: 'user-siti-host',
    from_status: 'in_live_queue',
    to_status: 'sold',
    notes: 'Terjual di TikTok Live kepada @putri_sukabumi seharga Rp 110.000',
    created_at: '2026-09-05T16:45:00Z',
  },
];

export interface AppStoreData {
  profiles: Profile[];
  batches: IntakeBatch[];
  items: ClothesItem[];
  orders: Order[];
  payouts: Payout[];
  sessions: LiveSession[];
  logs: ItemStatusLog[];
  activeUserId: string;
  currentAdminTier: AdminTier;
  activeLiveRunSheet: Record<string, string[]>;
  onStageItemId?: string | null;
}

export class PindahTanganStore {
  private data: AppStoreData;
  private listeners: Set<() => void> = new Set();
  private persistToLocalStorage: boolean;

  constructor(initialData?: Partial<AppStoreData>, persistToLocalStorage: boolean = true) {
    this.persistToLocalStorage = persistToLocalStorage;
    const defaultData = this.loadFromStorage();
    this.data = initialData ? { ...defaultData, ...initialData } : defaultData;
  }

  private loadFromStorage(): AppStoreData {
    if (typeof window === 'undefined') {
      return {
        profiles: JSON.parse(JSON.stringify(SEED_PROFILES)),
        batches: JSON.parse(JSON.stringify(SEED_BATCHES)),
        items: JSON.parse(JSON.stringify(SEED_ITEMS)),
        orders: JSON.parse(JSON.stringify(SEED_ORDERS)),
        payouts: JSON.parse(JSON.stringify(SEED_PAYOUTS)),
        sessions: JSON.parse(JSON.stringify(SEED_SESSIONS)),
        logs: JSON.parse(JSON.stringify(SEED_LOGS)),
        activeUserId: 'user-ratna-01',
        currentAdminTier: 'superadmin',
        activeLiveRunSheet: { 'session-live-01': ['item-01', 'item-02', 'item-03', 'item-04'] },
        onStageItemId: 'item-01',
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          currentAdminTier: parsed.currentAdminTier || 'superadmin',
          activeLiveRunSheet: parsed.activeLiveRunSheet || {
            'session-live-01': ['item-01', 'item-02', 'item-03', 'item-04'],
          },
          onStageItemId:
            parsed.onStageItemId !== undefined ? parsed.onStageItemId : 'item-01',
        };
      }
    } catch {
      // Fallback
    }

    const initial: AppStoreData = {
      profiles: JSON.parse(JSON.stringify(SEED_PROFILES)),
      batches: JSON.parse(JSON.stringify(SEED_BATCHES)),
      items: JSON.parse(JSON.stringify(SEED_ITEMS)),
      orders: JSON.parse(JSON.stringify(SEED_ORDERS)),
      payouts: JSON.parse(JSON.stringify(SEED_PAYOUTS)),
      sessions: JSON.parse(JSON.stringify(SEED_SESSIONS)),
      logs: JSON.parse(JSON.stringify(SEED_LOGS)),
      activeUserId: 'user-ratna-01',
      currentAdminTier: 'superadmin',
      activeLiveRunSheet: {
        'session-live-01': ['item-01', 'item-02', 'item-03', 'item-04'],
      },
      onStageItemId: 'item-01',
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    } catch {}
    return initial;
  }

  private save() {
    if (this.persistToLocalStorage && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      } catch {}
    }
    this.notify();
  }

  public setData(newData: Partial<AppStoreData>) {
    this.data = { ...this.data, ...newData };
    this.save();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getData(): AppStoreData {
    return this.data;
  }

  public getActiveUser(): Profile {
    return (
      this.data.profiles.find((p) => p.id === this.data.activeUserId) ||
      this.data.profiles[0]
    );
  }

  public setActiveUser(userId: string) {
    this.data.activeUserId = userId;
    this.save();
  }

  // RBAC Admin Tier
  public getCurrentAdminTier(): AdminTier {
    return this.data.currentAdminTier || 'superadmin';
  }

  public setCurrentAdminTier(tier: AdminTier) {
    this.data.currentAdminTier = tier;
    this.save();
  }

  // Booking Action
  public bookIntakeBatch(params: {
    consignorName: string;
    phoneNumber: string;
    pickupAddress: string;
    district: string;
    pickupDate: string;
    estimatedCount: number;
    notes?: string;
  }): { batch: IntakeBatch; consignor: Profile } {
    let consignor = this.data.profiles.find(
      (p) => p.phone_number.replace(/\D/g, '') === params.phoneNumber.replace(/\D/g, '')
    );

    if (!consignor) {
      consignor = {
        id: `user-${Date.now()}`,
        full_name: params.consignorName,
        phone_number: params.phoneNumber,
        address: `${params.pickupAddress}, ${params.district}`,
        city: 'Kota Sukabumi',
        role: 'consignor',
        created_at: new Date().toISOString(),
      };
      this.data.profiles.push(consignor);
    }

    const newBatch: IntakeBatch = {
      id: `batch-${Date.now()}`,
      consignor_id: consignor.id,
      batch_code: generateBatchCode(),
      pickup_address: params.pickupAddress,
      district: params.district,
      pickup_date: params.pickupDate,
      estimated_count: params.estimatedCount,
      actual_count: 0,
      status: 'scheduled',
      notes: params.notes,
      created_at: new Date().toISOString(),
    };

    this.data.batches.unshift(newBatch);
    this.data.activeUserId = consignor.id;
    this.save();
    return { batch: newBatch, consignor };
  }

  // Studio Intake Reception
  public receiveBatch(batchId: string, actualCount: number) {
    const batch = this.data.batches.find((b) => b.id === batchId);
    if (batch) {
      batch.actual_count = actualCount;
      batch.status = 'in_qc';
      this.save();
    }
  }

  public updateBatchActualCount(batchId: string, actualCount: number, notes?: string) {
    const batch = this.data.batches.find((b) => b.id === batchId);
    if (batch) {
      batch.actual_count = actualCount;
      if (notes !== undefined) batch.notes = notes;
      batch.status = 'in_qc';
      this.save();
    }
  }

  public completeBatchIntake(batchId: string) {
    const batch = this.data.batches.find((b) => b.id === batchId);
    if (batch) {
      batch.status = 'completed';
      this.save();
    }
  }

  public confirmSteaming(itemId: string) {
    const item = this.data.items.find((i) => i.id === itemId);
    if (item) {
      item.status = 'ready_for_live';
      item.steam_completed_at = new Date().toISOString();
      this.save();
    }
  }

  // Enhanced 5-parameter QC Inspection (PRD Section 4.1)
  public inspectQCItem(params: {
    batchId: string;
    consignorId: string;
    title: string;
    brand: string;
    size: string;
    chestWidthCm?: number;
    categoryTier: TierCategory;
    floorPrice: number;
    targetLivePrice: number;
    photoUrl?: string;
    passedQC: boolean;
    defectReason?: string;
    defectNotes?: string;
    defectPhotoUrl?: string;
    isSteamed?: boolean;
    rackLocation?: string;
  }): ClothesItem {
    const hangtag = this.data.items.length + 1;
    const consignorIdx = Math.floor(1 + Math.random() * 99);
    const sku = generateSKU(consignorIdx, hangtag);
    const nowStr = new Date().toISOString();

    if (params.passedQC) {
      const newItem: ClothesItem = {
        id: `item-${Date.now()}`,
        batch_id: params.batchId,
        consignor_id: params.consignorId,
        sku,
        hangtag_number: hangtag,
        title: params.title,
        brand: params.brand,
        size: params.size,
        chest_width_cm: params.chestWidthCm,
        category_tier: params.categoryTier,
        floor_price: params.floorPrice,
        target_live_price: params.targetLivePrice,
        steam_fee: BUSINESS_RULES.STEAM_FEE_PER_PIECE,
        status: params.isSteamed ? 'ready_for_live' : 'in_steam',
        rack_location: params.rackLocation || 'RACK-A1',
        inspected_by: this.data.activeUserId,
        inspection_notes: 'Lolos QC 5 parameter fisik & higienitas uap panas.',
        steam_completed_at: params.isSteamed ? nowStr : undefined,
        photo_url:
          params.photoUrl ||
          'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
        consignment_start_date: nowStr.split('T')[0],
        aging_expiry_date: new Date(Date.now() + 30 * 86400000)
          .toISOString()
          .split('T')[0],
        created_at: nowStr,
      };
      this.data.items.unshift(newItem);
      this.save();
      return newItem;
    } else {
      const newItem: ClothesItem = {
        id: `item-rej-${Date.now()}`,
        batch_id: params.batchId,
        consignor_id: params.consignorId,
        sku,
        hangtag_number: hangtag,
        title: params.title,
        brand: params.brand,
        size: params.size,
        category_tier: params.categoryTier,
        floor_price: params.floorPrice,
        target_live_price: params.targetLivePrice,
        steam_fee: BUSINESS_RULES.STEAM_FEE_PER_PIECE,
        status: 'rejected',
        rack_location: 'BIN-REJECT',
        inspected_by: this.data.activeUserId,
        defect_photo_url:
          params.defectPhotoUrl ||
          'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80',
        defect_notes:
          params.defectNotes ||
          `Defek teridentifikasi: ${params.defectReason || 'Kain cacat/noda'}.`,
        reject_resolution: null,
        consignment_start_date: nowStr.split('T')[0],
        aging_expiry_date: new Date(Date.now() + 30 * 86400000)
          .toISOString()
          .split('T')[0],
        created_at: nowStr,
      };
      this.data.items.unshift(newItem);
      this.save();
      return newItem;
    }
  }

  // Studio QC Pass
  public qcPassItem(params: {
    batchId: string;
    consignorId: string;
    title: string;
    brand: string;
    size: string;
    chestWidthCm?: number;
    categoryTier: 'tier_a' | 'tier_b' | 'tier_c';
    floorPrice: number;
    targetLivePrice: number;
    photoUrl?: string;
  }): ClothesItem {
    const hangtag = this.data.items.length + 1;
    const consignorIdx = Math.floor(1 + Math.random() * 99);
    const sku = generateSKU(consignorIdx, hangtag);

    const newItem: ClothesItem = {
      id: `item-${Date.now()}`,
      batch_id: params.batchId,
      consignor_id: params.consignorId,
      sku,
      hangtag_number: hangtag,
      title: params.title,
      brand: params.brand,
      size: params.size,
      chest_width_cm: params.chestWidthCm,
      category_tier: params.categoryTier,
      floor_price: params.floorPrice,
      target_live_price: params.targetLivePrice,
      steam_fee: BUSINESS_RULES.STEAM_FEE_PER_PIECE,
      status: 'ready_for_live',
      photo_url:
        params.photoUrl ||
        'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80',
      consignment_start_date: new Date().toISOString().split('T')[0],
      aging_expiry_date: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split('T')[0],
      created_at: new Date().toISOString(),
    };

    this.data.items.push(newItem);
    this.save();
    return newItem;
  }

  // Studio QC Reject
  public qcRejectItem(params: {
    batchId: string;
    consignorId: string;
    title: string;
    brand: string;
    defectNotes: string;
    defectPhotoUrl: string;
  }): ClothesItem {
    const hangtag = this.data.items.length + 1;
    const consignorIdx = Math.floor(1 + Math.random() * 99);
    const sku = generateSKU(consignorIdx, hangtag);

    const newItem: ClothesItem = {
      id: `item-rej-${Date.now()}`,
      batch_id: params.batchId,
      consignor_id: params.consignorId,
      sku,
      hangtag_number: hangtag,
      title: params.title,
      brand: params.brand,
      category_tier: 'tier_b',
      floor_price: 30000,
      target_live_price: 45000,
      steam_fee: BUSINESS_RULES.STEAM_FEE_PER_PIECE,
      status: 'rejected',
      defect_photo_url: params.defectPhotoUrl,
      defect_notes: params.defectNotes,
      reject_resolution: null,
      consignment_start_date: new Date().toISOString().split('T')[0],
      aging_expiry_date: new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split('T')[0],
      created_at: new Date().toISOString(),
    };

    this.data.items.push(newItem);
    this.save();
    return newItem;
  }

  // Consignor Resolves Defect
  public resolveRejectItem(itemId: string, action: RejectAction) {
    const item = this.data.items.find((i) => i.id === itemId);
    if (item) {
      item.reject_resolution = action;
      this.save();
    }
  }

  // Host Live: Mark Item Sold
  public markItemSold(params: {
    itemId: string;
    liveSessionId: string;
    buyerHandle: string;
    soldPrice: number;
    buyerName?: string;
    buyerPhone?: string;
    shippingAddress?: string;
    shippingCity?: string;
  }): { item: ClothesItem; order: Order } {
    const item = this.data.items.find((i) => i.id === params.itemId);
    if (!item) throw new Error('Item tidak ditemukan');

    item.status = 'sold';
    item.sold_price = params.soldPrice;
    item.net_payout_amount = Math.max(0, item.floor_price - item.steam_fee);
    item.live_session_id = params.liveSessionId;

    const orderNum = generateOrderNumber();
    const order: Order = {
      id: `ord-${Date.now()}`,
      live_session_id: params.liveSessionId,
      order_number: orderNum,
      buyer_handle: params.buyerHandle.startsWith('@')
        ? params.buyerHandle
        : `@${params.buyerHandle}`,
      buyer_name: params.buyerName || `Customer ${params.buyerHandle}`,
      buyer_phone: params.buyerPhone || '0812-9876-5432',
      shipping_address:
        params.shippingAddress || 'Jl. Jenderal Sudirman No. 10',
      shipping_city: params.shippingCity || 'Kota Sukabumi',
      courier_name: 'J&T Express',
      shipping_status: 'pending_pack',
      subtotal_amount: params.soldPrice,
      shipping_fee: 10000,
      total_paid: params.soldPrice + 10000,
      created_at: new Date().toISOString(),
    };

    item.order_id = order.id;
    this.data.orders.unshift(order);

    // Update session metrics
    const session = this.data.sessions.find(
      (s) => s.id === params.liveSessionId
    );
    if (session) {
      session.total_items_sold += 1;
      session.total_gmv += params.soldPrice;
      session.host_commission_earned += BUSINESS_RULES.HOST_COMMISSION_PER_PIECE;
    }

    // Add log
    this.data.logs.unshift({
      id: `log-${Date.now()}`,
      item_id: item.id,
      changed_by: this.data.activeUserId,
      from_status: 'in_live_queue',
      to_status: 'sold',
      notes: `Terjual di TikTok Live kepada ${order.buyer_handle} seharga Rp ${params.soldPrice.toLocaleString('id-ID')}`,
      created_at: new Date().toISOString(),
    });

    this.save();
    return { item, order };
  }

  // Host Live: Skip item (re-queue to back)
  public skipLiveItem(itemId: string) {
    const index = this.data.items.findIndex((i) => i.id === itemId);
    if (index !== -1) {
      const [skipped] = this.data.items.splice(index, 1);
      this.data.items.push(skipped);
      this.save();
    }
  }

  // Consignor / Admin: Buyout Aged Item (30 Days Retention)
  public buyoutAgedItem(itemId: string) {
    const item = this.data.items.find((i) => i.id === itemId);
    if (item) {
      item.status = 'bought_out';
      item.sold_price = BUSINESS_RULES.BUYOUT_OBRAL_PRICE;
      item.net_payout_amount = BUSINESS_RULES.BUYOUT_OBRAL_PRICE; // Beli putus bersih
      this.save();
    }
  }

  // Friday Payout Batch Execution
  public executeFridayPayout(): Payout[] {
    const soldItems = this.data.items.filter(
      (i) => i.status === 'sold' && !i.payout_id
    );

    if (soldItems.length === 0) return [];

    // Group by consignor
    const grouped = new Map<string, ClothesItem[]>();
    soldItems.forEach((item) => {
      const list = grouped.get(item.consignor_id) || [];
      list.push(item);
      grouped.set(item.consignor_id, list);
    });

    const now = new Date();
    const periodEnd = now.toISOString().split('T')[0];
    const prevSat = new Date(now.getTime() - 6 * 86400000);
    const periodStart = prevSat.toISOString().split('T')[0];

    const generatedPayouts: Payout[] = [];

    grouped.forEach((items, consignorId) => {
      const consignor = this.data.profiles.find((p) => p.id === consignorId);
      const grossFloor = items.reduce((sum, i) => sum + i.floor_price, 0);
      const steamDeduction = items.length * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
      const netPayout = Math.max(0, grossFloor - steamDeduction);

      const payout: Payout = {
        id: `payout-${Date.now()}-${consignorId.slice(-4)}`,
        consignor_id: consignorId,
        payout_code: generatePayoutCode(),
        period_start: periodStart,
        period_end: periodEnd,
        total_gross_floor: grossFloor,
        total_steam_deduction: steamDeduction,
        total_net_payout: netPayout,
        items_count: items.length,
        destination_bank: consignor?.bank_name || 'BCA',
        destination_account_number: consignor?.bank_account_number || '0281928471',
        destination_account_holder: consignor?.bank_account_holder || consignor?.full_name || 'Penerima Konsinyasi',
        status: 'transferred',
        transfer_receipt_url:
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
        transferred_at: now.toISOString(),
        created_at: now.toISOString(),
      };

      // Mark items as paid_out
      items.forEach((item) => {
        item.status = 'paid_out';
        item.payout_id = payout.id;
      });

      this.data.payouts.unshift(payout);
      generatedPayouts.push(payout);
    });

    this.save();
    return generatedPayouts;
  }

  // Update Consignor Bank Details
  public updateBankDetails(params: {
    userId: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }) {
    const user = this.data.profiles.find((p) => p.id === params.userId);
    if (user) {
      user.bank_name = params.bankName;
      user.bank_account_number = params.accountNumber;
      user.bank_account_holder = params.accountHolder;
      this.save();
    }
  }

  // Update Order Shipping Status
  public updateShippingStatus(
    orderId: string,
    status: ShippingStatus,
    trackingNumber?: string
  ) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (order) {
      order.shipping_status = status;
      if (trackingNumber) order.tracking_number = trackingNumber;
      this.save();
    }
  }

  // Live Run-Sheet & Studio Co-Pilot (PRD Section 4.2)
  public getRunSheetForSession(sessionId: string): RunSheetItem[] {
    const orderedIds = this.data.activeLiveRunSheet?.[sessionId] || [];
    const onStageId = this.data.onStageItemId;

    const result: RunSheetItem[] = [];
    let hanger = 1;

    orderedIds.forEach((id) => {
      const item = this.data.items.find((i) => i.id === id);
      if (item) {
        result.push({
          hangerNumber: hanger++,
          item,
          isOnStage: item.id === onStageId,
        });
      }
    });

    const remaining = this.data.items.filter(
      (i) =>
        (i.status === 'ready_for_live' || i.status === 'in_live_queue') &&
        !orderedIds.includes(i.id)
    );

    remaining.forEach((item) => {
      if (hanger <= 50) {
        result.push({
          hangerNumber: hanger++,
          item,
          isOnStage: item.id === onStageId,
        });
      }
    });

    return result;
  }

  public setRunSheetHangerOrder(sessionId: string, orderedItemIds: string[]) {
    if (!this.data.activeLiveRunSheet) {
      this.data.activeLiveRunSheet = {};
    }
    this.data.activeLiveRunSheet[sessionId] = orderedItemIds;
    this.save();
  }

  public setOnStageItem(itemId: string | null) {
    this.data.onStageItemId = itemId;
    if (itemId) {
      const item = this.data.items.find((i) => i.id === itemId);
      if (item && item.status === 'ready_for_live') {
        item.status = 'in_live_queue';
      }
    }
    this.save();
  }

  public getOnStageItem(): ClothesItem | null {
    if (!this.data.onStageItemId) return null;
    return this.data.items.find((i) => i.id === this.data.onStageItemId) || null;
  }

  public coPilotAdjustPrice(itemId: string, newTargetPrice: number) {
    const item = this.data.items.find((i) => i.id === itemId);
    if (item) {
      if (newTargetPrice < item.floor_price) {
        throw new Error(
          `Harga tawar tidak boleh di bawah Floor Price (${formatIDR(item.floor_price)})`
        );
      }
      item.target_live_price = newTargetPrice;
      this.save();
    }
  }

  public getHostPayrollSummary(): HostShiftSummary[] {
    return this.data.sessions.map((session) => {
      const host = this.data.profiles.find((p) => p.id === session.host_id);
      const base =
        session.host_base_fee || BUSINESS_RULES.HOST_BASE_FEE_PER_SHIFT;
      const comm =
        session.host_commission_earned ||
        session.total_items_sold * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE;
      return {
        hostId: session.host_id,
        hostName: host?.full_name || 'Host Sukabumi Talent',
        sessionTitle: session.session_title,
        date: session.start_time ? session.start_time.split('T')[0] : '2026-09-05',
        itemsSold: session.total_items_sold,
        baseFee: base,
        commissionFee: comm,
        totalEarnings: base + comm,
      };
    });
  }

  // Zero-Error Barcode Scanning Station (PRD Section 4.3)
  public verifyPackingBarcode(
    orderId: string,
    scannedSku: string
  ): FulfillmentScanResult {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) {
      return { matched: false, message: `Order #${orderId} tidak ditemukan.` };
    }

    const orderItem = this.data.items.find((i) => i.order_id === order.id);
    if (!orderItem) {
      return {
        matched: false,
        message: 'Item pesanan tidak ditemukan di database.',
        order,
      };
    }

    const cleanScan = scannedSku.trim().toUpperCase();
    const cleanTargetSku = orderItem.sku.trim().toUpperCase();

    if (cleanScan === cleanTargetSku) {
      orderItem.status = 'packed';
      order.shipping_status = 'pending_pack';
      order.packed_by = this.data.activeUserId;
      order.packed_at = new Date().toISOString();
      this.save();
      return {
        matched: true,
        message: `VERIFIKASI SUKSES: SKU ${orderItem.sku} (${orderItem.title}) cocok dengan pesanan ${order.order_number}!`,
        item: orderItem,
        order,
      };
    } else {
      return {
        matched: false,
        message: `VERIFIKASI GAGAL! Barcode fisik yang di-scan (${cleanScan}) TIDAK SESUAI dengan target pesanan (${cleanTargetSku}). Harap cek ulang nomor gantungan!`,
        item: orderItem,
        order,
      };
    }
  }

  public bulkDispatchOrders(
    orderIds: string[],
    courierName: string
  ): { count: number; trackingNumbers: Record<string, string> } {
    const trackingMap: Record<string, string> = {};
    let count = 0;
    const nowStr = new Date().toISOString();

    orderIds.forEach((id) => {
      const order = this.data.orders.find((o) => o.id === id);
      if (order && order.shipping_status !== 'shipped') {
        const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
        const prefix = courierName.toLowerCase().includes('gosend')
          ? 'GS-SKB-'
          : courierName.toLowerCase().includes('sicepat')
          ? '0028'
          : 'JT';
        const tracking = `${prefix}${randomDigits}`;
        order.courier_name = courierName;
        order.tracking_number = tracking;
        order.shipping_status = 'shipped';
        order.dispatched_at = nowStr;

        const item = this.data.items.find((i) => i.order_id === order.id);
        if (item) {
          item.status = 'shipped';
        }

        trackingMap[order.id] = tracking;
        count++;
      }
    });

    this.save();
    return { count, trackingNumbers: trackingMap };
  }

  // Bank Disbursement CSV Formats (PRD Section 4.4)
  public exportBankDisbursementCSV(format: 'bca' | 'mandiri'): string {
    const payouts = this.data.payouts;
    if (format === 'bca') {
      let csv = 'RekeningTujuan,NamaPenerima,Nominal,Keterangan,RefCode\n';
      payouts.forEach((p) => {
        const cleanAcc = (p.destination_account_number || '').replace(/[^0-9]/g, '');
        const name = `"${p.destination_account_holder.replace(/"/g, '""')}"`;
        const amount = p.total_net_payout;
        const note = `"Gajian PindahTangan ${p.payout_code}"`;
        csv += `${cleanAcc},${name},${amount},${note},${p.payout_code}\n`;
      });
      return csv;
    } else {
      let csv = 'BenAccountNo,BenName,Amount,Currency,Remark1,Remark2\n';
      payouts.forEach((p) => {
        const cleanAcc = (p.destination_account_number || '').replace(/[^0-9]/g, '');
        const name = `"${p.destination_account_holder.replace(/"/g, '""')}"`;
        const amount = p.total_net_payout;
        csv += `${cleanAcc},${name},${amount},IDR,PindahTangan,${p.payout_code}\n`;
      });
      return csv;
    }
  }

  // Accounting and Reporting CSV Exporters (PRD Section 4.6)
  public exportAccountingCSV(type: 'sales' | 'payouts' | 'inventory' | 'audit'): string {
    if (type === 'sales') {
      let csv = 'OrderNumber,Date,BuyerHandle,BuyerName,Courier,TrackingNumber,Subtotal,ShippingFee,TotalPaid,Status\n';
      this.data.orders.forEach((o) => {
        csv += `"${o.order_number}","${o.created_at}","${o.buyer_handle}","${o.buyer_name}","${o.courier_name}","${o.tracking_number || ''}",${o.subtotal_amount},${o.shipping_fee},${o.total_paid},"${o.shipping_status}"\n`;
      });
      return csv;
    } else if (type === 'payouts') {
      let csv = 'PayoutCode,Date,Consignor,Bank,AccountNo,GrossFloor,SteamDeduction,NetPayout,ItemsCount,Status\n';
      this.data.payouts.forEach((p) => {
        csv += `"${p.payout_code}","${p.created_at}","${p.destination_account_holder}","${p.destination_bank}","${p.destination_account_number}",${p.total_gross_floor},${p.total_steam_deduction},${p.total_net_payout},${p.items_count},"${p.status}"\n`;
      });
      return csv;
    } else if (type === 'inventory') {
      let csv = 'SKU,Hangtag,Title,Brand,Size,Tier,FloorPrice,TargetLivePrice,SoldPrice,Status,RackLocation,ExpiryDate\n';
      this.data.items.forEach((i) => {
        csv += `"${i.sku}",${i.hangtag_number},"${i.title}","${i.brand || ''}","${i.size || ''}","${i.category_tier}",${i.floor_price},${i.target_live_price},${i.sold_price || ''},"${i.status}","${i.rack_location || 'RACK-A'}","${i.aging_expiry_date}"\n`;
      });
      return csv;
    } else {
      let csv = 'LogId,ItemId,ChangedBy,FromStatus,ToStatus,Notes,CreatedAt\n';
      this.data.logs.forEach((l) => {
        csv += `"${l.id}","${l.item_id}","${l.changed_by}","${l.from_status || ''}","${l.to_status}","${l.notes || ''}","${l.created_at}"\n`;
      });
      return csv;
    }
  }

  // Reset to default
  public resetToDefault() {
    this.data = {
      profiles: JSON.parse(JSON.stringify(SEED_PROFILES)),
      batches: JSON.parse(JSON.stringify(SEED_BATCHES)),
      items: JSON.parse(JSON.stringify(SEED_ITEMS)),
      orders: JSON.parse(JSON.stringify(SEED_ORDERS)),
      payouts: JSON.parse(JSON.stringify(SEED_PAYOUTS)),
      sessions: JSON.parse(JSON.stringify(SEED_SESSIONS)),
      logs: JSON.parse(JSON.stringify(SEED_LOGS)),
      activeUserId: 'user-ratna-01',
      currentAdminTier: 'superadmin',
      activeLiveRunSheet: { 'session-live-01': ['item-01', 'item-02', 'item-03', 'item-04'] },
      onStageItemId: 'item-01',
    };
    this.save();
  }

  // Calculate Unit Economics
  public getUnitEconomics(): UnitEconomicsSummary {
    const soldItems = this.data.items.filter(
      (i) => i.status === 'sold' || i.status === 'paid_out'
    );
    const totalGrossGMV = soldItems.reduce(
      (sum, i) => sum + (i.sold_price || i.target_live_price),
      0
    );
    const totalFloor = soldItems.reduce((sum, i) => sum + i.floor_price, 0);
    const totalSteamFees =
      soldItems.length * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
    const totalConsignorNet = Math.max(0, totalFloor - totalSteamFees);

    const totalHostBaseFees = this.data.sessions.reduce(
      (sum, s) => sum + s.host_base_fee,
      0
    );
    const totalHostCommission =
      soldItems.length * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE;
    const totalHostFees = totalHostBaseFees + totalHostCommission;

    const totalPlatformGrossMargin = totalGrossGMV - totalFloor + totalSteamFees;
    const totalPlatformNetProfit = totalPlatformGrossMargin - totalHostFees;

    return {
      totalGrossGMV,
      totalConsignorNet,
      totalSteamFees,
      totalHostFees,
      totalHostCommission,
      totalPlatformGrossMargin,
      totalPlatformNetProfit,
      itemsSold: soldItems.length,
      averageSoldPrice:
        soldItems.length > 0 ? Math.round(totalGrossGMV / soldItems.length) : 0,
      averageFloorPrice:
        soldItems.length > 0 ? Math.round(totalFloor / soldItems.length) : 0,
    };
  }
}

// Global Singleton
let storeInstance: PindahTanganStore | null = null;

export function getStore(): PindahTanganStore {
  if (!storeInstance) {
    storeInstance = new PindahTanganStore();
  }
  return storeInstance;
}
