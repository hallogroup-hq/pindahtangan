'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { BUSINESS_RULES, TIER_CONFIG } from '@/lib/constants';
import { ClothesItem, RunSheetItem } from '@/lib/types';
import {
  Radio,
  Tv,
  ArrowUp,
  ArrowDown,
  Sparkles,
  TrendingUp,
  Tag,
  DollarSign,
  CheckCircle2,
  Users,
  Clock,
  Flame,
  ShoppingBag,
  Sliders,
  ChevronRight,
  Send,
  AlertCircle,
  Volume2,
  BellRing,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '@/lib/sound';

export default function LiveOrchestrationModule() {
  const { data, store } = useStore();

  const [activeTab, setActiveTab] = useState<'runsheet' | 'copilot' | 'payroll'>('runsheet');

  // Selected Live Session
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    data.sessions[0]?.id || 'session-live-01'
  );

  // Quick Sold Modal
  const [soldModalItem, setSoldModalItem] = useState<ClothesItem | null>(null);
  const [buyerHandleInput, setBuyerHandleInput] = useState('');
  const [soldPriceInput, setSoldPriceInput] = useState<number>(0);

  // Co-pilot Price Adjust Modal
  const [adjustPriceItem, setAdjustPriceItem] = useState<ClothesItem | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);
  const [priceAdjustError, setPriceAdjustError] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Get active session
  const activeSession =
    data.sessions.find((s) => s.id === selectedSessionId) || data.sessions[0];

  // Get Run-Sheet for selected session
  const runSheet = store.getRunSheetForSession(selectedSessionId);
  const onStageItem = store.getOnStageItem();

  // Shift slots
  const DAILY_SLOTS = [
    {
      id: 'slot-siang',
      time: '14.00–16.00 WIB',
      title: 'Sesi Siang • Flash Sale Tier C',
      desc: 'Kaos basic, celana santai, obral ceban serba Rp 10.000–25.000.',
      tierTarget: 'tier_c',
    },
    {
      id: 'slot-sore',
      time: '16.00–18.00 WIB',
      title: 'Sesi Sore • Casual Chic Tier B',
      desc: 'Blouse katun, kemeja kerja, kulot linen, tunik harian Rp 35.000–65.000.',
      tierTarget: 'tier_b',
    },
    {
      id: 'slot-malam',
      time: '20.00–22.00 WIB',
      title: 'Sesi Malam • Branded & Pesta Tier A',
      desc: 'Brand mall (Zara, Uniqlo, Mango), gamis kondangan, outer knit premium Rp 75.000–120.000.',
      tierTarget: 'tier_a',
    },
  ];

  // Reordering in Run Sheet
  const moveItem = (index: number, direction: 'up' | 'down' | 'top') => {
    const currentOrder = runSheet.map((r) => r.item.id);
    if (direction === 'top') {
      const [item] = currentOrder.splice(index, 1);
      currentOrder.unshift(item);
    } else if (direction === 'up' && index > 0) {
      const temp = currentOrder[index - 1];
      currentOrder[index - 1] = currentOrder[index];
      currentOrder[index] = temp;
    } else if (direction === 'down' && index < currentOrder.length - 1) {
      const temp = currentOrder[index + 1];
      currentOrder[index + 1] = currentOrder[index];
      currentOrder[index] = temp;
    }
    store.setRunSheetHangerOrder(selectedSessionId, currentOrder);
  };

  // Set Item on stage
  const handleSetOnStage = (itemId: string) => {
    store.setOnStageItem(itemId);
    const item = data.items.find((i) => i.id === itemId);
    showToast(`Gantungan No. ${item?.hangtag_number} (${item?.title}) sekarang ON-AIR di kamera live!`);
  };

  // Execute Mark Sold
  const handleConfirmSold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!soldModalItem) return;
    if (!buyerHandleInput) {
      alert('Masukkan username TikTok/IG pembeli.');
      return;
    }

    try {
      const { item, order } = store.markItemSold({
        itemId: soldModalItem.id,
        liveSessionId: selectedSessionId,
        buyerHandle: buyerHandleInput,
        soldPrice: soldPriceInput || soldModalItem.target_live_price,
      });

      sound.playSoldCheer();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      showToast(`TERJUAL! ${item.title} laku ke ${order.buyer_handle} (${formatIDR(item.sold_price || 0)}).`);
      setSoldModalItem(null);
      setBuyerHandleInput('');
    } catch (err: any) {
      alert(err.message || 'Gagal menandai item terjual.');
    }
  };

  // Execute Price Adjustment
  const handleSavePriceAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustPriceItem) return;
    setPriceAdjustError(null);

    try {
      store.coPilotAdjustPrice(adjustPriceItem.id, newPriceInput);
      sound.playGongDeal();
      showToast(
        `Harga live SKU ${adjustPriceItem.sku} disesuaikan menjadi ${formatIDR(newPriceInput)}.`
      );
      setAdjustPriceItem(null);
    } catch (err: any) {
      setPriceAdjustError(err.message || 'Gagal mengubah harga.');
    }
  };

  // Host payroll records
  const payrollSummaries = store.getHostPayrollSummary();

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
            Modul 2 • Siaran Studio Sukabumi
          </span>
          <h2 className="font-serif text-2xl font-medium text-espresso-900">
            Live Commerce Orchestration &amp; Host Co-Pilot
          </h2>
          <p className="text-xs text-espresso-600 mt-0.5">
            Kurasi 50 gantungan siaran harian, telemetri on-air mendampingi ring-light, dan kalkulasi honor host shift.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-linen-200/60 p-1 rounded-lg border border-linen-300/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('runsheet')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'runsheet'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            1. Run-Sheet 50 Gantungan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1 ${
              activeTab === 'copilot'
                ? 'bg-terracotta-700 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            <Radio className="w-3 h-3 animate-pulse text-amber-300" />
            2. Studio Co-Pilot
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payroll')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeTab === 'payroll'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            3. Honor Host ({payrollSummaries.length})
          </button>
        </div>
      </div>

      {/* Daily Shift Selector Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {DAILY_SLOTS.map((slot) => {
          const isCurrentShift = slot.id === 'slot-sore'; // pilot afternoon shift
          return (
            <div
              key={slot.id}
              className={`p-4 rounded-xl border transition ${
                isCurrentShift
                  ? 'bg-linen-100/90 border-espresso-800 shadow-xs'
                  : 'bg-linen-50 border-linen-300/80 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-espresso-700">
                  {slot.time}
                </span>
                {isCurrentShift && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                    Sedang On-Air
                  </span>
                )}
              </div>
              <h4 className="font-serif text-sm font-medium text-espresso-900">
                {slot.title}
              </h4>
              <p className="text-[11px] text-espresso-500 font-sans mt-0.5 line-clamp-2">
                {slot.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 1: RUN-SHEET BUILDER (50 HANGERS)             */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'runsheet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linen-50 p-4 rounded-xl border border-linen-300">
            <div className="space-y-0.5">
              <h3 className="font-serif text-base font-medium text-espresso-900">
                Susunan Antrean Gantungan Siaran (Run-Sheet No. 01–50)
              </h3>
              <p className="text-xs text-espresso-600">
                Gunakan tombol &quot;Ke Depan (Hook)&quot; untuk memindahkan pakaian viral ke urutan awal guna memikat penonton live pertama.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-espresso-500 block uppercase">
                Kapasitas Gantungan Siap
              </span>
              <span className="font-mono text-base font-bold text-espresso-900">
                {runSheet.length} / 50 Pakaian
              </span>
            </div>
          </div>

          <div className="bg-linen-50 border border-linen-300/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-espresso-800">
                <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                  <tr>
                    <th className="py-3 px-4 text-center">Urutan No.</th>
                    <th className="py-3 px-4">Pakaian &amp; SKU</th>
                    <th className="py-3 px-4">Brand / Ukuran</th>
                    <th className="py-3 px-4">Harga Buka Live</th>
                    <th className="py-3 px-4 text-center">Status Gantungan</th>
                    <th className="py-3 px-4 text-right">Aksi Fast-Reorder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-200">
                  {runSheet.map((row, idx) => {
                    const isSold = row.item.status === 'sold' || row.item.status === 'paid_out';
                    const isOnStage = row.isOnStage;

                    return (
                      <tr
                        key={row.item.id}
                        className={`transition ${
                          isOnStage
                            ? 'bg-terracotta-50/80 font-medium'
                            : isSold
                            ? 'bg-linen-100/40 opacity-70'
                            : 'hover:bg-linen-100/40'
                        }`}
                      >
                        <td className="py-3 px-4 text-center font-mono">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                              isOnStage
                                ? 'bg-terracotta-600 text-white shadow-xs'
                                : 'bg-linen-200 text-espresso-900'
                            }`}
                          >
                            No. {String(row.hangerNumber).padStart(2, '0')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-10 w-10 rounded bg-linen-200 overflow-hidden shrink-0 border border-linen-300">
                              <img
                                src={row.item.photo_url || ''}
                                alt={row.item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-serif text-xs font-medium text-espresso-900 line-clamp-1">
                                {row.item.title}
                              </p>
                              <span className="font-mono text-[10px] text-espresso-500">
                                {row.item.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-sans">
                          <span className="block text-espresso-900 font-medium">
                            {row.item.brand}
                          </span>
                          <span className="text-[10px] font-mono text-espresso-500">
                            Size {row.item.size} {row.item.chest_width_cm ? `• LD ${row.item.chest_width_cm} cm` : ''}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className="font-semibold text-espresso-900">
                            {formatIDR(row.item.target_live_price)}
                          </span>
                          <span className="block text-[10px] text-espresso-400">
                            Floor: {formatIDR(row.item.floor_price)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isOnStage ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-terracotta-600 text-white font-bold animate-pulse">
                              <Radio className="w-2.5 h-2.5" />
                              Sedang On-Air
                            </span>
                          ) : isSold ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-300">
                              Terjual
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-linen-200 text-espresso-700 border border-linen-300">
                              Siap Ditampilkan
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          {!isSold && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSetOnStage(row.item.id)}
                                title="Jadikan Gantungan Aktif di Ring Light"
                                className="px-2 py-1 rounded text-[11px] bg-espresso-900 text-linen-100 hover:bg-espresso-800 font-medium"
                              >
                                Tampilkan
                              </button>
                              <button
                                type="button"
                                onClick={() => moveItem(idx, 'top')}
                                title="Jadikan Hook Terdepan"
                                className="px-2 py-1 rounded text-[10px] font-mono bg-linen-200 hover:bg-linen-300 text-espresso-800"
                              >
                                Hook No.1
                              </button>
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveItem(idx, 'up')}
                                className="p-1 rounded bg-linen-200 hover:bg-linen-300 text-espresso-700 disabled:opacity-30"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === runSheet.length - 1}
                                onClick={() => moveItem(idx, 'down')}
                                className="p-1 rounded bg-linen-200 hover:bg-linen-300 text-espresso-700 disabled:opacity-30"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </>
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
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 2: STUDIO CO-PILOT & TELEMETRY                */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'copilot' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Active Ring-Light Monitor */}
          <div className="lg:col-span-7 bg-espresso-950 text-linen-50 border border-espresso-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-espresso-800">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono tracking-widest uppercase text-rose-400 font-bold">
                  STUDIO CO-PILOT LIVE MONITOR
                </span>
              </div>
              <span className="font-mono text-xs text-linen-400">
                Host: Siti Nurhaliza (TikTok @pindahtangan.id)
              </span>
            </div>

            {onStageItem ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-xl overflow-hidden bg-espresso-900 border-2 border-terracotta-500 shrink-0 relative">
                    <img
                      src={onStageItem.photo_url || ''}
                      alt={onStageItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-espresso-900/90 backdrop-blur-xs text-linen-50 px-2.5 py-1 rounded text-xs font-mono font-bold">
                      Gantungan #{onStageItem.hangtag_number}
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 text-left">
                    <div>
                      <span className="font-mono text-xs text-terracotta-400 uppercase tracking-widest block">
                        {onStageItem.category_tier.replace('_', ' ')} • SKU {onStageItem.sku}
                      </span>
                      <h3 className="font-serif text-2xl font-medium text-linen-50 leading-snug mt-1">
                        {onStageItem.title}
                      </h3>
                      <p className="text-sm text-linen-300 font-sans mt-1">
                        Brand: <strong className="text-linen-100">{onStageItem.brand}</strong> • Ukuran: <strong className="text-linen-100">{onStageItem.size}</strong> {onStageItem.chest_width_cm ? `• LD ${onStageItem.chest_width_cm} cm` : ''}
                      </p>
                    </div>

                    <div className="p-3 bg-espresso-900/90 rounded-xl border border-espresso-700 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-linen-400 font-sans">Harga Live Ditawarkan:</span>
                        <span className="font-mono text-2xl font-bold text-amber-300">
                          {formatIDR(onStageItem.target_live_price)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-linen-500 font-mono">
                        <span>Batas Floor Price (Nego):</span>
                        <span>{formatIDR(onStageItem.floor_price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSoldModalItem(onStageItem);
                          setSoldPriceInput(onStageItem.target_live_price);
                        }}
                        className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        [ MARK SOLD ]
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAdjustPriceItem(onStageItem);
                          setNewPriceInput(onStageItem.target_live_price);
                        }}
                        className="px-3.5 py-3 rounded-xl bg-espresso-800 hover:bg-espresso-700 text-linen-200 text-xs font-medium border border-espresso-700"
                        title="Sesuaikan harga jika ada tawar-menawar di komentar"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Live Studio Soundboard */}
                    <div className="pt-2 border-t border-espresso-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-linen-400">
                        <span className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-terracotta-400" />
                          <span>Soundboard Siaran Live (Web Audio)</span>
                        </span>
                        <span>Tanpa Lag</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => sound.playSoldCheer()}
                          className="px-2 py-1.5 rounded-lg bg-espresso-800 hover:bg-emerald-800/80 text-linen-200 hover:text-white text-[10px] font-sans font-medium transition text-center border border-espresso-700 hover:border-emerald-500"
                        >
                          🎉 Terjual!
                        </button>
                        <button
                          type="button"
                          onClick={() => sound.playGongDeal()}
                          className="px-2 py-1.5 rounded-lg bg-espresso-800 hover:bg-amber-800/80 text-linen-200 hover:text-white text-[10px] font-sans font-medium transition text-center border border-espresso-700 hover:border-amber-500"
                        >
                          🥋 Gong Deal
                        </button>
                        <button
                          type="button"
                          onClick={() => sound.playCountdownTick()}
                          className="px-2 py-1.5 rounded-lg bg-espresso-800 hover:bg-terracotta-800/80 text-linen-200 hover:text-white text-[10px] font-sans font-medium transition text-center border border-espresso-700 hover:border-terracotta-500"
                        >
                          ⏱️ Tick 30s
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-linen-400 space-y-3 font-sans">
                <Tv className="w-12 h-12 mx-auto text-espresso-700" />
                <p className="text-sm">Belum ada baju yang aktif di kamera live.</p>
                <p className="text-xs text-linen-500">
                  Pilih baju dari tab Run-Sheet dan klik &quot;Tampilkan&quot; untuk mengaktifkan telemetri panggung.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Real-time Telemetry & KPIs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-linen-200">
                <h3 className="font-serif text-base font-medium text-espresso-900">
                  Telemetri Sesi Live Terkini
                </h3>
                <span className="text-[11px] font-mono text-terracotta-700 font-semibold uppercase">
                  Sesi 2 Jam
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-4 bg-linen-100/70 rounded-xl border border-linen-200 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 block">
                    Pakaian Terjual
                  </span>
                  <p className="font-serif text-3xl font-normal text-espresso-900">
                    {activeSession?.total_items_sold || 0} pcs
                  </p>
                  <span className="text-[10px] text-emerald-700 font-mono">
                    Target: 30–50 pcs/shift
                  </span>
                </div>

                <div className="p-4 bg-linen-100/70 rounded-xl border border-linen-200 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 block">
                    Total GMV Sesi
                  </span>
                  <p className="font-serif text-2xl font-normal text-espresso-900">
                    {formatIDR(activeSession?.total_gmv || 0)}
                  </p>
                  <span className="text-[10px] text-espresso-500 font-mono">
                    Omzet kotor live
                  </span>
                </div>
              </div>

              {/* Conversion Benchmark Gauge */}
              <div className="p-4 bg-white rounded-xl border border-linen-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-espresso-600">Rasio Gantungan Laku (Sold-Out):</span>
                  <span className="font-bold text-espresso-900">
                    {Math.round(((activeSession?.total_items_sold || 0) / Math.max(1, runSheet.length)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-linen-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-terracotta-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(((activeSession?.total_items_sold || 0) / Math.max(1, runSheet.length)) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-espresso-500 font-sans">
                  SLA Target: ≥ 60% gantungan terjual per shift 2 jam.
                </p>
              </div>

              {/* Next in Line Hanger Preview */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 block">
                  Siap Naik Selanjutnya:
                </span>
                <div className="space-y-2">
                  {runSheet
                    .filter((r) => r.item.id !== onStageItem?.id && r.item.status === 'ready_for_live')
                    .slice(0, 3)
                    .map((next) => (
                      <div
                        key={next.item.id}
                        className="p-2.5 bg-linen-100/50 rounded-lg border border-linen-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-espresso-900">
                            #{next.hangerNumber}
                          </span>
                          <span className="text-xs text-espresso-800 line-clamp-1 font-serif">
                            {next.item.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetOnStage(next.item.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                        >
                          Naikkan
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* TikTok Live Webhook Ingestion Simulator */}
              <div className="p-4 bg-linen-100/70 rounded-xl border border-linen-200 space-y-3 pt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-espresso-900 text-linen-100 flex items-center justify-center text-[10px] font-mono font-bold">
                      TT
                    </div>
                    <div>
                      <h4 className="font-serif text-xs font-semibold text-espresso-900">
                        TikTok Shop Webhook Ingestion
                      </h4>
                      <p className="text-[9px] font-mono text-espresso-500">
                        /api/webhooks/orders
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold">
                    Live Webhook Active
                  </span>
                </div>

                <p className="text-[11px] text-espresso-600 leading-relaxed">
                  Terima checkout penonton TikTok Live otomatis hands-free ke antrean logistik PindahTangan.
                </p>

                <button
                  type="button"
                  disabled={!onStageItem}
                  onClick={async () => {
                    if (!onStageItem) return;
                    try {
                      const res = await fetch('/api/webhooks/orders', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          event: 'order.created',
                          source: 'tiktok_shop_live',
                          sku: onStageItem.sku,
                          buyer_handle: '@tiktok_buyer_skb',
                          buyer_name: 'Kak Dinda Sukabumi',
                          buyer_phone: '081288997711',
                          shipping_city: 'Kota Sukabumi',
                          sold_price: onStageItem.target_live_price,
                        }),
                      });
                      if (res.ok) {
                        store.markItemSold({
                          itemId: onStageItem.id,
                          liveSessionId: selectedSessionId,
                          buyerHandle: '@tiktok_buyer_skb',
                          soldPrice: onStageItem.target_live_price,
                          buyerName: 'Kak Dinda Sukabumi',
                          buyerPhone: '0812-8899-7711',
                        });
                        sound.playSoldCheer();
                        confetti({ particleCount: 50 });
                        showToast(`WEBHOOK SUKSES: ${onStageItem.title} terbeli otomatis via TikTok Shop!`);
                      }
                    } catch {
                      alert('Gagal mensimulasikan webhook.');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-espresso-900 hover:bg-espresso-800 disabled:opacity-40 text-linen-100 transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simulasi Order TikTok Live ({onStageItem ? onStageItem.sku : 'Pilih Baju'})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 3: HOST PAYROLL ENGINE                        */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'payroll' && (
        <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-linen-200">
            <div>
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Kalkulasi Honor Shift Host Live Talent
              </h3>
              <p className="text-xs text-espresso-600">
                Formula PRD Seksi 4.2: Honor = Rp 60.000 pokok/shift 2 jam + Rp 2.000 per pakaian laku terjual.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                <tr>
                  <th className="py-3 px-4">Tanggal &amp; Sesi</th>
                  <th className="py-3 px-4">Nama Talent (Host)</th>
                  <th className="py-3 px-4 text-center">Baju Terjual</th>
                  <th className="py-3 px-4 text-right">Honor Pokok Shift</th>
                  <th className="py-3 px-4 text-right">Komisi Per Pcs (Rp 2k)</th>
                  <th className="py-3 px-4 text-right">Total Honor Berhak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen-200 font-sans">
                {payrollSummaries.map((p, idx) => (
                  <tr key={idx} className="hover:bg-linen-100/40">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-medium text-espresso-900 block">{p.date}</span>
                      <span className="text-[10px] text-espresso-500 line-clamp-1">{p.sessionTitle}</span>
                    </td>
                    <td className="py-3.5 px-4 font-serif font-medium text-espresso-900">
                      {p.hostName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-espresso-900">
                      {p.itemsSold} pcs
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-espresso-700">
                      {formatIDR(p.baseFee)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-800 font-medium">
                      +{formatIDR(p.commissionFee)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-espresso-900 text-sm">
                      {formatIDR(p.totalEarnings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: MARK SOLD DI LIVE (QUICK AGGREGATION)         */}
      {/* ---------------------------------------------------- */}
      {soldModalItem && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-semibold block">
                  Transaksi Live Terjadi
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Tandai Pakaian Terjual [ MARK SOLD ]
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSoldModalItem(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSold} className="space-y-4">
              <div className="p-3 bg-linen-100 rounded-xl space-y-1 text-xs">
                <span className="font-mono text-espresso-500 uppercase text-[10px]">
                  Gantungan No. {soldModalItem.hangtag_number} • SKU {soldModalItem.sku}
                </span>
                <p className="font-serif text-sm font-medium text-espresso-900">
                  {soldModalItem.title}
                </p>
                <p className="text-[11px] text-espresso-600 font-mono">
                  Floor: {formatIDR(soldModalItem.floor_price)}
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Username Akun Pembeli (TikTok / IG):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="@siti_ootd atau nama pembeli"
                    value={buyerHandleInput}
                    onChange={(e) => setBuyerHandleInput(e.target.value)}
                    className="w-full text-xs font-sans bg-white border border-linen-300 rounded-lg p-2.5 text-espresso-900 focus:ring-1 focus:ring-espresso-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Harga Laku Akhir (Deal di Live):
                </label>
                <input
                  type="number"
                  step={1000}
                  required
                  min={soldModalItem.floor_price}
                  value={soldPriceInput}
                  onChange={(e) => setSoldPriceInput(Number(e.target.value))}
                  className="w-full text-sm font-mono font-bold bg-white border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                />
                <span className="text-[10px] text-espresso-500 block mt-0.5">
                  Batas Floor Price: {formatIDR(soldModalItem.floor_price)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-linen-200">
                <button
                  type="button"
                  onClick={() => setSoldModalItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-800"
                >
                  Terbitkan Pesanan &amp; Masuk Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: CO-PILOT ADJUST PRICE                         */}
      {/* ---------------------------------------------------- */}
      {adjustPriceItem && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta-700 font-semibold block">
                  Studio Co-Pilot Emergency
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Penyesuaian Harga Saat Live
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAdjustPriceItem(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePriceAdjust} className="space-y-4">
              <p className="text-xs text-espresso-600">
                Gunakan jika penonton di komentar live menawar pakaian. Admin dapat menurunkan harga buka live sepanjang tidak melanggar batas Floor Price penitip.
              </p>

              <div className="p-3 bg-linen-100 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-espresso-500">Floor Price (Batas Minimal):</span>
                  <span className="font-bold text-espresso-900">{formatIDR(adjustPriceItem.floor_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Harga Buka Saat Ini:</span>
                  <span className="text-espresso-900">{formatIDR(adjustPriceItem.target_live_price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Harga Baru Disepakati:
                </label>
                <input
                  type="number"
                  step={1000}
                  required
                  min={adjustPriceItem.floor_price}
                  value={newPriceInput}
                  onChange={(e) => setNewPriceInput(Number(e.target.value))}
                  className="w-full text-sm font-mono font-bold bg-white border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                />
              </div>

              {priceAdjustError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{priceAdjustError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-linen-200">
                <button
                  type="button"
                  onClick={() => setAdjustPriceItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                >
                  Terapkan ke Host Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
