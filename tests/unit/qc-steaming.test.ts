import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES, TIER_CONFIG } from '@/lib/constants';

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

  it('REG-QC-06: Tier configuration constants adhere to PRD v1.0 specifications', () => {
    expect(TIER_CONFIG.tier_a.minFloor).toBe(50000);
    expect(TIER_CONFIG.tier_a.maxFloor).toBe(120000);

    expect(TIER_CONFIG.tier_b.minFloor).toBe(25000);
    expect(TIER_CONFIG.tier_b.maxFloor).toBe(45000);

    expect(TIER_CONFIG.tier_c.minFloor).toBe(10000);
    expect(TIER_CONFIG.tier_c.maxFloor).toBe(20000);
  });
});
