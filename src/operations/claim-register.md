# 📝 PindahTangan — Claim Register: Reject & Disposition

**Version:** 1.0  
**Pilot:** Kota Sukabumi  
**Effective:** Start of pilot batch operations  
**Owner:** Studio Operations Lead  
**Auditor:** Akmal (Founder) — tiap batch review  

---

## 1. Purpose

Claim Register mencatat setiap item yang **TIDAK Lolos QC (rejected)** beserta pilihan pemilik pakaian untuk:
- **Donate:** Didaur ulang tekstil ramah lingkungan
- **Reclaim:** Diambil kembali saat pencairan gajian Jumat

Register ini memastikan:
- Transparansi bagi konsignor apa yang terjadi dengan item mereka
- Audit trail lengkap untuk setiap transaksi reject
- Komitmen kita tentang destinasian barang yang tidak jual

---

## 2. Register Structure

Setiap item reject memiliki entri register berikut:

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `item_id` | UUID | `clothes_items.id` | `a1b2c3d4-...` |
| `sku` | TEXT | `clothes_items.sku` | `PT-SM-001-042` |
| `title` | TEXT | `clothes_items.title` | `Zara Floral Blouse` |
| `brand` | TEXT | `clothes_items.brand` | `Zara` |
| `reject_reason` | TEXT | QC Inspector | `Noda Minyak / Tinta Permanen` |
| `reject_action` | ENUM | `reject_resolution` | `donate` atau `reclaim` |
| `defect_notes` | TEXT | QC Inspector | `Noda di siku kiri, 2cm` |
| `defect_photo_url` | TEXT | QC Photo upload | `https://.../defect_042.jpg` |
| `consignor_id` | UUID | `clothes_items.consignor_id` | `p1e2r3t4-...` |
| `consignor_name` | TEXT | `profiles.full_name` | `Ibu Ratna Dewi` |
| `conspector_phone` | TEXT | `profiles.phone_number` | `+62 812-3456-7890` |
| `resolution_timestamp` | TIMESTAMPTZ | Saat action di-set | `2026-09-10 14:30:00+07` |
| `resolved_by` | TEXT | Staff name | `Studio Staff A` |
| `donation_destination` | TEXT | Jika action=donate | `Bank Sampah Sukabumi / Partner A` |
| `reclaim_pickup_date` | DATE | Jika action=reclaim | `2026-09-15` |
| `reclaim_receipt_url` | TEXT | Jika action=reclaim | `https://.../receipt_042.pdf` |

**Primary Key:** `(item_id, reject_action)`

---

## 3. Workflow: Reject → Donate

| Step | Action | System | Staff | Evidence |
|------|--------|--------|-------|----------|
| 3.1 | QC menolak item → status berubah ke `rejected` | Auto | ✅ | Item status log |
| 3.2 | Tampilkan DefectModal ke konsignor | Modal | ✅ | Modal open log |
| 3.3 | Konsignor memilih **Donasi daur ulang** | User action | ✅ | DefectModal `onResolve('donate')` |
| 3.4 | Set `reject_resolution = 'donate'` di item record | System | ✅ | DB update |
| 3.5 | Catat ke Claim Register: <br>• `reject_action = 'donate'` <br>• `donation_destination = 'Partner X'` <br>• `resolved_by = Staff name` | System | ✅ | Register entry created |
| 3.6 | Kirim notifikasi WhatsApp: <br>• "Item tidak lolos QC, kami daur ulang"<br>• Foto cacat <br>• Terima kasih | System | ✅ | WhatsApp message log |
| 3.7 | Item destinasi: <br>• Didaur ulang ke partener daur ulang tekstil <br>• Buku taman buku catatan | Operations | ✅ | Donation receipt |

---

## 4. Workflow: Reject → Reclaim (Ambil Kembali Saat Payout)

