# 📋 PindahTangan — Operations SOP: Intake & QC

**Version:** 1.0  
**Pilot:** Kota Sukabumi  
**Effective:** Start of pilot batch operations  
**Owner:** Studio Operations Lead  

---

## 1. Intake Kantong Masuk (Consignor Drop-off)

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 1.1 | Kurir delivers consignor bag(s) to studio intake table | Kurir / Studio Staff | — | Timestamp in delivery log |
| 1.2 | Verifikasi jumlah fisik pakaian riil (`actual_count`) terhadap daftar manifest | Studio Staff | ≤ 5 menit setelah tiba | Count verification form |
| 1.3 | Catat selisih estimasi vs actual (`estimated_count` vs `actual_count`) | Studio Staff | — | Discrepancy noted in batch record |
| 1.4 | Jika `actual_count >= 20`: tandai untuk **gratis jemput lemari** di 7 kecamatan Sukabumi | Studio Staff | — | Auto-applied in system |
| 1.5 | Set batch status ke `in_qc` dan kirim notifikasi ke konsignor | Studio Staff | — | System status update + WhatsApp notification |
| 1.6 | Isi `batch_notes` dengan kondisi kantong, kerusakan lihat, atau catatan khusus | Studio Staff | — | Text field in batch record |

**QC Gate:** Batch hanya melanjutkan ke stasiun QC jika `actual_count > 0` dan status `in_qc` tercatat.

---

## 2. Stasiun QC 3-Parameter & Cuci Uap Panas

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 2.1 | Masukkan setiap potong pakaian ke stasiun QC | Studio Staff | Secara berurutan | Queue log |
| 2.2 | **5 Parameter Fisik** — setiap potong divalidasi: <br>• `noStain`: Bebas noda permanen/jamur <br>• `noTear`: Bebas sobek/bolong kain <br>• `zipperGood`: Resleting lancar & gigi utuh <br>• `buttonsGood`: Kancing lengkap & tidak copot <br>• `noOdor`: Bebas bau apek/residue lemari | Studio Staff | Setiap potong ≤ 3 menit | Checklist checkbox state |
| 2.3 | Jika **semua 5 parameter lolos**: tanda `passedQC: true` | Studio Staff | — | System record |
| 2.4 | Jika **apa pun gagal**: pindahkan ke mode **Reject** <br>• Catat `defectReason` dari dropdown standar <br>• Catat `defectNotes` detail lokasi kerusakan <br>• Unggah `defectPhotoUrl` foto resolusi tinggi | Studio Staff | — | Photo + reason text in record |
| 2.5 | Jika lolos: **Sterilisasi uap panas >100°C** <br>• Tekan tombol "Konfirmasi Uap Panas Selesai" <br>• Status pakaian berubah ke `ready_for_live` <br>• Cetak hangtag thermal 10x15 cm otomatis | Studio Staff | ≤ 2 menit per potong | Steam confirmation timestamp + hangtag print log |
| 2.6 | Jika reject: <br>• Item status berubah ke `rejected` <br>• Foto cacat & catatan disimpan <br>• Konsignor diberi opsi: **Donasi daur ulang** atau **Ambil kembali saat payout Jumat** | Studio Staff | — | Reject record + DefectModal state |

**QC Gate:** Setiap potong harus memiliki checklist 5 parameter terisi (TRUE atau FALSE) sebelum status diproses.

---

## 3. Cetak Hangtag Thermal (10×15 cm)

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 3.1 | Set item status `ready_for_live` <br>• Auto-trigger hangtag generation | System / Studio Staff | — | Item status change log |
| 3.2 | Generate hangtag display number (`No. XX`) | System | — | `hangtag_number` auto-increment |
| 3.3 | Generate barcode SKU fisik (`PT-SM-001-042`) | System | — | Barcode printed on thermal label |
| 3.4 | Print thermal label 10×15 cm dengan data: <br>• Nomor display live <br>• SKU fisik <br>• Brand, Ukuran <br>• LD (Lingkar Dada) <br> • Kategori <br>• Floor price & Target live price <br>• Lokasi rak | Studio Staff | ≤ 1 menit per item | Print log + label file |
| 3.5 | Tempel hangtag ke gantungan baju fisik | Studio Staff | — | Visual verification |

**Gate:** Item hanya bergelindung status `ready_for_live` setelah hangtag terbit dan ditempel.

---

