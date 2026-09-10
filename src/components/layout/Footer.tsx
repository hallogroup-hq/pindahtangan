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

          {/* Quick Access - Public routes only */}
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
                          <a
                            href="/pindahtangan-pitch-deck.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-300/90 hover:text-amber-200 transition font-medium flex items-center gap-1.5"
                          >
                            <span>📄 Unduh Pitch Deck (PDF)</span>
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Staff-only routes (hidden from public footer, accessible via direct nav or Navbar when authenticated) */}
                    <div className="hidden" aria-hidden="true">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-4">
                        Internal Staff Routes (Hidden from Public)
                      </span>
                      <ul className="text-xs text-stone-500 space-y-2.5">
                        <li>
                          <Link href="/studio" className="hover:text-stone-400 transition">
                            Studio QC & Cuci Uap
                          </Link>
                        </li>
                        <li>
                          <Link href="/host" className="hover:text-stone-400 transition">
                            Live Host Tablet Controller
                          </Link>
                        </li>
                        <li>
                          <Link href="/admin" className="hover:text-stone-400 transition">
                            Backoffice & Payout Jumat
                          </Link>
                        </li>
                      </ul>
                    </div>

          {/* Studio Hub - Removed unsupported operational claims per audit */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-400 font-semibold block mb-4">
                        Studio & Siaran Live
                      </span>
                      <div className="text-xs text-stone-400 space-y-3 leading-relaxed">
                        <p className="text-stone-500">
                          Detail operasional studio dan jadwal siaran akan dikonfirmasi saat pilot dibuka.
                        </p>
                        <p className="text-[11px] text-stone-500">
                          Pencairan dana dan jadwal transfer sedang divalidasi melalui pilot.
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
