import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES, TIER_CONFIG, COMMISSION_CONFIG } from '@/lib/constants';

describe('REG-QC: QC 3-Station & Steaming Flow Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-QC-01: qcPassItem sets correct SKU, floor price, and steam fee deduction', () => {
    const newItem = store.qcPassItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Zara Floral Blouse Katun',
      brand: 'Zara',
      size: 'M',
      chestWidthCm: 96,
      categoryTier: 'tier_a',
      floorPrice: 65000,
      targetLivePrice: 95000,
    });

    expect(newItem.id).toBeDefined();
    expect(newItem.sku).toMatch(/^PT-SM-\d{3}-\d{3}$/);
    expect(newItem.hangtag_number).toBeGreaterThan(0);
    expect(newItem.floor_price).toBe(65000);
    expect(newItem.target_live_price).toBe(95000);
    expect(newItem.steam_fee).toBe(BUSINESS_RULES.STEAM_FEE_PER_PIECE); // Rp 2.500
    expect(newItem.status).toBe('ready_for_live');
    expect(newItem.chest_width_cm).toBe(96);

    // Verify stored in state
    const saved = store.getData().items.find((i) => i.id === newItem.id);
    expect(saved).toBeDefined();
  });

  it('REG-QC-02: inspectQCItem with isSteamed=false sets status in_steam, and confirmSteaming moves to ready_for_live', () => {
    const unsteamedItem = store.inspectQCItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Uniqlo Oxford Shirt',
      brand: 'Uniqlo',
      size: 'L',
      chestWidthCm: 104,
      categoryTier: 'tier_b',
      floorPrice: 35000,
      targetLivePrice: 55000,
      passedQC: true,
      isSteamed: false,
      rackLocation: 'RACK-STEAM-01',
    });

    expect(unsteamedItem.status).toBe('in_steam');
    expect(unsteamedItem.steam_completed_at).toBeUndefined();

    // Confirm steaming completed
    store.confirmSteaming(unsteamedItem.id);

    const updated = store.getData().items.find((i) => i.id === unsteamedItem.id);
    expect(updated?.status).toBe('ready_for_live');
    expect(updated?.steam_completed_at).toBeDefined();
  });

  it('REG-QC-03: inspectQCItem with passedQC=false records reject reason, photo, and assigns to BIN-REJECT', () => {
    const rejectedItem = store.inspectQCItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Mango Blazer Noda Karat',
      brand: 'Mango',
      size: 'S',
      categoryTier: 'tier_a',
      floorPrice: 50000,
      targetLivePrice: 80000,
      passedQC: false,
      defectReason: 'Noda karat membandel di kerah belakang',
      defectNotes: 'Noda tidak hilang setelah spot cleaning uap',
      defectPhotoUrl: 'https://images.unsplash.com/defect-photo.jpg',
    });

    expect(rejectedItem.status).toBe('rejected');
    expect(rejectedItem.rack_location).toBe('BIN-REJECT');
    expect(rejectedItem.defect_notes).toContain('Noda tidak hilang');
    expect(rejectedItem.defect_photo_url).toBe('https://images.unsplash.com/defect-photo.jpg');
    expect(rejectedItem.reject_resolution).toBeNull();
  });

  it('REG-QC-04: qcRejectItem creates a rejected item with defect notes', () => {
    const item = store.qcRejectItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Celana Kulot Sobek Paha',
      brand: 'Non-brand',
      defectNotes: 'Robek 3cm di sambungan paha kiri',
      defectPhotoUrl: 'https://images.unsplash.com/defect-kulot.jpg',
    });

    expect(item.status).toBe('rejected');
    expect(item.defect_notes).toBe('Robek 3cm di sambungan paha kiri');
  });

  it('REG-QC-05: resolveRejectItem allows consignor to donate or reclaim rejected clothes', () => {
    const rejectedItem = store.qcRejectItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Kemeja Kancing Lepas',
      brand: 'H&M',
      defectNotes: 'Kancing hilang 2 buah',
      defectPhotoUrl: 'https://images.unsplash.com/hm.jpg',
    });

    // Test donate resolution
    store.resolveRejectItem(rejectedItem.id, 'donate');
    let item = store.getData().items.find((i) => i.id === rejectedItem.id);
    expect(item?.reject_resolution).toBe('donate');

    // Test reclaim resolution
    store.resolveRejectItem(rejectedItem.id, 'reclaim');
    item = store.getData().items.find((i) => i.id === rejectedItem.id);
    expect(item?.reject_resolution).toBe('reclaim');
  });

  it('REG-QC-06: Tier configuration constants adhere to consignor pricing specifications', () => {
    expect(TIER_CONFIG.tier_a.minFloor).toBe(25000);
    expect(TIER_CONFIG.tier_a.maxFloor).toBe(45000);

    expect(TIER_CONFIG.tier_b.minFloor).toBe(15000);
    expect(TIER_CONFIG.tier_b.maxFloor).toBe(35000);

    expect(TIER_CONFIG.tier_c.minFloor).toBe(5000);
    expect(TIER_CONFIG.tier_c.maxFloor).toBe(15000);
  });

  it('REG-QC-07: Commission split calculation handles 10% and 15% platform cuts while keeping consignor asking price as general selling price', () => {
    // 15% cut on Rp 100,000 asking price
    const split15 = COMMISSION_CONFIG.calculateCommissionSplit(100000, 15);
    expect(split15.targetLivePrice).toBe(100000); // Selling price to public remains the consignor's asking price
    expect(split15.commissionFee).toBe(15000);
    expect(split15.floorPrice).toBe(85000);
    expect(split15.consignorNetAfterSteam).toBe(82500); // 85000 - 2500

    // 10% cut on Rp 80,000 asking price
    const split10 = COMMISSION_CONFIG.calculateCommissionSplit(80000, 10);
    expect(split10.targetLivePrice).toBe(80000);
    expect(split10.commissionFee).toBe(8000);
    expect(split10.floorPrice).toBe(72000);
    expect(split10.consignorNetAfterSteam).toBe(69500); // 72000 - 2500
  });

  it('REG-QC-08: qcPassItem & inspectQCItem store commission_split properties correctly', () => {
    // Test qcPassItem with commission_split
    const passedItem = store.qcPassItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Levis 501 Original Denim Jeans',
      brand: 'Levis',
      size: '32',
      categoryTier: 'tier_a',
      pricingModel: 'commission_split',
      itemTypeCategory: 'celana',
      consignorAskingPrice: 200000,
      commissionRatePercent: 15,
      floorPrice: 170000,
      targetLivePrice: 200000,
    });

    expect(passedItem.pricing_model).toBe('commission_split');
    expect(passedItem.consignor_asking_price).toBe(200000);
    expect(passedItem.commission_rate_percent).toBe(15);
    expect(passedItem.item_type_category).toBe('celana');
    expect(passedItem.target_live_price).toBe(200000);
    expect(passedItem.floor_price).toBe(170000);

    // Test inspectQCItem with commission_split
    const inspectedItem = store.inspectQCItem({
      batchId: 'batch-001',
      consignorId: 'user-ratna-01',
      title: 'Coach Leather Handbag Brown',
      brand: 'Coach',
      size: 'All Size',
      categoryTier: 'tier_a',
      pricingModel: 'commission_split',
      itemTypeCategory: 'tas',
      consignorAskingPrice: 350000,
      commissionRatePercent: 10,
      floorPrice: 315000,
      targetLivePrice: 350000,
      passedQC: true,
      isSteamed: true,
    });

    expect(inspectedItem.pricing_model).toBe('commission_split');
    expect(inspectedItem.consignor_asking_price).toBe(350000);
    expect(inspectedItem.commission_rate_percent).toBe(10);
    expect(inspectedItem.item_type_category).toBe('tas');
    expect(inspectedItem.floor_price).toBe(315000);
    expect(inspectedItem.target_live_price).toBe(350000);
  });
});
