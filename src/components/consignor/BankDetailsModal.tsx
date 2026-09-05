'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { BANK_OPTIONS } from '@/lib/constants';
import { X } from 'lucide-react';

interface BankDetailsModalProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { bankName: string; accountNumber: string; accountHolder: string }) => void;
}

export default function BankDetailsModal({
  user,
  isOpen,
  onClose,
  onSave,
}: BankDetailsModalProps) {
  const [bankName, setBankName] = useState(user.bank_name || 'BCA');
  const [accountNumber, setAccountNumber] = useState(user.bank_account_number || '');
  const [accountHolder, setAccountHolder] = useState(
    user.bank_account_holder || user.full_name || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ bankName, accountNumber, accountHolder });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-950/70 backdrop-blur-sm animate-in fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-linen-300">
        <div className="p-6 border-b border-linen-200 flex justify-between items-center bg-linen-50">
          <div>
            <span className="text-[9px] font-mono tracking-widest uppercase text-espresso-400 block">
              Penyaluran Gajian Jumat
            </span>
            <h3 className="font-serif text-xl font-normal text-espresso-900 mt-0.5">
              Rekening Bank Consignor
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-espresso-400 hover:text-espresso-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
              Bank / Dompet Digital *
            </label>
            <select
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
            >
              {BANK_OPTIONS.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
              Nomor Rekening / Nomor E-Wallet *
            </label>
            <input
              type="text"
              required
              placeholder="0281928471"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 font-mono text-xs focus:outline-none focus:border-espresso-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-espresso-600 block">
              Nama Pemilik Rekening *
            </label>
            <input
              type="text"
              required
              placeholder="Ratna Dewi"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-linen-200 bg-linen-50/40 text-espresso-900 text-xs focus:outline-none focus:border-espresso-900"
            />
          </div>

          <p className="text-[11px] text-espresso-500 pt-1">
            *Hasil penjualan ditransfer ke rekening ini setiap hari Jumat pukul 16.00 WIB.
          </p>

          <div className="pt-4 flex justify-end gap-2 border-t border-linen-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-espresso-600 hover:text-espresso-900 text-xs font-mono uppercase"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-linen-50 bg-espresso-900 hover:bg-terracotta-600 text-xs font-mono uppercase tracking-wider transition"
            >
              Simpan Rekening
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
