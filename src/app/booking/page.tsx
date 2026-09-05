'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { SUKABUMI_DISTRICTS, BUSINESS_RULES } from '@/lib/constants';
import Link from 'next/link';
import { ArrowUpRight, Check } from 'lucide-react';

function BookingFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store, setActiveUser } = useStore();

  const initialCount = searchParams.get('count') ? Number(searchParams.get('count')) : 25;

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pickupAddress: '',
    district: SUKABUMI_DISTRICTS[0],
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickupSlot: 'pagi',
    estimatedCount: initialCount,
    notes: '',
  });

  const [successBatch, setSuccessBatch] = useState<{
    batchCode: string;
    consignorName: string;
    address: string;
    count: number;
  } | null>(null);

  const isFreePickup = formData.estimatedCount >= BUSINESS_RULES.FREE_PICKUP_THRESHOLD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { batch, consignor } = store.bookIntakeBatch({
      consignorName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      pickupAddress: `${formData.pickupAddress} (${formData.pickupSlot === 'pagi' ? 'Slot Pagi: 09.00-12.00' : 'Slot Siang: 13.30-16.30'})`,
      district: formData.district,
      pickupDate: formData.pickupDate,
      estimatedCount: formData.estimatedCount,
      notes: formData.notes,
    });

    setActiveUser(consignor.id);

    setSuccessBatch({
      batchCode: batch.batch_code,
      consignorName: consignor.full_name,
      address: batch.pickup_address,
      count: batch.estimated_count,
    });
  };

  return (
    <div className="py-16 bg-linen-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {!successBatch ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-linen-200/90 shadow-sm">
            {/* Header */}
            <div className="mb-10 space-y-2">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
                Concierge Penjemputan
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
                Jadwalkan Penjemputan Lemari
              </h1>
              <p className="text-xs sm:text-sm text-espresso-600 font-sans leading-relaxed">
                Kurir internal PindahTangan akan datang membawa kantong khusus ke alamatmu di Kota Sukabumi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Nama Lengkap Pemilik Pakaian *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ibu Ratna Dewi"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-8899-7711"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                  Kecamatan di Kota Sukabumi *
                </label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900 transition"
                >
                  {SUKABUMI_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                  Alamat Lengkap Rumah Penjemputan *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Nama jalan, nomor rumah, RT/RW, patokan lokasi..."
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900 transition"
                />
              </div>

              {/* Quantity Counter & Policy */}
              <div className="p-5 rounded-xl bg-linen-50 border border-linen-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                      Estimasi Jumlah Pakaian Layak Pakai:
                    </span>
                    <span className="text-[11px] text-espresso-500">
                      Minimal 10 potong per batch titipan
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={formData.estimatedCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedCount: Math.max(10, Number(e.target.value)),
                        })
                      }
                      className="w-20 px-3 py-1.5 rounded-lg border border-linen-300 text-center font-serif text-lg font-medium text-espresso-900"
                    />
                    <span className="font-mono text-espresso-500">pcs</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-linen-200/80">
                  {isFreePickup ? (
                    <span className="text-[11px] font-mono text-emerald-800 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Layanan penjemputan kurir gratis aktif (≥20 potong).
                    </span>
                  ) : (
                    <span className="text-[11px] text-espresso-500">
                      Di bawah 20 potong: Diantar mandiri ke Jl. Siliwangi atau via Gosend.
                    </span>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Tanggal Penjemputan *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Pilihan Slot Waktu
                  </label>
                  <select
                    value={formData.pickupSlot}
                    onChange={(e) => setFormData({ ...formData, pickupSlot: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                  >
                    <option value="pagi">Pagi (09.00 – 12.00 WIB)</option>
                    <option value="siang">Siang (13.30 – 16.30 WIB)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: Bawa kantong ekstra, sebagian pakaian berbahan linen."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-espresso-900 hover:bg-terracotta-600 text-linen-50 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 shadow-sm"
              >
                Konfirmasi Jadwal Penjemputan
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Receipt */
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-linen-200/90 shadow-sm space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-linen-100 border border-linen-200 flex items-center justify-center mx-auto text-espresso-900">
              <Check className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-espresso-500">
                Tanda Terima Terjadwal
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso-900">
                Penjemputan Lemari Dikonfirmasi
              </h2>
              <p className="text-xs text-espresso-600">
                Terima kasih, <strong>{successBatch.consignorName}</strong>. Kurir kami akan menghubungi via WhatsApp sebelum menuju ke lokasi.
              </p>
            </div>

            <div className="bg-linen-50 rounded-xl p-6 border border-linen-200 text-left max-w-md mx-auto space-y-2.5 text-xs text-espresso-800">
              <div className="flex justify-between border-b border-linen-200 pb-2">
                <span className="text-espresso-500">Kode Batch Intake:</span>
                <span className="font-mono font-bold text-terracotta-600">
                  {successBatch.batchCode}
                </span>
              </div>
              <div className="flex justify-between border-b border-linen-200 pb-2">
                <span className="text-espresso-500">Estimasi Titip:</span>
                <strong>{successBatch.count} Potong</strong>
              </div>
              <div className="flex justify-between border-b border-linen-200 pb-2">
                <span className="text-espresso-500">Alamat:</span>
                <span className="text-right max-w-[220px] truncate">{successBatch.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-500">Jadwal:</span>
                <strong className="text-espresso-900 font-mono">
                  {formData.pickupDate} ({formData.pickupSlot === 'pagi' ? '09.00-12.00' : '13.30-16.30'})
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/portal"
                className="w-full sm:w-auto bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-8 py-3.5 rounded-full text-xs font-medium uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <span>Buka Lemari Saya</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setSuccessBatch(null)}
                className="w-full sm:w-auto border border-linen-300 text-espresso-700 px-6 py-3.5 rounded-full text-xs font-medium uppercase tracking-wider transition hover:bg-linen-100"
              >
                Titip Batch Lain
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-20 text-center text-espresso-500 text-xs">
          Memuat formulir penjemputan...
        </div>
      }
    >
      <BookingFormContent />
    </Suspense>
  );
}
