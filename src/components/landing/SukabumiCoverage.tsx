import React from 'react';
import { SUKABUMI_DISTRICTS } from '@/lib/constants';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function SukabumiCoverage() {
  return (
    <section className="py-24 bg-linen-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
              Area Operasional
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
              Penjemputan Langsung di Wilayah Kota Sukabumi
            </h2>
            <p className="text-espresso-600 text-sm leading-relaxed font-sans">
              Untuk menjamin penanganan higienis dan kecepatan kurasi, kurir internal PindahTangan
              melayani penjemputan berkala di 7 kecamatan Kota Sukabumi dari hari Senin hingga Sabtu.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-3">
              {SUKABUMI_DISTRICTS.map((district) => (
                <div
                  key={district}
                  className="bg-white rounded-xl p-3 border border-linen-200 text-xs font-medium text-espresso-800"
                >
                  <span className="font-mono text-[10px] text-terracotta-500 mr-2">•</span>
                  <span>{district}</span>
                </div>
              ))}
              <div className="bg-linen-100 rounded-xl p-3 border border-linen-200 text-xs font-medium text-espresso-700">
                <span className="font-mono text-[10px] text-sage-600 mr-2">•</span>
                <span>Drop-off Mandiri Studio</span>
              </div>
            </div>

            <div className="pt-4 border-t border-linen-200 text-xs text-espresso-500 space-y-1">
              <p>• <strong>≥ 20 Potong:</strong> Layanan kurir jemput ke pintu rumah bebas ongkir.</p>
              <p>• <strong>&lt; 20 Potong:</strong> Dapat diantar mandiri atau menggunakan Gosend/GrabExpress.</p>
            </div>
          </div>

          {/* Right Column: Studio Hub Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-linen-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                  Pusat Operasional
                </span>
                <h3 className="font-serif text-2xl font-normal text-espresso-900">
                  Studio PindahTangan Hub Sukabumi
                </h3>
              </div>

              <div className="space-y-5 text-xs text-espresso-700 font-sans">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Alamat Drop-Point &amp; Studio Live:
                  </span>
                  <p className="text-espresso-900 font-medium leading-relaxed">
                    Jl. Siliwangi No. 102, Cikole, Kota Sukabumi, Jawa Barat 43113
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Jam Kerja QC &amp; Intake:
                  </span>
                  <p className="text-espresso-900 leading-relaxed">
                    Senin – Sabtu: 08.30 – 17.00 WIB
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Jadwal Live TikTok Shopping:
                  </span>
                  <div className="space-y-1 text-espresso-800">
                    <p>• <strong>Sore (16.00 – 18.00 WIB):</strong> Tier B — Casual Chic &amp; Workwear</p>
                    <p>• <strong>Malam (20.00 – 22.00 WIB):</strong> Tier A — Branded &amp; Gamis Pesta</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-linen-200 flex items-center justify-between">
                <span className="text-xs text-espresso-500">
                  Ingin pakaianmu masuk siaran minggu ini?
                </span>
                <Link
                  href="/booking"
                  className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>Booking Jemput</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
