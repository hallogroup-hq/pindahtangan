import React from 'react';
import Link from 'next/link';
import { SUKABUMI_DISTRICTS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-[#161412] text-[#EDE8E1] pt-20 pb-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <span className="font-serif text-2xl font-normal text-white tracking-tight">
                Pindah<span className="italic font-serif text-terracotta-400">Tangan</span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] text-stone-500 uppercase block mt-1">
                Circular Fashion • Sukabumi
              </span>
            </Link>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              &ldquo;Memberi nafas kedua untuk pakaian terbaikmu — dari lemarimu, berpindah tangan jadi cuan.&rdquo;
            </p>
          </div>

          {/* Pilot Sukabumi Area */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-4">
              Area Penjemputan
            </span>
            <ul className="text-xs text-stone-400 space-y-2">
              {SUKABUMI_DISTRICTS.map((d) => (
                <li key={d} className="flex items-center gap-2">
                  <span className="text-stone-600 font-mono">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-4">
              Navigasi Platform
            </span>
            <ul className="text-xs text-stone-400 space-y-2.5">
              <li>
                <Link href="/booking" className="hover:text-white transition">
                  Jadwal Penjemputan Lemari
                </Link>
              </li>
              <li>
                <Link href="/portal" className="hover:text-white transition">
                  Lemari Konsinyasi Saya
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-white transition">
                  Studio QC &amp; Cuci Uap
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-white transition">
                  Live Host Tablet Controller
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition">
                  Backoffice &amp; Payout Jumat
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Hub */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-4">
              Studio &amp; Siaran Live
            </span>
            <div className="text-xs text-stone-400 space-y-3 leading-relaxed">
              <p>
                <strong>Studio PindahTangan Hub:</strong>
                <br />
                Jl. Siliwangi No. 102, Cikole, Kota Sukabumi
              </p>
              <p>
                <strong>Jadwal Siaran Live TikTok:</strong>
                <br />
                • Sore (Tier B): 16.00 – 18.00 WIB
                <br />
                • Malam (Tier A): 20.00 – 22.00 WIB
              </p>
              <p className="text-[11px] text-stone-500">
                Pencairan otomatis ke rekening bank setiap Jumat sore pukul 16.00 WIB.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-mono">
          <p>© 2026 PindahTangan. Managed Circular Fashion Consignment.</p>
          <p className="text-[11px]">Kota Sukabumi, Jawa Barat</p>
        </div>
      </div>
    </footer>
  );
}
