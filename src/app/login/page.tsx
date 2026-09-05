'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { AdminTier, UserRole } from '@/lib/types';
import { sound } from '@/lib/sound';
import {
  Shield,
  Sparkles,
  Phone,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Tv,
  Shirt,
  Truck,
  CircleDollarSign,
  UserCheck,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

interface QuickAccount {
  id: string;
  name: string;
  role: UserRole;
  adminTier?: AdminTier;
  roleLabel: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  targetPath: string;
}

const QUICK_ACCOUNTS: QuickAccount[] = [
  {
    id: 'user-ratna-01',
    name: 'Ibu Ratna Dewi',
    role: 'consignor',
    roleLabel: 'Penitip Pakaian',
    badgeColor: 'bg-linen-200 text-espresso-800 border-linen-300',
    icon: Shirt,
    description: 'Pemilik lemari di Cikole. Pantau status kurasi, saldo escrow, dan slip transfer Jumat.',
    targetPath: '/portal',
  },
  {
    id: 'user-siti-host',
    name: 'Siti Nurhaliza',
    role: 'host',
    roleLabel: 'Host Live Talent',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Tv,
    description: 'Talent siaran live TikTok Studio Sukabumi. Akses Co-Pilot telemetri dan tombol MARK SOLD.',
    targetPath: '/host',
  },
  {
    id: 'user-admin-super',
    name: 'Akmal Irsyad',
    role: 'admin',
    adminTier: 'superadmin',
    roleLabel: 'Superadmin & Founder',
    badgeColor: 'bg-espresso-900 text-linen-50 border-espresso-700',
    icon: Shield,
    description: 'Akses komprehensif ke seluruh modul operasional, laba bersih, dan eksekusi transfer.',
    targetPath: '/admin',
  },
  {
    id: 'user-admin-studio',
    name: 'Kang Asep',
    role: 'admin',
    adminTier: 'studio_lead',
    roleLabel: 'Studio & QC Lead',
    badgeColor: 'bg-terracotta-100 text-terracotta-900 border-terracotta-300',
    icon: Sparkles,
    description: 'Stasiun penerimaan kantong kurir, screening 5-parameter cacat, cuci uap, dan cetak hangtag.',
    targetPath: '/admin/intake',
  },
  {
    id: 'user-admin-logistics',
    name: 'Budi Santoso',
    role: 'admin',
    adminTier: 'logistics',
    roleLabel: 'Logistik & Fulfillment',
    badgeColor: 'bg-sage-100 text-sage-900 border-sage-300',
    icon: Truck,
    description: 'Stasiun pemindaian barcode packing zero-error, cetak thermal AWB, dan dispatch 3PL.',
    targetPath: '/admin/fulfillment',
  },
  {
    id: 'user-admin-finance',
    name: 'Dewi Kartika',
    role: 'admin',
    adminTier: 'finance',
    roleLabel: 'Finance & Payout',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: CircleDollarSign,
    description: 'Rekonsiliasi kas escrow, batch payout Jumat 16.00 WIB, dan ekspor CSV BCA/Mandiri.',
    targetPath: '/admin/payouts',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { data, store, setActiveUser } = useStore();
  const [authMethod, setAuthMethod] = useState<'quick' | 'phone'>('quick');

  // Phone Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleQuickLogin = (account: QuickAccount) => {
    sound.playSuccessBeep();
    setActiveUser(account.id);
    if (account.adminTier) {
      store.setCurrentAdminTier(account.adminTier);
    }
    router.push(account.targetPath);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsSubmitting(true);
    setFeedback(null);

    // Simulate OTP generation and WhatsApp dispatch
    const fakeOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          message: `KODE KEAMANAN LOGIN PINDAHTANGAN SUKABUMI 🔐\n\nKode OTP Anda adalah: *${fakeOtp}*\nJangan bagikan kode ini kepada siapapun demi keamanan lemari pakaian dan data finansial Anda.`,
          eventType: 'BOOKING_CONFIRMATION',
        }),
      });

      sound.playCountdownTick();
      setOtpSent(true);
      setOtpCode(fakeOtp); // Auto-fill for friction-free simulation
      setFeedback(`Kode OTP (${fakeOtp}) telah dikirim via WhatsApp ke ${phoneNumber}!`);
    } catch {
      setFeedback('Gagal mengirim kode OTP. Periksa nomor Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;

    sound.playSuccessBeep();

    const profile = store.createOrGetProfile({
      fullName: fullName || 'Penitip Baru Sukabumi',
      phoneNumber: phoneNumber,
      role: 'consignor',
    });

    setActiveUser(profile.id);
    router.push(profile.role === 'admin' ? '/admin' : profile.role === 'host' ? '/host' : '/portal');
  };

  return (
    <div className="min-h-screen bg-linen-50 font-sans text-espresso-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Editorial Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-espresso-900 group-hover:text-terracotta-600 transition-colors">
              Pindah<span className="italic font-normal text-terracotta-600">Tangan</span>
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-espresso-500 uppercase block mt-0.5">
              Konsinyasi Fesyen • Sukabumi
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-medium text-espresso-900 pt-2">
            Akses Masuk Pengguna &amp; Operasional
          </h1>
          <p className="text-xs text-espresso-600 max-w-md mx-auto leading-relaxed">
            Masuk ke portal pemilik lemari pakaian, telemetri studio live streaming, atau pusat kendali operasional backoffice.
          </p>
        </div>

        {/* Method Switcher Tabs */}
        <div className="bg-linen-200/70 p-1.5 rounded-2xl border border-linen-300 flex items-center gap-1 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setAuthMethod('quick')}
            className={`flex-1 py-2 text-xs font-sans font-medium rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMethod === 'quick'
                ? 'bg-espresso-900 text-linen-50 shadow-xs font-semibold'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Pilih Akun Instan (Demo)</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 py-2 text-xs font-sans font-medium rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMethod === 'phone'
                ? 'bg-espresso-900 text-linen-50 shadow-xs font-semibold'
                : 'text-espresso-700 hover:text-espresso-900'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nomor WhatsApp / OTP</span>
          </button>
        </div>

        {/* Tab 1: Quick Role Selector */}
        {authMethod === 'quick' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-espresso-500 font-mono px-1">
              <span>PILIH PERAN &amp; SUDUT PANDANG</span>
              <span>6 AKUN AKTIF</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {QUICK_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    className="p-4 rounded-2xl bg-white border border-linen-300 hover:border-espresso-800 hover:shadow-md transition-all text-left group flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${acc.badgeColor}`}
                        >
                          {acc.roleLabel}
                        </span>
                        <div className="h-7 w-7 rounded-lg bg-linen-100 text-espresso-700 group-hover:bg-espresso-900 group-hover:text-linen-100 transition-colors flex items-center justify-center">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-serif text-base font-medium text-espresso-900 group-hover:text-terracotta-700 transition-colors">
                          {acc.name}
                        </h3>
                        <p className="text-[11px] text-espresso-500 leading-relaxed font-sans mt-0.5">
                          {acc.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-linen-100 flex items-center justify-between text-[11px] font-sans font-medium text-espresso-600 group-hover:text-espresso-900">
                      <span>Masuk ke {acc.targetPath}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: WhatsApp OTP Authentication Form */}
        {authMethod === 'phone' && (
          <div className="bg-white border border-linen-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 max-w-md mx-auto animate-fade-in">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                AUTENTIKASI AMAN
              </span>
              <h3 className="font-serif text-lg font-medium text-espresso-900">
                Masuk dengan Nomor WhatsApp
              </h3>
              <p className="text-xs text-espresso-600 leading-relaxed mt-0.5">
                Kami akan mengirimkan kode verifikasi 6-digit ke akun WhatsApp Anda.
              </p>
            </div>

            {feedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{feedback}</p>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Nama Lengkap (Opsional untuk akun baru)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Ibu Ratna Dewi"
                    className="w-full text-xs px-4 py-3 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Nomor WhatsApp *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0812-8899-7711"
                      className="w-full text-xs px-4 py-3 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-espresso-500 font-sans">
                    Tips demo: Anda dapat mengetik <code className="font-mono bg-linen-100 px-1 rounded">0812-8899-7711</code> untuk masuk langsung ke akun Ibu Ratna Dewi.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !phoneNumber}
                  className="w-full py-3 rounded-xl bg-espresso-900 hover:bg-espresso-800 disabled:opacity-40 text-linen-100 text-xs font-medium uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{isSubmitting ? 'Mengirim OTP...' : 'Kirim Kode Verifikasi'}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Masukkan 6-Digit Kode OTP:
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center text-lg font-mono font-bold tracking-[0.3em] px-4 py-3 rounded-xl border-2 border-espresso-800 bg-linen-50/50 text-espresso-900 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-espresso-500 hover:text-espresso-900"
                  >
                    Ganti nomor telepon
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-terracotta-700 font-semibold"
                  >
                    Kirim ulang
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-medium uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Verifikasi &amp; Masuk</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Studio Hub Footer Note */}
        <div className="text-center text-[11px] text-espresso-500 font-sans pt-4 border-t border-linen-200">
          <p>
            Sistem Autentikasi Fesyen Sirkular PindahTangan • Studio Hub Sukabumi, Jl. Siliwangi No. 102
          </p>
        </div>
      </div>
    </div>
  );
}
