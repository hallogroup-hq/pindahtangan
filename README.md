# 👗 PindahTangan — Managed Fashion Consignment & Live Circular Marketplace
### Pilot Kota Sukabumi | Next.js 14+ App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL

> **Visi Platform:** *"Memberi Nafas Kedua untuk Pakaian Terbaikmu — Dari Lemarimu, Berpindah Tangan Jadi Cuan."*  
> Dibangun sepenuhnya berdasarkan spesifikasi kanonikal **Product Requirement Document (PRD) v1.0**.

---

## 🚀 Fitur Utama & Modul Platform

### 1. Public Experience & Consignor Experience (Sisi Pemilik Pakaian)
- **Interactive Closet Value Estimator:** Slider 10–100 potong pakaian yang langsung menghitung estimasi uang tunai bersih di rekening (misal: 25 pcs $\to$ Rp 750rb – Rp 1,25jt).
- **Formulir Booking "Jemput Lemari" Sukabumi:** Form penjemputan dengan validasi otomatis: $\ge 20$ potong langsung memicu fasilitas **GRATIS Penjemputan Kurir Internal** di 7 kecamatan Kota Sukabumi.
- **Tanda Terima Digital Penjemputan:** Pembuatan nomor batch unik (`BATCH-YYYYMM-XXX`) dan estimasi waktu penjemputan.
- **Portofolio Konsinyasi Reaktif (`/portal`):**
  - Tab status: `🧺 Sedang Steam`, `👗 Siap Live (No. Gantungan)`, `✅ Terjual`, `⚠️ Reject QC`, `📦 Selesai/Paid Out`.
  - **Viewer Foto Cacat QC:** Inspeksi foto resolusi tinggi bagian pakaian yang cacat (noda/robek) beserta 2 tombol aksi: **[Relakan untuk Didonasikan/Daur Ulang]** atau **[Ambil Kembali Saat Payout]**.
  - **Opsi Beli Putus Obral (Retensi 30 Hari):** Tombol pencairan tunai cepat Rp 10.000/pcs untuk pakaian yang mendekati atau melewati masa titip 30 hari kalender.
  - **Ledger Payout & Rekening Bank:** Manajemen nomor rekening (BCA, Mandiri, BRI, GoPay, OVO) dan riwayat slip transfer digital tiap Jumat sore.

### 2. Studio Operator OS (`/studio`)
- **Intake Kantong Masuk:** Verifikasi jumlah fisik riil (`actual_count`) dari kantong yang diserahkan kurir.
- **QC 3-Stasiun & Cuci Uap Panas:**
  - Pengecekan noda, sobek, resleting, kancing.
  - Klasifikasi 3-Tier Niche: Tier A (Branded & Pesta), Tier B (Casual & Kerja), Tier C (Mass Market / Flash Sale).
  - Penetapan *Floor Price* (Hak Bersih Consignor) $\to$ otomatis mengkalkulasi rekomendasi harga buka Live TikTok.
  - Perekaman reject dengan catatan kerusakan dan foto cacat.
  - **Generator Hangtag Thermal:** Menghasilkan nomor gantungan display besar (`No. 42`) dan barcode SKU fisik (`PT-SM-001-042`) siap cetak.

### 3. Host Live Controller Tablet Mode (`/host`)
- **Antarmuka Ring-Light Touchscreen:** Didesain khusus untuk layar tablet di depan ring-light host siaran langsung TikTok / Instagram.
- **Active Hanger Display:** Menampilkan nomor gantungan display besar, SKU, Brand, Ukuran, dan Lingkar Dada (LD cm).
- **Panduan Harga Realtime:** Menampilkan batas *Floor Price* (jangan buka di bawah harga ini) dan *Rekomendasi Harga Buka Live*.
- **Tombol Sentuh Cepat (One-Tap Actions):**
  - **`[ 🟢 MARK SOLD ]`**: Modal sentuh cepat untuk input username pembeli TikTok (misal: `@siti_ootd`) dan harga laku $\to$ otomatis mengubah status ke `sold`, menghitung laba platform, mencatat pesanan, dan memicu efek visual perayaan confetti.
  - **`[ ⏭️ SKIP / NEXT ]`**: Menggeser antrean baju ke urutan paling belakang jika penonton belum menawar agar tempo siaran tetap tinggi.
- **Metrik Sesi Realtime:** Total baju terjual, total omzet GMV sesi, dan akumulasi penghasilan host (Gaji Pokok Rp 60.000 + Insentif Rp 2.000/pcs).

### 4. Admin Backoffice & Batch Engine (`/admin`)
- **Friday Payout Batch Engine (Gajian Tiap Jumat 16.00 WIB):**
  - Filter otomatis pakaian terjual periode cutoff mingguan (Sabtu–Kamis).
  - Agregasi per penitip: Total Gross Floor Price, Deduksi Biaya Cuci Uap ($N \times \text{Rp } 2.500$), dan Nilai Transfer Bersih.
  - Satu klik eksekusi: menghasilkan kode pencairan (`PAY-YYYYMMDD-XXX`), mengubah status pakaian ke `paid_out`, dan menerbitkan slip transfer digital.
- **Manajemen Pesanan & Dispatch Resi (`/admin/orders`):**
  - Antrean pesanan pembeli Live TikTok.
  - Pengemasan paket, pemilihan kurir (J&T Express, SiCepat, Gosend Sukabumi), dan pencatatan nomor resi pengiriman.
- **Engine Retensi 30 Hari & Obral Ceban (`/admin/aging`):**
  - Pemantauan masa titip 30 hari.
  - Pemicu Beli Putus Obral Ceban untuk memasok stok siaran TikTok Live Huru-Hara "Serba Ceban (Rp 10.000)".
- **Simulator Unit Economics (`/admin/economics`):**
  - Implementasi interaktif dari formula PRD Seksi 9.1 & 9.2 untuk menguji proyeksi arus kas dan laba bersih platform per sesi live 2 jam.

---

## 🛠️ Panduan Menjalankan Aplikasi

### 1. Instalasi Dependensi & Development Server
```bash
# Masuk ke direktori proyek
cd "Pindah Tangan"

# Jalankan server pengembangan
npm run dev
```
Akses platform di peramban Anda melalui: **`http://localhost:3000`**.

### 2. Bar Simulasi Multi-Role
Di bagian paling atas layar terdapat **Simulator Multi-Persona PindahTangan** yang memungkinkan Anda beralih peran secara instan:
- **👗 Ibu Ratna Dewi:** Mencoba pengalaman Consignor (lihat portofolio, status live, resolusi cacat QC, dan slip gajian Jumat).
- **🧺 Studio Sukabumi:** Mencoba proses penerimaan batch, QC cuci uap uap, dan cetak hangtag.
- **📱 Siti Host TikTok:** Mencoba controller tablet ring-light, tombol Mark Sold, Skip, dan pantauan komisi.
- **👑 Admin Backoffice:** Mencoba eksekusi gajian Jumat 16.00 WIB, resi ekspedisi, dan simulator finansial.

---

## 🗄️ Skema Database Supabase PostgreSQL

Skema DDL produksi resmi telah disediakan di:  
[`supabase/migrations/01_initial_schema.sql`](file:///Users/akmalirsyadpermana/Downloads/Pindah%20Tangan/supabase/migrations/01_initial_schema.sql)

Skema mencakup 7 tabel ternormalisasi, trigger audit trail otomatis `item_status_logs`, dan kebijakan Row Level Security (RLS) lengkap sesuai Seksi 8 & 10 PRD.
