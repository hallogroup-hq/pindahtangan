import { describe, it, expect, beforeEach } from 'vitest';
import { getStore } from '@/lib/store';
import {
  formatBookingConfirmationMessage,
  formatQcRejectAlertMessage,
  formatLiveSoldCongratsMessage,
  formatFridayPayoutSlipMessage,
  formatOrderShippedMessage,
  createDirectWhatsAppLink,
} from '@/lib/whatsapp';
import { formatIDR } from '@/lib/utils';

describe('REG-WA: WhatsApp Automation & Multi-Event Dispatch Engine', () => {
  beforeEach(() => {
    getStore().resetToDefault();
  });

  describe('1. Canonical Message Template Formatters', () => {
    it('REG-WA-01: formatBookingConfirmationMessage renders accurate pickup slot and batch code', () => {
      const msg = formatBookingConfirmationMessage({
        consignorName: 'Ratna Dewi',
        batchCode: 'BATCH-20260906-01',
        count: 15,
        pickupAddress: 'Jl. Surya Kencana No. 45',
        pickupDate: 'Besok, 07 Sep 2026',
        pickupSlot: 'pagi',
      });

      expect(msg).toContain('*Ratna Dewi*');
      expect(msg).toContain('BATCH-20260906-01');
      expect(msg).toContain('15 potong');
      expect(msg).toContain('Pagi (09.00 – 12.00 WIB)');
      expect(msg).toContain('Jl. Surya Kencana No. 45');
      expect(msg).toContain('https://pindahtangan-zeta.vercel.app/portal');
    });

    it('REG-WA-02: formatQcRejectAlertMessage includes defect notes and portal link', () => {
      const msg = formatQcRejectAlertMessage({
        consignorName: 'Ratna Dewi',
        itemTitle: 'Zara Knit Top',
        defectNotes: 'Noda luntur di kerah belakang',
        defectPhotoUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a',
      });

      expect(msg).toContain('Zara Knit Top');
      expect(msg).toContain('Noda luntur di kerah belakang');
      expect(msg).toContain('📸 *Foto Bukti Cacat:*');
      expect(msg).toContain('Relakan untuk Didonasi / Daur Ulang');
      expect(msg).toContain('Ambil Kembali Saat Payout Jumat');
    });

    it('REG-WA-03: formatLiveSoldCongratsMessage displays accurate floor price and net payout', () => {
      const msg = formatLiveSoldCongratsMessage({
        consignorName: 'Ratna Dewi',
        itemTitle: 'Zara Floral Blouse',
        hangtagNumber: 1,
        soldPrice: 95000,
        floorPrice: 65000,
        netPayout: 62500,
      });

      expect(msg).toContain('Kabar Gembira! Baju Anda Terjual di Live TikTok!');
      expect(msg).toContain('Gantungan #1');
      expect(msg).toContain(formatIDR(95000));
      expect(msg).toContain(formatIDR(65000));
      expect(msg).toContain(formatIDR(62500));
      expect(msg).toContain('Jumat Sore pukul 16.00 WIB');
    });

    it('REG-WA-04: formatFridayPayoutSlipMessage shows deductions and bank account details', () => {
      const msg = formatFridayPayoutSlipMessage({
        consignorName: 'Ratna Dewi',
        payoutCode: 'PAY-20260905-001',
        periodStart: '29 Agu 2026',
        periodEnd: '05 Sep 2026',
        itemsCount: 4,
        grossFloor: 230000,
        steamDeduction: 10000,
        netPayout: 220000,
        bankName: 'BCA',
        accountNumber: '0281928471',
      });

      expect(msg).toContain('SLIP RESMI TRANSFER GAJIAN JUMAT');
      expect(msg).toContain('PAY-20260905-001');
      expect(msg).toContain('4 potong');
      expect(msg).toContain(formatIDR(230000));
      expect(msg).toContain(`-${formatIDR(10000)}`);
      expect(msg).toContain(formatIDR(220000));
      expect(msg).toContain('BCA');
      expect(msg).toContain('0281928471');
      expect(msg).toContain('Jl. Siliwangi No. 102, Cikole, Kota Sukabumi');
    });

    it('REG-WA-05: formatOrderShippedMessage formats buyer handle and courier resi', () => {
      const msg = formatOrderShippedMessage({
        buyerName: 'Siti OOTD',
        buyerHandle: '@siti_ootd',
        orderNumber: 'ORD-20260906-0042',
        courierName: 'J&T Express',
        trackingNumber: 'JT9182740192',
        itemsCount: 2,
      });

      expect(msg).toContain('*Siti OOTD* (@siti_ootd)');
      expect(msg).toContain('ORD-20260906-0042');
      expect(msg).toContain('J&T Express');
      expect(msg).toContain('JT9182740192');
      expect(msg).toContain('2 potong (steril uap >100°C)');
    });
  });

  describe('2. Direct wa.me Link Generation & MSISDN Formatting', () => {
    it('REG-WA-06: converts local 08... to 628... and escapes URI characters', () => {
      const link1 = createDirectWhatsAppLink('0812-8899-7711', 'Halo Ibu Ratna!');
      expect(link1).toContain('https://wa.me/6281288997711?text=Halo%20Ibu%20Ratna!');

      const link2 = createDirectWhatsAppLink('628571234567', 'Test');
      expect(link2).toContain('https://wa.me/628571234567?text=Test');
    });
  });

  describe('3. Store Event Hooks & WhatsApp Dispatch Log Recording', () => {
    it('REG-WA-07: bookIntakeBatch automatically dispatches BOOKING_CONFIRMATION log', () => {
      const store = getStore();
      const initialLogCount = store.getWhatsAppLogs().length;

      store.bookIntakeBatch({
        consignorName: 'Ratna Dewi',
        phoneNumber: '0812-8899-7711',
        pickupAddress: 'Jl. Surya Kencana No. 45',
        district: 'Kecamatan Cikole',
        pickupDate: '2026-09-10',
        estimatedCount: 20,
      });

      const updatedLogs = store.getWhatsAppLogs();
      expect(updatedLogs.length).toBe(initialLogCount + 1);
      expect(updatedLogs[0].eventType).toBe('BOOKING_CONFIRMATION');
      expect(updatedLogs[0].recipientPhone).toBe('0812-8899-7711');
      expect(updatedLogs[0].recipientName).toBe('Ibu Ratna Dewi');
    });

    it('REG-WA-08: qcRejectItem automatically dispatches QC_REJECT_ALERT log', () => {
      const store = getStore();
      const initialLogCount = store.getWhatsAppLogs().length;

      store.qcRejectItem({
        batchId: 'batch-001',
        consignorId: 'user-ratna-01',
        title: 'Zara Knit Top Cacat',
        brand: 'Zara',
        defectNotes: 'Noda oli membandel di dada',
        defectPhotoUrl: 'https://example.com/defect.jpg',
      });

      const updatedLogs = store.getWhatsAppLogs();
      expect(updatedLogs.length).toBe(initialLogCount + 1);
      expect(updatedLogs[0].eventType).toBe('QC_REJECT_ALERT');
      expect(updatedLogs[0].messageText).toContain('Noda oli membandel di dada');
      expect(updatedLogs[0].mediaUrl).toBe('https://example.com/defect.jpg');
    });

    it('REG-WA-09: markItemSold automatically dispatches LIVE_SOLD_CONGRATS log', () => {
      const store = getStore();
      const initialLogCount = store.getWhatsAppLogs().length;

      store.markItemSold({
        itemId: 'item-01',
        liveSessionId: 'session-live-01',
        buyerHandle: '@buyer_sukabumi',
        soldPrice: 95000,
      });

      const updatedLogs = store.getWhatsAppLogs();
      expect(updatedLogs.length).toBe(initialLogCount + 1);
      expect(updatedLogs[0].eventType).toBe('LIVE_SOLD_CONGRATS');
      expect(updatedLogs[0].messageText).toContain('Kabar Gembira! Baju Anda Terjual di Live TikTok!');
    });

    it('REG-WA-10: bulkDispatchOrders automatically dispatches ORDER_SHIPPED_BUYER log', () => {
      const store = getStore();
      const initialLogCount = store.getWhatsAppLogs().length;

      const order = store.getData().orders.find(
        (o) => o.shipping_status === 'pending_pack'
      );
      if (order) {
        store.bulkDispatchOrders([order.id], 'SiCepat BEST');

        const updatedLogs = store.getWhatsAppLogs();
        expect(updatedLogs.length).toBe(initialLogCount + 1);
        expect(updatedLogs[0].eventType).toBe('ORDER_SHIPPED_BUYER');
        expect(updatedLogs[0].messageText).toContain('SiCepat BEST');
        expect(updatedLogs[0].recipientPhone).toBe(order.buyer_phone);
      }
    });
  });
});
