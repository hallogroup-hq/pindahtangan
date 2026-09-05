// =================================================================
// PINDAHTANGAN WHATSAPP AUTOMATION & DISPATCH ENGINE
// Multi-Provider Support: Fonnte API, Wablas API & Direct wa.me Fallback
// =================================================================

import { formatIDR } from './utils';

export type WhatsAppEventType =
  | 'BOOKING_CONFIRMATION'
  | 'QC_REJECT_ALERT'
  | 'LIVE_SOLD_CONGRATS'
  | 'FRIDAY_PAYOUT_SLIP'
  | 'ORDER_SHIPPED_BUYER';

export interface WhatsAppMessageLog {
  id: string;
  eventType: WhatsAppEventType;
  recipientPhone: string;
  recipientName: string;
  messageText: string;
  mediaUrl?: string;
  waLink: string;
  status: 'sent' | 'delivered' | 'queued' | 'simulated';
  provider: 'fonnte' | 'wablas' | 'sandbox';
  sentAt: string;
}

// -----------------------------------------------------------------
// 1. CANONICAL MESSAGE TEMPLATES (Warm, Polite, Indonesian Native)
// -----------------------------------------------------------------

export function formatBookingConfirmationMessage(params: {
  consignorName: string;
  batchCode: string;
  count: number;
  pickupAddress: string;
  pickupDate: string;
  pickupSlot: string;
}): string {
  const slotText = params.pickupSlot === 'pagi' ? 'Pagi (09.00 – 12.00 WIB)' : 'Siang (13.30 – 16.30 WIB)';
  return `Halo Ibu *${params.consignorName}*, salam hangat dari *PindahTangan Sukabumi* 👗✨

Terima kasih telah mempercayakan lemari pakaian Anda kepada kami. Booking penjemputan lemari Anda telah kami jadwalkan:

📦 *Detail Penjemputan:*
• Kode Batch: *${params.batchCode}*
• Estimasi Pakaian: *${params.count} potong*
• Jadwal Jemput: *${params.pickupDate}*
• Slot Waktu: *${slotText}*
• Alamat: *${params.pickupAddress}*

🛵 Kurir internal kami akan membawa kantong khusus dan menghubungi Anda 30 menit sebelum tiba di lokasi.

Pantau status kurasi dan sterilisasi cuci uap pakaian Anda secara langsung di portal:
🔗 https://pindahtangan-zeta.vercel.app/portal

Ada pertanyaan atau titipan tambahan? Balas pesan ini ya Bu! 🙏`;
}

export function formatQcRejectAlertMessage(params: {
  consignorName: string;
  itemTitle: string;
  defectNotes: string;
  defectPhotoUrl?: string;
  portalUrl?: string;
}): string {
  return `Halo Ibu *${params.consignorName}*, update kurasi dari *Studio QC PindahTangan Sukabumi* 🔍

Saat proses screening 5 parameter kualitas dan sterilisasi uap, tim kurator menemukan cacat pada pakaian berikut:

👗 *Pakaian:* *${params.itemTitle}*
⚠️ *Catatan Cacat:* ${params.defectNotes}
${params.defectPhotoUrl ? `📸 *Foto Bukti Cacat:* ${params.defectPhotoUrl}\n` : ''}
Untuk menjaga kualitas butik siaran Live TikTok, pakaian ini belum lolos masuk etalase. Mohon pilih opsi penanganan di portal:
1. *Relakan untuk Didonasi / Daur Ulang*, ATAU
2. *Ambil Kembali Saat Payout Jumat di Studio*

Tentukan pilihan Anda di:
🔗 ${params.portalUrl || 'https://pindahtangan-zeta.vercel.app/portal'}

Terima kasih atas pengertian dan kerjasamanya Bu! 🙏`;
}

export function formatLiveSoldCongratsMessage(params: {
  consignorName: string;
  itemTitle: string;
  hangtagNumber: number;
  soldPrice: number;
  floorPrice: number;
  netPayout: number;
}): string {
  return `Kabar Gembira! Baju Anda Terjual di Live TikTok! 🎉💃

Halo Ibu *${params.consignorName}*,
Pakaian dari lemari Anda baru saja laku terjual pada siaran Live TikTok Shopping PindahTangan Sukabumi:

✨ *Detail Item Terjual:*
• Pakaian: *${params.itemTitle}* (Gantungan #${params.hangtagNumber})
• Harga Laku Live: *${formatIDR(params.soldPrice)}*
• Hak Bersih (Floor Price): *${formatIDR(params.floorPrice)}*
• Transfer Bersih (setelah uap Rp 2.500): *${formatIDR(params.netPayout)}*

Dana penjualan ini telah diamankan di rekening escrow dan akan otomatis ditransfer pada:
🗓️ *Jumat Sore pukul 16.00 WIB*

Cek saldo lemarimu:
🔗 https://pindahtangan-zeta.vercel.app/portal`;
}

