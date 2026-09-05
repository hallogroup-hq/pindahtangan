'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { sound } from '@/lib/sound';
import {
  Menu,
  X,
  ArrowUpRight,
  User,
  LogOut,
  ChevronDown,
  Shirt,
  Tv,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, activeUser, isLoggedIn, logoutUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const liveQueueCount = data.items.filter(
    (i) => i.status === 'in_live_queue' || i.status === 'ready_for_live'
  ).length;

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/portal', label: 'Lemari Saya' },
    { href: '/studio', label: 'Studio QC' },
    {
      href: '/host',
      label: 'Live Host',
      tag: liveQueueCount > 0 ? `${liveQueueCount}` : undefined,
    },
    { href: '/admin', label: 'Backoffice' },
  ];

  const handleLogout = () => {
    sound.playCountdownTick();
    logoutUser();
    setIsUserMenuOpen(false);
    setIsOpen(false);
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (activeUser?.role === 'admin') return '/admin';
    if (activeUser?.role === 'host') return '/host';
    return '/portal';
  };

  const getRoleLabel = () => {
    if (activeUser?.role === 'admin') return 'Admin Hub';
    if (activeUser?.role === 'host') return 'Host Live';
    return 'Penitip Lemari';
  };

  return (
    <header className="bg-linen-50/95 backdrop-blur-md border-b border-linen-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl tracking-tight font-normal text-espresso-900 group-hover:text-terracotta-600 transition-colors">
              Pindah<span className="italic font-normal text-terracotta-600">Tangan</span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] text-espresso-500 uppercase -mt-1">
              Sukabumi Pilot
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-widest transition-colors py-2 relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-espresso-950 font-semibold'
                      : 'text-espresso-700 hover:text-espresso-950'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="text-[9px] font-mono bg-linen-200 text-espresso-700 px-1.5 py-0.2 rounded-full">
                      {item.tag}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-terracotta-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/booking"
              className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-5 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-warm"
            >
              <span>Jemput Lemari</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </Link>

            {/* Authenticated User Menu or Sign In Button */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-full border border-linen-300 hover:border-espresso-700 bg-linen-100/70 hover:bg-linen-200/70 transition-all text-left group"
                >
                  <div className="text-right leading-none hidden lg:block">
                    <span className="text-[11px] font-semibold text-espresso-900 block group-hover:text-terracotta-700 truncate max-w-[110px]">
                      {activeUser?.full_name?.split(' ')[0] || 'User'}
                    </span>
                    <span className="text-[8px] font-mono uppercase tracking-wider text-espresso-500">
                      {getRoleLabel()}
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-espresso-900 text-linen-100 flex items-center justify-center text-xs font-serif font-bold group-hover:bg-terracotta-600 transition-colors">
                    {activeUser?.full_name ? activeUser.full_name[0] : <User className="w-3 h-3" />}
                  </div>
                  <ChevronDown
                    className={`w-3 h-3 text-espresso-500 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-linen-300 shadow-xl p-3 space-y-2 z-50 animate-fade-in"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="p-2 border-b border-linen-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-linen-200 text-espresso-800 border border-linen-300">
                          {getRoleLabel()}
                        </span>
                        {activeUser?.district && (
                          <span className="text-[10px] text-espresso-500 truncate">
                            {activeUser.district}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-sm font-medium text-espresso-900 truncate">
                        {activeUser?.full_name}
                      </h4>
                      <p className="text-[10px] text-espresso-500 font-mono truncate">
                        {activeUser?.email || activeUser?.phone_number}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-espresso-800 hover:bg-linen-100 transition"
                      >
                        {activeUser?.role === 'admin' ? (
                          <Shield className="w-3.5 h-3.5 text-espresso-700" />
                        ) : activeUser?.role === 'host' ? (
                          <Tv className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <Shirt className="w-3.5 h-3.5 text-terracotta-600" />
                        )}
                        <span>Dashboard Saya</span>
                      </Link>

                      <Link
                        href="/booking"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-espresso-800 hover:bg-linen-100 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-espresso-600" />
                        <span>Titip Baju Baru</span>
                      </Link>

                      <Link
                        href="/login"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-espresso-800 hover:bg-linen-100 transition"
                      >
                        <Layers className="w-3.5 h-3.5 text-espresso-500" />
                        <span>Ganti / Masuk Akun Lain</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-linen-200">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-700 hover:bg-red-50 transition text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-linen-200/80 hover:bg-espresso-900 hover:text-linen-50 text-espresso-900 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 border border-linen-300"
              >
                <User className="w-3.5 h-3.5" />
                <span>Masuk / Daftar</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-espresso-800 hover:text-black transition"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-b border-linen-200 bg-linen-50 px-6 pt-2 pb-6 space-y-3">
          {/* User badge if logged in */}
          {isLoggedIn && (
            <div className="p-3 bg-white rounded-2xl border border-linen-200 mb-2 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-linen-100 text-espresso-600 font-semibold block mb-0.5">
                  {getRoleLabel()}
                </span>
                <span className="text-xs font-medium text-espresso-900 block truncate">
                  {activeUser?.full_name}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-[11px] text-red-700 hover:text-red-900 font-medium flex items-center gap-1 px-2.5 py-1 bg-red-50 rounded-lg border border-red-200"
              >
                <LogOut className="w-3 h-3" />
                <span>Keluar</span>
              </button>
            </div>
          )}

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-xs uppercase tracking-widest ${
                  isActive ? 'text-terracotta-600 font-semibold' : 'text-espresso-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span>{item.label}</span>
                  {item.tag && (
                    <span className="text-[10px] font-mono bg-linen-200 px-2 py-0.5 rounded-full">
                      {item.tag} Baju
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="pt-4 space-y-2">
            {!isLoggedIn ? (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center border border-linen-300 bg-white text-espresso-800 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider"
              >
                Masuk / Daftar Akun
              </Link>
            ) : (
              <Link
                href={getDashboardLink()}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center border border-linen-300 bg-white text-espresso-800 py-2.5 rounded-full text-xs font-medium uppercase tracking-wider"
              >
                Buka Dashboard ({getRoleLabel()})
              </Link>
            )}

            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-espresso-900 text-linen-50 py-3 rounded-full text-xs font-semibold uppercase tracking-wider"
            >
              Jemput Lemari (Gratis ≥20 pcs)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
