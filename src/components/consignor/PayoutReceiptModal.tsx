'use client';

import React from 'react';
import { Payout } from '@/lib/types';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { X, Printer } from 'lucide-react';

interface PayoutReceiptModalProps {
  payout: Payout | null;
  onClose: () => void;
}

export default function PayoutReceiptModal({
  payout,
  onClose,
}: PayoutReceiptModalProps) {
  if (!payout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/70 backdrop-blur-sm animate-in fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-linen-300">
        {/* Header */}
        <div className="p-8 border-b border-linen-200 flex justify-between items-start bg-linen-50">
          <div>
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-espresso-400 block mb-1">
              Slip Pencairan Mingguan • Jumat 16.00 WIB
            </span>
            <h3 className="font-serif text-3xl font-normal text-espresso-900 tracking-tight">
              Pindah<span className="italic font-serif text-terracotta-600">Tangan</span>
            </h3>
            <span className="text-[10px] font-mono text-espresso-500 block mt-1">
              Nomor Slip: {payout.payout_code}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-espresso-400 hover:text-espresso-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 space-y-6 text-xs text-espresso-800">
          <div className="space-y-2 py-3 border-y border-linen-200 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-espresso-400">Penerima:</span>
              <strong className="text-espresso-900">{payout.destination_account_holder}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso-400">Rekening Tujuan:</span>
              <strong className="text-espresso-900">
                {payout.destination_bank} • {payout.destination_account_number}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso-400">Periode Penjualan:</span>
              <span>
                {formatDateIndo(payout.period_start)} – {formatDateIndo(payout.period_end)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso-400">Waktu Transfer:</span>
              <span>
                {payout.transferred_at ? formatDateIndo(payout.transferred_at) : 'Jumat 16.00 WIB'}
              </span>
            </div>
          </div>

          {/* Breakdown Calculations */}
          <div className="p-5 rounded-xl bg-linen-50 border border-linen-200 space-y-3">
            <div className="flex justify-between">
              <span className="text-espresso-600">Total Baju Terjual:</span>
              <span className="font-mono">{payout.items_count} Potong</span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso-600">Gross Floor Price:</span>
              <span className="font-mono">{formatIDR(payout.total_gross_floor)}</span>
            </div>
            <div className="flex justify-between text-rose-700">
              <span>Deduksi Sterilisasi Uap ({payout.items_count} × Rp 2.500):</span>
              <span className="font-mono">- {formatIDR(payout.total_steam_deduction)}</span>
            </div>

            <div className="pt-3 border-t border-linen-300 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-base font-normal text-espresso-900 block">
                  Total Dana Bersih Ditransfer:
                </span>
                <span className="text-[10px] text-espresso-500">
                  Nett masuk rekening tanpa potongan lainnya
                </span>
              </div>
              <span className="font-serif text-3xl font-light text-espresso-900">
                {formatIDR(payout.total_net_payout)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-linen-50 border-t border-linen-200 flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full border border-linen-300 hover:border-espresso-900 text-xs font-mono uppercase tracking-wider text-espresso-700 transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Slip</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-linen-50 bg-espresso-900 hover:bg-terracotta-600 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
