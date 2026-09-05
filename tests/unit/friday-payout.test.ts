import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { createMockItem } from '../fixtures/factories';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES } from '@/lib/constants';

describe('REG-PAY: Friday Payout Engine & Banking Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-PAY-01: executeFridayPayout aggregates gross floor, deducts steam fee, and updates status to paid_out', () => {
    // Setup 2 sold items for user-ratna-01
    const soldItem1 = createMockItem({
      id: 'sold-1',
      consignor_id: 'user-ratna-01',
      floor_price: 60000,
      steam_fee: 2500,
      status: 'sold',
      payout_id: null,
    });
    const soldItem2 = createMockItem({
      id: 'sold-2',
      consignor_id: 'user-ratna-01',
      floor_price: 40000,
      steam_fee: 2500,
      status: 'sold',
      payout_id: null,
    });

    store.setData({ items: [soldItem1, soldItem2] });

    const payouts = store.executeFridayPayout();
    expect(payouts.length).toBe(1);

    const payout = payouts[0];
    expect(payout.consignor_id).toBe('user-ratna-01');
    expect(payout.items_count).toBe(2);
    expect(payout.total_gross_floor).toBe(100000); // 60000 + 40000
    expect(payout.total_steam_deduction).toBe(5000); // 2 * 2500
    expect(payout.total_net_payout).toBe(95000); // 100000 - 5000
    expect(payout.payout_code).toMatch(/^PAY-\d{8}-\d{3}$/);
    expect(payout.status).toBe('transferred');

    // Verify items in store are updated to paid_out
    const updatedItems = store.getData().items;
    expect(updatedItems.every((i) => i.status === 'paid_out')).toBe(true);
    expect(updatedItems.every((i) => i.payout_id === payout.id)).toBe(true);
  });

  it('REG-PAY-02: executeFridayPayout is idempotent - does not double-payout items', () => {
    const soldItem = createMockItem({
      id: 'sold-once',
      consignor_id: 'user-ratna-01',
      floor_price: 50000,
      status: 'sold',
      payout_id: null,
    });

    store.setData({ items: [soldItem] });

    const firstRun = store.executeFridayPayout();
    expect(firstRun.length).toBe(1);

    // Second execution immediately after
    const secondRun = store.executeFridayPayout();
    expect(secondRun.length).toBe(0);
  });

  it('REG-PAY-03: updateBankDetails updates destination account info on consignor profile', () => {
    store.updateBankDetails({
      userId: 'user-ratna-01',
      bankName: 'Bank Mandiri',
      accountNumber: '1320098271625',
      accountHolder: 'Ratna Dewi S.',
    });

    const user = store.getData().profiles.find((p) => p.id === 'user-ratna-01');
    expect(user?.bank_name).toBe('Bank Mandiri');
    expect(user?.bank_account_number).toBe('1320098271625');
    expect(user?.bank_account_holder).toBe('Ratna Dewi S.');
  });

  it('REG-PAY-04: exportBankDisbursementCSV formats BCA and Mandiri bulk disbursement headers', () => {
    // Seed at least one payout
    const soldItem = createMockItem({
      id: 'sold-bca',
      consignor_id: 'user-ratna-01',
      floor_price: 50000,
      status: 'sold',
    });
    store.setData({ items: [soldItem] });
    store.executeFridayPayout();

    const bcaCsv = store.exportBankDisbursementCSV('bca');
    expect(bcaCsv).toContain('RekeningTujuan,NamaPenerima,Nominal,Keterangan,RefCode');
    expect(bcaCsv).toContain('0281928471');

    const mandiriCsv = store.exportBankDisbursementCSV('mandiri');
    expect(mandiriCsv).toContain('BenAccountNo,BenName,Amount,Currency,Remark1,Remark2');
    expect(mandiriCsv).toContain('IDR');
  });

  it('REG-PAY-05: exportAccountingCSV exports sales, payouts, and inventory data', () => {
    const salesCsv = store.exportAccountingCSV('sales');
    expect(salesCsv).toContain('OrderNumber,Date,BuyerHandle');

    const payoutsCsv = store.exportAccountingCSV('payouts');
    expect(payoutsCsv).toContain('PayoutCode,Date,Consignor,Bank');

    const inventoryCsv = store.exportAccountingCSV('inventory');
    expect(inventoryCsv).toContain('SKU,Hangtag,Title,Brand');
  });
});
