import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { createMockOrder, createMockItem } from '../fixtures/factories';
import { PindahTanganStore } from '@/lib/store';

describe('REG-FUL: Fulfillment, Packing, & Courier Dispatch Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-FUL-01: verifyPackingBarcode matches SKU, updates item to packed and returns matched=true', () => {
    const order = createMockOrder({ id: 'ord-test-01', shipping_status: 'pending_pack' });
    const item = createMockItem({
      id: 'item-test-01',
      order_id: 'ord-test-01',
      sku: 'PT-SM-001-042',
      status: 'sold',
    });

    store.setData({ orders: [order], items: [item] });

    const scanResult = store.verifyPackingBarcode('ord-test-01', 'PT-SM-001-042');
    expect(scanResult.matched).toBe(true);
    expect(scanResult.message).toContain('VERIFIKASI SUKSES');

    const updatedItem = store.getData().items.find((i) => i.id === 'item-test-01');
    expect(updatedItem?.status).toBe('packed');
  });

  it('REG-FUL-02: verifyPackingBarcode rejects mismatched barcode and does not mutate item status', () => {
    const order = createMockOrder({ id: 'ord-test-02', shipping_status: 'pending_pack' });
    const item = createMockItem({
      id: 'item-test-02',
      order_id: 'ord-test-02',
      sku: 'PT-SM-001-042',
      status: 'sold',
    });

    store.setData({ orders: [order], items: [item] });

    // Operator accidentally scans different SKU
    const scanResult = store.verifyPackingBarcode('ord-test-02', 'PT-SM-002-099');
    expect(scanResult.matched).toBe(false);
    expect(scanResult.message).toContain('VERIFIKASI GAGAL');

    const updatedItem = store.getData().items.find((i) => i.id === 'item-test-02');
    expect(updatedItem?.status).toBe('sold'); // still sold, not packed
  });

  it('REG-FUL-03: updateShippingStatus updates tracking number and order status', () => {
    const order = createMockOrder({ id: 'ord-test-03', shipping_status: 'pending_pack' });
    store.setData({ orders: [order] });

    store.updateShippingStatus('ord-test-03', 'shipped', 'JT1234567890');

    const updated = store.getData().orders.find((o) => o.id === 'ord-test-03');
    expect(updated?.shipping_status).toBe('shipped');
    expect(updated?.tracking_number).toBe('JT1234567890');
  });

  it('REG-FUL-04: bulkDispatchOrders dispatches multiple orders and applies courier-specific tracking prefixes', () => {
    const ord1 = createMockOrder({ id: 'ord-bulk-1', shipping_status: 'pending_pack' });
    const ord2 = createMockOrder({ id: 'ord-bulk-2', shipping_status: 'pending_pack' });
    const item1 = createMockItem({ id: 'i1', order_id: 'ord-bulk-1', status: 'packed' });
    const item2 = createMockItem({ id: 'i2', order_id: 'ord-bulk-2', status: 'packed' });

    store.setData({ orders: [ord1, ord2], items: [item1, item2] });

    // Dispatch via J&T Express
    const resultJT = store.bulkDispatchOrders(['ord-bulk-1'], 'J&T Express');
    expect(resultJT.count).toBe(1);
    expect(resultJT.trackingNumbers['ord-bulk-1']).toMatch(/^JT\d+/);

    // Dispatch via Gosend Sukabumi
    const resultGoSend = store.bulkDispatchOrders(['ord-bulk-2'], 'Gosend Sukabumi');
    expect(resultGoSend.count).toBe(1);
    expect(resultGoSend.trackingNumbers['ord-bulk-2']).toMatch(/^GS-SKB-\d+/);

    // Verify both orders and items are marked shipped
    const data = store.getData();
    expect(data.orders.every((o) => o.shipping_status === 'shipped')).toBe(true);
    expect(data.items.every((i) => i.status === 'shipped')).toBe(true);
  });
});
