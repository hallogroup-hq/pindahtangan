'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/useStore';
import { AdminTier } from '@/lib/types';
import AdminHeader from './AdminHeader';
import IntakeQCModule from './IntakeQCModule';
import LiveOrchestrationModule from './LiveOrchestrationModule';
import FulfillmentModule from './FulfillmentModule';
import FridayPayoutModule from './FridayPayoutModule';
import AgingRetentionModule from './AgingRetentionModule';
import AnalyticsReportingModule from './AnalyticsReportingModule';
import {
  BarChart3,
  Shirt,
  Tv,
  PackageCheck,
  CircleDollarSign,
  Hourglass,
  Lock,
} from 'lucide-react';

export type AdminTab =
  | 'kpi'
  | 'intake_qc'
  | 'live_runsheet'
  | 'fulfillment'
  | 'friday_payout'
  | 'aging';

interface AdminBackofficeProps {
  initialTab?:
    | 'payouts'
    | 'orders'
    | 'aging'
    | 'economics'
    | 'intake'
    | 'live'
    | 'kpi'
    | 'intake_qc'
    | 'live_runsheet'
    | 'fulfillment'
    | 'friday_payout';
}

// Map legacy tab keys
function normalizeTab(rawTab?: string): AdminTab {
  switch (rawTab) {
    case 'economics':
    case 'kpi':
      return 'kpi';
    case 'intake':
    case 'intake_qc':
      return 'intake_qc';
    case 'live':
    case 'live_runsheet':
      return 'live_runsheet';
    case 'orders':
    case 'fulfillment':
      return 'fulfillment';
    case 'payouts':
    case 'friday_payout':
      return 'friday_payout';
    case 'aging':
      return 'aging';
    default:
      return 'friday_payout';
  }
}

// Permissions Matrix based on PRD v1.0 Section 2.1
const ALLOWED_TABS_BY_TIER: Record<AdminTier, AdminTab[]> = {
  superadmin: [
    'kpi',
    'intake_qc',
    'live_runsheet',
    'fulfillment',
    'friday_payout',
    'aging',
  ],
  studio_lead: ['intake_qc', 'live_runsheet', 'aging'],
  logistics: ['fulfillment', 'aging'],
  finance: ['friday_payout', 'kpi'],
};

const TAB_METADATA: Record<
  AdminTab,
  {
    title: string;
    shortLabel: string;
    icon: React.ElementType;
    badgeCountKey?: 'orders' | 'batches' | 'items' | 'pendingPayouts';
  }
> = {
  kpi: {
    title: 'Analitika Laba & Unit Economics',
    shortLabel: 'Executive KPI',
    icon: BarChart3,
  },
  intake_qc: {
    title: 'Intake Manifest, QC & Uap',
    shortLabel: 'Intake & QC Hub',
    icon: Shirt,
    badgeCountKey: 'batches',
  },
  live_runsheet: {
    title: 'Live Commerce & Host Co-Pilot',
    shortLabel: 'Run-Sheet Live',
    icon: Tv,
  },
  fulfillment: {
    title: 'Fulfillment & Barcode Scanning',
    shortLabel: 'Fulfillment & Resi',
    icon: PackageCheck,
    badgeCountKey: 'orders',
  },
  friday_payout: {
    title: 'Gajian Jumat 16.00 WIB & Kas Escrow',
    shortLabel: 'Payout Jumat',
    icon: CircleDollarSign,
    badgeCountKey: 'pendingPayouts',
  },
  aging: {
    title: 'Retensi 30 Hari & Obral Ceban',
    shortLabel: 'Retensi 30 Hari',
    icon: Hourglass,
  },
};

export function AdminBackofficeContent({ initialTab }: AdminBackofficeProps) {
  const { data, store } = useStore();

  const [activeTier, setActiveTier] = useState<AdminTier>(
    store.getCurrentAdminTier() || 'superadmin'
  );
  const [activeTab, setActiveTab] = useState<AdminTab>(normalizeTab(initialTab));

  // Sync tier changes
  const handleTierChange = (newTier: AdminTier) => {
    setActiveTier(newTier);
    store.setCurrentAdminTier(newTier);

    // If active tab is not allowed in new tier, switch to first allowed tab
    const allowed = ALLOWED_TABS_BY_TIER[newTier];
    if (!allowed.includes(activeTab)) {
      setActiveTab(allowed[0]);
    }
  };

  // Badge calculations
  const pendingPayoutCount = data.items.filter(
    (i) => i.status === 'sold' && !i.payout_id
  ).length;

  const getBadgeValue = (key?: 'orders' | 'batches' | 'items' | 'pendingPayouts') => {
    switch (key) {
      case 'orders':
        return data.orders.length;
      case 'batches':
        return data.batches.length;
      case 'items':
        return data.items.length;
      case 'pendingPayouts':
        return pendingPayoutCount > 0 ? pendingPayoutCount : undefined;
      default:
        return undefined;
    }
  };

  const allowedTabs = ALLOWED_TABS_BY_TIER[activeTier];

  return (
    <div className="min-h-screen bg-linen-50 font-sans text-espresso-900 pb-20">
      {/* Dynamic Header with RBAC Switcher */}
      <AdminHeader
        activeTier={activeTier}
        onTierChange={handleTierChange}
        activeTabTitle={TAB_METADATA[activeTab]?.title}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="bg-linen-100/80 p-1.5 rounded-2xl border border-linen-300 shadow-xs flex items-center gap-1.5 overflow-x-auto">
          {allowedTabs.map((tabKey) => {
            const meta = TAB_METADATA[tabKey];
            const Icon = meta.icon;
            const isSelected = activeTab === tabKey;
            const badgeVal = getBadgeValue(meta.badgeCountKey);

            return (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-espresso-900 text-linen-50 shadow-xs font-semibold'
                    : 'text-espresso-700 hover:text-espresso-900 hover:bg-linen-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-espresso-500'}`} />
                <span>{meta.shortLabel}</span>
                {badgeVal !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-linen-100 text-espresso-950'
                        : 'bg-linen-200 text-espresso-700'
                    }`}
                  >
                    {badgeVal}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Module Content */}
        <div className="transition-all duration-300">
          {activeTab === 'intake_qc' && <IntakeQCModule />}
          {activeTab === 'live_runsheet' && <LiveOrchestrationModule />}
          {activeTab === 'fulfillment' && <FulfillmentModule />}
          {activeTab === 'friday_payout' && <FridayPayoutModule />}
          {activeTab === 'aging' && <AgingRetentionModule />}
          {activeTab === 'kpi' && <AnalyticsReportingModule />}
        </div>
      </main>
    </div>
  );
}

export default AdminBackofficeContent;
