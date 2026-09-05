'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/useStore';
import { ClothesItem } from '@/lib/types';
import { formatIDR } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { ChevronRight, ChevronLeft, Check, X } from 'lucide-react';

export default function HostLiveControllerPage() {
  const { data, store } = useStore();

  const activeSession = data.sessions.find((s) => s.is_active) || data.sessions[0];

  const liveQueue = data.items.filter(
    (i) => i.status === 'in_live_queue' || i.status === 'ready_for_live'
  );

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMarkSoldOpen, setIsMarkSoldOpen] = useState<boolean>(false);
  const [buyerHandle, setBuyerHandle] = useState<string>('');
  const [soldPrice, setSoldPrice] = useState<number>(0);

  const currentItem: ClothesItem | undefined = liveQueue[currentIndex];

  useEffect(() => {
    if (currentItem) {
      setSoldPrice(currentItem.target_live_price);
    }
  }, [currentItem]);

  const handleNext = () => {
    if (currentIndex < liveQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(liveQueue.length - 1);
    }
  };

  const handleSkip = () => {
    if (currentItem) {
      store.skipLiveItem(currentItem.id);
      if (currentIndex >= liveQueue.length - 1) {
        setCurrentIndex(0);
      }
    }
  };

  const handleConfirmSold = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || !activeSession) return;

    store.markItemSold({
      itemId: currentItem.id,
      liveSessionId: activeSession.id,
      buyerHandle: buyerHandle || '@penonton_live',
      soldPrice: Number(soldPrice),
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C25E43', '#849078', '#FAF7F2'],
    });

    setIsMarkSoldOpen(false);
    setBuyerHandle('');

    if (currentIndex >= liveQueue.length - 1) {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#141210] text-[#EDE8E1] p-4 sm:p-6 lg:p-8 flex flex-col justify-between font-sans select-none">
      {/* 1. BROADCAST STUDIO CONSOLE BAR */}
      <div className="bg-[#1C1A17] rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 bg-red-950/80 text-red-400 border border-red-800/80 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <span>Live On-Air</span>
          </span>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400 block">
              {activeSession.platform.toUpperCase()} SHOPPING STUDIO
            </span>
            <h1 className="font-serif text-lg font-normal text-white">
              {activeSession.session_title}
            </h1>
          </div>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-6 bg-black/40 px-6 py-3 rounded-xl border border-white/5">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block">
              Terjual
            </span>
            <span className="font-serif text-xl font-light text-white">
              {activeSession.total_items_sold}{' '}
              <span className="text-xs text-stone-500 font-sans">pcs</span>
            </span>
          </div>

          <div className="w-px h-7 bg-white/10"></div>

          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block">
              Omzet Sesi
            </span>
            <span className="font-serif text-xl font-light text-white">
              {formatIDR(activeSession.total_gmv)}
            </span>
          </div>

          <div className="w-px h-7 bg-white/10"></div>

          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-terracotta-400 block">
              Komisi Host
            </span>
            <span className="font-serif text-xl font-light text-terracotta-400">
              {formatIDR(
                activeSession.host_base_fee + activeSession.host_commission_earned
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER STAGE HANGER */}
      {liveQueue.length === 0 ? (
        <div className="my-auto py-24 text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-500 block">
            Semua Baju Terjual
          </span>
          <h2 className="font-serif text-3xl font-light text-white">
            Antrean siaran sesi ini telah selesai.
          </h2>
          <p className="text-xs text-stone-400">
            Koleksi pakaian baru dapat didaftarkan melalui Studio QC Sukabumi.
          </p>
        </div>
      ) : (
        <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Active Card */}
          <div className="lg:col-span-8 bg-[#1C1A17] rounded-2xl p-8 sm:p-12 border border-white/10 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-terracotta-400 block mb-1">
                    Gantungan Aktif ({currentIndex + 1} / {liveQueue.length})
                  </span>
                  <div className="font-serif text-6xl sm:text-7xl font-light text-white tracking-tight">
                    No. {currentItem?.hangtag_number}
                  </div>
                  <span className="font-mono text-xs text-stone-500 block mt-1">
                    SKU: {currentItem?.sku}
                  </span>
                </div>

                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-300 border border-white/15 px-3 py-1.5 rounded-full">
                  {currentItem?.category_tier.replace('tier_', 'Tier ')}
                </span>
              </div>

              {/* Title & Sizing */}
              <div className="space-y-6">
                <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white leading-tight">
                  {currentItem?.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                    <span className="text-stone-500 text-[10px] uppercase block font-mono">
                      Merek
                    </span>
                    <span className="text-white font-medium text-sm">
                      {currentItem?.brand || 'No Brand'}
                    </span>
                  </div>

                  <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                    <span className="text-stone-500 text-[10px] uppercase block font-mono">
                      Ukuran
                    </span>
                    <span className="text-white font-medium text-sm">
                      {currentItem?.size || 'All Size'}
                    </span>
                  </div>

                  {currentItem?.chest_width_cm && (
                    <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                      <span className="text-stone-500 text-[10px] uppercase block font-mono">
                        Lingkar Dada
                      </span>
                      <span className="text-stone-200 font-medium text-sm">
                        {currentItem.chest_width_cm} cm
                      </span>
                    </div>
                  )}

                  <div className="bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                    <span className="text-stone-500 text-[10px] uppercase block font-mono">
                      Kondisi
                    </span>
                    <span className="text-emerald-400 font-medium text-sm">
                      Steril Uap &gt;100°C
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Cards */}
            <div className="my-10 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block">
                  Batas Floor Price (Hak Consignor)
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-light text-stone-300">
                  {formatIDR(currentItem?.floor_price || 0)}
                </div>
                <span className="text-[10px] text-stone-500 block">
                  *Batas minimal penjualan
                </span>
              </div>

              <div className="p-5 rounded-xl bg-black/40 border border-terracotta-500/30 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-400 block">
                  Rekomendasi Buka Live TikTok
                </span>
                <div className="font-serif text-2xl sm:text-3xl font-normal text-white">
                  {formatIDR(currentItem?.target_live_price || 0)}
                </div>
                <span className="text-[10px] text-terracotta-400/80 block">
                  *Dapat disesuaikan saat interaksi live
                </span>
              </div>
            </div>

            {/* Tactile Touch Buttons */}
            <div className="grid grid-cols-12 gap-3">
              <button
                onClick={handlePrev}
                className="col-span-2 py-5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-stone-300 text-xs font-mono uppercase tracking-wider transition active:scale-98 flex items-center justify-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                onClick={handleSkip}
                className="col-span-4 py-5 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-stone-300 text-xs font-mono uppercase tracking-wider transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <span>Lewati ke Belakang</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMarkSoldOpen(true)}
                className="col-span-6 py-5 rounded-xl bg-white hover:bg-stone-200 text-black font-serif text-lg font-medium tracking-wide transition active:scale-98 shadow-xl flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>Tandai Terjual (Sold)</span>
              </button>
            </div>
          </div>

          {/* Queue Sidebar */}
          <div className="lg:col-span-4 bg-[#1C1A17] rounded-2xl p-6 border border-white/10 flex flex-col justify-between max-h-[700px]">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  Antrean Gantungan Live
                </span>
                <span className="text-[10px] font-mono text-stone-500">
                  {liveQueue.length} Baju
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[560px] pr-1">
                {liveQueue.map((item, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        isCurrent
                          ? 'bg-white text-black border-white'
                          : 'bg-black/30 text-stone-300 border-white/5 hover:bg-black/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif text-base w-10 font-normal">
                          #{item.hangtag_number}
                        </span>
                        <div>
                          <strong className="block text-xs truncate max-w-[130px] font-normal">
                            {item.title}
                          </strong>
                          <span className="text-[10px] opacity-60">
                            {item.brand} • {item.size}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-xs">
                        {formatIDR(item.target_live_price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MARK SOLD MODAL */}
      {isMarkSoldOpen && currentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#1C1A17] rounded-2xl max-w-md w-full border border-white/15 shadow-2xl p-8 space-y-6 text-[#EDE8E1]">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-400 block">
                  Pencatatan Penjualan Live
                </span>
                <h3 className="font-serif text-2xl font-normal text-white mt-1">
                  Gantungan No. {currentItem.hangtag_number}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">{currentItem.title}</p>
              </div>
              <button
                onClick={() => setIsMarkSoldOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSold} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block">
                  Username TikTok Pembeli *
                </label>
                <input
                  type="text"
                  required
                  placeholder="@siti_ootd"
                  value={buyerHandle}
                  onChange={(e) => setBuyerHandle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-white"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-stone-400 block">
                  Harga Terjual Akhir (Rp) *
                </label>
                <input
                  type="number"
                  step={1000}
                  min={currentItem.floor_price}
                  required
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white font-serif text-2xl font-normal focus:outline-none focus:border-white"
                />
                <span className="text-[10px] font-mono text-stone-500 block">
                  Floor price pemilik: {formatIDR(currentItem.floor_price)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-stone-400">
                <div className="flex justify-between">
                  <span>Hak Bersih Consignor:</span>
                  <span className="font-mono text-white">
                    {formatIDR(currentItem.floor_price - 2500)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Komisi Host:</span>
                  <span className="font-mono text-terracotta-400">+Rp 2.000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMarkSoldOpen(false)}
                  className="py-3 rounded-xl border border-white/15 text-stone-300 font-mono text-xs uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-3 rounded-xl bg-white text-black font-medium text-xs uppercase tracking-wider hover:bg-stone-200"
                >
                  Simpan Terjual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
