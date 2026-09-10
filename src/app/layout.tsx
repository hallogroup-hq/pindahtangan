import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PindahTangan — Pilot Prototipe Konsinyasi Fesyen Terkelola (Sukabumi)',
  description:
    'Prototipe pilot terbatas PindahTangan — konsinyasi fesyen terkelola Sukabumi. Ini adalah demonstrasi konsep, bukan layanan publik aktif. Daftar minit pilot untuk info lanjutan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-linen-50 text-espresso-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
        <div className="bg-terracotta-50 border border-terracotta-200/50 rounded-t-2xl p-4 sm:p-6 mb-8 max-w-4xl mx-auto text-center border-y">
          <div className="text-sm font-medium text-terracotta-900 uppercase tracking-wider">
            <strong>Ini adalah prototipe pilot — belum siap layanan publik.</strong>
          </div>
          <div className="mt-2 text-xs text-terracotta-600">
            Konsep kami sedang diuji. Segera dapat daftar minat di halaman Tanya soal Pilot.
          </div>
        </div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
