'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { ClothesItem, Payout, RejectAction } from '@/lib/types';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { STATUS_LABELS, TIER_CONFIG } from '@/lib/constants';
import DefectModal from '@/components/consignor/DefectModal';
import PayoutReceiptModal from '@/components/consignor/PayoutReceiptModal';
import BankDetailsModal from '@/components/consignor/BankDetailsModal';
import { ArrowUpRight, ArrowRight, Truck, CheckCircle2, Clock, Sparkles, Package, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConsignorPortalPage() {
  const { data, activeUser, store } = useStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedDefectItem, setSelectedDefectItem] = useState<ClothesItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payout | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState<boolean>(false);

  const userItems = data.items.filter((i) => i.consignor_id === activeUser.id);
  const userPayouts = data.payouts.filter((p) => p.consignor_id === activeUser.id);
  const userBatches = data.batches.filter((b) => b.consignor_id === activeUser.id);
  const activeBatches = userBatches.filter((b) => b.status !== 'completed');

  const totalItems = userItems.length;
  const inSteamItems = userItems.filter((i) => i.status === 'in_steam').length;
  const readyLiveItems = userItems.filter(
    (i) => i.status === 'ready_for_live' || i.status === 'in_live_queue'
  ).length;
  const soldPendingPayout = userItems.filter((i) => i.status === 'sold');
  const totalUpcomingPayoutNet = soldPendingPayout.reduce(
    (sum, i) => sum + (i.net_payout_amount || Math.max(0, i.floor_price - i.steam_fee)),
    0
  );

  const filteredItems = userItems.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'steam') return item.status === 'in_steam';
    if (activeTab === 'live')
      return item.status === 'ready_for_live' || item.status === 'in_live_queue';
    if (activeTab === 'sold') return item.status === 'sold';
    if (activeTab === 'rejected') return item.status === 'rejected';
    if (activeTab === 'paid') return item.status === 'paid_out';
    return true;
  });

  const handleResolveDefect = (itemId: string, action: RejectAction) => {
    store.resolveRejectItem(itemId, action);
    setSelectedDefectItem(null);
  };

  const handleBuyout = (itemId: string) => {
    if (
      confirm(
        'Aktifkan Opsi Beli Putus Obral (Rp 10.000)? Saldo akan ditambahkan ke payout Jumat dan pakaian akan masuk siaran Live TikTok Obral Ceban.'
      )
    ) {
      store.buyoutAgedItem(itemId);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-linen-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Top Profile Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-linen-300">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
              Lemari Konsinyasi Saya
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
              {activeUser.full_name}
            </h1>
            <p className="text-xs text-espresso-500 font-sans">
              Domisili {activeUser.city} • Rekening {activeUser.bank_name || 'BCA'} (
              {activeUser.bank_account_number || 'Belum diatur'})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBankModalOpen(true)}
              className="border border-linen-300 hover:border-espresso-900 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider text-espresso-700 transition"
            >
              Rekening Transfer
            </button>
            <Link
              href="/booking"
              className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-6 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider transition flex items-center gap-1.5 shadow-sm"
            >
              <span>+ Titip Baju Baru</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Active Intake Batches In Progress */}
        {activeBatches.length > 0 && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono tracking-widest uppercase text-espresso-500 font-semibold block">
              Status Penjemputan Lemari Terkini
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeBatches.map((batch) => {
                const statusInfo = {
                  scheduled: {
                    label: 'Kurir Dijadwalkan',
                    desc: 'Kurir internal akan menghubungi Anda via WhatsApp sebelum tiba di lokasi.',
                    badge: 'bg-amber-100 text-amber-900 border-amber-300',
                  },
                  picked_up: {
                    label: 'Diantar ke Studio',
                    desc: 'Kantong pakaian telah diambil kurir dan dalam perjalanan ke Studio Jl. Siliwangi No. 102.',
                    badge: 'bg-blue-100 text-blue-900 border-blue-300',
                  },
                  in_qc: {
                    label: 'Sedang Screening QC & Uap',
                    desc: 'Pakaian sedang dihitung fisik, diperiksa noda/kancing, dan disterilisasi cuci uap panas >100°C.',
                    badge: 'bg-purple-100 text-purple-900 border-purple-300',
                  },
                  completed: {
                    label: 'Selesai Kurasi',
                    desc: 'Seluruh pakaian telah ber-hangtag dan siap masuk siaran live.',
                    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                  },
                }[batch.status] || {
                  label: batch.status,
                  desc: '',
                  badge: 'bg-linen-200 text-espresso-800 border-linen-300',
                };

                return (
                  <div
                    key={batch.id}
                    className="bg-white rounded-2xl p-6 border border-linen-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-espresso-900">
                            {batch.batch_code}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${statusInfo.badge}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-xs text-espresso-600 font-sans">{statusInfo.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[9px] font-mono text-espresso-400 block uppercase">
                          Estimasi
                        </span>
                        <span className="font-serif text-lg font-medium text-espresso-900">
                          {batch.actual_count > 0 ? batch.actual_count : batch.estimated_count} pcs
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-linen-200/80 flex items-center justify-between text-[11px] text-espresso-500 font-sans">
                      <div className="truncate max-w-[260px]">
                        📍 {batch.pickup_address}
                      </div>
                      <a
                        href={`https://wa.me/6281288997711?text=${encodeURIComponent(
                          `Halo Kurir PindahTangan Sukabumi, saya ingin konfirmasi status penjemputan untuk Batch ${batch.batch_code}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-terracotta-600 hover:text-espresso-900 font-medium font-sans flex items-center gap-1 shrink-0 ml-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Kurir</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4 Quiet High-End Metric Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400 block">
              Total Koleksi Lemari
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-light text-espresso-900">
              {totalItems} <span className="text-xs font-sans text-espresso-500 font-normal">pcs</span>
            </div>
            <span className="text-[11px] text-espresso-400 block">Tercatat di studio Sukabumi</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400 block">
              Sterilisasi Cuci Uap
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-light text-espresso-900">
              {inSteamItems} <span className="text-xs font-sans text-espresso-500 font-normal">pcs</span>
            </div>
            <span className="text-[11px] text-espresso-400 block">Steril uap panas &gt;100°C</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400 block">
              Siap Siaran Live
            </span>
            <div className="font-serif text-3xl sm:text-4xl font-light text-espresso-900">
              {readyLiveItems} <span className="text-xs font-sans text-espresso-500 font-normal">pcs</span>
            </div>
            <span className="text-[11px] text-espresso-400 block">Sudah memiliki nomor hangtag</span>
          </div>

          <div className="space-y-1 bg-linen-100/70 p-4 rounded-xl border border-linen-200">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-600 block">
                Pencairan Jumat 16.00
              </span>
              <span className="text-[9px] font-mono bg-espresso-900 text-white px-1.5 py-0.2 rounded">
                {soldPendingPayout.length} laku
              </span>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-normal text-espresso-900">
              {formatIDR(totalUpcomingPayoutNet)}
            </div>
            <span className="text-[10px] text-espresso-500 block">
              Nett hak bersih siap transfer
            </span>
          </div>
        </div>

        {/* Referral Card: Ajak Tetangga Bersih Lemari */}
        <div className="bg-gradient-to-r from-linen-100 via-linen-100/90 to-linen-200/50 border border-linen-300 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-700 font-bold">
                  PROGRAM KOMUNITAS SUKABUMI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                  Bonus Rp 10.000 / Batch Lolos QC
                </span>
              </div>
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Ajak Tetangga Bersih Lemari
              </h3>
              <p className="text-xs text-espresso-600 leading-relaxed max-w-xl">
                Bagikan kode unik Anda kepada teman atau tetangga di Kota Sukabumi. Setiap batch yang berhasil dijemput dan lolos kurasi, Anda otomatis mendapatkan bonus tunai Rp 10.000 yang dicairkan bersama gajian Jumat.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-xl border border-linen-300 text-left sm:text-right shrink-0">
              <span className="text-[10px] font-mono text-espresso-500 uppercase block">
                Total Bonus Terkumpul
              </span>
              <span className="font-serif text-2xl font-bold text-emerald-800 block mt-0.5">
                {formatIDR(activeUser.referral_bonus_earned || 0)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-linen-200/80">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-linen-300 flex-1">
              <span className="text-xs font-mono text-espresso-500">Kode:</span>
              <span className="text-xs font-mono font-bold text-espresso-900 tracking-wider">
                {activeUser.referral_code || 'RATNA-SKB'}
              </span>
              <span className="text-espresso-300">|</span>
              <span className="text-[11px] font-mono text-espresso-600 truncate">
                https://pindahtangan-zeta.vercel.app/booking?ref={activeUser.referral_code || 'RATNA-SKB'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const url = `https://pindahtangan-zeta.vercel.app/booking?ref=${activeUser.referral_code || 'RATNA-SKB'}`;
                  navigator.clipboard.writeText(url);
                  alert('Tautan referral berhasil disalin!');
                }}
                className="px-3.5 py-2.5 rounded-xl bg-linen-100 hover:bg-linen-200 border border-linen-300 text-espresso-800 text-xs font-medium transition"
              >
                Salin Tautan
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Halo! Yuk bersihkan lemari pakaianmu dan dapatkan uang tunai setiap Jumat lewat PindahTangan Sukabumi. Kurir jemput gratis ke rumah: https://pindahtangan-zeta.vercel.app/booking?ref=${activeUser.referral_code || 'RATNA-SKB'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium transition flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Bagikan ke WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Minimalist Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-linen-300 pb-3 flex-wrap gap-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                { id: 'all', label: `Semua (${totalItems})` },
                { id: 'live', label: `Siap Live (${readyLiveItems})` },
                { id: 'steam', label: `Cuci Uap (${inSteamItems})` },
                { id: 'sold', label: `Terjual (${soldPendingPayout.length})` },
                {
                  id: 'rejected',
                  label: `Cacat QC (${userItems.filter((i) => i.status === 'rejected').length})`,
                },
                {
                  id: 'paid',
                  label: `Selesai (${userItems.filter((i) => i.status === 'paid_out').length})`,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs uppercase tracking-widest pb-3 -mb-3 transition-colors relative whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-espresso-900 font-semibold border-b-2 border-espresso-900'
                      : 'text-espresso-400 hover:text-espresso-700 font-medium'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clothes Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-espresso-400 text-xs">
              Belum ada pakaian di kategori ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => {
                const statusMeta = STATUS_LABELS[item.status] || {
                  label: item.status,
                  color: 'bg-linen-100 text-espresso-800 border-linen-300',
                };
                const tierMeta = TIER_CONFIG[item.category_tier];

                return (
                  <div
                    key={item.id}
                    className="group bg-white rounded-xl overflow-hidden border border-linen-200/90 hover:border-linen-300 transition-all flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {/* Photo Thumbnail */}
                      <div className="relative aspect-[4/3] w-full bg-linen-100 overflow-hidden">
                        <img
                          src={item.photo_url || 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-espresso-950/90 text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded">
                          Hangtag #{item.hangtag_number}
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusMeta.color}`}
                          >
                            {statusMeta.label}
                          </span>
                        </div>
                      </div>

                      {/* Item Specs */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                              {item.brand || 'No Brand'}
                            </span>
                            <span className="text-[10px] font-mono text-espresso-400">
                              {item.sku}
                            </span>
                          </div>
                          <h3 className="font-serif text-lg font-normal text-espresso-900 leading-snug">
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-espresso-500 font-sans">
                          <span>Size {item.size || 'All Size'}</span>
                          {item.chest_width_cm && <span>• LD {item.chest_width_cm} cm</span>}
                          <span>• {tierMeta?.label.split(' • ')[0]}</span>
                        </div>

                        {/* Price Breakdown */}
                        <div className="pt-3 border-t border-linen-200 flex justify-between items-baseline">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-400 block">
                              Hak Bersih Consignor
                            </span>
                            <span className="font-serif text-base font-medium text-espresso-900">
                              {formatIDR(item.floor_price)}
                            </span>
                          </div>

                          {item.sold_price ? (
                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-700 block">
                                Laku Live TikTok
                              </span>
                              <span className="font-serif text-base font-medium text-emerald-800">
                                {formatIDR(item.sold_price)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-400 block">
                                Estimasi Buka Live
                              </span>
                              <span className="text-xs font-mono text-espresso-600">
                                {formatIDR(item.target_live_price)}
                              </span>
                            </div>
                          )}
                        </div>

                        {item.status === 'sold' && (
                          <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200">
                            Transfer Bersih: {formatIDR(item.net_payout_amount || item.floor_price - 2500)} (deduksi uap Rp 2.500)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-5 pt-0">
                      {item.status === 'rejected' && (
                        <button
                          onClick={() => setSelectedDefectItem(item)}
                          className="w-full bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition"
                        >
                          Periksa Foto Cacat QC
                        </button>
                      )}

                      {item.status !== 'sold' &&
                        item.status !== 'paid_out' &&
                        item.status !== 'rejected' &&
                        item.status !== 'bought_out' && (
                          <div className="pt-2 border-t border-linen-200 flex items-center justify-between text-[10px] font-mono text-espresso-400">
                            <span>Jatuh Tempo: {formatDateIndo(item.aging_expiry_date)}</span>
                            <button
                              onClick={() => handleBuyout(item.id)}
                              className="text-terracotta-600 hover:text-espresso-900 underline uppercase tracking-wider"
                            >
                              Beli Putus Ceban
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payout History Statement */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
          <div className="flex justify-between items-baseline pb-4 border-b border-linen-200">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400 block">
                Catatan Finansial
              </span>
              <h3 className="font-serif text-2xl font-normal text-espresso-900">
                Riwayat Slip Pencairan Jumat Sore
              </h3>
            </div>
            <span className="text-xs font-mono text-espresso-500">
              Cutoff Tiap Kamis 23.59 WIB
            </span>
          </div>

          {userPayouts.length === 0 ? (
            <div className="py-8 text-center text-espresso-400 text-xs">
              Belum ada riwayat pencairan dana gajian.
            </div>
          ) : (
            <div className="divide-y divide-linen-200">
              {userPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-espresso-900">
                        {payout.payout_code}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        Berhasil Ditransfer
                      </span>
                    </div>
                    <p className="text-espresso-500 font-sans">
                      Periode: {formatDateIndo(payout.period_start)} – {formatDateIndo(payout.period_end)} • {payout.items_count} Potong Baju
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-400 block">
                        Total Dana Diterima
                      </span>
                      <span className="font-serif text-lg font-medium text-espresso-900">
                        {formatIDR(payout.total_net_payout)}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(payout)}
                      className="border border-linen-300 hover:border-espresso-900 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider text-espresso-800 transition"
                    >
                      Buka Slip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DefectModal
        item={selectedDefectItem}
        onClose={() => setSelectedDefectItem(null)}
        onResolve={handleResolveDefect}
      />

      <PayoutReceiptModal
        payout={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      <BankDetailsModal
        user={activeUser}
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        onSave={(updated) =>
          store.updateBankDetails({
            userId: activeUser.id,
            bankName: updated.bankName,
            accountNumber: updated.accountNumber,
            accountHolder: updated.accountHolder,
          })
        }
      />
    </div>
  );
}
