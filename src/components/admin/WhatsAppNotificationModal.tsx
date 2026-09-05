'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { WhatsAppEventType } from '@/lib/types';
import {
  formatBookingConfirmationMessage,
  formatQcRejectAlertMessage,
  formatLiveSoldCongratsMessage,
  formatFridayPayoutSlipMessage,
  formatOrderShippedMessage,
  createDirectWhatsAppLink,
  sendWhatsAppNotification,
} from '@/lib/whatsapp';
import {
  MessageSquare,
  Send,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Search,
  Sparkles,
  Clock,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  X,
} from 'lucide-react';

interface WhatsAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_TYPE_LABELS: Record<WhatsAppEventType, { label: string; badgeColor: string }> = {
  BOOKING_CONFIRMATION: {
    label: 'Booking Intake',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  QC_REJECT_ALERT: {
    label: 'QC Reject Alert',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  LIVE_SOLD_CONGRATS: {
    label: 'Baju Terjual Live',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  FRIDAY_PAYOUT_SLIP: {
    label: 'Slip Gajian Jumat',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  ORDER_SHIPPED_BUYER: {
    label: 'Resi Pengiriman Buyer',
    badgeColor: 'bg-sage-50 text-sage-800 border-sage-200',
  },
};

export default function WhatsAppNotificationModal({
  isOpen,
  onClose,
}: WhatsAppNotificationModalProps) {
  const { data, store } = useStore();
  const [activeTab, setActiveTab] = useState<'logs' | 'simulator'>('logs');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Simulator State
  const [simEventType, setSimEventType] = useState<WhatsAppEventType>('LIVE_SOLD_CONGRATS');
  const [simRecipientName, setSimRecipientName] = useState('Ibu Ratna Dewi');
  const [simRecipientPhone, setSimRecipientPhone] = useState('0812-8899-7711');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!isOpen) return null;

  const logs = data.whatsappLogs || [];

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesEvent = selectedEventType === 'ALL' || log.eventType === selectedEventType;
    const matchesQuery =
      searchQuery === '' ||
      log.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.recipientPhone.includes(searchQuery) ||
      log.messageText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEvent && matchesQuery;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  // Generate simulated message text based on selected template
  const getSimulatedMessage = (): string => {
    switch (simEventType) {
      case 'BOOKING_CONFIRMATION':
        return formatBookingConfirmationMessage({
          consignorName: simRecipientName || 'Ibu Ratna Dewi',
          batchCode: 'BATCH-20260906-01',
          count: 15,
          pickupAddress: 'Jl. Surya Kencana No. 45, Cikole, Kota Sukabumi',
          pickupDate: 'Besok, 07 Sep 2026',
          pickupSlot: 'pagi',
        });
      case 'QC_REJECT_ALERT':
        return formatQcRejectAlertMessage({
          consignorName: simRecipientName || 'Ibu Ratna Dewi',
          itemTitle: 'Zara Basic Knit Top',
          defectNotes: 'Terdapat noda luntur di kerah belakang dan jahitan ketiak terlepas',
          portalUrl: 'https://pindahtangan-zeta.vercel.app/portal',
          defectPhotoUrl: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400',
        });
      case 'LIVE_SOLD_CONGRATS':
        return formatLiveSoldCongratsMessage({
          consignorName: simRecipientName || 'Ibu Ratna Dewi',
          itemTitle: 'Zara Floral Blouse Katun',
          hangtagNumber: 1,
          soldPrice: 95000,
          floorPrice: 65000,
          netPayout: 62500,
        });
      case 'FRIDAY_PAYOUT_SLIP':
        return formatFridayPayoutSlipMessage({
          consignorName: simRecipientName || 'Ibu Ratna Dewi',
          payoutCode: 'PAY-20260905-001',
          periodStart: '29 Agu 2026',
          periodEnd: '05 Sep 2026',
          itemsCount: 4,
          grossFloor: 230000,
          steamDeduction: 10000,
          netPayout: 220000,
          bankName: 'BCA',
          accountNumber: '0281928471',
        });
      case 'ORDER_SHIPPED_BUYER':
        return formatOrderShippedMessage({
          buyerName: simRecipientName || 'Kak Siti OOTD',
          buyerHandle: '@siti_ootd',
          orderNumber: 'ORD-20260906-0042',
          courierName: 'J&T Express Sukabumi',
          trackingNumber: 'JT9182740192',
          itemsCount: 2,
        });
      default:
        return '';
    }
  };

  const simulatedMessage = getSimulatedMessage();
  const directLink = createDirectWhatsAppLink(simRecipientPhone, simulatedMessage);

  const handleSendSimulator = async () => {
    setIsSending(true);
    setSendFeedback(null);

    try {
      // 1. Dispatch via API Route
      const res = await sendWhatsAppNotification({
        eventType: simEventType,
        recipientPhone: simRecipientPhone,
        recipientName: simRecipientName,
        messageText: simulatedMessage,
      });

      // 2. Also register into active Store Log
      store.pushWhatsAppLog({
        eventType: simEventType,
        recipientPhone: simRecipientPhone,
        recipientName: simRecipientName,
        messageText: simulatedMessage,
      });

      setSendFeedback({
        success: true,
        message: `Notifikasi berhasil diproses melalui ${res.messageLog.provider.toUpperCase()} (${res.messageLog.status}). Log telah dicatat.`,
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Gagal mengirim pesan';
      setSendFeedback({
        success: false,
        message: errMsg,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-espresso-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-linen-50 border border-linen-300 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-linen-100 border-b border-linen-300/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                  MULTI-EVENT DISPATCH ENGINE
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-700" />
                  API Gateway & Sandbox Ready
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-medium text-espresso-900">
                Pusat Notifikasi WhatsApp Otomatis
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-espresso-400 hover:text-espresso-800 hover:bg-linen-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 pt-3 bg-linen-100/50 border-b border-linen-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-2 text-xs font-sans font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'logs'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-espresso-600 hover:text-espresso-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Pengiriman ({logs.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-2 text-xs font-sans font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'border-emerald-700 text-emerald-900 font-semibold'
                  : 'border-transparent text-espresso-600 hover:text-espresso-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulator & Dispatch Manual</span>
            </button>
          </div>

          <div className="text-[11px] text-espresso-500 font-mono hidden sm:block">
            Jl. Siliwangi No. 102 • Sukabumi Hub
          </div>
        </div>

        {/* Tab 1: Dispatch Logs */}
        {activeTab === 'logs' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-linen-300/80 shadow-xs">
              <div className="flex items-center gap-2 flex-1">
                <Search className="w-4 h-4 text-espresso-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Cari penerima, no. telp, atau kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-transparent focus:outline-hidden text-espresso-900 placeholder:text-espresso-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-espresso-500 shrink-0" />
                <select
                  value={selectedEventType}
                  onChange={(e) => setSelectedEventType(e.target.value)}
                  className="text-xs bg-linen-100 border border-linen-300 rounded-lg px-2.5 py-1.5 text-espresso-800 focus:outline-hidden"
                >
                  <option value="ALL">Semua Jenis Notifikasi</option>
                  <option value="BOOKING_CONFIRMATION">Booking Intake</option>
                  <option value="QC_REJECT_ALERT">QC Reject Alert</option>
                  <option value="LIVE_SOLD_CONGRATS">Baju Terjual Live</option>
                  <option value="FRIDAY_PAYOUT_SLIP">Slip Gajian Jumat</option>
                  <option value="ORDER_SHIPPED_BUYER">Resi Pengiriman Buyer</option>
                </select>
              </div>
            </div>

            {/* Logs List */}
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-linen-300">
                <AlertCircle className="w-8 h-8 text-espresso-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-espresso-700">Belum ada riwayat notifikasi</p>
                <p className="text-[11px] text-espresso-500 mt-1">
                  Uji coba pengiriman melalui tab &quot;Simulator &amp; Dispatch Manual&quot;
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => {
                  const eventMeta = EVENT_TYPE_LABELS[log.eventType] || {
                    label: log.eventType,
                    badgeColor: 'bg-linen-200 text-espresso-800 border-linen-300',
                  };
                  const isExpanded = expandedLogId === log.id;
                  const isCopied = copiedLogId === log.id;

                  return (
                    <div
                      key={log.id}
                      className="bg-white rounded-xl border border-linen-300/90 p-4 transition-all hover:border-linen-400 shadow-xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${eventMeta.badgeColor}`}
                          >
                            {eventMeta.label}
                          </span>
                          <span className="text-xs font-serif font-medium text-espresso-900">
                            {log.recipientName}
                          </span>
                          <span className="text-[11px] font-mono text-espresso-500">
                            ({log.recipientPhone})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-mono text-espresso-500">
                          <span className="px-1.5 py-0.5 rounded bg-linen-100 border border-linen-200 text-emerald-800 font-semibold uppercase">
                            {log.provider || 'sandbox'}
                          </span>
                          <span>{new Date(log.sentAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                        </div>
                      </div>

                      {/* Message Content Preview */}
                      <div
                        className={`font-mono text-xs text-espresso-800 bg-linen-50/70 p-3 rounded-lg border border-linen-200 whitespace-pre-wrap leading-relaxed ${
                          !isExpanded ? 'line-clamp-2' : ''
                        }`}
                      >
                        {log.messageText}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          type="button"
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className="text-[11px] font-medium text-terracotta-700 hover:text-terracotta-800"
                        >
                          {isExpanded ? 'Tutup Rincian' : 'Lihat Pesan Lengkap'}
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(log.messageText, log.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-sans bg-linen-100 hover:bg-linen-200 text-espresso-700 border border-linen-300 transition-colors"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin Teks</span>
                              </>
                            )}
                          </button>

                          <a
                            href={log.waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-sans bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka di WA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Interactive Simulator */}
        {activeTab === 'simulator' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {sendFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                  sendFeedback.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold">
                    {sendFeedback.success ? 'Berhasil Dispatched!' : 'Gagal Mengirim'}
                  </p>
                  <p className="text-[11px] leading-relaxed">{sendFeedback.message}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Form Controls */}
              <div className="space-y-4 bg-white p-4 rounded-xl border border-linen-300 shadow-xs">
                <h3 className="font-serif text-sm font-semibold text-espresso-900 pb-2 border-b border-linen-200">
                  Parameter Pengujian Template
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 font-semibold block">
                    Pilih Event Bisnis:
                  </label>
                  <select
                    value={simEventType}
                    onChange={(e) => setSimEventType(e.target.value as WhatsAppEventType)}
                    className="w-full text-xs bg-linen-50 border border-linen-300 rounded-lg px-3 py-2 text-espresso-800 focus:outline-hidden"
                  >
                    <option value="BOOKING_CONFIRMATION">1. Konfirmasi Booking Intake (Consignor)</option>
                    <option value="QC_REJECT_ALERT">2. QC Reject Alert + Foto Defek (Consignor)</option>
                    <option value="LIVE_SOLD_CONGRATS">3. Ucapan Selamat Baju Terjual Live (Consignor)</option>
                    <option value="FRIDAY_PAYOUT_SLIP">4. Slip Resmi Transfer Gajian Jumat (Consignor)</option>
                    <option value="ORDER_SHIPPED_BUYER">5. Resi Pengiriman Live Shopping (Buyer)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 font-semibold block">
                    Nama Penerima:
                  </label>
                  <input
                    type="text"
                    value={simRecipientName}
                    onChange={(e) => setSimRecipientName(e.target.value)}
                    className="w-full text-xs bg-linen-50 border border-linen-300 rounded-lg px-3 py-2 text-espresso-800 focus:outline-hidden"
                    placeholder="Contoh: Ibu Ratna Dewi"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 font-semibold block">
                    No. WhatsApp Tujuan:
                  </label>
                  <input
                    type="text"
                    value={simRecipientPhone}
                    onChange={(e) => setSimRecipientPhone(e.target.value)}
                    className="w-full text-xs bg-linen-50 border border-linen-300 rounded-lg px-3 py-2 text-espresso-800 focus:outline-hidden"
                    placeholder="Contoh: 0812-8899-7711 atau 6281288997711"
                  />
                </div>

                <div className="p-3 bg-linen-100/70 rounded-lg border border-linen-200 space-y-1 text-[11px] text-espresso-600 font-sans">
                  <p className="font-semibold text-espresso-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Indonesian MSISDN Auto-Sanitizer
                  </p>
                  <p className="leading-relaxed">
                    Sistem otomatis mengonversi awalan <code className="font-mono bg-white px-1 py-0.2 rounded">08...</code> menjadi kode internasional <code className="font-mono bg-white px-1 py-0.2 rounded">628...</code> sebelum dikirim ke gateway.
                  </p>
                </div>
              </div>

              {/* Message Bubble Preview */}
              <div className="space-y-4 bg-linen-100/60 p-4 rounded-xl border border-linen-300 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-linen-300/80">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-espresso-600 font-semibold">
                      Pratinjau Bubble WhatsApp
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                      Format Markdown Asli
                    </span>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 font-mono text-xs whitespace-pre-wrap text-emerald-950 leading-relaxed shadow-sm max-h-80 overflow-y-auto">
                    {simulatedMessage}
                  </div>
                </div>

                {/* Dispatch Controls */}
                <div className="space-y-2 pt-3">
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={handleSendSimulator}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-xs transition-colors"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Mengirim ke Gateway API...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim via Gateway API / Sandbox</span>
                      </>
                    )}
                  </button>

                  <a
                    href={directLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-white hover:bg-linen-100 text-espresso-800 border border-linen-300 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Uji Coba Langsung di wa.me (Tanpa Token API)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-linen-100 border-t border-linen-300/80 flex items-center justify-between text-xs text-espresso-600 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-sans">
              Mode Sandbox aktif jika token Fonnte / Wablas belum terpasang di <code className="font-mono bg-white px-1 rounded">.env</code>
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-espresso-700 hover:bg-linen-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