| Step | Action | System | Staff | Evidence |
|------|--------|--------|-------|----------|
| 4.1 | QC menolak item → status berubah ke `rejected` | Auto | ✅ | Item status log |
| 4.2 | Tampilkan DefectModal ke konsignor | Modal | ✅ | Modal open log |
| 4.3 | Konsignor memilih **Ambil Kembali Saat Payout Jumat** | User action | ✅ | DefectModal `onResolve('reclaim')` |
| 4.4 | Set `reject_resolution = 'reclaim'` di item record | System | ✅ | DB update |
| 4.5 | Catat ke Claim Register: <br>• `reject_action = 'reclaim'` <br>• `reclaim_pickup_date = <tanggal payout>` <br>• `resolved_by = Staff name` | System | ✅ | Register entry created |
| 4.6 | Catat `reclaim_receipt_url` saat pengambilan | System | ✅ | PDF receipt generated |
| 4.7 | Item status: disiapkan di rack pickup <br>• Tanggal samar di portal pemilik | System | ✅ | Rack location update |
| 4.8 | Kirim notifikasi WhatsApp: <br>• "Item siap diambil di payout Jumat"<br>• Lokasi rack & jam <br>• Bawa KTP | System | ✅ | WhatsApp message log |

---

## 5. Claim Register Report (Mingguan)

Dihasilkan setiap akhir pekan oleh Studio Operations.

| Metric | Formula | Target | Actual (Week X) |
|--------|---------|--------|-----------------|
| Total Reject Count | `COUNT(*) FROM clothes_items WHERE status = 'rejected'` | ≤ 10% dari total incoming | |
| Donate % | `COUNT(*) WHERE reject_action = 'donate' / Total Reject` | ≥ 70% | |
| Reclaim % | `COUNT(*) WHERE reject_action = 'reclaim' / Total Reject` | ≤ 30% | |
| Reclaim Compliance | `% reclaim dengan receipt diambil` | 100% | |
| Avg Defect Reason Distribution | Group by `reject_reason` | — | Top 3: | |
| WhatsApp Notifikasi Delivered | `% pesan terkirim terbuka` | ≥ 95% | |

**Report Format:** CSV + PDF + WhatsApp broadcast ke semua konsignor aktif.

---

## 6. Data Integrity & Audit

| Check | Frequency | Owner |
|-------|-----------|-------|
| Setiap item rejected harus punya 1 entri Claim Register | Setiap batch | Studio Staff |
| `defect_photo_url` wajib ada bila `reject_action = 'donate'` | Setiap reject | QC Inspector |
| `reclaim_receipt_url` wajib ada bila `reject_action = 'reclaim'` | Saat pengambilan | Admin |
| Setiap entry memiliki `resolved_by` + `resolution_timestamp` | Setiap entry | System |
| WhatsApp notifikasi terkirim ke setiap consignor reject | Setiap entry | System |
| Claim Register data cocok dengan `clothes_items.reject_resolution` | Bulanan | Auditor |

**Error Handling:**
- Jika Claim Register entry kehilangan `item_id` → hapus item + lapor ke Auditor
- Jika `reject_action` tidak konsisten dengan `clothes_items.reject_resolution` → fix DB + lapor ke Founder
- Jika WhatsApp gagal terkirim → coba ulang 3x + catat error log

---

## 7. Pilot Gates — Claim Register Ready

**Claim Register hanya di-operasikan setelah:**

| Gate | Condition | Status |
|------|-----------|--------|
| CR1 | DefectModal component build & tested | ✅ Lihat `src/components/admin/DefectModal.tsx` |
| CR2 | `reject_resolution` field ada di types `src/lib/types.ts:119` | ✅ `reject_resolution?: RejectAction | null` |
| CR3 | `onResolve` callback terbaca dari DefectModal | ✅ Lihat `DefectModal.tsx:11` |
| CR4 | Claim Register template dibuat (file ini) | ✅ Selesai |
| CR5 | WhatsApp template untuk reject siap | ✅ Akan digenerate saat need |
| CR6 | Ren deliberate unblock claim register gate | ⬜ Belum |

**Signed:** _______________________ (Ren)  
**Date:** _______________________  
**Claim Register Gate:** _______________________ (check when unblocked)