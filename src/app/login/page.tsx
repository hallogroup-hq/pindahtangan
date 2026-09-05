'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { UserRole, AdminTier } from '@/lib/types';
import { sound } from '@/lib/sound';
import { SUKABUMI_DISTRICTS, BANK_OPTIONS } from '@/lib/constants';
import {
  Shield,
  Sparkles,
  Tv,
  Shirt,
  Truck,
  CircleDollarSign,
  Lock,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  Gift,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface DemoCredential {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  adminTier?: AdminTier;
  roleLabel: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    id: 'user-ratna-01',
    name: 'Ibu Ratna Dewi',
    email: 'ratna@pindahtangan.com',
    role: 'consignor',
    roleLabel: 'Penitip Lemari',
    badgeColor: 'bg-linen-200 text-espresso-800 border-linen-300',
    icon: Shirt,
    description: 'Pemilik lemari di Cikole. Pantau kurasi, saldo escrow, dan transfer Jumat.',
  },
  {
    id: 'user-siti-host',
    name: 'Siti Nurhaliza',
    email: 'siti@pindahtangan.com',
    role: 'host',
    roleLabel: 'Host Live Talent',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Tv,
    description: 'Talent TikTok Studio Sukabumi. Akses Co-Pilot telemetri dan MARK SOLD.',
  },
  {
    id: 'user-admin-super',
    name: 'Akmal Irsyad',
    email: 'akmal@pindahtangan.com',
    role: 'admin',
    adminTier: 'superadmin',
    roleLabel: 'Founder & Superadmin',
    badgeColor: 'bg-espresso-900 text-linen-50 border-espresso-700',
    icon: Shield,
    description: 'Pusat kendali seluruh modul, laba bersih platform, dan eksekusi disbursement.',
  },
  {
    id: 'user-admin-studio',
    name: 'Kang Asep',
    email: 'asep@pindahtangan.com',
    role: 'admin',
    adminTier: 'studio_lead',
    roleLabel: 'Studio & QC Lead',
    badgeColor: 'bg-terracotta-100 text-terracotta-900 border-terracotta-300',
    icon: Sparkles,
    description: 'Intake kantong kurir, screening 5-parameter, cuci uap, dan cetak hangtag.',
  },
  {
    id: 'user-admin-finance',
    name: 'Dewi Kartika',
    email: 'dewi@pindahtangan.com',
    role: 'admin',
    adminTier: 'finance',
    roleLabel: 'Finance & Payout',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    icon: CircleDollarSign,
    description: 'Rekonsiliasi kas escrow mingguan dan eksekusi batch payout Jumat.',
  },
  {
    id: 'user-admin-logistics',
    name: 'Budi Santoso',
    email: 'budi@pindahtangan.com',
    role: 'admin',
    adminTier: 'logistics',
    roleLabel: 'Logistik & Resi',
    badgeColor: 'bg-sage-100 text-sage-900 border-sage-300',
    icon: Truck,
    description: 'Stasiun barcode zero-error, cetak thermal AWB, dan dispatch 3PL.',
  },
];

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { store } = useStore();

  const urlRef = searchParams.get('ref') || '';
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDemoAccordion, setShowDemoAccordion] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('consignor');
  const [regAdminTier, setRegAdminTier] = useState<AdminTier>('studio_lead');
  const [regDistrict, setRegDistrict] = useState(SUKABUMI_DISTRICTS[0]);
  const [regAddress, setRegAddress] = useState('');
  const [regBankName, setRegBankName] = useState('bca');
  const [regBankAccountNumber, setRegBankAccountNumber] = useState('');
  const [regBankAccountHolder, setRegBankAccountHolder] = useState('');
  const [regReferralCode, setRegReferralCode] = useState(urlRef);
  const [agreedTerms, setAgreedTerms] = useState(true);

  useEffect(() => {
    if (urlRef) {
      setRegReferralCode(urlRef);
      setMode('register');
    }
  }, [urlRef]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const result = store.loginUser(loginIdentifier, loginPassword);
      if (!result.success || !result.profile) {
        sound.playErrorBuzzer();
        setErrorMessage(result.error || 'Gagal masuk. Periksa kembali kredensial Anda.');
        setIsLoading(false);
        return;
      }

      sound.playSuccessBeep();
      setSuccessMessage(`Selamat datang kembali, ${result.profile.full_name}! Mengalihkan...`);

      setTimeout(() => {
        const role = result.profile?.role;
        if (role === 'admin') {
          router.push('/admin');
        } else if (role === 'host') {
          router.push('/host');
        } else {
          router.push('/portal');
        }
      }, 600);
    } catch {
      setErrorMessage('Terjadi kendala saat proses autentikasi.');
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!regFullName.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Masukkan alamat email yang valid.');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/\D/g, '').length < 9) {
      setErrorMessage('Nomor WhatsApp minimal 9 digit.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Anda harus menyetujui Ketentuan Konsinyasi PindahTangan.');
      return;
    }

    setIsLoading(true);

    try {
      const selectedBankObj = BANK_OPTIONS.find((b) => b.id === regBankName);
      const bankLabel = selectedBankObj ? selectedBankObj.name.split(' ')[0] : 'BCA';

      const result = store.registerUser({
        fullName: regFullName,
        email: regEmail,
        phoneNumber: regPhone,
        password: regPassword,
        role: regRole,
        adminTier: regRole === 'admin' ? regAdminTier : undefined,
        district: regDistrict,
        address: regAddress || `Kecamatan ${regDistrict}, Sukabumi`,
        city: 'Kota Sukabumi',
        bankName: bankLabel,
        bankAccountNumber: regBankAccountNumber,
        bankAccountHolder: regBankAccountHolder || regFullName,
        referralCode: regReferralCode,
      });

      if (!result.success || !result.profile) {
        sound.playErrorBuzzer();
        setErrorMessage(result.error || 'Gagal mendaftarkan akun baru.');
        setIsLoading(false);
        return;
      }

      sound.playSuccessBeep();
      setSuccessMessage(
        `Akun ${result.profile.full_name} berhasil dibuat! Mengalihkan ke dashboard Anda...`
      );

      setTimeout(() => {
        if (regRole === 'admin') {
          router.push('/admin');
        } else if (regRole === 'host') {
          router.push('/host');
        } else {
          router.push('/portal');
        }
      }, 700);
    } catch {
      setErrorMessage('Terjadi kesalahan teknis saat registrasi.');
      setIsLoading(false);
    }
  };

  // Quick autofill demo credentials
  const handleSelectDemo = (demo: DemoCredential) => {
    setMode('login');
    setLoginIdentifier(demo.email);
    setLoginPassword('pindahtangan123');
    setErrorMessage(null);
    setSuccessMessage(`Kredensial ${demo.name} terisi otomatis. Klik "Masuk Sekarang"!`);
    sound.playCountdownTick();
  };

  return (
    <div className="min-h-screen bg-linen-50 font-sans text-espresso-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-espresso-900 group-hover:text-terracotta-600 transition-colors">
              Pindah<span className="italic font-normal text-terracotta-600">Tangan</span>
            </span>
            <span className="text-[10px] font-mono tracking-[0.25em] text-espresso-500 uppercase block mt-0.5">
              Konsinyasi Fesyen Terkurasi • Kota Sukabumi
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-medium text-espresso-900 pt-2">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h1>
          <p className="text-xs text-espresso-600 max-w-sm mx-auto leading-relaxed">
            {mode === 'login'
              ? 'Akses lemari pakaian konsinyasi, telemetri studio live streaming, atau kendali operasional.'
              : 'Daftarkan lemari Anda, nikmati gratis jemput kurir Sukabumi, dan gajian otomatis setiap Jumat.'}
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Daftar */}
        <div className="bg-linen-200/80 p-1.5 rounded-2xl border border-linen-300 flex items-center gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-sans font-medium rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-espresso-900 text-linen-50 shadow-xs font-semibold'
                : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Masuk Akun</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2.5 text-xs font-sans font-medium rounded-xl transition flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-espresso-900 text-linen-50 shadow-xs font-semibold'
                : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-100/50'
            }`}
          >
            <User className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Daftar Akun Baru</span>
          </button>
        </div>

        {/* Feedback Alert Banners */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-900 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-950 flex items-start gap-2.5 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans font-medium">{successMessage}</p>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white border border-linen-300 rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* ============================================================ */}
          {/* TAB 1: LOGIN (SIGN IN) FORM                                 */}
          {/* ============================================================ */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                  Email atau Nomor WhatsApp <span className="text-terracotta-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="nama@email.com atau 0812-xxxx-xxxx"
                    className="w-full text-xs px-4 py-3 pl-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 transition"
                  />
                  <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Kata Sandi <span className="text-terracotta-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert(
                        'Untuk bantuan reset kata sandi, silakan hubungi Studio Hub WhatsApp di 0811-9988-7766.'
                      );
                    }}
                    className="text-[11px] text-terracotta-600 hover:text-terracotta-700 font-sans"
                  >
                    Lupa sandi?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs px-4 py-3 pl-10 pr-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 transition font-mono"
                  />
                  <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-espresso-400 hover:text-espresso-700 focus:outline-hidden"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-espresso-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-linen-300 text-espresso-900 focus:ring-0 cursor-pointer"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginIdentifier || !loginPassword}
                className="w-full py-3.5 rounded-xl bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-linen-100 text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Memverifikasi...</span>
                  </span>
                ) : (
                  <>
                    <span>Masuk Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-espresso-600">
                <span>Belum punya akun PindahTangan? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="text-terracotta-600 hover:text-terracotta-700 font-semibold underline underline-offset-2"
                >
                  Daftar akun baru di sini
                </button>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* TAB 2: REGISTER (SIGN UP REAL USER) FORM                    */}
          {/* ============================================================ */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-linen-100/70 p-3 rounded-2xl border border-linen-200 flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-terracotta-500/10 text-terracotta-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-serif font-medium text-espresso-900 block">
                    Pendaftaran Real Pengguna PindahTangan
                  </span>
                  <span className="text-[11px] text-espresso-600 block leading-tight">
                    Buat akun personal Anda sendiri. Data terisolasi aman di database lokal &amp; cloud.
                  </span>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                  Pilih Peran Akun <span className="text-terracotta-600">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('consignor')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      regRole === 'consignor'
                        ? 'bg-espresso-900 text-linen-50 border-espresso-900 shadow-xs'
                        : 'bg-linen-50/50 text-espresso-800 border-linen-300 hover:border-espresso-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Shirt className="w-4 h-4" />
                      {regRole === 'consignor' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">Penitip Lemari</span>
                      <span className="text-[10px] opacity-75 leading-tight block">
                        Jemput baju gratis, gajian tiap Jumat
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('host')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      regRole === 'host'
                        ? 'bg-espresso-900 text-linen-50 border-espresso-900 shadow-xs'
                        : 'bg-linen-50/50 text-espresso-800 border-linen-300 hover:border-espresso-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Tv className="w-4 h-4" />
                      {regRole === 'host' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">Host Live</span>
                      <span className="text-[10px] opacity-75 leading-tight block">
                        Talent siaran TikTok Studio Sukabumi
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      regRole === 'admin'
                        ? 'bg-espresso-900 text-linen-50 border-espresso-900 shadow-xs'
                        : 'bg-linen-50/50 text-espresso-800 border-linen-300 hover:border-espresso-500'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Shield className="w-4 h-4" />
                      {regRole === 'admin' && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-semibold block">Staf Hub</span>
                      <span className="text-[10px] opacity-75 leading-tight block">
                        QC, Cuci Uap, Logistik, Finance
                      </span>
                    </div>
                  </button>
                </div>

                {/* Sub-tier if admin */}
                {regRole === 'admin' && (
                  <div className="p-3 bg-linen-100 rounded-xl border border-linen-200 mt-2 space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-espresso-700 block font-medium">
                      Divisi Operasional Studio:
                    </label>
                    <select
                      value={regAdminTier}
                      onChange={(e) => setRegAdminTier(e.target.value as AdminTier)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-linen-300 bg-white text-espresso-900 focus:outline-hidden"
                    >
                      <option value="superadmin">Superadmin &amp; Founder (Akses Penuh)</option>
                      <option value="studio_lead">Studio &amp; QC Lead (Intake, Cuci Uap, QC)</option>
                      <option value="logistics">Logistik &amp; Packing (Barcode Scan, AWB)</option>
                      <option value="finance">Finance Admin (Gajian Jumat &amp; Escrow)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Nama Lengkap <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Contoh: Siti Rahmawati"
                      className="w-full text-xs px-4 py-2.5 pl-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900"
                    />
                    <User className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    No. WhatsApp Aktif <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full text-xs px-4 py-2.5 pl-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 font-mono"
                    />
                    <Phone className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                  Alamat Email <span className="text-terracotta-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full text-xs px-4 py-2.5 pl-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900"
                  />
                  <Mail className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              {/* Password and Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Kata Sandi <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      className="w-full text-xs px-4 py-2.5 pl-10 pr-9 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 font-mono"
                    />
                    <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-espresso-400 hover:text-espresso-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                    Konfirmasi Sandi <span className="text-terracotta-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang sandi"
                      className="w-full text-xs px-4 py-2.5 pl-10 pr-9 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden focus:border-espresso-900 font-mono"
                    />
                    <Lock className="w-4 h-4 text-espresso-400 absolute left-3.5 top-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-espresso-400 hover:text-espresso-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Consignor specific location details */}
              {regRole === 'consignor' && (
                <div className="p-4 bg-linen-100/60 rounded-2xl border border-linen-200 space-y-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-600 font-semibold block">
                    Wilayah Penjemputan di Kota Sukabumi (Gratis ≥20 Pcs)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-espresso-700 block">Kecamatan:</label>
                      <select
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-linen-300 bg-white text-espresso-900 focus:outline-hidden"
                      >
                        {SUKABUMI_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-espresso-700 block">
                        Alamat Lengkap (Jl/No/Komplek):
                      </label>
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="Contoh: Jl. Surya Kencana No. 45"
                        className="w-full text-xs px-3 py-2 rounded-xl border border-linen-300 bg-white text-espresso-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Bank Details (Optional on register, editable later) */}
                  <div className="pt-2 border-t border-linen-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-espresso-600 font-semibold">
                        Rekening Payout Jumat (Opsional)
                      </span>
                      <span className="text-[10px] text-espresso-500 font-sans">
                        Bisa diatur nanti di portal
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={regBankName}
                        onChange={(e) => setRegBankName(e.target.value)}
                        className="text-xs px-3 py-2 rounded-xl border border-linen-300 bg-white text-espresso-900 focus:outline-hidden"
                      >
                        {BANK_OPTIONS.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={regBankAccountNumber}
                        onChange={(e) => setRegBankAccountNumber(e.target.value)}
                        placeholder="Nomor Rekening"
                        className="text-xs px-3 py-2 rounded-xl border border-linen-300 bg-white text-espresso-900 focus:outline-hidden font-mono"
                      />

                      <input
                        type="text"
                        value={regBankAccountHolder}
                        onChange={(e) => setRegBankAccountHolder(e.target.value)}
                        placeholder="Nama Pemilik Rekening"
                        className="text-xs px-3 py-2 rounded-xl border border-linen-300 bg-white text-espresso-900 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Referral Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-espresso-700 block font-medium">
                  Kode Referral Teman (Opsional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: RATNA-SKB"
                    className="w-full text-xs px-4 py-2.5 pl-10 rounded-xl border border-linen-300 bg-linen-50/50 text-espresso-900 focus:outline-hidden uppercase font-mono tracking-wider"
                  />
                  <Gift className="w-4 h-4 text-terracotta-500 absolute left-3.5 top-3 pointer-events-none" />
                </div>
                {regReferralCode && (
                  <p className="text-[11px] text-emerald-800 font-sans flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Kode referral akan memberi bonus Rp 10.000 kepada pemilik kode saat Anda menitip pakaian.
                  </p>
                )}
              </div>

              {/* Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-espresso-700 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-linen-300 text-espresso-900 focus:ring-0 cursor-pointer"
                  />
                  <span>
                    Saya menyetujui Ketentuan Konsinyasi PindahTangan Sukabumi, termasuk biaya cuci uap
                    deduktif Rp 2.500/pcs dan jadwal transfer mingguan setiap Jumat pukul 16.00 WIB.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    <span>Membuat Akun...</span>
                  </span>
                ) : (
                  <>
                    <span>Daftar &amp; Masuk Otomatis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-espresso-600">
                <span>Sudah punya akun sebelumnya? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="text-espresso-900 hover:text-terracotta-600 font-semibold underline underline-offset-2"
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Collapsible Demo Helper Drawer (Secondary & Discreet) */}
        <div className="border border-linen-300 bg-white/70 rounded-2xl overflow-hidden shadow-2xs">
          <button
            type="button"
            onClick={() => setShowDemoAccordion(!showDemoAccordion)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-linen-100/50 transition"
          >
            <div className="flex items-center gap-2 text-xs font-sans text-espresso-700">
              <HelpCircle className="w-4 h-4 text-espresso-500" />
              <span className="font-medium">
                Perlu akun simulasi untuk evaluasi cepat? Klik di sini
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-espresso-500 transition-transform ${
                showDemoAccordion ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showDemoAccordion && (
            <div className="p-4 pt-1 border-t border-linen-200 bg-linen-50/50 space-y-3 animate-fade-in">
              <p className="text-[11px] text-espresso-600 leading-relaxed">
                Pilih profil di bawah untuk mengisi otomatis email dan kata sandi demo (
                <code className="bg-linen-200 px-1 py-0.5 rounded font-mono text-[10px]">
                  pindahtangan123
                </code>
                ) ke formulir masuk:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_CREDENTIALS.map((demo) => {
                  const Icon = demo.icon;
                  return (
                    <button
                      key={demo.id}
                      type="button"
                      onClick={() => handleSelectDemo(demo)}
                      className="p-3 bg-white border border-linen-300 hover:border-espresso-700 rounded-xl text-left transition flex items-start justify-between group shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono border font-medium ${demo.badgeColor}`}
                          >
                            {demo.roleLabel}
                          </span>
                        </div>
                        <h4 className="font-serif text-xs font-medium text-espresso-900 group-hover:text-terracotta-600">
                          {demo.name}
                        </h4>
                        <p className="text-[10px] font-mono text-espresso-500">{demo.email}</p>
                      </div>
                      <div className="h-6 w-6 rounded-md bg-linen-100 group-hover:bg-espresso-900 group-hover:text-linen-100 flex items-center justify-center text-espresso-700 transition-colors shrink-0">
                        <Icon className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-espresso-500 font-sans pt-2">
          <p>Studio Konsinyasi PindahTangan Sukabumi • Jl. Siliwangi No. 102</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linen-50 flex items-center justify-center text-xs font-mono text-espresso-600">
          Memuat formulir autentikasi PindahTangan...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
