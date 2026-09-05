'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatIDR } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { BUSINESS_RULES } from '@/lib/constants';

export default function ValueEstimator() {
  const [pieces, setPieces] = useState<number>(25);

  const isFreePickup = pieces >= BUSINESS_RULES.FREE_PICKUP_THRESHOLD;
  const estimatedMinNet = Math.round(pieces * 32500);
  const estimatedMaxNet = Math.round(pieces * 52500);
  const estimatedAverageNet = Math.round(pieces * 42500);

  return (
    <section id="estimator" className="py-24 bg-linen-100/50 border-b border-linen-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Kalkulasi Nilai Lemari
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
            Punya berapa potong pakaian yang jarang dipakai?
          </h2>
          <p className="text-xs sm:text-sm text-espresso-600 font-sans leading-relaxed">
            Geser untuk melihat estimasi uang tunai bersih yang akan ditransfer ke rekeningmu
            setiap Jumat sore tanpa perlu meladeni negosiasi atau mengemas paket.
          </p>
        </div>

        {/* Minimalist Interactive Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-linen-200/90 shadow-sm max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Slider Range */}
            <div className="space-y-5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase tracking-wider text-espresso-500">
                  Jumlah Pakaian:
                </span>
                <span className="font-serif text-4xl sm:text-5xl font-light text-espresso-900">
                  {pieces}{' '}
                  <span className="text-sm font-sans font-normal text-espresso-500">
                    potong
                  </span>
                </span>
              </div>

              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={pieces}
                onChange={(e) => setPieces(Number(e.target.value))}
                className="w-full cursor-pointer"
              />

              <div className="flex justify-between text-[11px] font-mono text-espresso-400">
                <span>10 pcs (Min. Titip)</span>
                <span className="text-terracotta-600 font-medium">20 pcs (Batas Jemput Gratis)</span>
                <span>100 pcs (Bongkar Lemari)</span>
              </div>
            </div>

            {/* Estimated Return Box */}
            <div className="p-6 sm:p-8 rounded-xl bg-linen-50 border border-linen-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 block">
                  Estimasi Uang Bersih ke Rekeningmu:
                </span>
                <div className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
                  {formatIDR(estimatedMinNet)} — {formatIDR(estimatedMaxNet)}
                </div>
                <p className="text-[11px] text-espresso-500 font-sans">
                  *Rata-rata estimasi: <strong>{formatIDR(estimatedAverageNet)}</strong> (sudah dipotong biaya sterilisasi uap Rp 2.500/pcs).
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {isFreePickup ? (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full">
                    Penjemputan Gratis Aktif
                  </span>
                ) : (
                  <span className="text-[11px] text-espresso-500">
                    Tambah {20 - pieces} potong untuk penjemputan gratis.
                  </span>
                )}

                <Link
                  href={`/booking?count=${pieces}`}
                  className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Jemput Lemariku</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Micro Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-xs text-espresso-600 border-t border-linen-200/80">
              <div className="space-y-1">
                <span className="text-espresso-900 font-semibold block">01. Tanpa Foto &amp; Chat</span>
                <p className="text-[11px] leading-relaxed">
                  Tidak perlu mencari pencahayaan atau membalas chat tawar-menawar sadis.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-espresso-900 font-semibold block">02. Steril Uap &gt;100°C</span>
                <p className="text-[11px] leading-relaxed">
                  Baju disterilkan, disetrika uap wangi butik, dan siap tampil di Live.
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-espresso-900 font-semibold block">03. Gajian Tiap Jumat</span>
                <p className="text-[11px] leading-relaxed">
                  Dana penjualan dicairkan otomatis pukul 16.00 WIB langsung ke rekeningmu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
