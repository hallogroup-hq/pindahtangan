'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/useStore';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data } = useStore();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <header className="bg-linen-50/95 backdrop-blur-md border-b border-linen-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Logo - High Editorial Typography */}
          <Link href="/" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-espresso-900 group-hover:text-terracotta-600 transition-colors">
              Pindah<span className="italic font-normal text-terracotta-600">Tangan</span>
            </span>
            <span className="text-[9px] font-mono tracking-[0.25em] text-espresso-500 uppercase">
              Konsinyasi Fesyen • Sukabumi
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs uppercase tracking-widest transition-colors relative py-1 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-terracotta-600 font-semibold'
                      : 'text-espresso-700 hover:text-espresso-900 font-medium'
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

          {/* Primary Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/booking"
              className="bg-espresso-900 hover:bg-terracotta-600 text-linen-50 px-6 py-2.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-warm"
            >
              <span>Jemput Lemari</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </Link>
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
          <div className="pt-4">
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