## 4. Antrean Live & Pemasaran

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 4.1 | Masukkan item ke antrean `in_live_queue` | Studio Staff | — | Item status update |
| 4.2 | Host lihat daftar hanger di tablet di depan ring-light <br>• Setiap hanger menampilkan: No. gantungan, SKU, Brand, Ukuran, LD cm | Host | — | Tablet display log |
| 4.3 | Tombol satu sentuh: <br>• `[🟢 MARK SOLD]` → input username pembeli + harga <br>• `[⏭️ SKIP / NEXT]` → geser ke antrean paling belakang | Host | Per transaksi ≤ 30 detik | Sale recording + queue shift log |
| 4.4 | Set status ke `sold` saat terjual <br>• Otomatis hitung laba platform <br>• Cetak slip transfer digital <br>• Update ledger payout | System / Studio Staff | — | Order + item status change |

---

## 5. Friday Payout Batch Engine (16:00 WIB)

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 5.1 | Cutoff penjualan: Kamis 23:59 WIB <br>• Baju laku Jumat masuk siklus pekan berikutnya | System | Otomatis | System clock |
| 5.2 | Filter item status `sold` tanpa `payout_id` | System | — | Query result |
| 5.3 | Agregasi per konsignor: <br>• Total Gross Floor Price <br>• Deduksi Biaya Cuci Uap: `items_count × Rp 2.500` <br>• Total Net Payout | System | — | CSV export result |
| 5.4 | Eksekusi batch: <br>• Generate `payout_code` (`PAY-YYYYMMDD-XXX`) <br>• Ubah status item ke `paid_out` <br>• Generate slip transfer digital <br>• Publish ke WhatsApp ke konsignor | System | ≤ 10 menit | Batch execution log + slip URLs |
| 5.5 | Download CSV BCA/Mandiri untuk transfer ke rekening | Admin Finance | ≤ 5 menit | CSV file download |

**Gate:** Payout hanya dieksekusi jika ada item `sold` tanpa `payout_id`. Setiap konsignor minimal mendapat satu baris CSV.

---

## 6. Retensi 30 Hari & Beli Putus Ceban

| Step | Action | Responsible | SLA | Evidence |
|------|--------|-------------|-----|----------|
| 6.1 | Set `consignment_start_date` saat intake <br>• Hitung `aging_expiry_date = start_date + 30 days` | System | — | Item record |
| 6.2 | Monitoring harian: item yang melewati 30 hari tanpa terjual | Studio Staff | Setiap hari pagi | Aging report |
| 6.3 | Trigger `buyout_price = Rp 10.000/pcs` <br>• Tombol "Beli Putus Ceban" di portal pemilik <br>• Pakaian dibeli dari tangan konsignor Rp 10.000 | Studio Staff / System | — | Buyout transaction log |
| 6.4 | Jika dikembalikan: status berubah ke `bought_out` <br>• Pulihkan ke rekening konsignor | System | — | Status change log |

---

## 7. Konsentrasi Data & Keamanan

| Area | Policy | Evidence |
|------|--------|----------|
| **PII Handling** | Client PII hanya disimpan di tabel `profiles` dan `orders` <br>• RLS kebijakan: konsignor view own only | Supabase RLS policies |
| **Claim Register** | Setiap item reject memiliki register entry <br>• `reject_resolution` ∈ {donate, reclaim} <br>• `defect_notes` + `defect_photo_url` <br>• Audit trail via `item_status_logs` | DB schema + code |
| **Data Integrity** | Setiap status change logged ke `item_status_logs` <br>• `from_status` → `to_status` + `changed_by` + `notes` <br>• Trigger otomatis `trg_clothes_status_change` | DB trigger + audit log |
| **WhatsApp Integration** | Setiap reject → notifikasi WhatsApp <br>• Format terstandar dengan kode payout <br>• Copy ke clipboard manual | `FridayPayoutModule.tsx` + `getWhatsAppMessage()` |

---

## 8. Pilot Gates — When to Deliberately Unblock

**Do not deploy, publish, spend, collect customer data, or run real-money operations until Ren deliberately unblocks against pilot gates:**

| Gate | Condition | Action |
|------|-----------|--------|
| G1 | SOP documents verified against live code | Review + sign-off |
| G2 | Database schema matches code (Supabase migrations) | Migration run + verify |
| G3 | End-to-end test: intake → QC → hangtag → live sale → payout | Manual trace from seed data |
| G4 | Consignor consent records signed | Physical or digital consent |
| G5 | Claim register operational (reject → donate/reclaim flow) | Test with at least 1 item |

---

**Signed:** _______________________ (Ren)  
**Date:** _______________________  
**Pilot Gate:** _______________________ (check when unblocked)