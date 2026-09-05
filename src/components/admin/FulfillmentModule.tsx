'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { Order, ShippingStatus } from '@/lib/types';
import {
  ScanLine,
  Printer,
  Truck,
  CheckCircle2,
  XCircle,
  Package,
  AlertTriangle,
  QrCode,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FulfillmentModule() {
  const { data, store } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'scan_station' | 'orders_list' | 'bulk_dispatch'>('scan_station');

  // Scanner Station state
  const [selectedOrderId, setSelectedOrderId] = useState<string>(data.orders[0]?.id || '');
  const [skuScanInput, setSkuScanInput] = useState<string>('');
  const [scanResult, setScanResult] = useState<{
    status: 'idle' | 'matched' | 'mismatched';
    message: string;
  }>({ status: 'idle', message: '' });

  // Shipping Label Modal
  const [labelOrder, setLabelOrder] = useState<Order | null>(null);

  // Manual Tracking Edit
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Selected Order in Scan Station
  const activeOrder = data.orders.find((o) => o.id === selectedOrderId) || data.orders[0];
  const activeOrderItem = data.items.find((i) => i.order_id === activeOrder?.id);

  // Handle Scan Verification
  const handleVerifyScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeOrder || !skuScanInput) return;

    const result = store.verifyPackingBarcode(activeOrder.id, skuScanInput);
    if (result.matched) {
      setScanResult({
        status: 'matched',
        message: result.message,
      });
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
      showToast(`SKU ${skuScanInput} cocok! Paket siap ditempel label resi.`);
    } else {
      setScanResult({
        status: 'mismatched',
        message: result.message,
      });
    }
  };

  // Bulk Dispatch Action
  const handleBulkDispatch = (courierName: string) => {
    const pendingOrders = data.orders.filter(
      (o) => o.shipping_status !== 'shipped' && o.courier_name.toLowerCase().includes(courierName.toLowerCase().split(' ')[0])
    );

    if (pendingOrders.length === 0) {
      alert(`Tidak ada pesanan menunggu dispatch untuk kurir ${courierName}.`);
      return;
    }

    if (
      confirm(
        `Serahkan ${pendingOrders.length} paket ke kurir ${courierName} dan terbitkan nomor resi otomatis?`
      )
    ) {
      const { count } = store.bulkDispatchOrders(
        pendingOrders.map((o) => o.id),
        courierName
      );
      showToast(`Berhasil dispatch ${count} paket via ${courierName}!`);
    }
  };

  // Update single order status
  const handleUpdateStatus = (orderId: string, status: ShippingStatus) => {
    const tracking = trackingInputs[orderId];
    store.updateShippingStatus(orderId, status, tracking);
    showToast(`Status pesanan diperbarui ke ${status}.`);
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
            Modul 3 • Stasiun Logistik &amp; Packing
          </span>
          <h2 className="font-serif text-2xl font-medium text-espresso-900">
            Fulfillment, Barcode Verification &amp; 3PL Shipping
          </h2>
          <p className="text-xs text-espresso-600 mt-0.5">
            Zero-Error packing verification dengan pemindai barcode fisik, cetak resi thermal 10x15 cm, dan serah terima kurir mitra.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-linen-200/60 p-1 rounded-lg border border-linen-300/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('scan_station')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeSubTab === 'scan_station'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-amber-300" />
            1. Meja Scan Barcode
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('orders_list')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'orders_list'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            2. Daftar Pesanan ({data.orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('bulk_dispatch')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'bulk_dispatch'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            3. Serah Terima 3PL
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 1: MEJA SCAN BARCODE ZERO-ERROR               */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'scan_station' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Barcode Scanner Input */}
          <div className="lg:col-span-7 bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                  Meja Pengemasan Studio
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Verifikasi Fisik Barcode SKU (Zero-Error Packing)
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold uppercase">
                SLA Zero Error 100%
              </span>
            </div>

            {/* Select Order */}
            <div className="space-y-1">
              <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600">
                Pilih Pesanan yang Sedang Dikemas:
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => {
                  setSelectedOrderId(e.target.value);
                  setScanResult({ status: 'idle', message: '' });
                  setSkuScanInput('');
                }}
                className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900"
              >
                {data.orders.map((o) => {
                  const itm = data.items.find((i) => i.order_id === o.id);
                  return (
                    <option key={o.id} value={o.id}>
                      {o.order_number} — {o.buyer_handle} ({itm ? itm.sku : 'SKU N/A'}) • {o.shipping_status.toUpperCase()}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Target Item Reference Card */}
            {activeOrder && activeOrderItem && (
              <div className="p-4 bg-linen-100/70 rounded-xl border border-linen-300 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-lg bg-linen-200 overflow-hidden shrink-0 border border-linen-300">
                    <img
                      src={activeOrderItem.photo_url || ''}
                      alt={activeOrderItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-espresso-500 uppercase block">
                      Target SKU Pesanan:
                    </span>
                    <span className="font-mono text-sm font-bold text-espresso-900 block">
                      {activeOrderItem.sku}
                    </span>
                    <p className="font-serif text-xs font-medium text-espresso-900 line-clamp-1">
                      {activeOrderItem.title}
                    </p>
                    <span className="text-[10px] font-sans text-espresso-600">
                      Ukuran: {activeOrderItem.size} • Penerima: {activeOrder.buyer_name} ({activeOrder.buyer_handle})
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-espresso-400 block uppercase">
                    Nilai Paket
                  </span>
                  <span className="font-mono text-xs font-bold text-espresso-900">
                    {formatIDR(activeOrder.total_paid)}
                  </span>
                </div>
              </div>
            )}

            {/* Barcode Scanner Gun Input */}
            <form onSubmit={handleVerifyScan} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Arahkan Gun Scanner ke Barcode Hangtag Baju:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Scan barcode SKU atau ketik kode..."
                    value={skuScanInput}
                    onChange={(e) => setSkuScanInput(e.target.value)}
                    className="w-full text-sm font-mono font-bold uppercase tracking-wider bg-white border-2 border-espresso-800 rounded-xl p-3 text-espresso-900 placeholder:normal-case placeholder:font-normal focus:ring-2 focus:ring-espresso-900"
                  />
                  <div className="absolute right-3 top-3 text-espresso-400">
                    <ScanLine className="w-5 h-5 text-espresso-700 animate-pulse" />
                  </div>
                </div>
                <p className="text-[11px] text-espresso-500 font-sans mt-1">
                  Mendukung scanner laser USB/Bluetooth standar POS, atau ketik manual dan tekan Enter.
                </p>
              </div>

              {/* Sample Quick-fill testing buttons */}
              {activeOrderItem && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono text-espresso-500">Uji Simulator:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSkuScanInput(activeOrderItem.sku);
                      store.verifyPackingBarcode(activeOrder.id, activeOrderItem.sku);
                      setScanResult({
                        status: 'matched',
                        message: `VERIFIKASI SUKSES: SKU ${activeOrderItem.sku} cocok dengan pesanan ${activeOrder.order_number}!`,
                      });
                      confetti({ particleCount: 30 });
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300"
                  >
                    Simulasi Scan Benar ({activeOrderItem.sku})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSkuScanInput('PT-SM-999-999');
                      setScanResult({
                        status: 'mismatched',
                        message: 'VERIFIKASI GAGAL! Barcode fisik (PT-SM-999-999) TIDAK SESUAI dengan target pesanan. Harap cek ulang nomor gantungan!',
                      });
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-100 text-rose-800 border border-rose-300"
                  >
                    Simulasi Scan Salah
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-espresso-900 text-linen-100 text-xs font-medium uppercase tracking-wider hover:bg-espresso-800 transition"
              >
                Verifikasi Barcode Sekarang
              </button>
            </form>

            {/* Scan Feedback Banner */}
            {scanResult.status === 'matched' && (
              <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2 animate-scale-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-serif text-sm font-semibold text-emerald-900">
                    Lampu Hijau: Pakaian Cocok 100%!
                  </span>
                </div>
                <p className="text-xs font-sans text-emerald-800">{scanResult.message}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setLabelOrder(activeOrder)}
                    className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak Label Resi Thermal AWB
                  </button>
                </div>
              </div>
            )}

            {scanResult.status === 'mismatched' && (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-500 text-rose-950 space-y-2 animate-scale-in">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span className="font-serif text-sm font-semibold text-rose-900">
                    Lampu Merah: Barcode Tidak Sesuai!
                  </span>
                </div>
                <p className="text-xs font-sans text-rose-800">{scanResult.message}</p>
                <p className="text-[11px] text-rose-700 font-sans">
                  ⚠️ Peringatan: Jangan bungkus paket ini. Ambil pakaian yang benar dari gantungan rak studio.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Packing Station Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-linen-200">
                <h3 className="font-serif text-base font-medium text-espresso-900">
                  Antrean Packing Shift Ini
                </h3>
                <span className="text-xs font-mono text-espresso-500">
                  Total {data.orders.length} Pesanan
                </span>
              </div>

              <div className="space-y-3">
                {data.orders.map((ord) => {
                  const itm = data.items.find((i) => i.order_id === ord.id);
                  const isPacked = itm?.status === 'packed';
                  const isShipped = ord.shipping_status === 'shipped';

                  return (
                    <div
                      key={ord.id}
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setScanResult({ status: 'idle', message: '' });
                      }}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        selectedOrderId === ord.id
                          ? 'bg-linen-200/80 border-espresso-800'
                          : 'bg-white border-linen-200 hover:border-linen-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-espresso-900">
                            {ord.order_number}
                          </span>
                          <span className="text-[11px] font-sans text-espresso-600 font-medium">
                            {ord.buyer_handle}
                          </span>
                        </div>
                        <p className="text-[11px] text-espresso-500 font-mono mt-0.5">
                          {ord.courier_name} • {ord.shipping_city}
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-medium border ${
                            isShipped
                              ? 'bg-espresso-900 text-linen-100 border-espresso-900'
                              : isPacked
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-linen-100 text-espresso-700 border-linen-300'
                          }`}
                        >
                          {isShipped ? 'Terkirim' : isPacked ? 'Terverifikasi' : 'Menunggu Scan'}
                        </span>
                        <div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLabelOrder(ord);
                            }}
                            className="text-[10px] text-espresso-600 hover:text-espresso-900 underline flex items-center justify-end gap-0.5"
                          >
                            <Printer className="w-2.5 h-2.5" />
                            Cetak Resi
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 2: DAFTAR PESANAN & RESI                      */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'orders_list' && (
        <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-linen-200">
            <div>
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Semua Pesanan Hasil Live Commerce
              </h3>
              <p className="text-xs text-espresso-600">
                Daftar pembeli, status pengemasan, nomor resi pengiriman, dan serah terima ke ekspedisi.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-espresso-800">
              <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                <tr>
                  <th className="py-3 px-4">No. Pesanan</th>
                  <th className="py-3 px-4">Pembeli Live</th>
                  <th className="py-3 px-4">Ekspedisi &amp; Resi</th>
                  <th className="py-3 px-4">Total Bayar</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-linen-200">
                {data.orders.map((order) => {
                  const itm = data.items.find((i) => i.order_id === order.id);

                  return (
                    <tr key={order.id} className="hover:bg-linen-100/40 font-sans">
                      <td className="py-3.5 px-4 font-mono font-medium text-espresso-900">
                        {order.order_number}
                        <span className="block text-[10px] text-espresso-400">
                          {formatDateIndo(order.created_at)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-serif font-medium text-espresso-900 block">
                          {order.buyer_handle} ({order.buyer_name})
                        </span>
                        <span className="text-[11px] text-espresso-500 line-clamp-1">
                          {order.shipping_address}, {order.shipping_city}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-espresso-900 block">
                          {order.courier_name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <input
                            type="text"
                            placeholder="Input No. Resi..."
                            defaultValue={order.tracking_number || ''}
                            onChange={(e) =>
                              setTrackingInputs({
                                ...trackingInputs,
                                [order.id]: e.target.value,
                              })
                            }
                            className="text-[11px] font-mono bg-white border border-linen-300 rounded px-2 py-0.5 w-32"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-espresso-900">
                          {formatIDR(order.total_paid)}
                        </span>
                        <span className="block text-[10px] text-espresso-500">
                          (Ongkir {formatIDR(order.shipping_fee)})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                            order.shipping_status === 'shipped'
                              ? 'bg-espresso-900 text-linen-100 border-espresso-900'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {order.shipping_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => setLabelOrder(order)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-linen-200 text-espresso-800 hover:bg-linen-300"
                        >
                          <Printer className="w-3 h-3" />
                          Label
                        </button>
                        {order.shipping_status !== 'shipped' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(order.id, 'shipped')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                          >
                            <Truck className="w-3 h-3" />
                            Kirim
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
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 3: BULK DISPATCH 3PL                          */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'bulk_dispatch' && (
        <div className="space-y-6">
          <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="pb-4 border-b border-linen-200">
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Serah Terima Paket Massal (Bulk 3PL Dispatch)
              </h3>
              <p className="text-xs text-espresso-600">
                Kelompokkan paket berdasarkan kurir mitra penjemputan harian studio Sukabumi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* J&T Express */}
              <div className="p-5 rounded-2xl bg-white border border-linen-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-rose-700">
                    J&amp;T Express
                  </span>
                  <span className="text-[10px] font-mono bg-linen-200 px-2 py-0.5 rounded text-espresso-700">
                    Jemput 17.30 WIB
                  </span>
                </div>
                <p className="text-xs text-espresso-600">
                  Mitra pengiriman nasional reguler. Kurir drop-point menjemput paket langsung di studio setiap sore.
                </p>
                <div className="p-3 bg-linen-100 rounded-xl space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-espresso-500">Paket Menunggu:</span>
                    <span className="font-bold text-espresso-900">
                      {
                        data.orders.filter(
                          (o) =>
                            o.shipping_status !== 'shipped' &&
                            o.courier_name.toLowerCase().includes('j&t')
                        ).length
                      }{' '}
                      Paket
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBulkDispatch('J&T Express')}
                  className="w-full py-2.5 rounded-xl bg-espresso-900 text-linen-100 hover:bg-espresso-800 text-xs font-medium uppercase tracking-wider"
                >
                  Serahkan ke Kurir J&amp;T
                </button>
              </div>

              {/* SiCepat Express */}
              <div className="p-5 rounded-2xl bg-white border border-linen-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-terracotta-700">
                    SiCepat Express
                  </span>
                  <span className="text-[10px] font-mono bg-linen-200 px-2 py-0.5 rounded text-espresso-700">
                    Jemput 18.00 WIB
                  </span>
                </div>
                <p className="text-xs text-espresso-600">
                  Pengiriman antar-kota Jawa Barat &amp; Jabodetabek prioritas Next Day.
                </p>
                <div className="p-3 bg-linen-100 rounded-xl space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-espresso-500">Paket Menunggu:</span>
                    <span className="font-bold text-espresso-900">
                      {
                        data.orders.filter(
                          (o) =>
                            o.shipping_status !== 'shipped' &&
                            o.courier_name.toLowerCase().includes('sicepat')
                        ).length
                      }{' '}
                      Paket
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBulkDispatch('SiCepat Express')}
                  className="w-full py-2.5 rounded-xl bg-espresso-900 text-linen-100 hover:bg-espresso-800 text-xs font-medium uppercase tracking-wider"
                >
                  Serahkan ke SiCepat
                </button>
              </div>

              {/* Gosend Instant Sukabumi */}
              <div className="p-5 rounded-2xl bg-white border border-linen-300 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base font-bold text-emerald-800">
                    Gosend Instant Sukabumi
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    Sameday 2 Jam
                  </span>
                </div>
                <p className="text-xs text-espresso-600">
                  Khusus pembeli di 7 kecamatan Kota Sukabumi (Cikole, Citamiang, Baros, Gunungpuyuh, dll).
                </p>
                <div className="p-3 bg-linen-100 rounded-xl space-y-1 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-espresso-500">Paket Menunggu:</span>
                    <span className="font-bold text-espresso-900">
                      {
                        data.orders.filter(
                          (o) =>
                            o.shipping_status !== 'shipped' &&
                            o.courier_name.toLowerCase().includes('gosend')
                        ).length
                      }{' '}
                      Paket
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleBulkDispatch('Gosend Instant Sukabumi')}
                  className="w-full py-2.5 rounded-xl bg-espresso-900 text-linen-100 hover:bg-espresso-800 text-xs font-medium uppercase tracking-wider"
                >
                  Panggil Driver Gosend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: 10x15 CM THERMAL SHIPPING LABEL (AWB)         */}
      {/* ---------------------------------------------------- */}
      {labelOrder && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                  Thermal Label 10x15 cm
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Label Resi Pengiriman (Airway Bill)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLabelOrder(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Printable AWB */}
            <div className="bg-white border-2 border-dashed border-espresso-900 p-5 rounded-xl text-espresso-900 font-mono space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b-2 border-dashed border-espresso-900">
                <div>
                  <span className="font-serif font-bold text-sm block">PINDAHTANGAN ATELIER</span>
                  <span className="text-[8px] text-espresso-500 block">Jl. Siliwangi No. 102, Kota Sukabumi</span>
                </div>
                <span className="text-xs font-bold bg-espresso-900 text-linen-100 px-2 py-0.5 rounded">
                  {labelOrder.courier_name.toUpperCase()}
                </span>
              </div>

              {/* Barcode No Resi */}
              <div className="text-center py-1 space-y-1">
                <div className="h-9 w-full flex items-center justify-center gap-0.5 px-3">
                  {[3, 1, 5, 2, 6, 2, 4, 1, 6, 3, 2, 5, 1, 4, 2, 5, 3, 1, 6, 2, 4, 3].map((w, i) => (
                    <div key={i} className="bg-espresso-950 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <span className="text-xs font-bold tracking-widest block">
                  {labelOrder.tracking_number || `AWB-${labelOrder.order_number}`}
                </span>
              </div>

              {/* Penerima */}
              <div className="p-2.5 bg-linen-100/60 rounded-lg text-xs space-y-0.5 border border-linen-200">
                <span className="text-[9px] uppercase tracking-wider text-espresso-500 font-bold block">
                  PENERIMA PAKET:
                </span>
                <p className="font-bold text-espresso-900">{labelOrder.buyer_name} ({labelOrder.buyer_handle})</p>
                <p className="text-[11px] text-espresso-700">{labelOrder.buyer_phone}</p>
                <p className="text-[11px] text-espresso-800 leading-snug">{labelOrder.shipping_address}</p>
                <p className="text-[11px] font-bold text-espresso-900">{labelOrder.shipping_city}</p>
              </div>

              {/* Discreet Items description */}
              <div className="text-[10px] space-y-1 pt-1 border-t border-linen-200">
                <div className="flex justify-between">
                  <span className="text-espresso-500">Deskripsi Paket:</span>
                  <span className="font-bold text-espresso-900">Pakaian Fesyen Terkurasi PT-01</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Nomor Pesanan:</span>
                  <span>{labelOrder.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Instruksi Kurir:</span>
                  <span>Jangan dibanting, jangan terkena air.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-espresso-500 font-sans">
                Ukuran cetak 100mm x 150mm
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLabelOrder(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Thermal AWB
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
