import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES, SUKABUMI_DISTRICTS } from '@/lib/constants';

describe('REG-INT: Intake & Booking Flow Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-INT-01: Books intake batch with >= 20 pcs (Eligible for Free Sukabumi Pickup)', () => {
    const result = store.bookIntakeBatch({
      consignorName: 'Ibu Ratna Dewi',
      phoneNumber: '0812-8899-7711',
      pickupAddress: 'Jl. Surya Kencana No. 45',
      district: SUKABUMI_DISTRICTS[0], // Kecamatan Cikole
      pickupDate: '2026-09-10',
      estimatedCount: 25,
      notes: 'Baju gamis pesta dan blouse kantor',
    });

    expect(result.batch).toBeDefined();
    expect(result.batch.status).toBe('scheduled');
    expect(result.batch.estimated_count).toBe(25);
    expect(result.batch.estimated_count).toBeGreaterThanOrEqual(BUSINESS_RULES.FREE_PICKUP_THRESHOLD);
    expect(result.batch.batch_code).toMatch(/^BATCH-\d{6}-\d{3}$/);
    expect(result.consignor.full_name).toBe('Ibu Ratna Dewi');

    // Verify stored in state
    const data = store.getData();
    expect(data.batches.some((b) => b.id === result.batch.id)).toBe(true);
    expect(store.getActiveUser().id).toBe(result.consignor.id);
  });

  it('REG-INT-02: Books intake batch with < 20 pcs (Self Drop-off or Standard Courier)', () => {
    const result = store.bookIntakeBatch({
      consignorName: 'Ibu Anisa Melati',
      phoneNumber: '0857-1122-3344',
      pickupAddress: 'Jl. Bhayangkara No. 18',
      district: 'Kecamatan Gunungpuyuh',
      pickupDate: '2026-09-12',
      estimatedCount: 15,
      notes: 'Dress santai',
    });

    expect(result.batch.estimated_count).toBe(15);
    expect(result.batch.estimated_count).toBeLessThan(BUSINESS_RULES.FREE_PICKUP_THRESHOLD);
    expect(result.batch.status).toBe('scheduled');
  });

  it('REG-INT-03: Reuses existing consignor profile matching by sanitized phone number', () => {
    // First booking
    const res1 = store.bookIntakeBatch({
      consignorName: 'Ibu Ratna Dewi',
      phoneNumber: '0812-8899-7711',
      pickupAddress: 'Jl. Surya Kencana No. 45',
      district: 'Kecamatan Cikole',
      pickupDate: '2026-09-10',
      estimatedCount: 20,
    });

    // Second booking with different formatting
    const res2 = store.bookIntakeBatch({
      consignorName: 'Ratna D.',
      phoneNumber: '081288997711',
      pickupAddress: 'Jl. Surya Kencana No. 45',
      district: 'Kecamatan Cikole',
      pickupDate: '2026-09-20',
      estimatedCount: 22,
    });

    expect(res2.consignor.id).toBe(res1.consignor.id);
  });

  it('REG-INT-04: Studio intake reception updates actual count and advances status to in_qc', () => {
    const { batch } = store.bookIntakeBatch({
      consignorName: 'Ibu Fitri',
      phoneNumber: '0813-9988-0011',
      pickupAddress: 'Jl. Otista No. 5',
      district: 'Kecamatan Citamiang',
      pickupDate: '2026-09-10',
      estimatedCount: 25,
    });

    // Studio staff counts 24 physical items upon unbagging
    store.receiveBatch(batch.id, 24);

    const updated = store.getData().batches.find((b) => b.id === batch.id);
    expect(updated?.status).toBe('in_qc');
    expect(updated?.actual_count).toBe(24);
  });

  it('REG-INT-05: updateBatchActualCount adjusts count and appends discrepancy note', () => {
    const { batch } = store.bookIntakeBatch({
      consignorName: 'Ibu Dewi',
      phoneNumber: '0813-0000-1111',
      pickupAddress: 'Jl. Veteran',
      district: 'Kecamatan Baros',
      pickupDate: '2026-09-10',
      estimatedCount: 30,
    });

    store.updateBatchActualCount(batch.id, 28, '2 pcs jaket kulit tidak memenuhi standar');

    const updated = store.getData().batches.find((b) => b.id === batch.id);
    expect(updated?.actual_count).toBe(28);
    expect(updated?.notes).toContain('2 pcs jaket kulit tidak memenuhi standar');
  });

  it('REG-INT-06: completeBatchIntake transitions status to completed', () => {
    const { batch } = store.bookIntakeBatch({
      consignorName: 'Ibu Maya',
      phoneNumber: '0813-2222-3333',
      pickupAddress: 'Jl. Siliwangi',
      district: 'Kecamatan Cikole',
      pickupDate: '2026-09-10',
      estimatedCount: 20,
    });

    store.completeBatchIntake(batch.id);

    const updated = store.getData().batches.find((b) => b.id === batch.id);
    expect(updated?.status).toBe('completed');
  });
});
