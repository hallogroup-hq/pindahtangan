import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from '@/lib/useStore';
import { getStore } from '@/lib/store';

describe('REG-HOOK: React useStore Hook & Global Singleton Tests', () => {
  beforeEach(() => {
    getStore().resetToDefault();
  });

  it('REG-HOOK-01: getStore returns a singleton store instance', () => {
    const store1 = getStore();
    const store2 = getStore();
    expect(store1).toBe(store2);
    expect(store1.getData()).toBeDefined();
  });

  it('REG-HOOK-02: useStore initializes with active user and provides state access', () => {
    const { result } = renderHook(() => useStore());

    expect(result.current.data).toBeDefined();
    expect(result.current.activeUser).toBeDefined();
    expect(result.current.activeUser.id).toBe(result.current.data.activeUserId);
  });

  it('REG-HOOK-03: useStore reacts and re-renders when store state changes', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.setActiveUser('user-siti-host');
    });

    expect(result.current.activeUser.id).toBe('user-siti-host');
    expect(result.current.activeUser.role).toBe('host');
  });

  it('REG-HOOK-04: resetToDefault restores all entities to default seed state', () => {
    const store = getStore();
    // mutate state
    store.bookIntakeBatch({
      consignorName: 'Tester Mutate',
      phoneNumber: '0899-0000-1111',
      pickupAddress: 'Jl. Uji Coba',
      district: 'Kecamatan Cikole',
      pickupDate: '2026-09-01',
      estimatedCount: 15,
    });

    expect(store.getData().batches.some((b) => b.pickup_address === 'Jl. Uji Coba')).toBe(true);

    // reset
    store.resetToDefault();
    expect(store.getData().batches.some((b) => b.pickup_address === 'Jl. Uji Coba')).toBe(false);
  });
});
