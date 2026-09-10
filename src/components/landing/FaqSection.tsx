'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    category: 'Biaya & Ongkir',
    question: 'Apakah ada biaya di awal saat pakaian saya dijemput kurir?',
    answer:
      'Pilot ini sengaja dibuat kecil sehingga biaya, area, dan opsi penyerahan dikonfirmasi per peserta. Kami tidak menjanjikan penjemputan gratis atau biaya pasti sebelum kapasitas dan ketentuan pilot disetujui. Detail biaya akan dijelaskan sebelum item masuk proses.',
  },
  {
    category: 'Pencairan Dana',
    question: 'Kapan dan bagaimana uang hasil penjualan ditransfer ke rekening saya?',
    answer:
      'Jadwal dan mekanisme pencairan akan dijelaskan sebelum item masuk proses. Sebuah payout hanya memenuhi syarat setelah pembayaran pembeli terverifikasi dan proses rekonsiliasi yang berlaku selesai. Kami tidak menjanjikan transfer otomatis atau jadwal tetap di fase pilot ini.',
  },
  {
    category: 'SOP & Quality Control',
    question: 'Bagaimana jika ada pakaian saya yang bernoda atau cacat saat diperiksa studio?',
    answer:
      'Setiap item yang diterima akan dicek dan dicatat kondisinya. Jika ada item yang belum memenuhi kriteria, alasannya akan dijelaskan. Opsi untuk item yang tidak diterima (donasi, pengambilan kembali, dsb) harus disepakati tertulis sebelum pilot real-money berjalan.',
  },
  {
    category: 'Retensi 30 Hari',
    question: 'Berapa lama masa titip pakaian? Apa yang terjadi jika pakaian belum laku?',
    answer:
      'Masa konsinyasi dan opsi untuk item yang belum laku akan dijelaskan dalam ketentuan pilot yang disepakati tertulis. Kami tidak menentukan durasi pasti, harga beli putus, atau jalur donasi otomatis sebelum ketentuan pilot disetujui bersama.',
  },
  {
    category: 'Kategori Pakaian',
    question: 'Jenis pakaian apa saja yang diterima untuk dititipkan?',
    answer:
      'Kriteria penerimaan akan dijelaskan oleh tim saat mengecek item. Secara umum kami mencari pakaian dewasa yang masih bersih dan layak pakai. Daftar kategori pasti dan item yang tidak diterima dikonfirmasi sebelum penyerahan.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-linen-50 border-t border-linen-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Tanya Jawab Pilot
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
            Apa yang Diuji & Apa yang Belum
          </h2>
          <p className="text-espresso-600 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
            Jawaban di bawah mencerminkan apa yang sedang diuji dalam pilot terbatas. Detail pasti dikonfirmasi sebelum item masuk proses.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-linen-200 border-y border-linen-200">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-6 transition-colors">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left flex items-start justify-between gap-4 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-terracotta-600 font-semibold block">
                      {faq.category}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl text-espresso-900 group-hover:text-terracotta-600 transition-colors leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div
                    className={`mt-1 w-7 h-7 rounded-full border border-linen-300 flex items-center justify-center shrink-0 text-espresso-600 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 bg-linen-200 text-espresso-900' : 'group-hover:border-espresso-900'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-8 text-espresso-600 text-xs sm:text-sm font-sans leading-relaxed animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quiet Help Footnote */}
        <div className="bg-linen-100/70 rounded-2xl p-6 border border-linen-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 text-espresso-700">
            <HelpCircle className="w-5 h-5 text-terracotta-500 shrink-0" />
            <span>Punya pertanyaan soal pilot? Hubungi jalur pertanyaan pilot yang dipantau tim.</span>
          </div>
          <span className="text-espresso-500 text-[11px] font-mono">
            Jalur pertanyaan pilot akan dikonfirmasi bersama
          </span>
        </div>
      </div>
    </section>
  );
}
