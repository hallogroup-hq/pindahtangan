// =================================================================
// PINDAHTANGAN CORE TYPE DEFINITIONS
// Canonical Data Model based on PRD v1.0 Section 7 & 8
// =================================================================

export type UserRole = 'consignor' | 'host' | 'admin';

export type BatchStatus = 'scheduled' | 'picked_up' | 'in_qc' | 'completed';

export type TierCategory = 'tier_a' | 'tier_b' | 'tier_c';

export type ItemStatus =
  | 'in_steam'
  | 'ready_for_live'
  | 'in_live_queue'
  | 'sold'
  | 'packed'
  | 'shipped'
  | 'paid_out'
  | 'rejected'
  | 'bought_out';

export type RejectAction = 'donate' | 'reclaim';

export type ShippingStatus = 'pending_pack' | 'shipped' | 'delivered' | 'returned';

export type PayoutStatus = 'draft' | 'processing' | 'transferred' | 'failed';

export type LivePlatform = 'tiktok' | 'instagram';

// 1. Profile / User
export interface Profile {
  id: string;
  full_name: string;
  phone_number: string;
  address?: string;
  city: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  role: UserRole;
  created_at: string;
}

// 2. Intake Batch
export interface IntakeBatch {
  id: string;
  consignor_id: string;
  batch_code: string;
  pickup_address: string;
  pickup_date?: string;
  estimated_count: number;
  actual_count: number;
  status: BatchStatus;
  notes?: string;
  district?: string;
  created_at: string;
  consignor?: Profile;
}

// 3. Clothes Item
export interface ClothesItem {
  id: string;
  batch_id: string;
  consignor_id: string;
  live_session_id?: string | null;
  order_id?: string | null;
  payout_id?: string | null;
  sku: string;
  hangtag_number: number;
  title: string;
  brand?: string;
  size?: string;
  chest_width_cm?: number; // Lingkar dada / LD
  category_tier: TierCategory;
  floor_price: number;
  target_live_price: number;
  sold_price?: number | null;
  steam_fee: number;
  net_payout_amount?: number | null;
  status: ItemStatus;
  photo_url?: string;
  defect_photo_url?: string | null;
  defect_notes?: string | null;
  reject_resolution?: RejectAction | null;
  consignment_start_date: string;
  aging_expiry_date: string;
  created_at: string;
  consignor?: Profile;
}

// 4. Item Status Log (Audit Trail)
export interface ItemStatusLog {
  id: string;
  item_id: string;
  changed_by: string;
  from_status?: string | null;
  to_status: string;
  notes?: string;
  created_at: string;
  user?: Profile;
}

// 5. Order
export interface Order {
  id: string;
  live_session_id?: string | null;
  order_number: string;
  buyer_handle: string; // @siti_ootd
  buyer_name: string;
  buyer_phone: string;
  shipping_address: string;
  shipping_city: string;
  courier_name: string;
  tracking_number?: string | null;
  shipping_status: ShippingStatus;
  subtotal_amount: number;
  shipping_fee: number;
  total_paid: number;
  created_at: string;
  items?: ClothesItem[];
}

// 6. Payout (Jumat 16.00 WIB)
export interface Payout {
  id: string;
  consignor_id: string;
  payout_code: string;
  period_start: string;
  period_end: string;
  total_gross_floor: number;
  total_steam_deduction: number;
  total_net_payout: number;
  items_count: number;
  destination_bank: string;
  destination_account_number: string;
  destination_account_holder: string;
  status: PayoutStatus;
  transfer_receipt_url?: string | null;
  transferred_at?: string | null;
  created_at: string;
  consignor?: Profile;
  items?: ClothesItem[];
}

// 7. Live Session
export interface LiveSession {
  id: string;
  host_id: string;
  session_title: string;
  platform: LivePlatform;
  start_time: string;
  end_time?: string | null;
  total_items_sold: number;
  total_gmv: number;
  host_base_fee: number;
  host_commission_earned: number;
  is_active?: boolean;
  host?: Profile;
}

// Financial Simulation Payload
export interface UnitEconomicsSummary {
  totalGrossGMV: number;
  totalConsignorNet: number;
  totalSteamFees: number;
  totalHostFees: number;
  totalHostCommission: number;
  totalPlatformGrossMargin: number;
  totalPlatformNetProfit: number;
  itemsSold: number;
  averageSoldPrice: number;
  averageFloorPrice: number;
}
