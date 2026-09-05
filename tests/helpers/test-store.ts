import { PindahTanganStore, AppStoreData } from '@/lib/store';
import {
  createMockProfile,
  createMockBatch,
  createMockItem,
  createMockOrder,
  createMockSession,
} from '../fixtures/factories';

export function createTestStore(customData?: Partial<AppStoreData>): PindahTanganStore {
  const defaultTestData: AppStoreData = {
    profiles: [
      createMockProfile({ id: 'user-ratna-01', full_name: 'Ibu Ratna Dewi', role: 'consignor' }),
      createMockProfile({
        id: 'user-siti-host',
        full_name: 'Siti Talent Host',
        role: 'host',
      }),
      createMockProfile({
        id: 'user-admin-finance',
        full_name: 'Finance Admin',
        role: 'admin',
        admin_tier: 'finance',
      }),
      createMockProfile({
        id: 'user-admin-super',
        full_name: 'Super Admin',
        role: 'admin',
        admin_tier: 'superadmin',
      }),
    ],
    batches: [
      createMockBatch({ id: 'batch-001', consignor_id: 'user-ratna-01', status: 'completed' }),
    ],
    items: [
      createMockItem({
        id: 'item-01',
        batch_id: 'batch-001',
        consignor_id: 'user-ratna-01',
        sku: 'PT-SM-001-001',
        hangtag_number: 1,
        title: 'Zara Floral Blouse Katun',
        category_tier: 'tier_a',
        floor_price: 65000,
        target_live_price: 95000,
        status: 'ready_for_live',
      }),
      createMockItem({
        id: 'item-02',
        batch_id: 'batch-001',
        consignor_id: 'user-ratna-01',
        sku: 'PT-SM-001-002',
        hangtag_number: 2,
        title: 'Uniqlo Rayon Work Shirt',
        category_tier: 'tier_b',
        floor_price: 40000,
        target_live_price: 65000,
        status: 'in_live_queue',
      }),
    ],
    orders: [],
    payouts: [],
    sessions: [
      createMockSession({
        id: 'session-live-01',
        host_id: 'user-siti-host',
        is_active: true,
      }),
    ],
    logs: [],
    whatsappLogs: [],
    activeUserId: 'user-ratna-01',
    currentAdminTier: 'superadmin',
    activeLiveRunSheet: { 'session-live-01': ['item-02', 'item-01'] },
    onStageItemId: 'item-02',
  };

  const initialData = customData ? { ...defaultTestData, ...customData } : defaultTestData;
  // persistToLocalStorage = false to ensure complete in-memory isolation
  return new PindahTanganStore(initialData, false);
}
