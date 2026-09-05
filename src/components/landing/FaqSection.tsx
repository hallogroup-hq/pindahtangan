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
      'Sama sekali tidak ada biaya di muka (Rp 0). Layanan penjemputan ke pintu rumah gratis untuk penitipan minimal 20 potong pakaian di 7 kecamatan Kota Sukabumi. Biaya sterilisasi cuci uap panas Rp 2.500/pcs dan bagi hasil platform hanya dipotong secara transparan ketika pakaian telah berhasil terjual di Live TikTok.',
  },
  {
    category: 'Pencairan Dana',
    question: 'Kapan dan bagaimana uang hasil penjualan ditransfer ke rekening saya?',
    answer:
      'PindahTangan memiliki jadwal gajian rutin setiap hari Jumat sore pukul 16.00 WIB. Seluruh pakaian yang terjual pada periode Sabtu hingga Kamis malam akan otomatis direkonsiliasi dan ditransfer ke rekening bank (BCA, Mandiri, BRI, BSI) atau e-wallet (GoPay, OVO) Anda, disertai notifikasi slip resmi via WhatsApp.',
  },
  {
    category: 'SOP & Quality Control',
    question: 'Bagaimana jika ada pakaian saya yang bernoda atau cacat saat diperiksa studio?',
    answer:
      'Setiap pakaian melewati 3 stasiun kurasi dalam tempo 24 jam. Jika ditemukan noda membandel atau kerusakan resleting, tim QC akan memfoto bagian cacat tersebut. Foto ini otomatis muncul di Portal Penitip Anda dengan dua pilihan aksi: Anda bisa merelakannya untuk didonasikan/didaur ulang atau memilih untuk mengambilnya kembali.',
  },
  {
    category: 'Retensi 30 Hari',
    question: 'Berapa lama masa titip pakaian? Apa yang terjadi jika pakaian belum laku?',
    answer:
      'Masa konsinyasi aktif berlangsung selama 30 hari kalender. Jika ada pakaian yang belum terjual hingga hari ke-30, sistem mengaktifkan Opsi Beli Putus Obral (Rp 10.000/potong tunai). Anda tetap memperoleh uang tunai daripada baju kembali menumpuk di lemari, dan pakaian akan dialihkan ke siaran Live Khusus "Serba Ceban".',
  },
  {
    category: 'Kategori Pakaian',
    question: 'Jenis pakaian apa saja yang diterima untuk dititipkan?',
    answer:
      'Kami menerima pakaian wanita dan pria dewasa yang masih bersih dan layak pakai: Tier A (Brand mall Zara/Uniqlo, gamis pesta, gaun kondangan), Tier B (Blouse katun, kemeja kerja, celana kulot, tunik harian), dan Tier C (Kaos basic, cardigan santai). Kami tidak menerima pakaian dalam, pakaian anak balita, seragam sekolah/instansi, atau pakaian basah/berbau apek tajam.',
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
            Pertanyaan Umum
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
            Transparansi Layanan Konsinyasi
          </h2>
          <p className="text-espresso-600 text-xs sm:text-sm leading-relaxed font-sans max-w-xl mx-auto">
            Semua yang perlu Anda ketahui tentang alur penjemputan, sterilisasi uap, jadwal live, hingga transfer gajian tiap Jumat.
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
            <span>Punya pertanyaan khusus mengenai kondisi lemari Anda?</span>
          </div>
          <a
            href="https://wa.me/6281288997711?text=Halo%20Admin%20PindahTangan,%20saya%20ingin%20tanya%20seputar%20titip%20lemari"
            target="_blank"
            rel="noopener noreferrer"
            className="text-espresso-900 hover:text-terracotta-600 font-medium font-sans underline underline-offset-4 tracking-wider uppercase text-[11px]"
          >
            Chat Concierge WhatsApp Studio &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
