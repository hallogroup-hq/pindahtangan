'use client';

import React from 'react';
import { AdminTier } from '@/lib/types';
import { Shield, Sparkles, Truck, CircleDollarSign, CheckCircle2 } from 'lucide-react';

interface AdminHeaderProps {
  activeTier: AdminTier;
  onTierChange: (tier: AdminTier) => void;
  activeTabTitle: string;
}

const TIER_DETAILS: Record<
  AdminTier,
  {
    title: string;
    roleLabel: string;
    icon: React.ElementType;
    badgeColor: string;
    description: string;
    allowedModules: string[];
  }
> = {
  superadmin: {
    title: 'Superadmin (Founder & Owner)',
    roleLabel: 'Akses Penuh',
    icon: Shield,
    badgeColor: 'bg-espresso-900 text-linen-100 border-espresso-700',
    description: 'Akses penuh ke semua modul operasional, hak eksekusi gajian Jumat, dan visibilitas laba bersih platform.',
    allowedModules: ['Semua Modul', 'Laba Bersih', 'Disbursement', 'Co-Pilot'],
  },
  studio_lead: {
    title: 'Studio & QC Lead',
    roleLabel: 'Stasiun QC & Live',
    icon: Sparkles,
    badgeColor: 'bg-terracotta-50 text-terracotta-800 border-terracotta-200',
    description: 'Penerimaan kantong masuk, QC 5 parameter, sterilisasi uap >100°C, cetak hangtag, dan susun run-sheet 50 gantungan.',
    allowedModules: ['Intake Kantong', 'QC 5 Parameter', 'Cetak Hangtag', 'Live Run-Sheet', 'Co-Pilot Harga'],
  },
  logistics: {
    title: 'Logistics & Packing Station',
    roleLabel: 'Verifikasi & Resi',
    icon: Truck,
    badgeColor: 'bg-sage-50 text-sage-900 border-sage-300',
    description: 'Pemindaian barcode zero-error packing, cetak label thermal AWB 10x15 cm, dan dispatch 3PL J&T/SiCepat/Gosend.',
    allowedModules: ['Barcode Scan Zero-Error', 'Cetak Label AWB', 'Dispatch 3PL'],
  },
  finance: {
    title: 'Finance & Payout Admin',
    roleLabel: 'Kas & Gajian Jumat',
    icon: CircleDollarSign,
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-300',
    description: 'Rekonsiliasi kas mingguan, eksekusi batch payout Jumat 16.00 WIB, deduksi cuci uap Rp 2.500/pcs, dan ekspor CSV BCA/Mandiri.',
    allowedModules: ['Friday Payout Engine', 'Rekonsiliasi Bank', 'Slip WhatsApp', 'Ekspor CSV Pembukuan'],
  },
};

export default function AdminHeader({
  activeTier,
  onTierChange,
  activeTabTitle,
}: AdminHeaderProps) {
  const currentDetails = TIER_DETAILS[activeTier];
  const IconComponent = currentDetails.icon;

  return (
    <header className="bg-linen-100/70 border-b border-linen-300/80 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Studio Identity */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-semibold tracking-[0.2em] uppercase bg-espresso-900 text-linen-100 rounded">
                STUDIO HUB SUKABUMI
              </span>
              <span className="text-[11px] font-sans text-espresso-500 font-medium flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Shift Operasional Aktif • Jl. Siliwangi No. 102
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-espresso-900 tracking-tight">
                Pusat Kendali Operasional
              </h1>
              <span className="hidden sm:inline-block text-espresso-400 font-serif italic text-sm">
                / {activeTabTitle}
              </span>
            </div>
          </div>

          {/* Granular 4-Tier RBAC Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-linen-50/90 p-2 sm:p-2.5 rounded-xl border border-linen-300/90 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-linen-200/80 flex items-center justify-center text-espresso-800">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight pr-2">
                <span className="text-[9px] font-mono tracking-wider uppercase text-espresso-500 block font-semibold">
                  Simulasi Hak Akses (RBAC)
                </span>
                <span className="text-xs font-serif font-medium text-espresso-900">
                  {currentDetails.title}
                </span>
              </div>
            </div>

            {/* Switcher Buttons */}
            <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-linen-200/60 p-1 rounded-lg border border-linen-300/60">
              <button
                type="button"
                onClick={() => onTierChange('superadmin')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-sans font-medium transition-all text-center ${
                  activeTier === 'superadmin'
                    ? 'bg-espresso-900 text-linen-50 shadow-xs'
                    : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100'
                }`}
              >
                Superadmin
              </button>
              <button
                type="button"
                onClick={() => onTierChange('studio_lead')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-sans font-medium transition-all text-center ${
                  activeTier === 'studio_lead'
                    ? 'bg-espresso-900 text-linen-50 shadow-xs'
                    : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100'
                }`}
              >
                Studio &amp; QC
              </button>
              <button
                type="button"
                onClick={() => onTierChange('logistics')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-sans font-medium transition-all text-center ${
                  activeTier === 'logistics'
                    ? 'bg-espresso-900 text-linen-50 shadow-xs'
                    : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100'
                }`}
              >
                Logistics
              </button>
              <button
                type="button"
                onClick={() => onTierChange('finance')}
                className={`px-2.5 py-1.5 rounded-md text-[11px] font-sans font-medium transition-all text-center ${
                  activeTier === 'finance'
                    ? 'bg-espresso-900 text-linen-50 shadow-xs'
                    : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100'
                }`}
              >
                Finance
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic RBAC Privilege Notice */}
        <div className="mt-3 pt-2.5 border-t border-linen-200 flex flex-wrap items-center justify-between text-xs text-espresso-600 gap-2">
          <p className="font-sans text-[11px] leading-relaxed text-espresso-600">
            <span className="font-semibold text-espresso-800">Cakupan Wewenang:</span>{' '}
            {currentDetails.description}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {currentDetails.allowedModules.map((mod) => (
              <span
                key={mod}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-linen-200/70 text-espresso-800 border border-linen-300/80"
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                {mod}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
