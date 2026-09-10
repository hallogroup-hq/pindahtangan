import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Booking Penjemputan',
      desc: 'Tentukan jadwal penjemputan bersama. Opsi penyerahan akan dikonfirmasi per pilot participant.'
    },
    {
      num: '02',
      title: 'Kurati QC & Evaluasi Nilai',
      desc: 'Setiap item diterima akan dicek kualitas dan kondisi. Nilai bersih akan dikonfirmasi per item sebelum masuk proses selanjutnya.'
    },
    {
      num: '03',
      title: 'Bandingkan & Ajukan ke Live',
      desc: 'Item yang lolos QC akan diajukan ke siaran live. Status dan harga akan diumumkan bersama peserta pilot.'
    },
    {
      num: '04',
      title: 'Evaluasi Pencairan',
      desc: 'Jadwal dan mekanisme pencairan akan dijelaskan sebelum item masuk proses. Tidak ada janji transfer otomatis di fase pilot ini.'
    },
  ];

  return (
    <section className="py-24 bg-white border-b border-linen-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Alur Konsinyasi Terkelola
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
            Bagaimana PindahTangan Bekerja (Pilot)?
          </h2>
          <p className="text-xs sm:text-sm text-espresso-600 font-sans leading-relaxed">
            Pengalaman sirkular fesyen yang sedang diuji. Setiap langkah dijalankan per
            item dan bersama pilot participant, bukan janji operasional standar.
          </p>
        </div>

        {/* 4 Minimalist Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {steps.map((step) => (
            <div key={step.num} className="space-y-4 text-left group">
              <div className="font-serif text-4xl sm:text-5xl font-light text-terracotta-500/80 group-hover:text-terracotta-600 transition-colors">
                {step.num}
              </div>
              <div className="h-px w-12 bg-espresso-900/20 group-hover:w-20 transition-all duration-300"></div>
              <h3 className="font-serif text-xl font-medium text-espresso-900">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-espresso-600 leading-relaxed font-sans">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Editorial Comparison Table */}
        <div className="mt-24 max-w-4xl mx-auto bg-linen-50 rounded-2xl p-8 sm:p-12 border border-linen-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-espresso-500 font-semibold block mb-1">
              Perbandingan Nilai (Pilot vs. Tradisional)
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-espresso-900">
              Panduan Panduan bagi Peserta Pilot
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div className="p-6 rounded-xl bg-white border border-linen-200 space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-400 block pb-2 border-b border-linen-200">
                Menjual Sendiri di Marketplace
              </span>
              <ul className="space-y-3 text-espresso-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Harus memfoto 5 sudut dan mencari pencahayaan bagus.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Mengukur dan melampirkan detail ukuran per pakaian.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Menghadapi tawaran dan pembatalan dari pembeli individu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Mengurus packing, ekspedisi, dan transfer uang sendiri.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white border-2 border-terracotta-500/30 space-y-4 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta-600 font-semibold block pb-2 border-b border-linen-200">
                Panduan Peserta Pilot PindahTangan
              </span>
              <ul className="space-y-3 text-espresso-800 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Petunjuk Langkah per Item:</strong> Setiap pakaian diproses secara terpisah, QC dan harga konfirmasi bersama.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Siaran Live Bersama:</strong> Host dan pilot participant menampilkan item secara dinamis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Konfirmasi Pencairan Tertulis:</strong> Setiap pembayaran dan transfer divalidasi bersama sebelum dikirim.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Tidak Ada Janji Rutin:</strong> Setiap jadwal, penyerahan, dan transfer akan dikonfirmasi per pilot participant.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}