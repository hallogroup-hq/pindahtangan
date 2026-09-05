import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { PindahTanganStore } from '@/lib/store';
import { AdminTier } from '@/lib/types';

describe('REG-SEC: RBAC & Persona Multi-Role Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-SEC-01: Switching active user switches profile role correctly', () => {
    store.setActiveUser('user-siti-host');
    const user = store.getActiveUser();
    expect(user.id).toBe('user-siti-host');
    expect(user.role).toBe('host');

    store.setActiveUser('user-admin-finance');
    const adminUser = store.getActiveUser();
    expect(adminUser.id).toBe('user-admin-finance');
    expect(adminUser.role).toBe('admin');
  });

  it('REG-SEC-02: Switching admin tier updates currentAdminTier state correctly', () => {
    const tiers: AdminTier[] = ['superadmin', 'finance', 'studio_lead', 'logistics'];

    tiers.forEach((tier) => {
      store.setCurrentAdminTier(tier);
      expect(store.getCurrentAdminTier()).toBe(tier);
    });
  });

  it('REG-SEC-03: Defaults gracefully if non-existent active user ID is provided', () => {
    store.setActiveUser('non-existent-user-id');
    const user = store.getActiveUser();
    expect(user).toBeDefined();
    expect(user.id).toBe('user-ratna-01'); // falls back to first profile
  });
});
