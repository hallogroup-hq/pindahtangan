import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Booking Penjemputan',
      desc: 'Tentukan jadwal dan alamat rumahmu di Sukabumi. Kurir kami membawa kantong khusus dan menjemput gratis untuk titipan minimal 20 potong.',
    },
    {
      num: '02',
      title: 'Kurasi QC & Cuci Uap',
      desc: 'Setiap pakaian diperiksa kancing dan nodanya, disterilisasi dengan uap panas bersuhu >100°C agar wangi butik, lalu diberi nomor hangtag display.',
    },
    {
      num: '03',
      title: 'Siaran Live TikTok',
      desc: 'Host berbakat kami memamerkan bajumu di TikTok Shopping sesuai tier kualitas. Penonton langsung checkout dengan harga terbaik.',
    },
    {
      num: '04',
      title: 'Pencairan Dana Jumat',
      desc: 'Hasil penjualan langsung ditransfer ke rekening bank atau dompet digitalmu setiap Jumat sore pukul 16.00 WIB disertai slip rincian transparan.',
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
            Bagaimana PindahTangan Bekerja?
          </h2>
          <p className="text-xs sm:text-sm text-espresso-600 font-sans leading-relaxed">
            Pengalaman sirkular fesyen tanpa repot bagi kamu yang ingin mengosongkan lemari
            tanpa harus membuang waktu dan energi meladeni pembeli.
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
              Perbandingan Nilai
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-espresso-900">
              Menjual Mandiri vs. PindahTangan
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
                  <span>Mengukur lingkar dada, panjang lengan, dan detail kain satu per satu.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Lelah meladeni tawaran sadis atau pembeli yang membatalkan pesanan.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-espresso-400 font-mono">—</span>
                  <span>Membeli bubble wrap, mengemas paket, dan antre ke counter ekspedisi.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-white border-2 border-terracotta-500/30 space-y-4 shadow-sm">
              <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta-600 font-semibold block pb-2 border-b border-linen-200">
                Layanan Konsinyasi PindahTangan
              </span>
              <ul className="space-y-3 text-espresso-800 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Penjemputan Pintu ke Pintu:</strong> Pakaian diambil langsung ke rumah di Sukabumi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Higienitas Terjamin:</strong> Cuci uap panas &gt;100°C gratis di awal (biaya uap dipotong hanya saat laku).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Penjualan Live Interaktif:</strong> Host profesional memamerkan pakaian di TikTok secara dinamis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta-600 font-bold">•</span>
                  <span><strong>Gajian Mingguan Terjadwal:</strong> Uang masuk ke rekening bank tiap Jumat sore pukul 16.00 WIB.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
