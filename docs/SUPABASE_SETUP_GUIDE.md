# 🐘 Panduan Koneksi Supabase Cloud & Eksekusi DDL — PindahTangan

Panduan resmi untuk menghubungkan platform konsinyasi **PindahTangan** ke instance **Supabase Cloud PostgreSQL** agar seluruh data inventaris, status pakaian, order pembeli, dan kalkulasi gajian Jumat tersimpan permanen di cloud dan tersinkronisasi via WebSockets secara real-time.

---

## 🏛️ Arsitektur Dual-Mode (Cloud + Local Fallback)

PindahTangan dirancang dengan arsitektur **Zero-Downtime Dual-Mode**:
* **Mode Cloud (Terkoneksi):** Saat `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` terkonfigurasi, aplikasi otomatis melakukan *fetch* data dari PostgreSQL dan membuka channel *Supabase Realtime* (`pindahtangan_studio_broadcast`). Saat host menekan `[ MARK SOLD ]`, seluruh dashboard dan portal penitip ter-update tanpa reload.
* **Mode Local Storage (Offline / Fallback):** Jika kredensial belum diisi atau koneksi terputus, aplikasi otomatis beralih ke cache lokal in-memory tanpa crash, sehingga demo studio tetap dapat berjalan 100% lancar.

---

## 📋 Langkah 1: Buat Project Supabase Baru

1. Buka [https://database.new](https://database.new) atau login ke dashboard [Supabase](https://supabase.com/dashboard).
2. Klik **"New Project"**.
3. Isi informasi project:
   * **Name:** `pindahtangan-studio`
   * **Database Password:** *(Catat password database Anda)*
   * **Region:** Pilih **Singapore (ap-southeast-1)** untuk latensi terendah ke Kota Sukabumi & Indonesia (< 35 ms).
4. Tunggu sekitar 1–2 menit hingga database siap.

---

## 💾 Langkah 2: Eksekusi Skrip DDL SQL Produksi

1. Di dashboard Supabase, buka menu **SQL Editor** pada sidebar kiri.
2. Klik **"New Query"**.
3. Buka file skrip DDL yang telah kami siapkan di repositori:
   * [`supabase/migrations/20260905_initial_schema.sql`](../supabase/migrations/20260905_initial_schema.sql)
4. Salin seluruh isi file tersebut dan tempelkan ke SQL Editor Supabase.
5. Klik tombol **"Run"** (atau tekan `Ctrl+Enter` / `Cmd+Enter`).
6. Pastikan muncul pesan sukses: `Success. No rows returned`.

> [!NOTE]
> Skrip ini secara otomatis membuat:
> * 7 Tabel Inti: `profiles`, `intake_batches`, `clothes_items`, `orders`, `payouts`, `live_sessions`, `item_status_logs`.
> * 9 Tipe ENUM PostgreSQL untuk type-safety mutlak.
> * Trigger otomatis `trg_clothes_status_change` untuk audit trail riwayat pakaian.
> * Row Level Security (RLS) policies.
> * Publikasi Realtime (`supabase_realtime`) untuk tabel pakaian, pesanan, dan kantong masuk.

---

## 🌱 Langkah 3: Eksekusi Seed Data Awal (Opsional tapi Direkomendasikan)

Untuk langsung mengisi data percontohan pilot Sukabumi (Ibu Ratna Dewi, Kang Asep, Siti Nurhaliza, gantungan No. 01–42, sesi live sore):

1. Di **SQL Editor** Supabase, buat query baru.
2. Buka file [`supabase/seed.sql`](../supabase/seed.sql).
3. Salin seluruh isi file dan tempelkan ke SQL Editor.
4. Klik **"Run"**.
5. Buka menu **Table Editor** di sidebar untuk memverifikasi bahwa tabel `profiles`, `clothes_items`, dan `intake_batches` telah terisi data.

---

## 🔑 Langkah 4: Ambil Kredensial API Supabase

1. Di dashboard Supabase, buka **Project Settings** (ikon gerigi di kiri bawah) $\to$ pilih tab **API**.
2. Salin nilai berikut:
   * **Project URL:** Contoh: `https://xyzprojectid.supabase.co`
   * **anon / public key:** Contoh: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

---

## ⚙️ Langkah 5: Konfigurasi di Lingkungan Lokal (.env.local)

1. Di folder proyek lokal Anda, buat file `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Buka `.env.local` dan masukkan kredensial yang Anda salin:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzprojectid.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Jalankan aplikasi lokal:
   ```bash
   npm run dev
   ```
4. Buka `http://localhost:3000/admin`.
5. Perhatikan badge di header: indikator akan berwarna hijau dengan tulisan **"Cloud Live (Realtime)"**.

---

## 🚀 Langkah 6: Pasang Kredensial di Vercel Production

Agar website produksi di [https://pindahtangan-zeta.vercel.app](https://pindahtangan-zeta.vercel.app) juga terhubung ke Supabase Cloud:

### Opsi A: Melalui Vercel Dashboard Web
1. Buka [Vercel Dashboard](https://vercel.com) $\to$ pilih project `pindahtangan`.
2. Masuk ke tab **Settings** $\to$ **Environment Variables**.
3. Tambahkan 2 variabel:
   * Key: `NEXT_PUBLIC_SUPABASE_URL` | Value: *(URL Supabase Anda)* | Environments: Production, Preview, Development.
   * Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: *(Anon Key Supabase Anda)* | Environments: Production, Preview, Development.
4. Klik **Save**.
5. Buka tab **Deployments** $\to$ pada deployment terbaru klik titik tiga (`...`) $\to$ **Redeploy**.

### Opsi B: Melalui Terminal (Vercel CLI)
```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Masukkan URL saat diminta

npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Masukkan Anon Key saat diminta

# Deploy ulang untuk menerapkan env
npx vercel --prod
```

---

## ✅ Verifikasi Akhir

1. Buka dashboard admin di production: [https://pindahtangan-zeta.vercel.app/admin](https://pindahtangan-zeta.vercel.app/admin).
2. Di header bagian atas, pastikan badge status menampilkan:
   `🟢 Cloud Live (Realtime)`.
3. Buka halaman `/host` di tablet/perangkat lain, klik `[ MARK SOLD ]` pada salah satu gantungan.
4. Tanpa reload, periksa `/portal` atau `/admin/fulfillment` di perangkat lain $\to$ item langsung berpindah status menjadi `sold` & `pending_pack` secara real-time!
