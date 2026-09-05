'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { BUSINESS_RULES } from '@/lib/constants';
import { ClothesItem } from '@/lib/types';
import {
  Hourglass,
  Clock,
  Sparkles,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AgingRetentionModule() {
  const { data, store } = useStore();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Filter items in active consignment or bought out
  const consignmentItems = data.items.filter(
    (i) => i.status !== 'sold' && i.status !== 'paid_out' && i.status !== 'rejected'
  );

  const calculateDaysRemaining = (expiryStr: string) => {
    const now = new Date();
    const expiry = new Date(expiryStr);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleBuyoutItem = (item: ClothesItem) => {
    if (
      confirm(
        `Beli Putus pakaian "${item.title}" (${item.sku}) seharga Rp 10.000 tunai untuk stok Live Huru-Hara "Serba Ceban" TikTok?`
      )
    ) {
      store.buyoutAgedItem(item.id);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(
        `Berhasil Beli Putus! ${item.sku} dialihkan ke katalog siaran Serba Ceban.`
      );
    }
  };

  // Group items by aging stages
  const urgentItems = consignmentItems.filter((i) => {
    const rem = calculateDaysRemaining(i.aging_expiry_date);
    return rem <= 0 && i.status !== 'bought_out';
  });

  const warningItems = consignmentItems.filter((i) => {
    const rem = calculateDaysRemaining(i.aging_expiry_date);
    return rem > 0 && rem <= 10 && i.status !== 'bought_out';
  });

  const normalItems = consignmentItems.filter((i) => {
    const rem = calculateDaysRemaining(i.aging_expiry_date);
    return rem > 10 && i.status !== 'bought_out';
  });

  const boughtOutItems = consignmentItems.filter((i) => i.status === 'bought_out');

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-espresso-900 text-linen-100 px-5 py-3.5 rounded-xl shadow-xl border border-espresso-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-linen-300 pb-4">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
          Modul 5 • Manajemen Inventaris Berjalan
        </span>
        <h2 className="font-serif text-2xl font-medium text-espresso-900">
          30-Day Aging Engine &amp; Pasokan Obral Ceban
        </h2>
        <p className="text-xs text-espresso-600 mt-0.5">
          Monitoring sisa masa pajang 30 hari, otomatisasi rekomendasi diskon live 15%, dan konversi beli putus tunai Rp 10.000/pcs untuk siaran viral TikTok.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
            Hari 1–20 (Siklus Normal)
          </span>
          <p className="font-serif text-2xl font-normal text-espresso-900">
            {normalItems.length} Potong
          </p>
          <p className="text-[11px] text-espresso-500 font-sans">
            Diprioritaskan di Live Tier A &amp; B
          </p>
        </div>

        <div className="p-4 bg-linen-50 border border-amber-300 rounded-xl space-y-1 bg-amber-50/40">
          <span className="text-[10px] font-mono tracking-wider uppercase text-amber-800 font-semibold block">
            Hari 21–29 (Diskon Rekomendasi 15%)
          </span>
          <p className="font-serif text-2xl font-normal text-amber-900">
            {warningItems.length} Potong
          </p>
          <p className="text-[11px] text-amber-700 font-sans">
            Promo flash sale sore
          </p>
        </div>

        <div className="p-4 bg-linen-50 border border-terracotta-300 rounded-xl space-y-1 bg-terracotta-50/40">
          <span className="text-[10px] font-mono tracking-wider uppercase text-terracotta-800 font-semibold block">
            Hari &ge; 30 (Batas Kadaluwarsa)
          </span>
          <p className="font-serif text-2xl font-normal text-terracotta-900">
            {urgentItems.length} Potong
          </p>
          <p className="text-[11px] text-terracotta-700 font-sans">
            Siap Beli Putus Obral Ceban
          </p>
        </div>

        <div className="p-4 bg-linen-50 border border-espresso-800 rounded-xl space-y-1 bg-linen-100/80">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-700 font-bold block">
            Stok Serba Ceban (Beli Putus)
          </span>
          <p className="font-serif text-2xl font-bold text-espresso-900">
            {boughtOutItems.length} Potong
          </p>
          <p className="text-[11px] text-espresso-600 font-sans">
            Katalog TikTok Live Huru-Hara
          </p>
        </div>
      </div>

      {/* Main Table: Aging Tracking */}
      <div className="bg-linen-50 border border-linen-300/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-linen-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linen-100/50">
          <div>
            <h3 className="font-serif text-base font-medium text-espresso-900">
              Pelacakan Umur Inventaris Studio (Batas 30 Hari)
            </h3>
            <p className="text-xs text-espresso-600">
              Hak milik dapat dibeli putus Rp 10.000 bersih untuk mencegah pakaian kembali mengotori lemari penitip.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-espresso-800">
            <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
              <tr>
                <th className="py-3 px-4">Pakaian &amp; SKU</th>
                <th className="py-3 px-4">Pemilik Lemari</th>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4 text-center">Sisa Waktu</th>
                <th className="py-3 px-4">Floor / Live</th>
                <th className="py-3 px-4 text-center">Status Retensi</th>
                <th className="py-3 px-4 text-right">Opsi Eksekusi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen-200 font-sans">
              {consignmentItems.map((item) => {
                const consignor = data.profiles.find((p) => p.id === item.consignor_id);
                const daysRemaining = calculateDaysRemaining(item.aging_expiry_date);
                const isExpired = daysRemaining <= 0;
                const isWarning = daysRemaining > 0 && daysRemaining <= 10;
                const isBoughtOut = item.status === 'bought_out';

                return (
                  <tr key={item.id} className="hover:bg-linen-100/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded bg-linen-200 overflow-hidden shrink-0 border border-linen-300">
                          <img
                            src={item.photo_url || ''}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-serif text-xs font-medium text-espresso-900 line-clamp-1">
                            {item.title}
                          </p>
                          <span className="font-mono text-[10px] text-espresso-500">
                            {item.sku} • {item.brand} (Size {item.size})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-serif font-medium text-espresso-900 block">
                        {consignor?.full_name || 'Penitip Sukabumi'}
                      </span>
                      <span className="font-mono text-[10px] text-espresso-500">
                        {consignor?.phone_number}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-espresso-600">
                      {formatDateIndo(item.consignment_start_date)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {isBoughtOut ? (
                        <span className="font-bold text-amber-900">Beli Putus</span>
                      ) : isExpired ? (
                        <span className="font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">
                          Kadaluwarsa ({Math.abs(daysRemaining)} hari lewat)
                        </span>
                      ) : isWarning ? (
                        <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {daysRemaining} hari lagi
                        </span>
                      ) : (
                        <span className="text-espresso-700">
                          {daysRemaining} hari
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-medium text-espresso-900 block">
                        {formatIDR(item.target_live_price)}
                      </span>
                      <span className="text-[10px] text-espresso-400">
                        Floor: {formatIDR(item.floor_price)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${
                          isBoughtOut
                            ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                            : isExpired
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : isWarning
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-linen-200 text-espresso-700 border-linen-300'
                        }`}
                      >
                        {isBoughtOut
                          ? 'Serba Ceban'
                          : isExpired
                          ? 'Expired'
                          : isWarning
                          ? 'Diskon 15%'
                          : 'Pajang Aktif'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isBoughtOut && (
                        <button
                          type="button"
                          onClick={() => handleBuyoutItem(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-terracotta-600 text-white hover:bg-terracotta-700 transition shadow-xs"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Beli Putus Ceban (Rp 10k)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
