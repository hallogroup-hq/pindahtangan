import React from 'react';
import { Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  district: string;
  role: string;
  quote: string;
  itemsCount: number;
  earnedAmount: string;
  period: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ibu Ratna Dewi',
    district: 'Cikole, Sukabumi',
    role: 'Ibu Rumah Tangga & Mantan Karyawati',
    quote:
      'Lemari saya tadinya sesak dengan baju kantor dan gamis yang cuma dipakai sekali. Dijemput kurir hari Selasa, Jumat sorenya langsung masuk transferan Rp 1,4 juta lebih! Nggak perlu pusing foto-foto atau layani orang nawar sadis di marketplace.',
    itemsCount: 28,
    earnedAmount: 'Rp 1.485.000',
    period: '2 Minggu Konsinyasi',
  },
  {
    name: 'Teh Nenden Lestari',
    district: 'Citamiang, Sukabumi',
    role: 'Guru & Penggemar Fashion',
    quote:
      'Paling suka transparansinya. Pas ada blouse saya yang ada noda kopi kecil di kerah, tim QC kirim foto penjelasannya ke portal, saya tinggal klik donasi. Baju lain yang lolos langsung wangi uap butik dan laku di live TikTok malamnya.',
    itemsCount: 35,
    earnedAmount: 'Rp 2.120.000',
    period: '3 Minggu Konsinyasi',
  },
  {
    name: 'Cindy Octaviana',
    district: 'Baros, Sukabumi',
    role: 'Content Creator Lokal',
    quote:
      'Solusi paling elegan buat decluttering lemari. PindahTangan beneran jemput gratis ke rumah karena saya titip 22 pcs. Jadwal gajian tiap Jumat jam 4 sore juga selalu on-time langsung ada slip WA resminya.',
    itemsCount: 22,
    earnedAmount: 'Rp 980.000',
    period: '1 Minggu Konsinyasi',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-linen-100/50 border-t border-linen-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Kisah Nyata Penitip Lemari
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
            Dari Lemari Penuh Jadi Uang Tunai
          </h2>
          <p className="text-espresso-600 text-xs sm:text-sm leading-relaxed font-sans">
            Ratusan perempuan di Kota Sukabumi telah mempercayakan koleksi pakaiannya tanpa ribet, tanpa drama tawar-menawar.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-8 border border-linen-200/90 shadow-sm flex flex-col justify-between space-y-6 relative hover:border-linen-300 transition-all duration-300"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-terracotta-500/20" />
                <p className="font-serif text-espresso-800 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-linen-200/80 space-y-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="font-sans font-semibold text-espresso-900 text-xs">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-espresso-500 font-sans">
                      {t.district} • {t.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] font-mono bg-linen-50 p-2.5 rounded-lg border border-linen-200 text-espresso-700">
                  <span>{t.itemsCount} Pcs Dititip</span>
                  <span className="font-bold text-terracotta-600 font-sans text-xs">
                    Cair {t.earnedAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
