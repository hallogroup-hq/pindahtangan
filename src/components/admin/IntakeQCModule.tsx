'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { IntakeBatch, ClothesItem, TierCategory } from '@/lib/types';
import { formatIDR, formatDateIndo } from '@/lib/utils';
import { TIER_CONFIG, STATUS_LABELS } from '@/lib/constants';
import {
  PackageCheck,
  Sparkles,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  QrCode,
  Tag,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';

export default function IntakeQCModule() {
  const { data, store } = useStore();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'manifest' | 'qc_station' | 'hangtags'>('manifest');

  // Intake manifest modal state
  const [selectedBatchForCount, setSelectedBatchForCount] = useState<IntakeBatch | null>(null);
  const [actualCountInput, setActualCountInput] = useState<number>(20);
  const [batchNotesInput, setBatchNotesInput] = useState<string>('');

  // QC Form state
  const [selectedBatchId, setSelectedBatchId] = useState<string>(data.batches[0]?.id || '');
  const [itemTitle, setItemTitle] = useState('');
  const [itemBrand, setItemBrand] = useState('Zara');
  const [itemSize, setItemSize] = useState('M');
  const [itemChestWidth, setItemChestWidth] = useState<number>(96);
  const [itemTier, setItemTier] = useState<TierCategory>('tier_a');
  const [itemFloorPrice, setItemFloorPrice] = useState<number>(60000);
  const [itemTargetPrice, setItemTargetPrice] = useState<number>(89000);
  const [rackLocation, setRackLocation] = useState('RACK-A1');
  const [isSteamed, setIsSteamed] = useState(true);

  // 5 QC Parameters Checklist
  const [qcChecks, setQcChecks] = useState({
    noStain: true,
    noTear: true,
    zipperGood: true,
    buttonsGood: true,
    noOdor: true,
  });

  // Reject state
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [defectReason, setDefectReason] = useState('Noda Minyak / Tinta Permanen');
  const [defectNotes, setDefectNotes] = useState('');
  const [defectPhotoUrl, setDefectPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80'
  );

  // Hangtag Modal
  const [selectedHangtagItem, setSelectedHangtagItem] = useState<ClothesItem | null>(null);

  // Success message state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Tier change handler with floor & target defaults
  const handleTierSelect = (tier: TierCategory) => {
    setItemTier(tier);
    const config = TIER_CONFIG[tier];
    setItemFloorPrice(config.minFloor);
    setItemTargetPrice(config.defaultTargetLive);
  };

  // Save Intake Count Verification
  const handleSaveActualCount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForCount) return;

    store.updateBatchActualCount(
      selectedBatchForCount.id,
      actualCountInput,
      batchNotesInput || selectedBatchForCount.notes
    );

    showToast(
      `Kantong ${selectedBatchForCount.batch_code} diverifikasi: ${actualCountInput} pcs fisik masuk stasiun QC.`
    );
    setSelectedBatchForCount(null);
  };

  // Submit QC
  const handleQCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = data.batches.find((b) => b.id === selectedBatchId);
    if (!batch) {
      alert('Pilih batch kantong masuk terlebih dahulu.');
      return;
    }

    if (isRejectMode) {
      const rejectedItem = store.inspectQCItem({
        batchId: batch.id,
        consignorId: batch.consignor_id,
        title: itemTitle || 'Pakaian Tidak Lolos QC',
        brand: itemBrand,
        size: itemSize,
        categoryTier: itemTier,
        floorPrice: itemFloorPrice,
        targetLivePrice: itemTargetPrice,
        passedQC: false,
        defectReason,
        defectNotes: defectNotes || `Kerusakan fisik: ${defectReason}`,
        defectPhotoUrl,
      });

      showToast(`Item ${rejectedItem.sku} dicatat sebagai REJECT dan siap dikonfirmasi consignor.`);
      // Reset form title
      setItemTitle('');
      setDefectNotes('');
    } else {
      // Validate checks
      const allPassed = Object.values(qcChecks).every(Boolean);
      if (!allPassed) {
        if (
          !confirm(
            'Beberapa parameter QC belum dicentang bersih. Tetap loloskan pakaian ini ke antrean live?'
          )
        ) {
          return;
        }
      }

      const passedItem = store.inspectQCItem({
        batchId: batch.id,
        consignorId: batch.consignor_id,
        title: itemTitle || `${itemBrand} ${itemTier.toUpperCase()} Pilihan`,
        brand: itemBrand,
        size: itemSize,
        chestWidthCm: Number(itemChestWidth) || undefined,
        categoryTier: itemTier,
        floorPrice: Number(itemFloorPrice),
        targetLivePrice: Number(itemTargetPrice),
        passedQC: true,
        isSteamed,
        rackLocation,
      });

      showToast(`Item ${passedItem.sku} lolos QC! Hangtag No. ${passedItem.hangtag_number} siap dicetak.`);
      setItemTitle('');
      setSelectedHangtagItem(passedItem);
    }
  };

  // Confirm Steaming action
  const handleConfirmSteam = (itemId: string) => {
    store.confirmSteaming(itemId);
    showToast('Sterilisasi uap >100°C selesai. Pakaian masuk status Siap Live!');
  };

  // Recent items in QC / Steaming
  const recentQCItems = data.items.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-espresso-900 text-linen-100 px-5 py-3.5 rounded-xl shadow-xl border border-espresso-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-sans font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-linen-300 pb-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
            Modul 1 • Stasiun Fisik Studio
          </span>
          <h2 className="font-serif text-2xl font-medium text-espresso-900">
            Intake Kantong, Screening QC &amp; Cuci Uap
          </h2>
          <p className="text-xs text-espresso-600 mt-0.5">
            Verifikasi fisik kedatangan kurir, 5 parameter kelayakan pakaian, sterilisasi uap suhu &gt;100°C, dan cetak hangtag thermal 10x15 cm.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-linen-200/60 p-1 rounded-lg border border-linen-300/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('manifest')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'manifest'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            1. Manifest Kantong ({data.batches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('qc_station')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'qc_station'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            2. Stasiun QC &amp; Uap
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('hangtags')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeSubTab === 'hangtags'
                ? 'bg-espresso-900 text-linen-50 shadow-xs'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            3. Arsip Hangtag ({data.items.length})
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 1: MANIFEST INTAKE KANTONG                    */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'manifest' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Total Kantong Terdaftar
              </span>
              <p className="font-serif text-2xl font-normal text-espresso-900">
                {data.batches.length} Kantong
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                Rute penjemputan 7 kecamatan Kota Sukabumi
              </p>
            </div>
            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Dalam Proses QC &amp; Uap
              </span>
              <p className="font-serif text-2xl font-normal text-terracotta-700">
                {data.batches.filter((b) => b.status === 'in_qc').length} Kantong
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                SLA penyelesaian QC &lt; 24 jam di studio
              </p>
            </div>
            <div className="p-4 bg-linen-50 border border-linen-300/90 rounded-xl space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-espresso-500 font-semibold block">
                Selesai Dipasangi Hangtag
              </span>
              <p className="font-serif text-2xl font-normal text-emerald-800">
                {data.batches.filter((b) => b.status === 'completed').length} Kantong
              </p>
              <p className="text-[11px] text-espresso-500 font-sans">
                Pakaian masuk ke rack staging siaran live
              </p>
            </div>
          </div>

          {/* Table Batches */}
          <div className="bg-linen-50 border border-linen-300/90 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 sm:p-5 border-b border-linen-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-linen-100/50">
              <div>
                <h3 className="font-serif text-base font-medium text-espresso-900">
                  Daftar Manifest Penjemputan Kurir Masuk
                </h3>
                <p className="text-xs text-espresso-600">
                  Verifikasi jumlah pakaian aktual saat kantong tiba di meja intake studio.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-espresso-800">
                <thead className="bg-linen-100/90 text-espresso-600 uppercase font-mono tracking-wider text-[10px] border-b border-linen-200">
                  <tr>
                    <th className="py-3 px-4">Kode Batch</th>
                    <th className="py-3 px-4">Pemilik Lemari</th>
                    <th className="py-3 px-4">Kecamatan / Alamat</th>
                    <th className="py-3 px-4 text-center">Estimasi vs Aktual</th>
                    <th className="py-3 px-4 text-center">Status Intake</th>
                    <th className="py-3 px-4 text-right">Tindakan Fisik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-200">
                  {data.batches.map((batch) => {
                    const consignor = data.profiles.find((p) => p.id === batch.consignor_id);
                    const isDiscrepant =
                      batch.actual_count > 0 && batch.actual_count !== batch.estimated_count;

                    return (
                      <tr key={batch.id} className="hover:bg-linen-100/40 transition">
                        <td className="py-3.5 px-4 font-mono font-medium text-espresso-900">
                          {batch.batch_code}
                          <span className="block text-[10px] text-espresso-400 font-sans">
                            {formatDateIndo(batch.created_at)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-serif font-medium text-espresso-900 block">
                            {consignor?.full_name || 'Penitip Sukabumi'}
                          </span>
                          <span className="font-mono text-[11px] text-espresso-500">
                            {consignor?.phone_number}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="block text-espresso-900">{batch.district || 'Kota Sukabumi'}</span>
                          <span className="text-[11px] text-espresso-500 line-clamp-1">
                            {batch.pickup_address}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 font-mono">
                            <span className="text-espresso-600">{batch.estimated_count} est</span>
                            <span className="text-espresso-400">→</span>
                            <span
                              className={`font-semibold ${
                                batch.actual_count === 0
                                  ? 'text-amber-700'
                                  : isDiscrepant
                                  ? 'text-terracotta-700'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {batch.actual_count > 0 ? `${batch.actual_count} fisik` : 'Belum Dihitung'}
                            </span>
                          </div>
                          {isDiscrepant && (
                            <span className="block text-[10px] font-mono text-terracotta-600 mt-0.5">
                              Selisih {batch.actual_count - batch.estimated_count} pcs
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
                              batch.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : batch.status === 'in_qc'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-linen-200 text-espresso-700 border-linen-300'
                            }`}
                          >
                            {batch.status === 'completed'
                              ? 'QC Selesai'
                              : batch.status === 'in_qc'
                              ? 'Sedang di-QC'
                              : 'Dijadwalkan'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBatchForCount(batch);
                              setActualCountInput(batch.actual_count || batch.estimated_count || 20);
                              setBatchNotesInput(batch.notes || '');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800 transition"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            Hitung Fisik
                          </button>
                          {batch.status === 'in_qc' && (
                            <button
                              type="button"
                              onClick={() => {
                                store.completeBatchIntake(batch.id);
                                showToast(`Batch ${batch.batch_code} ditandai selesai QC.`);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-linen-200 text-espresso-800 hover:bg-linen-300 border border-linen-300 transition"
                            >
                              Selesaikan
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
      )}

      {/* ---------------------------------------------------- */}
      {/* SUBTAB 2: STASIUN QC & CUCI UAP                      */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'qc_station' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: QC Inspection Form */}
          <div className="lg:col-span-7 bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                  Pemeriksaan Studio
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Formulir QC 5-Parameter &amp; Uap Panas
                </h3>
              </div>

              {/* Toggle Mode: Pass vs Reject */}
              <div className="flex items-center gap-1 bg-linen-200/80 p-1 rounded-lg border border-linen-300">
                <button
                  type="button"
                  onClick={() => setIsRejectMode(false)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    !isRejectMode
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-espresso-700 hover:text-espresso-900'
                  }`}
                >
                  Lolos QC
                </button>
                <button
                  type="button"
                  onClick={() => setIsRejectMode(true)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    isRejectMode
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-espresso-700 hover:text-espresso-900'
                  }`}
                >
                  Reject Defek
                </button>
              </div>
            </div>

            <form onSubmit={handleQCSubmit} className="space-y-5">
              {/* Batch Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                  Batch Kantong Masuk:
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900 focus:ring-1 focus:ring-espresso-800"
                >
                  {data.batches.map((b) => {
                    const cons = data.profiles.find((p) => p.id === b.consignor_id);
                    return (
                      <option key={b.id} value={b.id}>
                        {b.batch_code} — {cons?.full_name || 'Penitip'} ({b.actual_count || b.estimated_count} pcs)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Title & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Judul Pakaian:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Zara Floral Blouse Katun"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900 focus:ring-1 focus:ring-espresso-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Brand / Merek:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Zara, Uniqlo, Mango, H&M, Lokal"
                    value={itemBrand}
                    onChange={(e) => setItemBrand(e.target.value)}
                    className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900 focus:ring-1 focus:ring-espresso-800"
                  />
                </div>
              </div>

              {/* Size, LD cm & Rack */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Ukuran:
                  </label>
                  <select
                    value={itemSize}
                    onChange={(e) => setItemSize(e.target.value)}
                    className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="All Size">All Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Lingkar Dada (cm):
                  </label>
                  <input
                    type="number"
                    placeholder="LD misal 96"
                    value={itemChestWidth || ''}
                    onChange={(e) => setItemChestWidth(Number(e.target.value))}
                    className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1">
                    Lokasi Rak:
                  </label>
                  <input
                    type="text"
                    value={rackLocation}
                    onChange={(e) => setRackLocation(e.target.value)}
                    className="w-full text-xs font-sans bg-linen-100/80 border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                  />
                </div>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-600 mb-1.5">
                  Kategori Tier Kurasi:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['tier_a', 'tier_b', 'tier_c'] as TierCategory[]).map((tier) => {
                    const cfg = TIER_CONFIG[tier];
                    const isSelected = itemTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleTierSelect(tier)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          isSelected
                            ? 'border-espresso-900 bg-linen-200/90 shadow-xs'
                            : 'border-linen-300 bg-linen-100/40 hover:bg-linen-100'
                        }`}
                      >
                        <span className="font-serif text-xs font-medium text-espresso-900 block">
                          {cfg.label.split('•')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-espresso-500 block">
                          {cfg.floorPriceRange}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Form */}
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-linen-100/60 rounded-xl border border-linen-200">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-700 mb-1">
                    Floor Price (Hak Penitip):
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={itemFloorPrice}
                    onChange={(e) => setItemFloorPrice(Number(e.target.value))}
                    className="w-full text-xs font-mono font-semibold bg-white border border-linen-300 rounded-lg p-2 text-espresso-900"
                  />
                  <span className="text-[10px] text-espresso-500 block mt-0.5">
                    Bersih setelah uap: {formatIDR(Math.max(0, itemFloorPrice - 2500))}
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-espresso-700 mb-1">
                    Target Live Price (Host):
                  </label>
                  <input
                    type="number"
                    step={5000}
                    value={itemTargetPrice}
                    onChange={(e) => setItemTargetPrice(Number(e.target.value))}
                    className="w-full text-xs font-mono font-semibold bg-white border border-linen-300 rounded-lg p-2 text-espresso-900"
                  />
                  <span className="text-[10px] text-terracotta-700 block mt-0.5 font-medium">
                    Estimasi Margin: {formatIDR(itemTargetPrice - itemFloorPrice + 2500)}
                  </span>
                </div>
              </div>

              {/* PASS MODE: 5 QC Parameter Checklist */}
              {!isRejectMode && (
                <div className="space-y-3 p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span className="text-xs font-serif font-medium text-emerald-900">
                      Standar 5-Parameter Fisik (Wajib Bersih)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-espresso-800">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={qcChecks.noStain}
                        onChange={(e) => setQcChecks({ ...qcChecks, noStain: e.target.checked })}
                        className="rounded border-linen-300 text-espresso-900 focus:ring-espresso-800"
                      />
                      <span>Bebas noda permanen / jamur</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={qcChecks.noTear}
                        onChange={(e) => setQcChecks({ ...qcChecks, noTear: e.target.checked })}
                        className="rounded border-linen-300 text-espresso-900 focus:ring-espresso-800"
                      />
                      <span>Bebas sobek / bolong kain</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={qcChecks.zipperGood}
                        onChange={(e) => setQcChecks({ ...qcChecks, zipperGood: e.target.checked })}
                        className="rounded border-linen-300 text-espresso-900 focus:ring-espresso-800"
                      />
                      <span>Resleting lancar &amp; gigi utuh</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={qcChecks.buttonsGood}
                        onChange={(e) => setQcChecks({ ...qcChecks, buttonsGood: e.target.checked })}
                        className="rounded border-linen-300 text-espresso-900 focus:ring-espresso-800"
                      />
                      <span>Kancing lengkap &amp; tidak copot</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={qcChecks.noOdor}
                        onChange={(e) => setQcChecks({ ...qcChecks, noOdor: e.target.checked })}
                        className="rounded border-linen-300 text-espresso-900 focus:ring-espresso-800"
                      />
                      <span>Bebas bau apek / residu lemari lama</span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="steamConfirm"
                      checked={isSteamed}
                      onChange={(e) => setIsSteamed(e.target.checked)}
                      className="rounded border-linen-300 text-emerald-800 focus:ring-emerald-700"
                    />
                    <label htmlFor="steamConfirm" className="text-xs font-medium text-emerald-950 flex items-center gap-1 cursor-pointer">
                      <Flame className="w-3.5 h-3.5 text-terracotta-600" />
                      Sterilisasi Uap Panas &gt;100°C &amp; Fabric Mist Selesai (Langsung Siap Live)
                    </label>
                  </div>
                </div>
              )}

              {/* REJECT MODE: Defect reason & photo */}
              {isRejectMode && (
                <div className="space-y-3 p-4 bg-rose-50/60 border border-rose-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span className="text-xs font-serif font-medium text-rose-900">
                      Rincian Kerusakan (Reject QC)
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-rose-800 mb-1">
                      Kategori Cacat:
                    </label>
                    <select
                      value={defectReason}
                      onChange={(e) => setDefectReason(e.target.value)}
                      className="w-full text-xs font-sans bg-white border border-rose-200 rounded-lg p-2 text-rose-950"
                    >
                      <option value="Noda Minyak / Tinta Permanen">Noda Minyak / Tinta Permanen</option>
                      <option value="Kain Bolong / Sobek di Lipatan">Kain Bolong / Sobek di Lipatan</option>
                      <option value="Resleting Patah / Macet Total">Resleting Patah / Macet Total</option>
                      <option value="Kancing Utama Hilang">Kancing Utama Hilang</option>
                      <option value="Bau Apek / Jamur Membandel">Bau Apek / Jamur Membandel</option>
                      <option value="Bahan Melar / Karet Rusak">Bahan Melar / Karet Rusak</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-rose-800 mb-1">
                      Catatan Detail untuk Penitip:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Tuliskan posisi spesifik noda/sobek agar penitip paham..."
                      value={defectNotes}
                      onChange={(e) => setDefectNotes(e.target.value)}
                      className="w-full text-xs font-sans bg-white border border-rose-200 rounded-lg p-2 text-rose-950"
                    />
                  </div>

                  <div className="text-[11px] text-rose-700 font-sans">
                    * Pakaian reject akan muncul di portal pemilik baju dengan opsi: Donasi atau Ambil Kembali saat Payout.
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-medium uppercase tracking-wider transition shadow-sm ${
                  isRejectMode
                    ? 'bg-rose-800 text-white hover:bg-rose-900'
                    : 'bg-espresso-900 text-linen-100 hover:bg-espresso-800'
                }`}
              >
                {isRejectMode ? 'Simpan Data Pakaian Reject' : 'Loloskan QC & Terbitkan Hangtag'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Steam Rack Queue */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-linen-200">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                    Staging Rack
                  </span>
                  <h3 className="font-serif text-base font-medium text-espresso-900">
                    Antrean Uap &amp; Gantungan Terkini
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-linen-200 text-espresso-700">
                  {recentQCItems.length} Potong Terakhir
                </span>
              </div>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {recentQCItems.map((item) => {
                  const statusInfo = STATUS_LABELS[item.status] || {
                    label: item.status,
                    color: 'bg-linen-200 text-espresso-800',
                  };

                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-linen-100/50 rounded-xl border border-linen-200/80 flex items-center justify-between gap-3 hover:bg-linen-100 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-lg bg-linen-200 overflow-hidden shrink-0 border border-linen-300/60">
                          <img
                            src={item.photo_url || item.defect_photo_url || ''}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-espresso-900 bg-linen-200 px-1.5 py-0.2 rounded">
                              No. {item.hangtag_number}
                            </span>
                            <span className="font-mono text-[10px] text-espresso-500">
                              {item.sku}
                            </span>
                          </div>
                          <p className="font-serif text-xs font-medium text-espresso-900 line-clamp-1">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-espresso-500 font-mono">
                            {item.brand} • Size {item.size || '-'} • Floor: {formatIDR(item.floor_price)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 space-y-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>

                        <div className="flex items-center justify-end gap-1">
                          {item.status === 'in_steam' && (
                            <button
                              type="button"
                              onClick={() => handleConfirmSteam(item.id)}
                              title="Konfirmasi Uap Panas Selesai"
                              className="px-2 py-1 rounded bg-terracotta-600 text-white text-[10px] hover:bg-terracotta-700 flex items-center gap-1"
                            >
                              <Flame className="w-2.5 h-2.5" />
                              Uap
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedHangtagItem(item)}
                            title="Lihat & Cetak Hangtag"
                            className="p-1 rounded bg-linen-200 hover:bg-linen-300 text-espresso-700"
                          >
                            <Printer className="w-3.5 h-3.5" />
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
      {/* SUBTAB 3: ARSIP HANGTAG & CETAK                      */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'hangtags' && (
        <div className="bg-linen-50 border border-linen-300/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-linen-200">
            <div>
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Arsip Cetak Hangtag Barcode Thermal (10x15 cm)
              </h3>
              <p className="text-xs text-espresso-600">
                Hangtag fisik dipasang di gantungan baju studio sebelum masuk antrean siaran live.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items
              .filter((i) => i.status !== 'rejected')
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-linen-300 shadow-xs flex flex-col justify-between space-y-3 hover:border-espresso-800 transition"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-espresso-900 text-linen-100 px-2 py-0.5 rounded">
                        GANTUNGAN #{item.hangtag_number}
                      </span>
                      <span className="text-[10px] font-mono text-espresso-500 uppercase">
                        {item.category_tier.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="h-28 w-full bg-linen-100 rounded-lg overflow-hidden border border-linen-200">
                      <img
                        src={item.photo_url || ''}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-espresso-500 block">
                        {item.sku}
                      </span>
                      <p className="font-serif text-xs font-medium text-espresso-900 line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-espresso-600 font-sans">
                        {item.brand} • Size {item.size} {item.chest_width_cm ? `(LD ${item.chest_width_cm})` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-linen-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-espresso-400 block uppercase">
                        Floor / Live
                      </span>
                      <span className="font-mono text-xs font-semibold text-espresso-900">
                        {formatIDR(item.floor_price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedHangtagItem(item)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800 transition"
                    >
                      <Printer className="w-3 h-3" />
                      Cetak
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 1: HITUNG FISIK INTAKE                         */}
      {/* ---------------------------------------------------- */}
      {selectedBatchForCount && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                  Verifikasi Meja Intake
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Hitung Fisik Kantong Masuk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBatchForCount(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveActualCount} className="space-y-4">
              <div className="p-3 bg-linen-100 rounded-xl space-y-1 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-espresso-500">Kode Manifest:</span>
                  <span className="font-bold text-espresso-900">{selectedBatchForCount.batch_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Estimasi Penitip:</span>
                  <span className="text-espresso-900">{selectedBatchForCount.estimated_count} potong</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-espresso-500">Alamat Jemput:</span>
                  <span className="text-espresso-900">{selectedBatchForCount.district}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Jumlah Riil Pakaian (Fisik Dihitung):
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={actualCountInput}
                  onChange={(e) => setActualCountInput(Number(e.target.value))}
                  className="w-full text-base font-mono font-bold bg-white border border-linen-300 rounded-lg p-2.5 text-espresso-900"
                />
                {actualCountInput !== selectedBatchForCount.estimated_count && (
                  <p className="text-[11px] text-terracotta-700 mt-1 font-sans">
                    ⚠️ Terdapat selisih {actualCountInput - selectedBatchForCount.estimated_count} pcs dari estimasi awal penitip.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-espresso-700 mb-1">
                  Catatan Kondisi Kantong / Discrepancy:
                </label>
                <textarea
                  rows={2}
                  placeholder="Kondisi kantong utuh, ada beberapa baju kerja dan gamis..."
                  value={batchNotesInput}
                  onChange={(e) => setBatchNotesInput(e.target.value)}
                  className="w-full text-xs font-sans bg-white border border-linen-300 rounded-lg p-2 text-espresso-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-linen-200">
                <button
                  type="button"
                  onClick={() => setSelectedBatchForCount(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                >
                  Simpan &amp; Lanjut ke QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL 2: 10x15 CM THERMAL HANGTAG PREVIEW & PRINT    */}
      {/* ---------------------------------------------------- */}
      {selectedHangtagItem && (
        <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-linen-200">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-500 font-semibold block">
                  Thermal Label 10x15 cm
                </span>
                <h3 className="font-serif text-lg font-medium text-espresso-900">
                  Hangtag Display Siaran Live
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHangtagItem(null)}
                className="text-espresso-400 hover:text-espresso-700 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Printable Thermal Label Area */}
            <div
              id="printable-hangtag"
              className="bg-white border-2 border-dashed border-espresso-800 p-6 rounded-xl shadow-inner font-mono text-espresso-900 space-y-4"
            >
              <div className="text-center pb-3 border-b-2 border-dashed border-espresso-800">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold block text-espresso-700">
                  PINDAHTANGAN ATELIER
                </span>
                <span className="text-[9px] text-espresso-500 block">
                  Studio Hub Sukabumi • Fesyen Sirkular
                </span>
              </div>

              {/* Huge Hanger Number for 2-meter camera readability */}
              <div className="text-center py-2 bg-espresso-900 text-linen-50 rounded-lg">
                <span className="text-[10px] uppercase tracking-widest text-linen-300 block">
                  NOMOR DISPLAY LIVE
                </span>
                <span className="font-serif text-5xl font-extrabold tracking-tight">
                  No. {String(selectedHangtagItem.hangtag_number).padStart(2, '0')}
                </span>
              </div>

              {/* Garment Details */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between border-b border-linen-200 pb-1">
                  <span className="text-espresso-500 uppercase text-[10px]">SKU Fisik:</span>
                  <span className="font-bold">{selectedHangtagItem.sku}</span>
                </div>
                <div className="flex justify-between border-b border-linen-200 pb-1">
                  <span className="text-espresso-500 uppercase text-[10px]">Brand:</span>
                  <span className="font-semibold">{selectedHangtagItem.brand || 'Lokal'}</span>
                </div>
                <div className="flex justify-between border-b border-linen-200 pb-1">
                  <span className="text-espresso-500 uppercase text-[10px]">Ukuran:</span>
                  <span className="font-bold">
                    {selectedHangtagItem.size || 'All Size'}{' '}
                    {selectedHangtagItem.chest_width_cm ? `(LD ${selectedHangtagItem.chest_width_cm} cm)` : ''}
                  </span>
                </div>
                <div className="flex justify-between border-b border-linen-200 pb-1">
                  <span className="text-espresso-500 uppercase text-[10px]">Kategori:</span>
                  <span className="uppercase">{selectedHangtagItem.category_tier.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between border-b border-linen-200 pb-1">
                  <span className="text-espresso-500 uppercase text-[10px]">Lokasi Rak:</span>
                  <span className="font-bold text-terracotta-700">{selectedHangtagItem.rack_location || 'RACK-A1'}</span>
                </div>
              </div>

              {/* Simulated Code-128 Barcode */}
              <div className="pt-2 text-center space-y-1">
                <div className="h-10 w-full flex items-center justify-center gap-0.5 px-4">
                  {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 6, 2, 5, 3, 1, 6, 2, 4, 3, 5, 2, 7, 1, 3, 5].map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-espresso-950 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] tracking-widest text-espresso-700 block">
                  *{selectedHangtagItem.sku}*
                </span>
              </div>

              {/* Operator footnote (Floor price guide) */}
              <div className="pt-2 border-t border-dashed border-espresso-300 text-[9px] text-espresso-500 text-center">
                <span>Panduan Host: Buka Live {formatIDR(selectedHangtagItem.target_live_price)}</span>
                <span className="block text-[8px] text-espresso-400">
                  (Batas Nego Floor: {formatIDR(selectedHangtagItem.floor_price)})
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-espresso-500 font-sans">
                Ukuran cetak 100mm x 150mm
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHangtagItem(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-espresso-900 text-linen-100 hover:bg-espresso-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Thermal POS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
