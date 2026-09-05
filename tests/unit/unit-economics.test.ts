import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { createMockItem, createMockSession } from '../fixtures/factories';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES } from '@/lib/constants';

describe('REG-FIN: Unit Economics & Platform Margin Calculation Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-FIN-01: Correctly calculates GMV, Gross Margin, Host Fees, and Platform Net Profit for sold items', () => {
    // 2 sold items:
    // Item 1: floor = 50.000, sold = 80.000
    // Item 2: floor = 40.000, sold = 70.000
    // Total GMV = 150.000
    // Total Floor = 90.000
    // Total Steam Fees (deducted from consignor) = 2 * 2.500 = 5.000
    // Total Consignor Net = 90.000 - 5.000 = 85.000
    // 1 Session with host base fee = 60.000
    // Total Host Commission = 2 * 2.000 = 4.000
    // Total Host Fees = 64.000
    // Platform Gross Margin = GMV (150.000) - Floor (90.000) + Steam (5.000) = 65.000
    // Platform Net Profit = Gross Margin (65.000) - Host Fees (64.000) = 1.000

    const item1 = createMockItem({
      id: 'fin-item-1',
      floor_price: 50000,
      sold_price: 80000,
      status: 'sold',
    });
    const item2 = createMockItem({
      id: 'fin-item-2',
      floor_price: 40000,
      sold_price: 70000,
      status: 'paid_out',
    });

    const session = createMockSession({
      id: 'fin-session',
      host_base_fee: 60000,
    });

    store.setData({
      items: [item1, item2],
      sessions: [session],
    });

    const eco = store.getUnitEconomics();

    expect(eco.itemsSold).toBe(2);
    expect(eco.totalGrossGMV).toBe(150000);
    expect(eco.totalSteamFees).toBe(5000);
    expect(eco.totalConsignorNet).toBe(85000);
    expect(eco.totalHostFees).toBe(64000);
    expect(eco.totalHostCommission).toBe(4000);
    expect(eco.totalPlatformGrossMargin).toBe(65000);
    expect(eco.totalPlatformNetProfit).toBe(1000);
    expect(eco.averageSoldPrice).toBe(75000);
    expect(eco.averageFloorPrice).toBe(45000);
  });

  it('REG-FIN-02: Returns zero metrics gracefully when no items have been sold', () => {
    store.setData({ items: [], sessions: [] });
    const eco = store.getUnitEconomics();

    expect(eco.itemsSold).toBe(0);
    expect(eco.totalGrossGMV).toBe(0);
    expect(eco.totalPlatformNetProfit).toBe(0);
    expect(eco.averageSoldPrice).toBe(0);
  });
});
