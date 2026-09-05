import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import RoleSwitcher from '@/components/layout/RoleSwitcher';
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
  title: 'PindahTangan — Managed Fashion Consignment & Live Circular Marketplace',
  description:
    'Layanan konsinyasi fesyen terkelola nomor satu di Sukabumi. Baju dijemput ke rumah, dicuci uap higienis, dijual via Live TikTok, gajian tiap Jumat 16.00 WIB.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-linen-50 text-espresso-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
        <RoleSwitcher />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
