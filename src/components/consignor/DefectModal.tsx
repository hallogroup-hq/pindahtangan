'use client';

import React from 'react';
import { ClothesItem, RejectAction } from '@/lib/types';
import { X, Check } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

interface DefectModalProps {
  item: ClothesItem | null;
  onClose: () => void;
  onResolve: (itemId: string, action: RejectAction) => void;
}

export default function DefectModal({ item, onClose, onResolve }: DefectModalProps) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-linen-300">
        {/* Header */}
        <div className="p-6 border-b border-linen-200 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-espresso-400 block">
              Laporan Screening Kerusakan (QC)
            </span>
            <h3 className="font-serif text-xl font-normal text-espresso-900 mt-0.5">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-espresso-400 hover:text-espresso-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Photo */}
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-linen-100 border border-linen-200">
            <img
              src={
                item.defect_photo_url ||
                'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80'
              }
              alt="Foto Detail Cacat"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-espresso-900/90 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
              Foto Bukti QC Studio
            </span>
          </div>

          {/* Notes */}
          <div className="p-4 rounded-xl bg-linen-50 border border-linen-200 space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-500 block">
              Catatan Pemeriksa:
            </span>
            <p className="text-espresso-800 leading-relaxed font-sans">
              {item.defect_notes ||
                'Ditemukan noda atau kerusakan serat yang tidak hilang setelah proses pembersihan uap.'}
            </p>
          </div>

          {/* Specs */}
          <div className="flex justify-between font-mono text-[11px] text-espresso-500 pb-2 border-b border-linen-200">
            <span>SKU: {item.sku}</span>
            <span>Merek: {item.brand || '-'}</span>
            <span>Floor: {formatIDR(item.floor_price)}</span>
          </div>

          {/* Resolution Options */}
          <div className="space-y-2 pt-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-espresso-500 block">
              Keputusan Pemilik Pakaian:
            </span>

            {item.reject_resolution ? (
              <div className="p-3.5 rounded-xl bg-linen-100 border border-linen-300 flex items-center gap-2 text-espresso-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  Opsi terpilih:{' '}
                  {item.reject_resolution === 'donate'
                    ? 'Didonasikan untuk Daur Ulang Tekstil Ramah Lingkungan.'
                    : 'Akan diambil kembali / dikembalikan saat pencairan gajian Jumat.'}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => onResolve(item.id, 'donate')}
                  className="p-3 rounded-xl border border-linen-300 hover:border-espresso-900 text-espresso-800 text-xs font-medium uppercase tracking-wider transition text-center"
                >
                  Relakan Donasi Daur Ulang
                </button>

                <button
                  onClick={() => onResolve(item.id, 'reclaim')}
                  className="p-3 rounded-xl bg-espresso-900 hover:bg-terracotta-600 text-linen-50 text-xs font-medium uppercase tracking-wider transition text-center"
                >
                  Ambil Kembali Saat Payout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-linen-50 border-t border-linen-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-espresso-600 hover:text-espresso-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
