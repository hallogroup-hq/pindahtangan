import {
  Profile,
  IntakeBatch,
  ClothesItem,
  Order,
  Payout,
  LiveSession,
  ItemStatusLog,
  TierCategory,
  ItemStatus,
} from '@/lib/types';

export function createMockProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: `profile-${Math.random().toString(36).substring(2, 9)}`,
    full_name: 'Ibu Ratna Dewi Test',
    phone_number: '081234567890',
    address: 'Jl. Surya Kencana No. 45',
    city: 'Kota Sukabumi',
    bank_name: 'BCA',
    bank_account_number: '0281928471',
    bank_account_holder: 'Ratna Dewi',
    role: 'consignor',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockBatch(overrides: Partial<IntakeBatch> = {}): IntakeBatch {
  return {
    id: `batch-${Math.random().toString(36).substring(2, 9)}`,
    consignor_id: 'user-ratna-01',
    batch_code: `BATCH-202609-${Math.floor(100 + Math.random() * 900)}`,
    pickup_address: 'Jl. Surya Kencana No. 45, Cikole',
    district: 'Kecamatan Cikole',
    pickup_date: '2026-09-01',
    estimated_count: 20,
    actual_count: 20,
    status: 'scheduled',
    notes: 'Kemeja dan blouse',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockItem(overrides: Partial<ClothesItem> = {}): ClothesItem {
  return {
    id: `item-${Math.random().toString(36).substring(2, 9)}`,
    batch_id: 'batch-001',
    consignor_id: 'user-ratna-01',
    sku: `PT-SM-001-${Math.floor(100 + Math.random() * 900)}`,
    hangtag_number: Math.floor(1 + Math.random() * 50),
    title: 'Test Fashion Item Zara',
    brand: 'Zara',
    size: 'M',
    chest_width_cm: 96,
    category_tier: 'tier_a' as TierCategory,
    floor_price: 50000,
    target_live_price: 85000,
    steam_fee: 2500,
    status: 'in_steam' as ItemStatus,
    consignment_start_date: new Date().toISOString().split('T')[0],
    aging_expiry_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: `order-${Math.random().toString(36).substring(2, 9)}`,
    order_number: `ORD-202609-${Math.floor(1000 + Math.random() * 9000)}`,
    buyer_handle: '@siti_ootd',
    buyer_name: 'Siti Pembeli',
    buyer_phone: '081299887766',
    shipping_address: 'Jl. Otista No. 12',
    shipping_city: 'Kota Sukabumi',
    courier_name: 'J&T Express',
    shipping_status: 'pending_pack',
    subtotal_amount: 85000,
    shipping_fee: 10000,
    total_paid: 95000,
    created_at: new Date().toISOString(),
    items: [],
    ...overrides,
  };
}

export function createMockPayout(overrides: Partial<Payout> = {}): Payout {
  return {
    id: `payout-${Math.random().toString(36).substring(2, 9)}`,
    consignor_id: 'user-ratna-01',
    payout_code: `PAY-20260905-${Math.floor(100 + Math.random() * 900)}`,
    period_start: '2026-08-30',
    period_end: '2026-09-04',
    total_gross_floor: 100000,
    total_steam_deduction: 5000,
    total_net_payout: 95000,
    items_count: 2,
    destination_bank: 'BCA',
    destination_account_number: '0281928471',
    destination_account_holder: 'Ratna Dewi',
    status: 'transferred',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

export function createMockSession(overrides: Partial<LiveSession> = {}): LiveSession {
  return {
    id: `session-${Math.random().toString(36).substring(2, 9)}`,
    host_id: 'user-siti-host',
    session_title: 'TikTok Live Sore Flash Sale',
    platform: 'tiktok',
    start_time: new Date().toISOString(),
    total_items_sold: 0,
    total_gmv: 0,
    host_base_fee: 60000,
    host_commission_earned: 0,
    is_active: true,
    ...overrides,
  };
}
