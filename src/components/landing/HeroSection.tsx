import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden bg-linen-50 border-b border-linen-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold">
                Pilot terbatas Sukabumi
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-espresso-900 leading-[1.12] tracking-tight">
                Pakaian yang masih bagus, nggak harus diam di lemari.
              </h1>
            </div>

            <p className="text-espresso-600 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              PindahTangan sedang menguji proses titip jual dengan kapasitas kecil di Sukabumi.
              Setiap langkah — penerimaan, pengecekan, nilai bersih — dijalani per item
              dan masih membutuhkan konfirmasi bersama. Kamu bisa fokus ke hal lain;
              kami bantu rapikan prosesnya, sementara kita tetap terbuka bagi yang
              tertarik mengikuti pilot ini.
            </p>

            {/* CTAs */}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/booking"
                className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-warm text-center"
              >
                <span>Tanya soal pilot</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </Link>

              <Link
                href="#how-it-works"
                className="border border-espresso-900/20 hover:border-espresso-900 text-espresso-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 text-center"
              >
                Lihat cara kerjanya
              </Link>
            </div>

            {/* Pilot Notes — replacement for unverified micro-stats */}

            <div className="pt-8 grid grid-cols-2 gap-6 border-t border-linen-300/80">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 block">
                  Apa yang diuji
                </span>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Penerimaan item, QC per item, updating status secara transparan.
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 block">
                  Apa yang belum dipastikan
                </span>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  Jadwal pasti penjemputan, gajian otomatis, estimasi cuan, dan hasil
                  live yang menjamin penghasilan. Ini masih fase pilot terbatas.
                </p>
              </div>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Main Editorial Image */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-linen-200 shadow-warm">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85"
                  alt="Curated Fashion Consignment Sukabumi"
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-espresso-950/10 to-transparent"></div>

                {/* Minimalist Live Indicator */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-espresso-950/80 backdrop-blur-md text-linen-100 px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
                  <span>Pilot Sukabumi</span>
                </div>

                {/* Bottom Editorial Caption */}
                <div className="absolute bottom-5 left-5 right-5 bg-linen-50/95 backdrop-blur-md rounded-xl p-4 border border-linen-200/80 text-espresso-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-terracotta-600 block">
                        Contoh item • Konsep pilot
                      </span>
                      <h4 className="font-serif text-base font-medium text-espresso-900 mt-0.5">
                        Pakaian layak pakai
                      </h4>
                      <p className="text-[11px] text-espresso-500">
                        Masuk proses pengecekan & nilai bersih
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-400 block">
                        Proses pilot
                      </span>
                      <span className="font-serif text-lg font-medium text-espresso-900">
                        Dibahas per item
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}