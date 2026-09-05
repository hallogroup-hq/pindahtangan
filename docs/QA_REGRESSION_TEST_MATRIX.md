# 📋 Katalog & Matriks Uji Regresi PindahTangan (QA Regression Test Matrix)
### Platform Managed Fashion Consignment & Live Circular Marketplace — Pilot Kota Sukabumi
> Versi Dokumen: v1.0 | Standar Rujukan: PRD v1.0 & PRD Admin Dashboard v1.0

---

## 📌 Ringkasan Eksekutif & Sasaran Mutu

Dokumen ini memuat seluruh spesifikasi pengujian regresi (*regression test suite*) untuk platform **PindahTangan**. Pengujian dirancang untuk menjamin tidak ada regresi logika pada alur penjemputan pakaian, proses kurasi QC 3-titik, live streaming selling, pengemasan logistik, hingga kalkulasi pencairan mingguan (Gajian Tiap Jumat 16.00 WIB).

### Target Mutu (Quality Gates)
1. **Core Business Logic Coverage:** $\ge 90\%$ statements & lines pada [`src/lib/store.ts`](file:///Users/akmalirsyadpermana/Downloads/Pindah%20Tangan/src/lib/store.ts) dan [`src/lib/utils.ts`](file:///Users/akmalirsyadpermana/Downloads/Pindah%20Tangan/src/lib/utils.ts).
2. **Zero Financial Drift:** Tidak ada pembulatan salah pada kalkulasi hak bersih consignor (*Floor Price*), deduksi cuci uap ($N \times \text{Rp } 2.500$), maupun komisi host siaran live ($N \times \text{Rp } 2.000$).
3. **Idempotensi Finansial:** Payout yang dieksekusi lebih dari 1 kali dalam cutoff yang sama wajib menghasilkan 0 double transfer.

---

## 🗂️ Matriks Uji Regresi Lengkap (Per Fungsi & Skenario)

### 1. Modul Utilitas & Generator Kode Sistem (`src/lib/utils.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-UTL-01** | `formatIDR` | Format angka ke mata uang Rupiah Indonesia | `75000`, `0`, `2500000` | Format string diawali `Rp`, pemisah ribuan titik tanpa desimal (`Rp 75.000`). | ✅ Automated (`utils.test.ts`) |
| **REG-UTL-02** | `formatDateIndo` | Format timestamp ISO ke bahasa Indonesia | `'2026-09-05T16:00:00Z'` | Mengembalikan format tanggal lokal (`5 September 2026`). | ✅ Automated (`utils.test.ts`) |
| **REG-UTL-03** | `generateBatchCode` | Pembuatan kode batch penjemputan | Sistem clock | Format `BATCH-YYYYMM-XXX` dengan padding angka acak 3 digit. | ✅ Automated (`utils.test.ts`) |
| **REG-UTL-04** | `generateSKU` | Generator barcode SKU fisik pakaian | `consignorIndex: 1`, `itemIndex: 42` | Menghasilkan `PT-SM-001-042` dengan padding 3 digit. | ✅ Automated (`utils.test.ts`) |
| **REG-UTL-05** | `generateOrderNumber` | Generator nomor invoice pesanan live | Sistem clock | Format `ORD-YYYYMM-XXXX` unik. | ✅ Automated (`utils.test.ts`) |
| **REG-UTL-06** | `generatePayoutCode` | Generator kode slip pencairan bank Jumat | Sistem clock | Format `PAY-YYYYMMDD-XXX`. | ✅ Automated (`utils.test.ts`) |

---

### 2. Modul Intake, Estimator & Booking Lemari (`src/app/booking`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-INT-01** | `bookIntakeBatch` | Booking penjemputan $\ge 20$ pcs (Gratis Jemput) | `estimatedCount: 25`, Sukabumi Cikole | Batch terbuat status `scheduled`, fasilitas gratis jemput kurir internal aktif. | ✅ Automated (`intake-booking.test.ts`) |
| **REG-INT-02** | `bookIntakeBatch` | Booking penjemputan $< 20$ pcs | `estimatedCount: 15` | Batch terbuat status `scheduled`, tercatat opsi antar mandiri / ongkir reguler. | ✅ Automated (`intake-booking.test.ts`) |
| **REG-INT-03** | `bookIntakeBatch` | Sanitasi & deduplikasi profil penitip berdasarkan nomor HP | Nomor HP `0812-8899-7711` vs `081288997711` | Menghubungkan batch baru ke profil yang sudah ada tanpa duplikasi user. | ✅ Automated (`intake-booking.test.ts`) |
| **REG-INT-04** | `receiveBatch` | Verifikasi jumlah fisik kantong oleh studio lead | Estimasi 25 pcs, fisik riil 24 pcs | Status batch bertransisi ke `in_qc`, `actual_count: 24` tersimpan. | ✅ Automated (`intake-booking.test.ts`) |
| **REG-INT-05** | `updateBatchActualCount` | Koreksi jumlah baju dan catatan diskrepansi | `actualCount: 28`, catatan reject | Data tersimpan dan tercatat pada audit trail batch. | ✅ Automated (`intake-booking.test.ts`) |
| **REG-INT-06** | `completeBatchIntake` | Penutupan sesi intake kantong masuk | `batchId: 'batch-001'` | Status batch berubah menjadi `completed`. | ✅ Automated (`intake-booking.test.ts`) |

---

### 3. Modul QC 3-Titik, Cuci Uap & Hangtag Label (`src/app/studio`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-QC-01** | `qcPassItem` | Penetapan pakaian lolos QC (Tier A, B, C) | Brand Zara, Tier A, Floor Rp 65.000, LD 96cm | Diterbitkan nomor gantungan fisik, SKU `PT-SM-XXX-XXX`, deduksi uap Rp 2.500 dipasang, status `ready_for_live`. | ✅ Automated (`qc-steaming.test.ts`) |
| **REG-QC-02** | `inspectQCItem` | Alur cuci uap terpisah (`isSteamed: false`) | Pakaian baru selesai inspeksi noda | Status awal `in_steam`, setelah operator panggil `confirmSteaming` bertransisi ke `ready_for_live` dengan timestamp. | ✅ Automated (`qc-steaming.test.ts`) |
| **REG-QC-03** | `inspectQCItem` | Penolakan pakaian cacat/noda membandel | Noda karat kerah, foto noda | Status item `rejected`, dialokasikan ke keranjang `BIN-REJECT`, `defect_notes` dan foto tersimpan. | ✅ Automated (`qc-steaming.test.ts`) |
| **REG-QC-04** | `resolveRejectItem` | Hak prerogatif penitip atas baju reject | `action: 'donate'` atau `'reclaim'` | Kolom `reject_resolution` ter-update, baju terkunci dari daftar tayang live. | ✅ Automated (`qc-steaming.test.ts`) |
| **REG-QC-05** | `TIER_CONFIG` | Validasi batas rentang harga floor per Tier | Tier A (50k-120k), Tier B (25k-45k), Tier C (10k-20k) | Sesuai konfigurasi bisnis PRD v1.0 Seksi 4.1. | ✅ Automated (`qc-steaming.test.ts`) |

---

### 4. Modul Host Live Controller Tablet (`src/app/host`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-LIVE-01** | `setOnStageItem` | Menampilkan gantungan baju aktif di tablet depan kamera | `itemId: 'item-01'` | Status baju $\to$ `in_live_queue`, gantungan terpilih tampil aktif di UI. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-02** | `markItemSold` | Host menekan tombol satu ketukan `[MARK SOLD]` | Buyer `@siti_ootd`, Harga Laku Rp 75.000 | 1. Status baju $\to$ `sold`<br>2. Pesanan terbuat status `pending_pack`<br>3. GMV sesi bertambah<br>4. Komisi host +Rp 2.000<br>5. Log audit status terbit. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-03** | `coPilotAdjustPrice` | Proteksi penawaran di bawah *Floor Price* | Floor Rp 40.000, tawar Rp 30.000 | Sistem melempar `Error` protektif: harga tidak boleh di bawah hak bersih penitip. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-04** | `coPilotAdjustPrice` | Penyesuaian rekomendasi harga live oleh co-pilot | Target baru Rp 55.000 ($\ge$ floor) | Target harga tayang ter-update secara reaktif. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-05** | `skipLiveItem` | Host menekan tombol `[SKIP]` | Baju belum ditawar penonton | Baju dipindah ke urutan paling belakang pada run-sheet siaran. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-06** | `getHostPayrollSummary` | Rekapitulasi honor shift host live 2 jam | 15 pcs baju terjual | Gaji pokok Rp 60.000 + Insentif (15 $\times$ Rp 2.000 = Rp 30.000) $\to$ Total Rp 90.000. | ✅ Automated (`live-selling.test.ts`) |
| **REG-LIVE-07** | `getRunSheetForSession` | Tata kelola 50 gantungan display live | Sesi live aktif | Penomoran gantungan 1..50 konsisten dan melacak item on-stage. | ✅ Automated (`live-selling.test.ts`) |

---

### 5. Modul Fulfillment, Packing & Ekspedisi (`src/app/admin/orders`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-FUL-01** | `verifyPackingBarcode` | Pemindaian barcode SKU fisik saat pengemasan | Barcode cocok dengan SKU order | Status item berubah ke `packed`, pesan konfirmasi sukses terbit. | ✅ Automated (`fulfillment.test.ts`) |
| **REG-FUL-02** | `verifyPackingBarcode` | Pemindaian barcode SKU yang salah (*error prevention*) | Barcode SKU pesanan lain | Sistem menolak (`matched: false`), status item tetap `sold` (belum terkemas). | ✅ Automated (`fulfillment.test.ts`) |
| **REG-FUL-03** | `updateShippingStatus` | Pencatatan nomor resi kurir pengiriman | Resi J&T Express `JT991827361` | Status pesanan $\to$ `shipped`, nomor resi tersimpan. | ✅ Automated (`fulfillment.test.ts`) |
| **REG-FUL-04** | `bulkDispatchOrders` | Ekspedisi massal pesanan siap kirim | Array order terkemas, Kurir J&T / GoSend | Seluruh pesanan otomatis terbit resi dengan prefix kurir sesuai (`JT...`, `GS-SKB-...`) dan status $\to$ `shipped`. | ✅ Automated (`fulfillment.test.ts`) |

---

### 6. Modul Payout Jumat 16.00 WIB & Perbankan (`src/app/admin/payouts`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-PAY-01** | `executeFridayPayout` | Eksekusi transfer gajian Jumat sore mingguan | 2 item terjual (Floor 60rb & 40rb) | Gross Floor: Rp 100.000, Deduksi Cuci: $2 \times \text{Rp } 2.500 = \text{Rp } 5.000$, Transfer Bersih: Rp 95.000, Status $\to$ `paid_out`. | ✅ Automated (`friday-payout.test.ts`) |
| **REG-PAY-02** | `executeFridayPayout` | Uji Idempotensi: Payout dipicu berulang kali | Tidak ada item baru yang terjual | Sistem mengembalikan array kosong (`[]`), tidak ada transfer ganda. | ✅ Automated (`friday-payout.test.ts`) |
| **REG-PAY-03** | `updateBankDetails` | Pembaruan rekening bank / e-wallet penitip | BCA, Mandiri, BRI, GoPay | Data rekening profil ter-update untuk pencairan Jumat berikutnya. | ✅ Automated (`friday-payout.test.ts`) |
| **REG-PAY-04** | `exportBankDisbursementCSV` | Generate file CSV pencairan massal perbankan | Format `'bca'` atau `'mandiri'` | Header dan baris CSV sesuai spesifikasi format bulk payment bank. | ✅ Automated (`friday-payout.test.ts`) |
| **REG-PAY-05** | `exportAccountingCSV` | Ekspor laporan pembukuan berkala | Tipe `'sales'`, `'payouts'`, `'inventory'` | Menghasilkan data tabular CSV yang dapat diimpor ke sistem akuntansi. | ✅ Automated (`friday-payout.test.ts`) |

---

### 7. Modul Retensi 30 Hari & Obral Ceban (`src/app/admin/aging`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-AGE-01** | `buyoutAgedItem` | Beli Putus Pakaian Lewat 30 Hari (Rp 10.000) | Item dengan masa titip $\ge 30$ hari | Status $\to$ `bought_out`, hak penitip dicairkan Rp 10.000, kepemilikan dialihkan ke obral ceban platform. | ✅ Automated (`aging-retention.test.ts`) |

---

### 8. Modul Simulasi Finansial & Unit Economics (`src/app/admin/economics`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-FIN-01** | `getUnitEconomics` | Verifikasi formula margin & laba bersih platform | 2 item terjual, 1 sesi live host | Menghitung GMV, Consignor Net, Host Fees, Margin Kotor, dan Laba Bersih Platform secara presisi. | ✅ Automated (`unit-economics.test.ts`) |
| **REG-FIN-02** | `getUnitEconomics` | Penanganan sesi tanpa penjualan (*zero division guard*) | 0 item terjual | Metrik rata-rata harga tidak menyebabkan error NaN/divisi nol. | ✅ Automated (`unit-economics.test.ts`) |

---

### 9. Modul RBAC & React Hooks (`src/lib/useStore.ts`, `src/lib/store.ts`)

| ID Skenario | Fungsi Teknis | Deskripsi Pengujian | Input Data | Kriteria Keberhasilan (*Expected Result*) | Status Otomasi |
|---|---|---|---|---|---|
| **REG-SEC-01** | `setActiveUser` | Peralihan multi-persona simulator | Consignor, Host, Admin | State user aktif berubah dan sinkron ke seluruh subscriber reaktif. | ✅ Automated (`rbac-security.test.ts`, `hook.test.ts`) |
| **REG-SEC-02** | `setCurrentAdminTier` | Otorisasi sub-role backoffice | Superadmin, Finance, Studio Lead, Logistics | Tingkat otorisasi tersimpan dan membatasi akses menu backoffice. | ✅ Automated (`rbac-security.test.ts`) |
| **REG-HOOK-01** | `useStore` | Sinkronisasi reaktif hook React | State dispatch via method store | Komponen UI me-render ulang nilai terbaru secara otomatis. | ✅ Automated (`hook.test.ts`) |
| **REG-HOOK-02** | `resetToDefault` | Reset simulasi ke data awal bersih | Mutasi state data | Mengembalikan seluruh entitas ke data `SEED_*` tanpa merusak referensi memory. | ✅ Automated (`hook.test.ts`) |

---

## 🚀 Panduan Eksekusi Pengujian

### 1. Menjalankan Unit & Integration Test Suite
```bash
# Jalankan seluruh unit test suite
npm test

# Jalankan dalam mode interaktif (watch mode)
npm run test:watch

# Jalankan dengan laporan code coverage v8
npm run test:coverage
```

### 2. Menjalankan Automated End-to-End (E2E) Smoke Tests
```bash
# Jalankan Playwright browser tests
npm run test:e2e

# Jalankan Playwright dalam mode UI visual interaktif
npx playwright test --ui
```
