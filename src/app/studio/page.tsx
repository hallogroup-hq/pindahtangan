'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { TIER_CONFIG, STATUS_LABELS } from '@/lib/constants';
import { formatIDR } from '@/lib/utils';
import { Check, AlertTriangle, Printer, ArrowRight } from 'lucide-react';

export default function StudioOperatorPage() {
  const { data, store } = useStore();

  const [activeTab, setActiveTab] = useState<'qc_station' | 'intake_batches' | 'inventory'>(
    'qc_station'
  );

  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    data.batches[0]?.id || ''
  );
  const [actualCountInput, setActualCountInput] = useState<number>(20);

  const [qcForm, setQcForm] = useState({
    title: '',
    brand: '',
    size: 'M',
    chestWidthCm: 98,
    categoryTier: 'tier_b' as 'tier_a' | 'tier_b' | 'tier_c',
    floorPrice: 35000,
    targetLivePrice: 55000,
    isPassed: true,
    defectReason: 'Noda permanen',
    defectNotes: '',
    photoUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    defectPhotoUrl: 'https://images.unsplash.com/photo-1584285418504-0052ec77846f?w=800&q=80',
  });

  const [justGeneratedItem, setJustGeneratedItem] = useState<{
    hangtag: number;
    sku: string;
    title: string;
    status: string;
  } | null>(null);

  const selectedBatch = data.batches.find((b) => b.id === selectedBatchId);
  const consignor = data.profiles.find((p) => p.id === selectedBatch?.consignor_id);

  const handleTierChange = (tier: 'tier_a' | 'tier_b' | 'tier_c') => {
    const config = TIER_CONFIG[tier];
    setQcForm((prev) => ({
      ...prev,
      categoryTier: tier,
      floorPrice: config.minFloor,
      targetLivePrice: config.defaultTargetLive,
    }));
  };

  const handleFloorPriceChange = (val: number) => {
    let multiplier = 1.4;
    if (qcForm.categoryTier === 'tier_a') multiplier = 1.5;
    if (qcForm.categoryTier === 'tier_c') multiplier = 1.3;

    const recommendedLive = Math.round((val * multiplier) / 5000) * 5000;

    setQcForm((prev) => ({
      ...prev,
      floorPrice: val,
      targetLivePrice: recommendedLive,
    }));
  };

  const handleReceiveBatch = (batchId: string) => {
    store.receiveBatch(batchId, actualCountInput);
    alert(`Batch telah diverifikasi dengan ${actualCountInput} potong pakaian fisik.`);
  };

  const handleQCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch || !consignor) {
      alert('Pilih batch intake terlebih dahulu.');
      return;
    }

    if (qcForm.isPassed) {
      const item = store.qcPassItem({
        batchId: selectedBatch.id,
        consignorId: consignor.id,
        title: qcForm.title || `${qcForm.brand} ${qcForm.categoryTier.toUpperCase()}`,
        brand: qcForm.brand || 'Lokal',
        size: qcForm.size,
        chestWidthCm: qcForm.chestWidthCm,
        categoryTier: qcForm.categoryTier,
        floorPrice: qcForm.floorPrice,
        targetLivePrice: qcForm.targetLivePrice,
        photoUrl: qcForm.photoUrl,
      });

      setJustGeneratedItem({
        hangtag: item.hangtag_number,
        sku: item.sku,
        title: item.title,
        status: 'Lolos QC & Siap Live',
      });
    } else {
      const item = store.qcRejectItem({
        batchId: selectedBatch.id,
        consignorId: consignor.id,
        title: qcForm.title || `${qcForm.brand} (Reject)`,
        brand: qcForm.brand || 'Lokal',
        defectNotes: `${qcForm.defectReason}: ${qcForm.defectNotes}`,
        defectPhotoUrl: qcForm.defectPhotoUrl,
      });

      setJustGeneratedItem({
        hangtag: item.hangtag_number,
        sku: item.sku,
        title: item.title,
        status: 'Reject QC Tercatat',
      });
    }

    setQcForm((prev) => ({
      ...prev,
      title: '',
      brand: '',
      defectNotes: '',
    }));
  };

  return (
    <div className="py-12 sm:py-16 bg-linen-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-linen-300">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-espresso-500 font-semibold block">
              Atelier &amp; Studio Kurasi
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-espresso-900 tracking-tight">
              Studio Operasional Sukabumi
            </h1>
            <p className="text-xs text-espresso-500 font-sans">
              SOP 3-Stasiun: Screening Kerusakan • Cuci Uap Panas &gt;100°C • Penomoran Hangtag Barcode.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-linen-100 p-1 rounded-full border border-linen-200">
            <button
              onClick={() => setActiveTab('qc_station')}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'qc_station'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Stasiun QC
            </button>
            <button
              onClick={() => setActiveTab('intake_batches')}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'intake_batches'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Intake Kantong ({data.batches.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-5 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition ${
                activeTab === 'inventory'
                  ? 'bg-espresso-900 text-linen-50'
                  : 'text-espresso-600 hover:text-espresso-900'
              }`}
            >
              Semua Koleksi ({data.items.length})
            </button>
          </div>
        </div>

        {/* TAB 1: QC STATION */}
        {activeTab === 'qc_station' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Input Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-linen-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                  Formulir Pemeriksaan
                </span>
                <h2 className="font-serif text-2xl font-normal text-espresso-900">
                  Inspeksi Pakaian Masuk
                </h2>
              </div>

              <form onSubmit={handleQCSubmit} className="space-y-5 text-xs">
                {/* Batch Selector */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Pilih Batch Kantong Penitip *
                  </label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                  >
                    {data.batches.map((b) => {
                      const c = data.profiles.find((p) => p.id === b.consignor_id);
                      return (
                        <option key={b.id} value={b.id}>
                          {b.batch_code} — {c?.full_name} ({b.actual_count || b.estimated_count} pcs)
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* QC Outcome Buttons */}
                <div className="space-y-2">
                  <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                    Hasil Screening Fisik
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setQcForm({ ...qcForm, isPassed: true })}
                      className={`py-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition ${
                        qcForm.isPassed
                          ? 'bg-espresso-900 text-white border-espresso-900'
                          : 'bg-white text-espresso-600 border-linen-200 hover:border-linen-300'
                      }`}
                    >
                      Lolos QC (Siap Uap)
                    </button>

                    <button
                      type="button"
                      onClick={() => setQcForm({ ...qcForm, isPassed: false })}
                      className={`py-3 rounded-xl border text-xs font-mono uppercase tracking-wider transition ${
                        !qcForm.isPassed
                          ? 'bg-rose-900 text-white border-rose-900'
                          : 'bg-white text-espresso-600 border-linen-200 hover:border-linen-300'
                      }`}
                    >
                      Tidak Lolos (Cacat)
                    </button>
                  </div>
                </div>

                {qcForm.isPassed ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Nama Pakaian *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Kemeja Linen Kerah Shanghai"
                          value={qcForm.title}
                          onChange={(e) => setQcForm({ ...qcForm, title: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Merek / Brand *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Zara, Uniqlo, Mango..."
                          value={qcForm.brand}
                          onChange={(e) => setQcForm({ ...qcForm, brand: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Ukuran
                        </label>
                        <select
                          value={qcForm.size}
                          onChange={(e) => setQcForm({ ...qcForm, size: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                          <option value="All Size">All Size</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          LD (cm)
                        </label>
                        <input
                          type="number"
                          value={qcForm.chestWidthCm}
                          onChange={(e) =>
                            setQcForm({ ...qcForm, chestWidthCm: Number(e.target.value) })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 font-mono text-xs focus:outline-none focus:border-espresso-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Tier Jadwal
                        </label>
                        <select
                          value={qcForm.categoryTier}
                          onChange={(e) =>
                            handleTierChange(e.target.value as 'tier_a' | 'tier_b' | 'tier_c')
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
                        >
                          <option value="tier_a">Tier A (Branded)</option>
                          <option value="tier_b">Tier B (Casual)</option>
                          <option value="tier_c">Tier C (Mass)</option>
                        </select>
                      </div>
                    </div>

                    {/* Price Setup */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-xl bg-linen-50 border border-linen-200">
                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Floor Price Consignor *
                        </label>
                        <span className="text-[10px] text-espresso-400 block">
                          Kisaran: {TIER_CONFIG[qcForm.categoryTier].floorPriceRange}
                        </span>
                        <input
                          type="number"
                          step={5000}
                          value={qcForm.floorPrice}
                          onChange={(e) => handleFloorPriceChange(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-linen-300 bg-white font-serif text-xl font-normal text-espresso-900"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
                          Rekomendasi Buka Live *
                        </label>
                        <span className="text-[10px] text-espresso-400 block">
                          Margin Platform: {formatIDR(qcForm.targetLivePrice - qcForm.floorPrice + 2500)}
                        </span>
                        <input
                          type="number"
                          step={5000}
                          value={qcForm.targetLivePrice}
                          onChange={(e) =>
                            setQcForm({ ...qcForm, targetLivePrice: Number(e.target.value) })
                          }
                          className="w-full px-4 py-2.5 rounded-xl border border-linen-300 bg-white font-serif text-xl font-normal text-espresso-900"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-rose-900 block">
                        Kategori Cacat *
                      </label>
                      <select
                        value={qcForm.defectReason}
                        onChange={(e) => setQcForm({ ...qcForm, defectReason: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-rose-900 text-xs"
                      >
                        <option value="Noda permanen">Noda permanen</option>
                        <option value="Sobek / Bolong">Sobek / bolong kain</option>
                        <option value="Resleting rusak">Resleting macet / patah</option>
                        <option value="Kancing lepas">Kancing utama hilang</option>
                        <option value="Bau apek">Bau apek membandel</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[10px] uppercase tracking-wider text-rose-900 block">
                        Catatan Cacat untuk Pemilik *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Deskripsikan letak noda atau bagian yang rusak..."
                        value={qcForm.defectNotes}
                        onChange={(e) => setQcForm({ ...qcForm, defectNotes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-rose-200 bg-white text-espresso-900 text-xs"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-espresso-900 hover:bg-terracotta-600 text-linen-50 py-4 rounded-full text-xs font-medium uppercase tracking-widest transition"
                >
                  {qcForm.isPassed
                    ? 'Simpan & Terbitkan Hangtag Barcode'
                    : 'Rekam Barang Reject'}
                </button>
              </form>
            </div>

            {/* Hangtag Card Preview */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-8 border border-linen-200/90 shadow-sm space-y-6">
                <div className="flex justify-between items-baseline pb-3 border-b border-linen-200">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                    Label Hangtag Fisik
                  </span>
                  <span className="text-[10px] font-mono text-espresso-500">
                    Format Thermal 10x15cm
                  </span>
                </div>

                {/* Boutique Hangtag Mockup */}
                <div className="mx-auto max-w-xs bg-linen-50 rounded-xl p-8 border border-linen-300 text-center space-y-6 shadow-sm">
                  <div className="w-3.5 h-3.5 rounded-full bg-white border border-linen-400 mx-auto"></div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-espresso-400 block">
                      PINDAHTANGAN SUKABUMI
                    </span>
                    <div className="font-serif text-5xl font-light text-espresso-900">
                      No. {data.items.length + 1}
                    </div>
                  </div>

                  <div className="py-3 border-y border-linen-200 space-y-1 text-xs text-espresso-700">
                    <strong className="block text-espresso-900 font-medium">
                      {qcForm.title || 'Judul Pakaian'}
                    </strong>
                    <div className="text-[11px] text-espresso-500">
                      {qcForm.brand || 'Merek'} • Size {qcForm.size} • LD {qcForm.chestWidthCm} cm
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="font-mono text-xs text-espresso-900 tracking-widest py-1 bg-white border border-linen-200 rounded">
                      ||| |||| || |||| |||
                    </div>
                    <span className="text-[9px] font-mono text-espresso-400 block">
                      PT-SM-001-{String(data.items.length + 1).padStart(3, '0')}
                    </span>
                  </div>

                  <div className="pt-2 text-[10px] font-mono text-espresso-600 flex justify-between border-t border-linen-200">
                    <span>Floor: {formatIDR(qcForm.floorPrice)}</span>
                    <span className="text-espresso-900 font-bold">
                      Live: {formatIDR(qcForm.targetLivePrice)}
                    </span>
                  </div>
                </div>

                {justGeneratedItem && (
                  <div className="p-4 rounded-xl bg-linen-50 border border-linen-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 font-mono text-espresso-900">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{justGeneratedItem.status}: No. {justGeneratedItem.hangtag}</span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="w-full py-2 border border-linen-300 hover:border-espresso-900 rounded-lg text-[11px] font-mono uppercase tracking-wider text-espresso-800 transition flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak Hangtag Thermal</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTAKE BATCHES */}
        {activeTab === 'intake_batches' && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-linen-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                Logistik Masuk
              </span>
              <h2 className="font-serif text-2xl font-normal text-espresso-900">
                Verifikasi Batch Kantong Kurir
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.batches.map((batch) => {
                const c = data.profiles.find((p) => p.id === batch.consignor_id);
                return (
                  <div
                    key={batch.id}
                    className="p-6 rounded-xl bg-linen-50 border border-linen-200 space-y-3 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-espresso-900 text-sm">
                          {batch.batch_code}
                        </span>
                        <h4 className="font-medium text-espresso-800 mt-0.5">
                          {c?.full_name} ({c?.phone_number})
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-linen-200 text-espresso-700">
                        {batch.status}
                      </span>
                    </div>

                    <div className="text-espresso-600 space-y-1">
                      <p>Alamat: {batch.pickup_address}</p>
                      <p>Estimasi Booking: {batch.estimated_count} Pcs</p>
                      <p>Fisik Terhitung: <strong>{batch.actual_count || 'Belum dihitung'} Pcs</strong></p>
                    </div>

                    {batch.status !== 'completed' && (
                      <div className="pt-3 border-t border-linen-200 flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Fisik"
                          defaultValue={batch.estimated_count}
                          onChange={(e) => setActualCountInput(Number(e.target.value))}
                          className="w-20 px-3 py-1.5 rounded-lg border border-linen-300 text-center font-mono text-xs"
                        />
                        <button
                          onClick={() => handleReceiveBatch(batch.id)}
                          className="px-4 py-1.5 rounded-lg bg-espresso-900 text-white text-xs font-mono uppercase tracking-wider"
                        >
                          Verifikasi Kantong
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-linen-200/90 shadow-sm space-y-6">
            <div className="space-y-1 pb-4 border-b border-linen-200">
              <span className="text-[10px] font-mono uppercase tracking-widest text-espresso-400">
                Inventaris Studio
              </span>
              <h2 className="font-serif text-2xl font-normal text-espresso-900">
                Koleksi Baju Sukabumi ({data.items.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-linen-200 text-espresso-400 font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3">Hangtag</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Pakaian &amp; Brand</th>
                    <th className="pb-3">Tier</th>
                    <th className="pb-3">Floor Price</th>
                    <th className="pb-3">Target Live</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-linen-200 font-sans">
                  {data.items.map((item) => {
                    const statusMeta = STATUS_LABELS[item.status] || {
                      label: item.status,
                      color: 'bg-linen-100 text-espresso-700',
                    };
                    return (
                      <tr key={item.id} className="hover:bg-linen-50">
                        <td className="py-3.5 font-serif font-medium text-espresso-900">
                          #{item.hangtag_number}
                        </td>
                        <td className="py-3.5 font-mono text-espresso-500">{item.sku}</td>
                        <td className="py-3.5 text-espresso-900 font-medium">
                          {item.title} ({item.brand})
                        </td>
                        <td className="py-3.5 font-mono text-[11px]">
                          {item.category_tier.replace('tier_', 'Tier ')}
                        </td>
                        <td className="py-3.5 font-mono">{formatIDR(item.floor_price)}</td>
                        <td className="py-3.5 font-mono">{formatIDR(item.target_live_price)}</td>
                        <td className="py-3.5">
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusMeta.color}`}
                          >
                            {statusMeta.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
