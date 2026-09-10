# 📄 PindahTangan — Consent Records: Pilot Edition

**Version:** 1.0  
**Pilot:** Kota Sukabumi  
**Effective:** Start of pilot batch operations  
**Owner:** Studio Operations + Founder Review  

---

## 1. Konsignor Consent Form (Intake Drop-off)

Isi saat kurir menjatuhkan kantong di studio atau saat registrasi online.

| Field | Value | Status | Evidence |
|-------|-------|--------|----------|
| **Nama Lengkap** | _______________________ | ✓ | KTP / Selfie |
| **Nomor Telepon** | _______________________ | ✓ | WhatsApp verified |
| **Alamat Lengkap** | _______________________ | ✚ | Sukabumi only (7 kecamatan) |
| **Nama Bank** | _______________________ | ✓ | BCA / Mandiri / BRI / lain |
| **Nomor Rekening** | _______________________ | ✓ | 12-16 digits |
| **Nama Pemilik Rekening** | _______________________ | ✓ | Harus sesuai KTP |
| **Role** | Consignor | ✓ | Tertuang di sistem |
| **Referral Code** | _(opsional)_ | — | Jika ada |
| **Diterima Oleh** | _______________________ | ✓ | Staff name + timestamp |
| **Tanggal Drop-off** | _______________________ | ✓ | System timestamp |
| **Jumlah Kantong** | _______________________ | ✓ | Estimated vs actual count |

**Consent Statement (dicentang):**

- [ ] Saya menyetujui PindahTangan mengangkat pakaian saya ke dalam sistem katalog live commerce.
- [ ] Saya menyetujui proses cuci uap panas >100°C sebagai syarat kualitas QC.
- [ ] Saya menyetujui deduksi biaya cuci uap Rp 2.500 per potong saat gajian mingguan.
- [ ] Saya menyetujui jadwal payout setiap Jumat 16:00 WIB.
- [ ] Saya menyetujui retensi 30 hari dan opsi beli putus ceban Rp 10.000/pcs setelah masa berakhir.
- [ ] Saya menyetujui opsi donasi daur ulang atau ambil kembali item reject saat pencairan gajian.
- [ ] Saya menyetujui pencatatan foto cacat QC untuk dokumentasi kualitas (tidak dipublik tanpa izin).
- [ ] Saya menyetujui integrasi WhatsApp untuk notifikasi status pakaian dan slip gajian.

**Tanda Tangan Konsignor:** _______________________ **Tanggal:** _______________________

---

## 2. Admin Consent Form (Operations Unblock)

Isi saat Ren deliberate unblock pilot gates.

| Field | Value | Status | Evidence |
|-------|-------|--------|----------|
| **Nama Operator** | _______________________ | ✓ | Ren / Studio Lead |
| **Tanggal Verifikasi SOP** | _______________________ | ✓ | Tgl pembacaan dokumentasi |
| **Status Database Schema** | _______________________ | ✓ | Migrasi sukses / perlu perbaikan |
| **E2E Test Results** | _______________________ | ✓ | Pass / Failed details |
| **Consignor Consent Collected** | _______________________ | ✓ | % lengkap atau daftar belum lengkap |
| **Claim Register Ready** | _______________________ | ✓ | Reject/reclaim flow tes lulus |
| **Pilot Gate Unblocked** | — | ⬜ Belum / ⬜ Ya | Ren signature |

**Ren Signature (unblock pilot):** _______________________ **Tanggal:** _______________________

**Catatan:** Semua field wajib diisi sebelum pilot berjalan. Jika ⬜ Belum, catat alasan dan jadwal ulang.

---

## 3. Consent Record Archive

Setiap konsignor consent form disimpan sebagai:

1. **File fisik:** Folder konsignor di studio Sukabumi (kepemilikan fisik)
2. **File digital:** Upload ke Supabase storage → `consent-forms/<consignor_id>/`
3. **Record database:** Tabel `profiles` sudah menyimpan `full_name`, `phone_number`, `bank_name`, `bank_account_number`, `bank_account_holder`
4. **Audit trail:** Setiap perubahan di-log ke `item_status_logs` dengan `changed_by` + `notes`

**Retention Policy:**
- Konsentrasi disimpan selama 24 bulan setelah berakhirnya hubungan konsignor.
- Setelah 24 bulan: diskripsikan/shred secara aman.
- Data keuangan (bank account) disimpan sesuai regulasi keuangan Indonesia.

**Owner:** Studio Operations Lead  
**Reviewer:** Akmal (Founder) — setiap kuartal review.

---

## 4. Verification Checklist — Sebelum Pilot Start

| # | Checklist Item | Status | Verified By | Date |
|---|----------------|--------|-------------|------|
| 1 | SOP Intake & QC terbaca & disaafikan | ☐ | | |
| 2 | SOP Hangtag & Live Queue terbaca & disaafikan | ☐ | | |
| 3 | SOP Friday Payout terbaca & disaafikan | ☐ | | |
| 4 | SOP Retensi 30 Hari & Beli Putus terbaca & disaafikan | ☐ | | |
| 5 | Database schema migration run ke produksi | ☐ | | |
| 6 | Setidaknya 3 konsignor consent form terisi lengkap | ☐ | | |
| 7 | E2E test: intake → QC → hangtag → live sale → payout | ☐ | | |
| 8 | Claim register operasi (reject → donate/reclaim) | ☐ | | |
| 9 | WhatsApp notifikasi test ke setidaknya 1 nomor | ☐ | | |
| 10 | Ren deliberate unblock pilot gates | ☐ | Ren | |

**Pilot Ready:** ☐ Ya — semua checklist tercentang  
**Pilot Ready:** ☐ Tidak — lihat catatan di bawah

**Blocking Issues (if any):**

________________________________________________________________________
________________________________________________________________________
________________________________________________________________________

**Signed:** _______________________ (Ren)   **Date:** _______________________