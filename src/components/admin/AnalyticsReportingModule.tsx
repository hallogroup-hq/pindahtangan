'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { formatIDR } from '@/lib/utils';
import { BUSINESS_RULES } from '@/lib/constants';
import {
  BarChart3,
  TrendingUp,
  Download,
  CheckCircle2,
  DollarSign,
  PieChart,
  Sliders,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export default function AnalyticsReportingModule() {
  const { data, store } = useStore();

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Simulator state
  const [simSoldVolume, setSimSoldVolume] = useState<number>(30);
  const [simAvgFloor, setSimAvgFloor] = useState<number>(35000);
  const [simAvgSold, setSimAvgSold] = useState<number>(65000);

  // Download CSV Handler
  const handleDownloadCSV = (type: 'sales' | 'payouts' | 'inventory' | 'audit') => {
    const csvContent = store.exportAccountingCSV(type);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `laporan_${type}_pindahtangan_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Laporan ${type.toUpperCase()} CSV berhasil diunduh!`);
  };

  // Real-time Unit Economics calculation
  const metrics = store.getUnitEconomics();

  // QC Metrics
  const totalInspected = data.items.length;
  const rejectedCount = data.items.filter((i) => i.status === 'rejected').length;
  const passedCount = totalInspected - rejectedCount;
  const qcPassRate = totalInspected > 0 ? Math.round((passedCount / totalInspected) * 100) : 100;

  // Simulator calculations
  const simTotalGMV = simSoldVolume * simAvgSold;
  const simTotalConsignorGross = simSoldVolume * simAvgFloor;
  const simTotalSteamDeduction = simSoldVolume * BUSINESS_RULES.STEAM_FEE_PER_PIECE;
  const simTotalConsignorNet = Math.max(0, simTotalConsignorGross - simTotalSteamDeduction);
  const simHostCost =
    BUSINESS_RULES.HOST_BASE_FEE_PER_SHIFT +
    simSoldVolume * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE;
  const simPlatformGrossMargin =
    simSoldVolume * (simAvgSold - simAvgFloor) + simTotalSteamDeduction;
  const simPlatformNetProfit = simPlatformGrossMargin - simHostCost;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-linen-300 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Modul 6 • Analitika Eksekutif &amp; Pembukuan
          </span>
          <h2 className="font-serif text-2xl font-medium text-espresso-900">
            Executive Analytics &amp; Unit Economics Simulator
          </h2>
          <p className="text-xs text-espresso-600 mt-0.5">
            Visibilitas laba bersih kas platform, simulator shift 2 jam, dan ekspor pembukuan standar akuntansi.
          </p>
        </div>

        {/* 1-Click CSV Downloads Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleDownloadCSV('sales')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-linen-200 text-espresso-900 hover:bg-linen-300 border border-linen-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            Sales CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownloadCSV('payouts')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-linen-200 text-espresso-900 hover:bg-linen-300 border border-linen-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            Payouts CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownloadCSV('inventory')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-linen-200 text-espresso-900 hover:bg-linen-300 border border-linen-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            Inventory CSV
          </button>
          <button
            type="button"
            onClick={() => handleDownloadCSV('audit')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-linen-200 text-espresso-900 hover:bg-linen-300 border border-linen-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-espresso-600" />
            Audit Log CSV
          </button>
        </div>
      </div>

      {/* Realtime KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
            Total GMV Penjualan
          </span>
          <p className="font-serif text-2xl font-medium text-espresso-900">
            {formatIDR(metrics.totalGrossGMV)}
          </p>
          <span className="text-[10px] text-espresso-500 font-mono block">
            {metrics.itemsSold} potong baju laku
          </span>
        </div>

        <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
            Gross Margin Platform
          </span>
          <p className="font-serif text-2xl font-medium text-terracotta-700">
            {formatIDR(metrics.totalPlatformGrossMargin)}
          </p>
          <span className="text-[10px] text-espresso-500 font-mono block">
            Selisih harga + jasa uap
          </span>
        </div>

        <div className="p-4 bg-linen-50 border border-emerald-300 rounded-2xl space-y-1 bg-emerald-50/40">
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-800 font-bold block">
            Platform Net Profit
          </span>
          <p className="font-serif text-2xl font-bold text-emerald-900">
            {formatIDR(metrics.totalPlatformNetProfit)}
          </p>
          <span className="text-[10px] text-emerald-700 font-mono block">
            Laba bersih setelah honor host
          </span>
        </div>

        <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
            QC Pass Rate Studio
          </span>
          <p className="font-serif text-2xl font-medium text-espresso-900">
            {qcPassRate}%
          </p>
          <span className="text-[10px] text-espresso-500 font-mono block">
            {rejectedCount} pcs cacat fisik
          </span>
        </div>

        <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
            Beban Honor Host Shift
          </span>
          <p className="font-serif text-2xl font-medium text-espresso-900">
            {formatIDR(metrics.totalHostFees)}
          </p>
          <span className="text-[10px] text-espresso-500 font-mono block">
            Pokok Rp 60k + Komisi Rp 2k
          </span>
        </div>
      </div>

      {/* Simulator Section (PRD Section 9) */}
      <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-linen-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
              Simulasi Dinamis Shift 2 Jam
            </span>
            <h3 className="font-serif text-lg font-medium text-espresso-900">
              Unit Economics Per Shift Live TikTok
            </h3>
          </div>
          <span className="text-xs font-mono text-espresso-600 bg-linen-200 px-3 py-1 rounded-full">
            Formula PRD Seksi 9
          </span>
        </div>

        {/* Sliders Input */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-linen-100/50 rounded-xl border border-linen-200">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-mono uppercase tracking-wider text-espresso-600">
                Volume Pakaian Laku:
              </span>
              <span className="font-mono font-bold text-espresso-900 text-sm">
                {simSoldVolume} potong
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={1}
              value={simSoldVolume}
              onChange={(e) => setSimSoldVolume(Number(e.target.value))}
              className="w-full accent-espresso-900"
            />
            <span className="text-[10px] text-espresso-500 font-sans block mt-1">
              Standar target host: 30–50 pcs / shift 2 jam.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-mono uppercase tracking-wider text-espresso-600">
                Rata-rata Floor Price:
              </span>
              <span className="font-mono font-bold text-espresso-900 text-sm">
                {formatIDR(simAvgFloor)}
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={100000}
              step={5000}
              value={simAvgFloor}
              onChange={(e) => setSimAvgFloor(Number(e.target.value))}
              className="w-full accent-espresso-900"
            />
            <span className="text-[10px] text-espresso-500 font-sans block mt-1">
              Hak dasar penitip sebelum deduksi cuci uap.
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="font-mono uppercase tracking-wider text-espresso-600">
                Rata-rata Harga Laku Live:
              </span>
              <span className="font-mono font-bold text-espresso-900 text-sm">
                {formatIDR(simAvgSold)}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={150000}
              step={5000}
              value={simAvgSold}
              onChange={(e) => setSimAvgSold(Number(e.target.value))}
              className="w-full accent-espresso-900"
            />
            <span className="text-[10px] text-espresso-500 font-sans block mt-1">
              Harga deal live streaming kepada pembeli.
            </span>
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Revenue Breakdown */}
          <div className="p-5 bg-white rounded-xl border border-linen-200 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-espresso-900 pb-2 border-b border-linen-200">
              Arus Kas Kotor (Gross Flow)
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-espresso-600">Total Omzet (GMV):</span>
                <span className="font-bold text-espresso-900">{formatIDR(simTotalGMV)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-600">Hak Dasar Consignor:</span>
                <span>{formatIDR(simTotalConsignorGross)}</span>
              </div>
              <div className="flex justify-between text-terracotta-700">
                <span>Deduksi Uap (Rp 2.500):</span>
                <span>-{formatIDR(simTotalSteamDeduction)}</span>
              </div>
              <div className="pt-2 border-t border-linen-200 flex justify-between font-bold text-espresso-900">
                <span>Net Transfer Consignor:</span>
                <span>{formatIDR(simTotalConsignorNet)}</span>
              </div>
            </div>
          </div>

          {/* Platform Unit Economics */}
          <div className="p-5 bg-white rounded-xl border border-linen-200 space-y-3">
            <h4 className="font-serif text-sm font-semibold text-espresso-900 pb-2 border-b border-linen-200">
              Struktur Biaya Talent
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-espresso-600">Honor Pokok Host (2 Jam):</span>
                <span>{formatIDR(BUSINESS_RULES.HOST_BASE_FEE_PER_SHIFT)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-espresso-600">Komisi Host ({simSoldVolume}x Rp 2k):</span>
                <span>{formatIDR(simSoldVolume * BUSINESS_RULES.HOST_COMMISSION_PER_PIECE)}</span>
              </div>
              <div className="pt-2 border-t border-linen-200 flex justify-between font-bold text-espresso-900">
                <span>Total Honor Host Talent:</span>
                <span>{formatIDR(simHostCost)}</span>
              </div>
            </div>
          </div>

          {/* Net Margin Highlight */}
          <div className="p-5 bg-emerald-50/50 rounded-xl border-2 border-emerald-300 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-serif text-sm font-bold text-emerald-950 pb-2 border-b border-emerald-200">
                Laba Bersih Platform per Shift
              </h4>
              <div className="space-y-2 text-xs font-mono mt-2">
                <div className="flex justify-between text-emerald-800">
                  <span>Gross Margin Platform:</span>
                  <span>{formatIDR(simPlatformGrossMargin)}</span>
                </div>
                <div className="flex justify-between text-emerald-800">
                  <span>Beban Talent Host:</span>
                  <span>-{formatIDR(simHostCost)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 block">
                NET PROFIT KAS PLATFORM:
              </span>
              <span className="font-serif text-3xl font-extrabold text-emerald-900">
                {formatIDR(simPlatformNetProfit)}
              </span>
              <p className="text-[10px] text-emerald-700 font-sans mt-1">
                Margin profit bersih: {Math.round((simPlatformNetProfit / simTotalGMV) * 100)}% dari GMV live
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
