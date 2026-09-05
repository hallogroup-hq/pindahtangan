import { describe, it, expect, beforeEach } from 'vitest';
import { createTestStore } from '../helpers/test-store';
import { PindahTanganStore } from '@/lib/store';
import { BUSINESS_RULES } from '@/lib/constants';

describe('REG-LIVE: Host Live Controller & Selling Flow Tests', () => {
  let store: PindahTanganStore;

  beforeEach(() => {
    store = createTestStore();
  });

  it('REG-LIVE-01: setOnStageItem sets active item to on-stage and transitions ready_for_live to in_live_queue', () => {
    store.setOnStageItem('item-01');
    const onStage = store.getOnStageItem();
    expect(onStage?.id).toBe('item-01');
    expect(onStage?.status).toBe('in_live_queue');
  });

  it('REG-LIVE-02: markItemSold updates item status to sold, creates an order, and updates session GMV and host commission', () => {
    const sessionBefore = store.getData().sessions.find((s) => s.id === 'session-live-01');
    const initialGMV = sessionBefore?.total_gmv || 0;
    const initialSold = sessionBefore?.total_items_sold || 0;
    const initialComm = sessionBefore?.host_commission_earned || 0;

    const { item, order } = store.markItemSold({
      itemId: 'item-02',
      liveSessionId: 'session-live-01',
      buyerHandle: '@siti_ootd',
      soldPrice: 75000,
      buyerName: 'Siti Sukabumi',
      buyerPhone: '0812-9876-5432',
    });

    // 1. Verify item properties
    expect(item.status).toBe('sold');
    expect(item.sold_price).toBe(75000);
    // Net payout: Floor price (40000) - steam fee (2500) = 37500
    expect(item.net_payout_amount).toBe(37500);
    expect(item.order_id).toBe(order.id);

    // 2. Verify order created
    expect(order.order_number).toMatch(/^ORD-\d{6}-\d{4}$/);
    expect(order.buyer_handle).toBe('@siti_ootd');
    expect(order.subtotal_amount).toBe(75000);
    expect(order.shipping_status).toBe('pending_pack');

    // 3. Verify session metrics updated
    const sessionAfter = store.getData().sessions.find((s) => s.id === 'session-live-01');
    expect(sessionAfter?.total_items_sold).toBe(initialSold + 1);
    expect(sessionAfter?.total_gmv).toBe(initialGMV + 75000);
    expect(sessionAfter?.host_commission_earned).toBe(
      initialComm + BUSINESS_RULES.HOST_COMMISSION_PER_PIECE
    );

    // 4. Verify audit trail log created
    const log = store.getData().logs.find((l) => l.item_id === 'item-02');
    expect(log).toBeDefined();
    expect(log?.to_status).toBe('sold');
  });

  it('REG-LIVE-03: coPilotAdjustPrice throws an error when trying to adjust price below Floor Price', () => {
    // item-02 has floor_price: 40000
    expect(() => {
      store.coPilotAdjustPrice('item-02', 30000);
    }).toThrow(/Floor Price/);
  });

  it('REG-LIVE-04: coPilotAdjustPrice successfully updates target live price when >= floor price', () => {
    store.coPilotAdjustPrice('item-02', 55000);
    const item = store.getData().items.find((i) => i.id === 'item-02');
    expect(item?.target_live_price).toBe(55000);
  });

  it('REG-LIVE-05: skipLiveItem moves active item to the back of the items list', () => {
    const initialFirstItemId = store.getData().items[0].id;
    store.skipLiveItem(initialFirstItemId);

    const items = store.getData().items;
    const lastItem = items[items.length - 1];
    expect(lastItem.id).toBe(initialFirstItemId);
  });

  it('REG-LIVE-06: getHostPayrollSummary calculates base fee + commission per piece correctly', () => {
    const summaries = store.getHostPayrollSummary();
    expect(summaries.length).toBeGreaterThan(0);

    const hostSummary = summaries[0];
    expect(hostSummary.baseFee).toBe(BUSINESS_RULES.HOST_BASE_FEE_PER_SHIFT); // Rp 60.000
    expect(hostSummary.commissionFee).toBe(
      hostSummary.itemsSold * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE
    );
    expect(hostSummary.totalEarnings).toBe(hostSummary.baseFee + hostSummary.commissionFee);
  });

  it('REG-LIVE-07: getRunSheetForSession and setRunSheetHangerOrder manage hanger numbering and stage tracking', () => {
    store.setRunSheetHangerOrder('session-live-01', ['item-01', 'item-02']);
    store.setOnStageItem('item-01');

    const runSheet = store.getRunSheetForSession('session-live-01');
    expect(runSheet.length).toBeGreaterThan(0);
    expect(runSheet[0].item.id).toBe('item-01');
    expect(runSheet[0].hangerNumber).toBe(1);
    expect(runSheet[0].isOnStage).toBe(true);

    expect(runSheet[1].item.id).toBe('item-02');
    expect(runSheet[1].hangerNumber).toBe(2);
    expect(runSheet[1].isOnStage).toBe(false);
  });
});

