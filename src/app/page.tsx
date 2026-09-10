import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import ValueEstimator from '@/components/landing/ValueEstimator';
import HowItWorks from '@/components/landing/HowItWorks';
import SukabumiCoverage from '@/components/landing/SukabumiCoverage';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FaqSection from '@/components/landing/FaqSection';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ValueEstimator />
      <HowItWorks />
      <SukabumiCoverage />
      <TestimonialsSection />
      <FaqSection />

      {/* Warm Editorial Chic Closing Banner */}
      <section className="py-20 bg-[#1F1916] text-linen-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-terracotta-500/20 text-terracotta-300 border border-terracotta-500/30 px-3.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-terracotta-400" />
            <span>Fase 1: Pilot Terbatas Sukabumi</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-linen-50">
            Beri Nafas Kedua untuk Pakaian Terbaikmu
          </h2>

          <p className="text-linen-300 text-xs sm:text-sm font-sans max-w-xl mx-auto leading-relaxed">
            PindahTangan membantu mengurus proses titip jual pakaian yang masih layak pakai —
            mulai dari pengecekan sampai item siap ditawarkan. Area, jadwal, dan mekanisme
            pencairan akan dikonfirmasi bersama sebelum item masuk proses pilot.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-espresso-900 hover:bg-terracotta-600 text-white px-8 py-3.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Tanya soal pilot</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/portal"
              className="w-full sm:w-auto border border-white/20 hover:border-white text-linen-200 hover:text-white px-8 py-3.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200"
            >
              Buka Lemari Konsinyasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
