'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { TIER_CONFIG, STATUS_LABELS } from '@/lib/constants';
import { formatIDR } from '@/lib/utils';
import { createDirectWhatsAppLink, formatCatalogOrderMessage } from '@/lib/whatsapp';
import { sound } from '@/lib/sound';
import { ClothesItem } from '@/lib/types';
import {
  Search,
  Filter,
  Share2,
  Copy,
  Check,
  MessageCircle,
  X,
  ExternalLink,
  Shirt,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Flame,
  CheckCircle,
  Info
} from 'lucide-react';

const ADMIN_PHONE = '6281288997711';

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);
  const [activeModalItem, setActiveModalItem] = useState<ClothesItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Read ?item=[id] deep link from URL
  const deepLinkedItemId = searchParams.get('item');

  useEffect(() => {
    if (deepLinkedItemId && data.items.length > 0) {
      const found = data.items.find((i) => i.id === deepLinkedItemId);
      if (found) {
        setActiveModalItem(found);
      }
    } else if (!deepLinkedItemId) {
      setActiveModalItem(null);
    }
  }, [deepLinkedItemId, data.items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Helper to build product URL
  const getProductUrl = (itemId: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/katalog?item=${itemId}`;
    }
    return `https://pindahtangan-zeta.vercel.app/katalog?item=${itemId}`;
  };

  // Helper to build WhatsApp Message
  const getWhatsAppOrderUrl = (item: ClothesItem) => {
    const productUrl = getProductUrl(item.id);
    const text = formatCatalogOrderMessage({
      itemTitle: item.title,
      brand: item.brand,
      size: item.size,
      chestWidthCm: item.chest_width_cm,
      hangtagNumber: item.hangtag_number,
      sku: item.sku,
      price: item.target_live_price,
      productUrl,
    });

    return createDirectWhatsAppLink(ADMIN_PHONE, text);
  };

  // Handle Copy Link
  const handleCopyLink = (e: React.MouseEvent, item: ClothesItem) => {
    e.stopPropagation();
    const url = getProductUrl(item.id);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedItemId(item.id);
      showToast(`Link "${item.title}" berhasil disalin ke clipboard!`);
      sound.playCountdownTick();
      setTimeout(() => setCopiedItemId(null), 2500);
    });
  };

  // Open Item Detail & update URL
  const handleOpenDetail = (item: ClothesItem) => {
    setActiveModalItem(item);
    window.history.pushState({}, '', `/katalog?item=${item.id}`);
  };

  // Close Item Detail & clear query param
  const handleCloseDetail = () => {
    setActiveModalItem(null);
    window.history.pushState({}, '', '/katalog');
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return data.items.filter((item) => {
      // Exclude permanently rejected
      if (item.status === 'rejected') return false;

      // Available filter
      if (onlyAvailable) {
        const isAvail = ['ready_for_live', 'in_live_queue', 'in_steam'].includes(item.status);
        if (!isAvail) return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && item.category_tier !== selectedTier) {
        return false;
      }

      // Size filter
      if (selectedSize !== 'all' && item.size?.toUpperCase() !== selectedSize.toUpperCase()) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBrand = (item.brand || '').toLowerCase().includes(query);
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesHangtag = `#${item.hangtag_number}`.includes(query) || `${item.hangtag_number}` === query;
        if (!matchesTitle && !matchesBrand && !matchesSku && !matchesHangtag) {
          return false;
        }
      }

      return true;
    });
  }, [data.items, onlyAvailable, selectedTier, selectedSize, searchQuery]);

  // Unique sizes from all items
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    data.items.forEach((i) => {
      if (i.size) set.add(i.size.toUpperCase());
    });
    return Array.from(set).sort();
  }, [data.items]);

  return (
    <div className="min-h-screen bg-linen-50/50 pb-28 text-espresso-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 flex items-center gap-2 bg-espresso-900 text-linen-100 px-4 py-3 rounded-xl shadow-warm border border-white/10 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="bg-linen-100/70 border-b border-linen-200/80 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-50 text-terracotta-800 text-[11px] font-mono font-medium border border-terracotta-200 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-terracotta-600" />
                  Katalog Kurasi Langsung
                </span>
                <span className="text-[11px] font-mono text-espresso-600">
                  Kota Sukabumi
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-espresso-900 tracking-tight">
                Katalog Baju <span className="italic font-serif text-terracotta-600">Siap Kirim</span>
              </h1>
              <p className="text-espresso-700 text-sm sm:text-base leading-relaxed">
                Pakaian kurasi pilihan dari lemari warga Sukabumi. Telah disterilisasi uap panas &gt;100°C, wangi, bergaransi bebas noda sobek, dan siap dipesan langsung via WhatsApp Admin Hub.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-2xl border border-linen-200 shadow-sm shrink-0">
              <div className="text-left sm:text-right pr-2">
                <p className="text-[11px] font-mono uppercase text-espresso-500 font-semibold">Admin Pemesanan</p>
                <p className="text-sm font-semibold text-espresso-900">0812-8899-7711</p>
              </div>
              <a
                href={createDirectWhatsAppLink(
                  ADMIN_PHONE,
                  'Halo Admin PindahTangan Sukabumi, saya ingin menanyakan koleksi baju yang tersedia di katalog website.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat Admin WA</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="sticky top-20 z-30 bg-linen-50/95 backdrop-blur-md border-b border-linen-200/80 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pakaian, brand (Zara, Uniqlo), ukuran, atau No. Gantungan..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-linen-300 rounded-xl text-xs sm:text-sm text-espresso-900 placeholder:text-espresso-400 focus:outline-none focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Size Filter Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-espresso-600 font-medium hidden sm:inline">Ukuran:</span>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-white border border-linen-300 rounded-xl px-3 py-2.5 text-xs text-espresso-900 focus:outline-none focus:border-terracotta-500 font-medium cursor-pointer"
              >
                <option value="all">Semua Ukuran</option>
                {availableSizes.map((size) => (
                  <option key={size} value={size}>
                    Size {size}
                  </option>
                ))}
              </select>

              {/* Only Available Checkbox */}
              <label className="flex items-center gap-2 bg-white border border-linen-300 rounded-xl px-3 py-2.5 text-xs font-medium text-espresso-800 cursor-pointer select-none hover:border-linen-400">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded border-linen-400 text-terracotta-600 focus:ring-terracotta-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>Hanya Tersedia</span>
              </label>
            </div>
          </div>

          {/* Category Tier Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            <button
              onClick={() => setSelectedTier('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedTier === 'all'
                  ? 'bg-espresso-900 text-linen-50 shadow-sm'
                  : 'bg-white border border-linen-300 text-espresso-700 hover:bg-linen-100'
              }`}
            >
              Semua Koleksi ({data.items.length})
            </button>
            <button
              onClick={() => setSelectedTier('tier_a')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedTier === 'tier_a'
                  ? 'bg-espresso-900 text-linen-50 shadow-sm'
                  : 'bg-white border border-linen-300 text-espresso-700 hover:bg-linen-100'
              }`}
            >
              ✨ Tier A • Branded & Pesta
            </button>
            <button
              onClick={() => setSelectedTier('tier_b')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedTier === 'tier_b'
                  ? 'bg-espresso-900 text-linen-50 shadow-sm'
                  : 'bg-white border border-linen-300 text-espresso-700 hover:bg-linen-100'
              }`}
            >
              💼 Tier B • Casual & Kerja
            </button>
            <button
              onClick={() => setSelectedTier('tier_c')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                selectedTier === 'tier_c'
                  ? 'bg-espresso-900 text-linen-50 shadow-sm'
                  : 'bg-white border border-linen-300 text-espresso-700 hover:bg-linen-100'
              }`}
            >
              ⚡ Tier C • Mass Market
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-espresso-600 font-mono">
            Menampilkan <span className="font-semibold text-espresso-950">{filteredItems.length}</span> pakaian siap kirim
          </p>

          <div className="text-[11px] text-espresso-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Steril uap panas 100°C • Garansi keaslian kondisi</span>
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="bg-white rounded-3xl border border-linen-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-linen-100 flex items-center justify-center mx-auto text-espresso-400">
              <Shirt className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="font-serif text-xl font-medium text-espresso-900">
              Tidak Ada Pakaian Sesuai Filter
            </h3>
            <p className="text-xs sm:text-sm text-espresso-600 leading-relaxed">
              Coba kurangi filter pencarian atau ubah kata kunci untuk melihat pakaian lainnya.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTier('all');
                setSelectedSize('all');
                setOnlyAvailable(false);
              }}
              className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-5 py-2.5 rounded-full text-xs font-medium transition-all"
            >
              Reset Semua Filter
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isSold = item.status === 'sold' || item.status === 'packed' || item.status === 'shipped';
            const isCopied = copiedItemId === item.id;
            const tierConfig = TIER_CONFIG[item.category_tier] || TIER_CONFIG.tier_b;

            return (
              <div
                key={item.id}
                onClick={() => handleOpenDetail(item)}
                className="group bg-white rounded-2xl border border-linen-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer relative"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full bg-linen-100 overflow-hidden">
                  <img
                    src={item.photo_url || 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Hangtag & Tier Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="bg-espresso-950/80 backdrop-blur-md text-linen-100 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border border-white/10 font-medium">
                      #{item.hangtag_number}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md ${tierConfig.badgeColor}`}
                    >
                      {item.category_tier === 'tier_a'
                        ? 'Tier A'
                        : item.category_tier === 'tier_b'
                        ? 'Tier B'
                        : 'Tier C'}
                    </span>
                  </div>

                  {/* Status Overlay if Sold */}
                  {isSold && (
                    <div className="absolute inset-0 bg-espresso-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                      <span className="bg-rose-500/90 text-white font-mono uppercase text-xs tracking-wider px-3 py-1.5 rounded-full border border-white/20 font-medium shadow-lg">
                        Sudah Terjual
                      </span>
                    </div>
                  )}

                  {/* Quick Copy Link Floating Button */}
                  <button
                    onClick={(e) => handleCopyLink(e, item)}
                    title="Salin Link Produk Ini"
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-espresso-800 shadow-md backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-espresso-700" />
                    )}
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Brand & Size */}
                    <div className="flex items-center justify-between text-xs text-espresso-500 font-mono">
                      <span className="font-semibold text-espresso-800 uppercase tracking-wider">
                        {item.brand || 'Original Brand'}
                      </span>
                      <span className="bg-linen-100 text-espresso-700 px-2 py-0.5 rounded font-medium">
                        Size {item.size || '-'} {item.chest_width_cm ? `• LD ${item.chest_width_cm}` : ''}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-sm sm:text-base font-normal text-espresso-900 line-clamp-2 leading-snug group-hover:text-terracotta-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="pt-2 border-t border-linen-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[10px] font-mono uppercase text-espresso-500">Harga Siap Kirim</span>
                      <span className="font-serif text-lg font-medium text-espresso-950">
                        {formatIDR(item.target_live_price)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      {/* Copy Link Button */}
                      <button
                        onClick={(e) => handleCopyLink(e, item)}
                        className="w-full py-2 px-2.5 rounded-xl border border-linen-300 hover:border-espresso-900 bg-linen-50 hover:bg-white text-espresso-800 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-espresso-600" />
                            <span>Salin Link</span>
                          </>
                        )}
                      </button>

                      {/* WhatsApp Order Button */}
                      <a
                        href={getWhatsAppOrderUrl(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playCountdownTick()}
                        className={`w-full py-2 px-2.5 rounded-xl text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isSold
                            ? 'bg-stone-400 cursor-not-allowed pointer-events-none'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white shrink-0" />
                        <span>Pesan WA</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Product Detail Modal (Deep-Linkable via ?item=[id]) */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-espresso-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={handleCloseDetail}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-linen-200 flex flex-col md:flex-row relative max-h-[90vh] my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-espresso-700 hover:text-espresso-950 shadow-md backdrop-blur-md transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Photo View */}
            <div className="w-full md:w-1/2 bg-linen-100 relative aspect-[3/4] md:aspect-auto min-h-[280px]">
              <img
                src={activeModalItem.photo_url || 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80'}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="bg-espresso-950/80 backdrop-blur-md text-linen-100 px-3 py-1 rounded-full text-xs font-mono font-medium border border-white/10">
                  Gantungan #{activeModalItem.hangtag_number}
                </span>
                <span className="bg-white/90 backdrop-blur-md text-espresso-800 px-3 py-0.5 rounded-full text-[11px] font-mono font-medium border border-linen-200">
                  SKU: {activeModalItem.sku}
                </span>
              </div>
            </div>

            {/* Right Details Panel */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-terracotta-700 uppercase font-semibold">
                      {activeModalItem.brand || 'Original Brand'}
                    </span>
                    <span className="text-espresso-300">•</span>
                    <span className="text-xs font-mono text-espresso-500 uppercase">
                      {activeModalItem.category_tier.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-normal text-espresso-900 leading-tight">
                    {activeModalItem.title}
                  </h2>
                </div>

                {/* Price Display */}
                <div className="bg-linen-50 p-4 rounded-2xl border border-linen-200 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-espresso-500 block">
                    Harga Konsinyasi Langsung
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl sm:text-3xl font-medium text-espresso-950">
                      {formatIDR(activeModalItem.target_live_price)}
                    </span>
                    <span className="text-xs text-emerald-700 font-medium">
                      (Nett • Bebas Tawar)
                    </span>
                  </div>
                </div>

                {/* Specs List */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-linen-200">
                    <span className="text-espresso-400 font-mono text-[10px] uppercase block">Ukuran (Size)</span>
                    <span className="font-semibold text-espresso-900 text-sm">{activeModalItem.size || '-'}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-linen-200">
                    <span className="text-espresso-400 font-mono text-[10px] uppercase block">Lingkar Dada (LD)</span>
                    <span className="font-semibold text-espresso-900 text-sm">
                      {activeModalItem.chest_width_cm ? `${activeModalItem.chest_width_cm} cm` : '-'}
                    </span>
                  </div>
                </div>

                {/* Quality Badge */}
                <div className="space-y-2 pt-2 border-t border-linen-200 text-xs text-espresso-700">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Lolos kurasi 5 parameter &amp; sterilisasi uap panas &gt;100°C di Studio Sukabumi.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                    <span>Siap kirim dari Hub PindahTangan (Jl. Siliwangi No. 102, Cikole) atau jemput langsung.</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4 border-t border-linen-200">
                <a
                  href={getWhatsAppOrderUrl(activeModalItem)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playSuccessBeep()}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Pesan Sekarang ke WhatsApp Admin</span>
                </a>

                <button
                  onClick={(e) => handleCopyLink(e, activeModalItem)}
                  className="w-full py-3 px-4 rounded-xl border border-linen-300 hover:border-espresso-900 bg-linen-50 hover:bg-white text-espresso-900 font-medium text-xs flex items-center justify-center gap-2 transition-all"
                >
                  {copiedItemId === activeModalItem.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Link Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-espresso-600" />
                      <span>Salin Link Bagikan Pakaian Ini</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linen-50/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-600"></div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
