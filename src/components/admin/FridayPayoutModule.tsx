'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { BUSINESS_RULES } from '@/lib/constants';
import { ClothesItem, Payout, Profile } from '@/lib/types';
import PayoutReceiptModal from '@/components/consignor/PayoutReceiptModal';
import {
  CalendarClock,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ExternalLink,
  MessageCircle,
  Copy,
  Receipt,
  Building2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FridayPayoutModule() {
  const { data, store } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'history'>('pending');
  const [selectedReceipt, setSelectedReceipt] = useState<Payout | null>(null);
  const [whatsappModalData, setWhatsappModalData] = useState<{
    consignor: Profile;
    payoutCode: string;
    itemsCount: number;
    grossFloor: number;
    steamDeduction: number;
    netPayout: number;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 1. Pending Friday Payouts calculation
  const soldItemsPending = data.items.filter(
    (i) => i.status === 'sold' && !i.payout_id
  );

  const pendingByConsignor = new Map<string, ClothesItem[]>();
  soldItemsPending.forEach((i) => {
    const list = pendingByConsignor.get(i.consignor_id) || [];
    list.push(i);
    pendingByConsignor.set(i.consignor_id, list);
  });

  const totalPendingGrossFloor = soldItemsPending.reduce(
    (sum, i) => sum + i.floor_price,
    0
  );
  const totalPendingSteamDeduction =
    soldItemsPending.length * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
  const totalPendingNetPayout = Math.max(
    0,
    totalPendingGrossFloor - totalPendingSteamDeduction
  );

  // Trigger Friday Payout Batch Execution
  const handleTriggerPayout = () => {
    if (soldItemsPending.length === 0) {
      alert('Tidak ada pakaian berstatus terjual yang menunggu payout.');
      return;
    }

    if (
      confirm(
        `Jalankan Batch Payout Jumat 16.00 WIB untuk ${soldItemsPending.length} potong baju bagi ${pendingByConsignor.size} pemilik lemari (Total ${formatIDR(totalPendingNetPayout)})?`
      )
    ) {
      const generated = store.executeFridayPayout();
      confetti({
        particleCount: 75,
        spread: 75,
        origin: { y: 0.5 },
      });
      showToast(
        `Berhasil mengeksekusi payout Jumat untuk ${generated.length} pemilik lemari!`
      );
    }
  };

  // Download Bank CSV
  const handleDownloadBankCSV = (format: 'bca' | 'mandiri') => {
    const csvContent = store.exportBankDisbursementCSV(format);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `payout_pindahtangan_${format}_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`File CSV format ${format.toUpperCase()} berhasil diunduh!`);
  };

  // Format WhatsApp Text
  const getWhatsAppMessage = (item: {
    consignor: Profile;
    payoutCode: string;
    itemsCount: number;
    grossFloor: number;
    steamDeduction: number;
    netPayout: number;
  }) => {
    return `Halo Ibu/Kak ${item.consignor.full_name}, kabar gembira dari PindahTangan Studio Sukabumi! 🧺✨

Gajian konsinyasi fesyen Anda untuk periode minggu ini telah resmi diproses:
• Kode Payout: *${item.payoutCode}*
• Jumlah Pakaian Terjual: *${item.itemsCount} potong*
• Total Nilai Bersih (Floor): ${formatIDR(item.grossFloor)}
• Deduksi Biaya Cuci Uap (${item.itemsCount}x Rp 2.500): -${formatIDR(item.steamDeduction)}
---------------------------------------------
*TOTAL DITRANSFER BERSIH: ${formatIDR(item.netPayout)}*
• Bank Tujuan: *${item.consignor.bank_name || 'BCA'} ${item.consignor.bank_account_number || '-'}*
• Rekening: *${item.consignor.bank_account_holder || item.consignor.full_name}*

Cek rincian digital & pakaian yang laku melalui portal pemilik:
https://pindahtangan.id/portal

Terima kasih telah mempercayakan lemari Anda bersama PindahTangan! 🌱`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Teks pesan WhatsApp disalin ke clipboard!');
  };

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-espresso-900 text-linen-100 px-5 py-3.5 rounded-xl shadow-xl border border-espresso-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-linen-300 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Modul 4 • Otomasi Finansial &amp; Escrow
          </span>
          <h2 className="font-serif text-2xl font-medium text-espresso-900">
            Friday Payout Batch Engine (Jumat 16.00 WIB)
          </h2>
          <p className="text-xs text-espresso-600 mt-0.5">
            Cutoff penjualan Kamis 23.59 WIB, deduksi cuci uap Rp 2.500/pcs presisi, ekspor payroll CSV BCA/Mandiri, dan slip digital WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-linen-200/60 p-1 rounded-lg border border-linen-300/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('pending')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'pending'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            1. Menunggu Transfer ({pendingByConsignor.size})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'history'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            2. Riwayat Transfer ({data.payouts.length})
          </button>
        </div>
      </div>

      {/* Friday Cutoff Banner (PRD Seksi 4.4) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-espresso-900 text-linen-100 border border-espresso-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-amber-300" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-amber-300">
              JADWAL BATCH MINGGUAN RESMI
            </span>
          </div>
          <h3 className="font-serif text-lg font-medium text-linen-50">
            Jumat Pukul 16.00 WIB Tepat
          </h3>
          <p className="text-xs text-linen-300 font-sans">
            Cutoff Penjualan: Sabtu 00:00 s/d Kamis 23:59 WIB. Baju laku Jumat masuk siklus pekan berikutnya.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadBankCSV('bca')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-linen-100 text-espresso-900 hover:bg-white transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            CSV BCA KlikBisnis
          </button>
          <button
            type="button"
            onClick={() => handleDownloadBankCSV('mandiri')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-linen-100 text-espresso-900 hover:bg-white transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            CSV Mandiri MCM
          </button>
          <button
            type="button"
            onClick={handleTriggerPayout}
            disabled={soldItemsPending.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white disabled:opacity-40 transition shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            Eksekusi Payout Jumat 16.00 WIB
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 1: PENDING PAYOUTS (MENUNGGU TRANSFER)        */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'pending' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Penitip Berhak Gajian
              </span>
              <p className="font-serif text-2xl font-normal text-espresso-900">
                {pendingByConsignor.size} Penitip
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                {soldItemsPending.length} potong baju terjual
              </p>
            </div>

            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Gross Floor Price
              </span>
              <p className="font-serif text-2xl font-normal text-espresso-900">
                {formatIDR(totalPendingGrossFloor)}
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                Akumulasi hak dasar penitip
              </p>
            </div>

            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Deduksi Cuci Uap (Rp 2.500)
              </span>
              <p className="font-serif text-2xl font-normal text-terracotta-700">
                -{formatIDR(totalPendingSteamDeduction)}
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                Jasa sterilisasi uap &gt;100°C
              </p>
            </div>

            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1 bg-emerald-50/40 border-emerald-200">
              <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-800 font-bold block">
                Total Net Disbursement
              </span>
              <p className="font-serif text-2xl font-bold text-emerald-900">
                {formatIDR(totalPendingNetPayout)}
              </p>
              <p className="text-[11px] text-emerald-700 font-sans">
                Total kas keluar Jumat
              </p>
            </div>
          </div>

          {/* Table Consignors Pending */}
          <div className="bg-linen-50 border border-linen-300/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-linen-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linen-100/50">
              <div>
                <h3 className="font-serif text-base font-medium text-espresso-900">
                  Rincian Penerima Hak Bersih PindahTangan
                </h3>
                <p className="text-xs text-espresso-600">
                  Verifikasi nomor rekening bank &amp; potongan deduksi uap Rp 2.500/pcs sebelum file bank diekspor.
                </p>
              </div>
            </div>

            {pendingByConsignor.size === 0 ? (
              <div className="py-16 text-center text-espresso-500 font-sans space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                <p className="text-sm font-medium text-espresso-800">
                  Seluruh payout telah terselesaikan.
                </p>
                <p className="text-xs text-espresso-500">
                  Tidak ada pakaian terjual baru yang menunggu proses transfer Jumat saat ini.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-espresso-800">
                  <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                    <tr>
                      <th className="py-3 px-4">Pemilik Pakaian</th>
                      <th className="py-3 px-4">Rekening Tujuan</th>
                      <th className="py-3 px-4 text-center">Baju Terjual</th>
                      <th className="py-3 px-4 text-right">Gross Floor</th>
                      <th className="py-3 px-4 text-right">Deduksi Uap (Rp 2.500)</th>
                      <th className="py-3 px-4 text-right">Net Ditransfer</th>
                      <th className="py-3 px-4 text-right">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-linen-200 font-sans">
                    {Array.from(pendingByConsignor.entries()).map(([consignorId, items]) => {
                      const consignor = data.profiles.find((p) => p.id === consignorId);
                      const gross = items.reduce((sum, i) => sum + i.floor_price, 0);
                      const steam = items.length * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
                      const net = Math.max(0, gross - steam);
                      const hasBank = !!consignor?.bank_account_number;

                      return (
                        <tr key={consignorId} className="hover:bg-linen-100/40">
                          <td className="py-3.5 px-4">
                            <span className="font-serif font-medium text-espresso-900 block">
                              {consignor?.full_name || 'Penitip Sukabumi'}
                            </span>
                            <span className="font-mono text-[11px] text-espresso-500">
                              {consignor?.phone_number}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono">
                            {hasBank ? (
                              <>
                                <span className="font-medium text-espresso-900 block">
                                  {consignor?.bank_name} {consignor?.bank_account_number}
                                </span>
                                <span className="text-[10px] text-espresso-500 font-sans">
                                  a.n. {consignor?.bank_account_holder || consignor?.full_name}
                                </span>
                              </>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-terracotta-700 text-[11px]">
                                <AlertTriangle className="w-3 h-3" /> Rekening Belum Lengkap
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-espresso-900">
                            {items.length} pcs
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-espresso-700">
                            {formatIDR(gross)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-terracotta-700">
                            -{formatIDR(steam)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-800 text-sm">
                            {formatIDR(net)}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5">
                            {consignor && (
                              <button
                                type="button"
                                onClick={() =>
                                  setWhatsappModalData({
                                    consignor,
                                    payoutCode: 'PAY-DRAFT-PREVIEW',
                                    itemsCount: items.length,
                                    grossFloor: gross,
                                    steamDeduction: steam,
                                    netPayout: net,
                                  })
                                }
                                title="Pratinjau Pesan WhatsApp Resmi"
                                className="p-1.5 rounded-lg bg-linen-200 text-espresso-800 hover:bg-linen-300"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 2: RIWAYAT BATCH PAYOUT SUKSES                */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'history' && (
        <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="pb-4 border-b border-linen-200">
            <h3 className="font-serif text-lg font-medium text-espresso-900">
              Arsip Batch Payout yang Telah Ditransfer
            </h3>
            <p className="text-xs text-espresso-600">
              Catatan mutasi kas resmi dan slip transfer digital terverifikasi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                <tr>
                  <th className="py-3 px-4">Kode Payout</th>
                  <th className="py-3 px-4">Penerima Transfer</th>
                  <th className="py-3 px-4">Bank &amp; Rekening</th>
                  <th className="py-3 px-4 text-center">Baju Terjual</th>
                  <th className="py-3 px-4 text-right">Net Ditransfer</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Slip Digital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen-200 font-sans">
                {data.payouts.map((payout) => {
                  const consignor = data.profiles.find((p) => p.id === payout.consignor_id);

                  return (
                    <tr key={payout.id} className="hover:bg-linen-100/40">
                      <td className="py-3.5 px-4 font-mono font-medium text-espresso-900">
                        {payout.payout_code}
                        <span className="block text-[10px] text-espresso-400">
                          {formatDateIndo(payout.created_at)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-medium text-espresso-900 block">
                          {payout.destination_account_holder}
                        </span>
                        <span className="font-mono text-[10px] text-espresso-500">
                          {consignor?.phone_number}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {payout.destination_bank} {payout.destination_account_number}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-espresso-900">
                        {payout.items_count} pcs
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-espresso-900 text-sm">
                        {formatIDR(payout.total_net_payout)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300">
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(payout)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Lihat Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: WHATSAPP SLIP GENERATOR                       */}
      {/* ---------------------------------------------------- */}
      {whatsappModalData && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                  Integrasi Notifikasi WhatsApp
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Pratinjau Slip Transfer Resmi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappModalData(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-white rounded-xl border border-linen-300 font-mono text-xs whitespace-pre-wrap text-espresso-800 leading-relaxed shadow-inner max-h-72 overflow-y-auto">
              {getWhatsAppMessage(whatsappModalData)}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-espresso-500 font-sans">
                Kirim ke {whatsappModalData.consignor.phone_number}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhatsappModalData(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    copyToClipboard(getWhatsAppMessage(whatsappModalData));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Salin Teks WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Digital Receipt Modal (Shared with consignor portal) */}
      <PayoutReceiptModal
        payout={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
