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
                Layanan Konsinyasi Fesyen Terkelola • Pilot Sukabumi
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-espresso-900 leading-[1.12] tracking-tight">
                Memberi <span className="italic font-serif text-terracotta-600 font-normal">nafas kedua</span> untuk pakaian terbaikmu.
              </h1>
              <p className="font-serif text-lg sm:text-xl text-espresso-700 italic font-normal">
                &ldquo;Dari lemarimu, berpindah tangan jadi cuan.&rdquo;
              </p>
            </div>

            <p className="text-espresso-600 text-sm sm:text-base leading-relaxed max-w-xl font-sans">
              Lemari penuh tapi enggan repot memfoto, mengukur, dan meladeni tawar-menawar sadis?
              PindahTangan menjemput pakaianmu ke rumah di Kota Sukabumi, mensterilisasi dengan uap panas &gt;100°C,
              lalu menjualnya secara profesional melalui siaran <strong>Live TikTok Commerce</strong>.
              Uang tunai ditransfer otomatis ke rekeningmu setiap Jumat sore.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/booking"
                className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-warm text-center"
              >
                <span>Jemput Lemari (Gratis ≥20 pcs)</span>
                <ArrowUpRight className="w-4 h-4 opacity-80" />
              </Link>

              <Link
                href="#estimator"
                className="border border-espresso-900/20 hover:border-espresso-900 text-espresso-900 px-8 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition-all duration-200 text-center"
              >
                Hitung Estimasi Cuan
              </Link>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-linen-300/80">
              <div>
                <span className="font-serif text-3xl font-light text-espresso-900 block">
                  ≥20<span className="text-sm font-sans font-normal text-espresso-500 ml-1">pcs</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 block mt-1">
                  Gratis Dijemput Kurir
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl font-light text-espresso-900 block">
                  100<span className="text-sm font-sans font-normal text-espresso-500 ml-1">°C</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 block mt-1">
                  Steril Uap Panas
                </span>
              </div>
              <div>
                <span className="font-serif text-3xl font-light text-espresso-900 block">
                  16.00<span className="text-sm font-sans font-normal text-espresso-500 ml-1">WIB</span>
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 block mt-1">
                  Gajian Tiap Jumat
                </span>
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
                  <span>Studio Live Sukabumi</span>
                </div>

                {/* Bottom Editorial Caption */}
                <div className="absolute bottom-5 left-5 right-5 bg-linen-50/95 backdrop-blur-md rounded-xl p-4 border border-linen-200/80 text-espresso-900">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-terracotta-600 block">
                        Gantungan No. 42 • Tier B
                      </span>
                      <h4 className="font-serif text-base font-medium text-espresso-900 mt-0.5">
                        Zara Linen Summer Shirt
                      </h4>
                      <p className="text-[11px] text-espresso-500">
                        Kondisi Kurasi 9.5/10 • Cuci Uap Panas
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-400 block">
                        Hak Bersih
                      </span>
                      <span className="font-serif text-lg font-medium text-espresso-900">
                        Rp 45.000
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
