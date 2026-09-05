'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { BUSINESS_RULES, STATUS_LABELS } from '@/lib/constants';
import { Payout, Order, ClothesItem, ShippingStatus } from '@/lib/types';
import PayoutReceiptModal from '@/components/consignor/PayoutReceiptModal';
import confetti from 'canvas-confetti';

interface AdminBackofficeProps {
  initialTab?: 'payouts' | 'orders' | 'aging' | 'economics';
}

export function AdminBackofficeContent({
  initialTab = 'payouts',
}: AdminBackofficeProps) {
  const { data, store } = useStore();

  const [activeTab, setActiveTab] = useState<
    'payouts' | 'orders' | 'aging' | 'economics'
  >(initialTab);

  const [selectedReceipt, setSelectedReceipt] = useState<Payout | null>(null);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

  const [simSoldVolume, setSimSoldVolume] = useState<number>(30);
  const [simAvgFloor, setSimAvgFloor] = useState<number>(35000);
  const [simAvgSold, setSimAvgSold] = useState<number>(65000);

  // 1. Pending Friday Payouts
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

  const handleTriggerPayout = () => {
    if (soldItemsPending.length === 0) {
      alert('Tidak ada pakaian berstatus terjual yang menunggu payout.');
      return;
    }

    if (
      confirm(
        `Jalankan Batch Payout Jumat 16.00 WIB untuk ${soldItemsPending.length} potong baju (Total ${formatIDR(totalPendingNetPayout)})?`
      )
    ) {
      const payouts = store.executeFridayPayout();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 },
      });
      alert(`Berhasil menerbitkan ${payouts.length} slip transfer gajian Jumat.`);
    }
  };

  const handleUpdateShipping = (orderId: string, status: ShippingStatus) => {
    const trackingNum = trackingInput[orderId];
    store.updateShippingStatus(orderId, status, trackingNum);
    alert(`Status pesanan diperbarui ke ${status}.`);
  };

  const handleBuyoutItem = (itemId: string) => {
    if (
      confirm(
        'Beli Putus Pakaian ini seharga Rp 10.000 untuk stok Live Huru-Hara "Serba Ceban" TikTok?'
      )
    ) {
      store.buyoutAgedItem(itemId);
    }
  };

  // Unit economics simulation calculation (PRD Section 9)
  const simTotalGMV = simSoldVolume * simAvgSold;
  const simTotalConsignorGross = simSoldVolume * simAvgFloor;
  const simTotalSteamDeduction = simSoldVolume * 2500;
  const simTotalConsignorNet = simTotalConsignorGross - simTotalSteamDeduction;
  const simHostCost =
    BUSINESS_RULES.HOST_BASE_FEE_PER_SHIFT +
    simSoldVolume * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE;
  const simPlatformGrossMargin =
    simSoldVolume * (simAvgSold - simAvgFloor) + simTotalSteamDeduction;
  const simPlatformNetProfit = simPlatformGrossMargin - simHostCost;

  return (
    <div className="py-12 sm:py-16 bg-linen-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-linen-300">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
              Backoffice &amp; Operasional
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
              Pusat Manajemen PindahTangan
            </h1>
            <p className="text-xs text-espresso-500 font-sans">
              Gajian Jumat 16.00 WIB • Dispatch Resi Pesanan • Retensi 30 Hari Obral • Unit Economics.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-linen-100 p-1 rounded-full border border-linen-200">
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'payouts'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Gajian Jumat
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'orders'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Pesanan ({data.orders.length})
            </button>
            <button
              onClick={() => setActiveTab('aging')}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'aging'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Retensi 30 Hari
            </button>
            <button
              onClick={() => setActiveTab('economics')}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'economics'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Unit Economics
            </button>
          </div>
        </div>

        {/* TAB 1: FRIDAY PAYOUT */}
        {activeTab === 'payouts' && (
          <div className="space-y-8">
            {/* Cutoff Summary */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-2 max-w-xl">
                <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                  Cutoff Penjualan: Sabtu – Kamis
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-espresso-900">
                  Penyaluran Gajian Jumat 16.00 WIB
                </h2>
                <p className="text-xs text-espresso-600 leading-relaxed font-sans">
                  Sistem otomatis menghitung pakaian terjual, memotong biaya sterilisasi cuci uap Rp 2.500/pcs, dan menerbitkan slip transfer ke rekening penitip.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-linen-50 border border-linen-200 text-right space-y-3 shrink-0">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-400 block">
                    Total Dana Bersih Siap Transfer:
                  </span>
                  <div className="font-serif text-3xl font-light text-espresso-900">
                    {formatIDR(totalPendingNetPayout)}
                  </div>
                </div>
                <div className="text-[11px] text-espresso-500 font-mono">
                  {soldItemsPending.length} Baju Terjual • {pendingByConsignor.size} Penerima Transfer
                </div>

                <button
                  onClick={handleTriggerPayout}
                  disabled={soldItemsPending.length === 0}
                  className="w-full bg-espresso-900 hover:bg-terracotta-600 disabled:opacity-40 text-linen-50 font-medium py-3 rounded-full text-xs uppercase tracking-wider transition"
                >
                  Eksekusi Payout Jumat
                </button>
              </div>
            </div>

            {/* Consignor Breakdown List */}
            <div className="bg-white rounded-2xl p-8 border border-linen-200/90 shadow-sm space-y-4">
              <div className="flex justify-between items-baseline pb-3 border-b border-linen-200">
                <h3 className="font-serif text-xl font-normal text-espresso-900">
                  Rincian Penyaluran Dana per Consignor
                </h3>
                <span className="text-xs font-mono text-espresso-400">
                  {pendingByConsignor.size} Consignor
                </span>
              </div>

              {pendingByConsignor.size === 0 ? (
                <div className="py-12 text-center text-espresso-400 text-xs">
                  Tidak ada pakaian terjual yang menunggu pencairan saat ini.
                </div>
              ) : (
                <div className="divide-y divide-linen-200">
                  {Array.from(pendingByConsignor.entries()).map(([consignorId, items]) => {
                    const consignor = data.profiles.find((p) => p.id === consignorId);
                    const gross = items.reduce((sum, i) => sum + i.floor_price, 0);
                    const steamFee = items.length * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
                    const net = Math.max(0, gross - steamFee);

                    return (
                      <div
                        key={consignorId}
                        className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-serif text-base font-medium text-espresso-900">
                            {consignor?.full_name}
                          </h4>
                          <p className="text-espresso-500 text-[11px]">
                            {consignor?.bank_name} • {consignor?.bank_account_number} a.n.{' '}
                            {consignor?.bank_account_holder} • WA {consignor?.phone_number}
                          </p>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6 text-right">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-espresso-400 block">
                              Gross Floor
                            </span>
                            <span className="font-mono text-espresso-700">
                              {formatIDR(gross)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono uppercase text-rose-500 block">
                              Uap ({items.length} pcs)
                            </span>
                            <span className="font-mono text-rose-600">
                              - {formatIDR(steamFee)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono uppercase text-espresso-900 block font-semibold">
                              Transfer Bersih
                            </span>
                            <span className="font-serif text-base font-medium text-espresso-900">
                              {formatIDR(net)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Historical Batches */}
            <div className="bg-white rounded-2xl p-8 border border-linen-200/90 shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-normal text-espresso-900">
                Riwayat Batch Payout Terbit
              </h3>
              <div className="divide-y divide-linen-200">
                {data.payouts.map((p) => (
                  <div
                    key={p.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-espresso-900">
                        {p.payout_code}
                      </span>
                      <p className="text-espresso-500 text-[11px] mt-0.5">
                        Penerima: {p.destination_account_holder} ({p.destination_bank} • {p.destination_account_number}) • {p.items_count} pcs
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-serif text-base font-medium text-espresso-900">
                        {formatIDR(p.total_net_payout)}
                      </span>
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="border border-linen-300 hover:border-espresso-900 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase"
                      >
                        Buka Slip
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
            <div className="flex justify-between items-baseline pb-3 border-b border-linen-200">
              <h2 className="font-serif text-2xl font-normal text-espresso-900">
                Pesanan Pembeli Live TikTok
              </h2>
              <span className="text-xs font-mono text-espresso-500">
                {data.orders.length} Pesanan
              </span>
            </div>

            <div className="divide-y divide-linen-200">
              {data.orders.map((order) => {
                const isShipped = order.shipping_status === 'shipped';
                return (
                  <div key={order.id} className="py-5 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-espresso-900">
                          {order.order_number}
                        </span>
                        <span className="font-mono text-[10px] text-espresso-600 bg-linen-100 px-2 py-0.5 rounded">
                          {order.buyer_handle}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isShipped
                            ? 'bg-espresso-900 text-linen-100 border-espresso-900'
                            : 'bg-linen-100 text-espresso-700 border-linen-200'
                        }`}
                      >
                        {order.shipping_status === 'shipped' ? 'Dikirim' : 'Menunggu Kemas'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-espresso-600">
                      <div>
                        Penerima: <strong>{order.buyer_name}</strong> ({order.buyer_phone})
                        <br />
                        Alamat: {order.shipping_address}, {order.shipping_city}
                      </div>
                      <div className="sm:text-right">
                        Total Bayar:{' '}
                        <strong className="font-serif text-base text-espresso-900">
                          {formatIDR(order.total_paid)}
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 max-w-md w-full">
                        <span className="text-espresso-400 font-mono text-[10px] uppercase">Resi:</span>
                        {order.tracking_number ? (
                          <span className="font-mono font-medium text-espresso-900 bg-linen-50 px-2.5 py-1 rounded border border-linen-200">
                            {order.courier_name} — {order.tracking_number}
                          </span>
                        ) : (
                          <input
                            type="text"
                            placeholder="Nomor resi J&T / Gosend..."
                            value={trackingInput[order.id] || ''}
                            onChange={(e) =>
                              setTrackingInput({
                                ...trackingInput,
                                [order.id]: e.target.value,
                              })
                            }
                            className="px-3 py-1.5 rounded-lg border border-linen-200 bg-linen-50/50 text-xs w-full font-mono"
                          />
                        )}
                      </div>

                      {!isShipped && (
                        <button
                          onClick={() => handleUpdateShipping(order.id, 'shipped')}
                          className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition"
                        >
                          Dispatch Resi
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: AGING 30 DAYS */}
        {activeTab === 'aging' && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-linen-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                Retensi 30 Hari Kalender
              </span>
              <h2 className="font-serif text-2xl font-normal text-espresso-900">
                Pakaian Mendekati / Melewati Masa Titip
              </h2>
              <p className="text-xs text-espresso-500 font-sans leading-relaxed">
                PRD 5.4: Pakaian yang belum terjual di hari ke-30 dialihkan ke Opsi Beli Putus Obral (Rp 10.000/pcs)
                untuk memasok konten Live TikTok &ldquo;Serba Ceban&rdquo;.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items
                .filter((i) => i.status !== 'sold' && i.status !== 'paid_out')
                .map((item) => {
                  const isBoughtOut = item.status === 'bought_out';
                  return (
                    <div
                      key={item.id}
                      className="rounded-xl p-5 border border-linen-200 bg-linen-50 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif text-lg font-medium text-espresso-900">
                            #{item.hangtag_number}
                          </span>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-espresso-500">
                            {isBoughtOut ? 'Beli Putus' : 'Titip Aktif'}
                          </span>
                        </div>

                        <div>
                          <strong className="block text-espresso-900">{item.title}</strong>
                          <span className="text-espresso-500 text-[11px]">
                            {item.brand} • Size {item.size}
                          </span>
                        </div>

                        <div className="text-[10px] font-mono text-espresso-400 pt-1 border-t border-linen-200">
                          Jatuh Tempo: {formatDateIndo(item.aging_expiry_date)}
                        </div>
                      </div>

                      {isBoughtOut ? (
                        <div className="text-[11px] font-mono text-espresso-600 bg-white p-2 rounded text-center border border-linen-200">
                          Masuk Etalase Live Serba Ceban
                        </div>
                      ) : (
                        <button
                          onClick={() => handleBuyoutItem(item.id)}
                          className="w-full py-2 bg-espresso-900 text-white rounded-lg text-xs font-mono uppercase tracking-wider hover:bg-terracotta-600 transition"
                        >
                          Beli Putus (Rp 10.000)
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: UNIT ECONOMICS */}
        {activeTab === 'economics' && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-8">
            <div className="space-y-1 pb-4 border-b border-linen-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                Formula Kanonikal PRD Seksi 9
              </span>
              <h2 className="font-serif text-2xl font-normal text-espresso-900">
                Simulasi Unit Economics 1 Sesi Live Streaming (2 Jam)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Sliders */}
              <div className="lg:col-span-6 space-y-6 bg-linen-50 p-6 rounded-xl border border-linen-200 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Volume Terjual:</span>
                    <strong className="text-espresso-900">{simSoldVolume} Potong</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={1}
                    value={simSoldVolume}
                    onChange={(e) => setSimSoldVolume(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Rata-Rata Floor Price (Hak Consignor):</span>
                    <strong className="text-espresso-900">{formatIDR(simAvgFloor)}</strong>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={80000}
                    step={5000}
                    value={simAvgFloor}
                    onChange={(e) => setSimAvgFloor(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between font-mono">
                    <span>Rata-Rata Harga Laku Live (TikTok):</span>
                    <strong className="text-espresso-900">{formatIDR(simAvgSold)}</strong>
                  </div>
                  <input
                    type="range"
                    min={simAvgFloor + 5000}
                    max={150000}
                    step={5000}
                    value={simAvgSold}
                    onChange={(e) => setSimAvgSold(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Financial Cash Flow Breakdown */}
              <div className="lg:col-span-6 bg-espresso-900 text-linen-100 p-8 rounded-2xl space-y-4 shadow-xl text-xs">
                <span className="text-[9px] font-mono uppercase tracking-widest text-espresso-400 block">
                  Simulasi Arus Kas Sesi (2 Jam)
                </span>

                <div className="space-y-2.5">
                  <div className="flex justify-between pb-2 border-b border-espresso-800">
                    <span className="text-espresso-300">Total Omzet GMV:</span>
                    <strong className="font-mono text-base text-white">
                      {formatIDR(simTotalGMV)}
                    </strong>
                  </div>

                  <div className="flex justify-between text-espresso-300">
                    <span>Hak Consignor (Gross Floor):</span>
                    <span className="font-mono">{formatIDR(simTotalConsignorGross)}</span>
                  </div>

                  <div className="flex justify-between text-emerald-400">
                    <span>Deduksi Cuci Uap (+Rp 2.500/pcs):</span>
                    <span className="font-mono">+{formatIDR(simTotalSteamDeduction)}</span>
                  </div>

                  <div className="flex justify-between text-espresso-300 pb-2 border-b border-espresso-800">
                    <span>Transfer Bersih ke Consignor:</span>
                    <strong className="font-mono text-white">
                      {formatIDR(simTotalConsignorNet)}
                    </strong>
                  </div>

                  <div className="flex justify-between text-espresso-300 pb-2 border-b border-espresso-800">
                    <span>Biaya Host (Gaji Pokok + Bonus Rp 2k):</span>
                    <span className="font-mono">- {formatIDR(simHostCost)}</span>
                  </div>

                  <div className="pt-2 flex justify-between items-baseline">
                    <div>
                      <span className="font-serif text-lg font-normal text-white block">
                        Laba Bersih Platform:
                      </span>
                      <span className="text-[10px] text-espresso-400">
                        Net profit kas per sesi siaran
                      </span>
                    </div>
                    <span className="font-serif text-3xl font-light text-emerald-400">
                      {formatIDR(simPlatformNetProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <PayoutReceiptModal
        payout={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
export default AdminBackofficeContent;
