'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/useStore';
import { RefreshCw, ChevronDown, Check, User } from 'lucide-react';

export default function RoleSwitcher() {
  const { data, activeUser, setActiveUser, store } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'user-ratna-01',
      name: 'Ibu Ratna Dewi',
      role: 'Consignor',
      desc: 'Pemilik lemari pakaian penuh di Cikole, Sukabumi',
      path: '/portal',
    },
    {
      id: 'user-admin-studio',
      name: 'Studio Operator',
      role: 'Studio & QC',
      desc: 'Petugas QC, cuci uap panas & penomoran hangtag',
      path: '/studio',
    },
    {
      id: 'user-siti-host',
      name: 'Siti Nurhaliza',
      role: 'Host Live',
      desc: 'Talent siaran live streaming TikTok/IG di ring-light',
      path: '/host',
    },
    {
      id: 'user-superadmin',
      name: 'Admin Backoffice',
      role: 'Finance & Ops',
      desc: 'Eksekusi payout Jumat 16.00 WIB & resi paket',
      path: '/admin',
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Popover Dropdown */}
      {isOpen && (
        <div className="mb-2 w-80 bg-espresso-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-3 shadow-2xl text-linen-100 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 px-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-linen-300">
              Pilih Sudut Pandang Pengguna
            </span>
            <button
              onClick={() => {
                if (confirm('Reset seluruh data simulasi ke kondisi awal?')) {
                  store.resetToDefault();
                  window.location.reload();
                }
              }}
              title="Reset Data Simulasi"
              className="text-linen-400 hover:text-white transition p-1"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1">
            {roles.map((r) => {
              const isSelected =
                activeUser?.id === r.id ||
                (r.id === 'user-superadmin' && activeUser?.role === 'admin');
              return (
                <button
                  key={r.id}
                  onClick={() => {
                    if (r.id === 'user-superadmin') {
                      setActiveUser('user-admin-studio');
                    } else {
                      setActiveUser(r.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-terracotta-500/20 text-white border border-terracotta-500/40'
                      : 'text-linen-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{r.name}</span>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-linen-300">
                        {r.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-linen-400 mt-0.5">{r.desc}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-terracotta-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-espresso-950/90 hover:bg-espresso-900 backdrop-blur-md text-white border border-white/10 px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2.5 transition active:scale-95 group"
      >
        <span className="w-2 h-2 rounded-full bg-terracotta-400"></span>
        <div className="text-left text-xs">
          <span className="text-[10px] text-linen-400 block -mb-0.5 leading-none">
            Mode Persona
          </span>
          <span className="font-semibold text-linen-100">
            {activeUser?.full_name?.split(' ')[0] || 'User'}{' '}
            <span className="font-normal text-linen-400 text-[11px]">
              ({activeUser?.role})
            </span>
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-linen-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
    </div>
  );
}
