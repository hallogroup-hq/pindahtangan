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
              Penjemputan Langsung untuk Peserta Pilot
            </h2>

            <p className="text-espresso-600 text-sm leading-relaxed font-sans">
              Penjemputan kurir tersedia untuk peserta pilot terbatas di Sukabumi. Area dan jadwal penyerahan akan dikonfirmasi bersama saat pendaftaran.
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
                <span>Ketersediaan akan diverifikasi saat pilot</span>
              </div>
            </div>

            <div className="pt-4 border-t border-linen-200 text-xs text-espresso-500 space-y-1">
              <p>
                <strong>Layanan kurir:</strong> Ditetapkan saat pendaftaran pilot.
              </p>
              <p>
                <strong>Drop-off mandiri:</strong> Jl. Siliwangi atau via transportasi lain. Detail akan dikonfirmasi saat pendaftaran.
              </p>
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
                  Studio PindahTangan
                </h3>
              </div>

              <div className="space-y-5 text-xs text-espresso-700 font-sans">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Alamat Studio & Drop-Point:
                  </span>
                  <p className="text-espresso-900 font-medium leading-relaxed">
                    Lokasi studio akan dikonfirmasi bersama peserta pilot.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Jam Operasional:
                  </span>
                  <p className="text-espresso-900 leading-relaxed">
                    Jadwal akan dikonfirmasi bersama saat pendaftaran.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block mb-1">
                    Pendaftaran Pilot:
                  </span>
                  <div className="space-y-1 text-espresso-800">
                    <p>
                      <strong>Klik di bawah ini</strong> untuk berpartisipasi dalam pilot terbatas. Kapasitas sedang dipastikan, dan area operasional serta jadwal akan dikonfirmasi bersama.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-linen-200 flex items-center justify-between">
                <span className="text-xs text-espresso-500">
                  Ingin berpartisipasi?
                </span>
                <Link
                  href="/booking"
                  className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all flex items-center gap-1.5"
                >
                  <span>Daftar Pilot</span>
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