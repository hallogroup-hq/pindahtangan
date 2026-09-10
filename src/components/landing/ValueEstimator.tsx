import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

// Replaced per Pilot Readiness Risk Register R-10/R-14:
// - Steam temperature, hygiene result, automatic weekly payout, earnings estimator
//   are treated as established facts but are unproven claims.
// - Estimator labels a fixed speculative range as net cash to bank.
// Replaced with honest Pilot Note section.

export default function ValueEstimator() {
  return (
    <section id="pilot-note" className="py-24 bg-linen-100/50 border-b border-linen-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-linen-200/90 shadow-sm max-w-3xl mx-auto">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 bg-terracotta-500/20 text-terracotta-600 border border-terracotta-500/30 px-4 py-2 rounded-full text-[10px] font-mono tracking-widest uppercase">
              <span>Pilot Terbatas</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
              Saat ini kami sedang menguji proses titip jual dengan kapasitas kecil
            </h2>

            <p className="text-espresso-600 text-base leading-relaxed font-sans max-w-xl mx-auto">
              PindahTangan sedang dalam fase pilot terbatas di Sukabumi. Kami sengaja membuat
              ini kecil dulu supaya setiap langkah — penerimaan, pengecekan, nilai bersih,
              dan pencairan — benar-benar rapi dan adil bagi penitip.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-linen-200/80">
              <div className="space-y-2 text-left">
                <span className="text-espresso-900 font-semibold block">Apa yang diuji</span>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Penerimaan item, QC, kesepakatan nilai bersih, update status.
                </p>
              </div>
              <div className="space-y-2 text-left">
                <span className="text-espresso-900 font-semibold block">Apa yang belum</span>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Penjemputan terjadwal, jadwal live, gajian otomatis, estimasi cuan.
                </p>
              </div>
              <div className="space-y-2 text-left">
                <span className="text-espresso-900 font-semibold block">Langkah selanjutnya</span>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Tanya soal pilot → kami cek kapasitas → konfirmasi opsi penyerahan.
                </p>
              </div>
            </div>

            <Link
              href="/booking"
              className="inline-flex bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 items-center justify-center gap-2 shadow-sm hover:shadow-warm"
            >
              <span>Tanya soal pilot</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
