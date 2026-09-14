import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RoleSwitcher from '@/components/layout/RoleSwitcher';

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
  title: 'PindahTangan — Konsinyasi Fesyen Terkelola & Live Circular Marketplace (Sukabumi)',
  description:
    'Memberi nafas kedua untuk pakaian terbaikmu — Dari lemarimu, berpindah tangan jadi cuan. Konsinyasi pakaian terkurasi, jemput gratis Sukabumi, sterilisasi uap, dan gajian tiap Jumat.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-linen-50 text-espresso-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <RoleSwitcher />
        <Footer />
      </body>
    </html>
  );
}
