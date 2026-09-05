import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { createMockItem } from '../fixtures/factories';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES } from '@/lib/constants';

describe('REG-AGE: 30-Day Retention & Obral Ceban Buyout Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-AGE-01: buyoutAgedItem transitions status to bought_out and fixes payout at Rp 10.000', () => {
    // Create an item that has aged 31 days
    const pastDate = new Date(Date.now() - 31 * 86400000).toISOString().split('T')[0];
    const agedItem = createMockItem({
      id: 'aged-item-01',
      consignment_start_date: pastDate,
      aging_expiry_date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
      floor_price: 35000,
      status: 'ready_for_live',
    });

    store.setData({ items: [...store.getData().items, agedItem] });

    store.buyoutAgedItem(agedItem.id);

    const updated = store.getData().items.find((i) => i.id === agedItem.id);
    expect(updated?.status).toBe('bought_out');
    expect(updated?.sold_price).toBe(BUSINESS_RULES.BUYOUT_OBRAL_PRICE); // Rp 10.000
    expect(updated?.net_payout_amount).toBe(BUSINESS_RULES.BUYOUT_OBRAL_PRICE);
  });

  it('REG-AGE-02: Non-existent item id does not throw or corrupt state', () => {
    const itemsCountBefore = store.getData().items.length;
    store.buyoutAgedItem('non-existent-id');
    expect(store.getData().items.length).toBe(itemsCountBefore);
  });
});