export function formatFridayPayoutSlipMessage(params: {
  consignorName: string;
  payoutCode: string;
  periodStart: string;
  periodEnd: string;
  itemsCount: number;
  grossFloor: number;
  steamDeduction: number;
  netPayout: number;
  bankName: string;
  accountNumber: string;
}): string {
  return `SLIP RESMI TRANSFER GAJIAN JUMAT — PINDAHTANGAN 💰✨

Halo Ibu *${params.consignorName}*,
Dana hasil penjualan pakaian konsinyasi Anda untuk periode *${params.periodStart}* s/d *${params.periodEnd}* telah BERHASIL ditransfer ke rekening Anda.

📋 *Rincian Transfer Hak Bersih:*
• Kode Payout: *${params.payoutCode}*
• Total Baju Laku: *${params.itemsCount} potong*
• Akumulasi Floor Price: *${formatIDR(params.grossFloor)}*
• Deduksi Sterilisasi Cuci Uap: *-${formatIDR(params.steamDeduction)}*
---------------------------------------
💵 *TOTAL DANA DITRANSFER:* *${formatIDR(params.netPayout)}*

🏦 *Rekening Tujuan:*
• Bank: *${params.bankName}*
• No. Rekening: *${params.accountNumber}*
• Status: *LUNAS (Transferred)*

Terima kasih telah menjadi bagian dari fesyen sirkular Sukabumi. Buka lemari Anda lagi untuk penjemputan batch berikutnya ya Bu!

Salam hangat,
*Finance PindahTangan Hub Sukabumi*
Jl. Siliwangi No. 102, Cikole, Kota Sukabumi`;
}

export function formatOrderShippedMessage(params: {
  buyerName: string;
  buyerHandle: string;
  orderNumber: string;
  courierName: string;
  trackingNumber: string;
  itemsCount: number;
}): string {
  return `Halo Kak *${params.buyerName}* (${params.buyerHandle})! Paket OOTD Kamu Sedang Menuju ke Rumah 📦🛵

Pesanan dari siaran Live TikTok Shopping *PindahTangan Sukabumi* telah selesai diverifikasi barcode dan diserahkan ke ekspedisi.

📋 *Rincian Pengiriman:*
• No. Pesanan: *${params.orderNumber}*
• Jumlah Baju: *${params.itemsCount} potong (steril uap >100°C)*
• Ekspedisi: *${params.courierName}*
• No. Resi (AWB): *${params.trackingNumber}*

Lacak paket Anda melalui aplikasi ekspedisi atau hubungi kurir saat paket tiba.
Terima kasih sudah berbelanja fesyen kurasi di PindahTangan! ✨`;
}

// -----------------------------------------------------------------
// 2. DISPATCH ENGINE (Direct URL or API Gateway)
// -----------------------------------------------------------------

export function createDirectWhatsAppLink(phoneNumber: string, message: string): string {
  let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export async function sendWhatsAppNotification(params: {
  eventType: WhatsAppEventType;
  recipientPhone: string;
  recipientName: string;
  messageText: string;
  mediaUrl?: string;
}): Promise<{
  success: boolean;
  messageLog: WhatsAppMessageLog;
}> {
  const waLink = createDirectWhatsAppLink(params.recipientPhone, params.messageText);
  const logId = `wa-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

  const log: WhatsAppMessageLog = {
    id: logId,
    eventType: params.eventType,
    recipientPhone: params.recipientPhone,
    recipientName: params.recipientName,
    messageText: params.messageText,
    mediaUrl: params.mediaUrl,
    waLink,
    status: 'simulated',
    provider: 'sandbox',
    sentAt: new Date().toISOString(),
  };

  // Attempt server API route if available
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: params.recipientPhone,
          message: params.messageText,
          mediaUrl: params.mediaUrl,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        log.status = result.status || 'delivered';
        log.provider = result.provider || 'sandbox';
      }
    } catch {
      // Graceful fallback to sandbox simulation
      log.status = 'queued';
    }
  }

  return { success: true, messageLog: log };
}
