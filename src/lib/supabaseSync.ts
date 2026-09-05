// =================================================================
// PINDAHTANGAN SUPABASE CLOUD SYNC & REALTIME ADAPTER
// Dual-Mode Architecture: Cloud PostgreSQL + Offline Local Storage
// =================================================================

import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { PindahTanganStore } from './store';
import { ClothesItem, IntakeBatch, Order, Payout, Profile, LiveSession } from './types';

let isSyncInitialized = false;
let realtimeChannel: RealtimeChannel | null = null;

export interface CloudSyncStatus {
  isConnected: boolean;
  isRealtimeActive: boolean;
  lastSyncedAt: Date | null;
  mode: 'cloud' | 'local';
}

let syncStatus: CloudSyncStatus = {
  isConnected: false,
  isRealtimeActive: false,
  lastSyncedAt: null,
  mode: isSupabaseConfigured ? 'cloud' : 'local',
};

const statusListeners = new Set<(status: CloudSyncStatus) => void>();

export function getCloudSyncStatus(): CloudSyncStatus {
  return { ...syncStatus };
}

export function subscribeSyncStatus(listener: (status: CloudSyncStatus) => void): () => void {
  statusListeners.add(listener);
  listener(syncStatus);
  return () => {
    statusListeners.delete(listener);
  };
}

function updateStatus(updates: Partial<CloudSyncStatus>) {
  syncStatus = { ...syncStatus, ...updates };
  statusListeners.forEach((fn) => fn(syncStatus));
}

/**
 * Initialize bidirectional sync between local store and Supabase Cloud
 */
export async function initSupabaseSync(store: PindahTanganStore): Promise<() => void> {
  if (!isSupabaseConfigured || !supabase) {
    updateStatus({ isConnected: false, isRealtimeActive: false, mode: 'local' });
    return () => {};
  }

  if (isSyncInitialized) {
    return () => {};
  }

  isSyncInitialized = true;

  try {
    // 1. Initial Cloud Data Fetch
    const [
      { data: profiles },
      { data: batches },
      { data: items },
      { data: orders },
      { data: payouts },
      { data: sessions },
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('intake_batches').select('*'),
      supabase.from('clothes_items').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('payouts').select('*'),
      supabase.from('live_sessions').select('*'),
    ]);

    const hasCloudData = (items && items.length > 0) || (batches && batches.length > 0);

    if (hasCloudData) {
      store.setData({
        ...(profiles && profiles.length > 0 ? { profiles: profiles as Profile[] } : {}),
        ...(batches && batches.length > 0 ? { batches: batches as IntakeBatch[] } : {}),
        ...(items && items.length > 0 ? { items: items as ClothesItem[] } : {}),
        ...(orders && orders.length > 0 ? { orders: orders as Order[] } : {}),
        ...(payouts && payouts.length > 0 ? { payouts: payouts as Payout[] } : {}),
        ...(sessions && sessions.length > 0 ? { sessions: sessions as LiveSession[] } : {}),
      });
    }

    updateStatus({
      isConnected: true,
      lastSyncedAt: new Date(),
      mode: 'cloud',
    });

    // 2. Setup Supabase Realtime WebSockets
    realtimeChannel = supabase
      .channel('pindahtangan_studio_broadcast')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clothes_items' },
        (payload) => {
          const currentItems = store.getData().items;
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as ClothesItem;
            if (!currentItems.some((i) => i.id === newItem.id)) {
              store.setData({ items: [newItem, ...currentItems] });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as ClothesItem;
            store.setData({
              items: currentItems.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)),
            });
          }
          updateStatus({ lastSyncedAt: new Date() });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          const currentOrders = store.getData().orders;
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            if (!currentOrders.some((o) => o.id === newOrder.id)) {
              store.setData({ orders: [newOrder, ...currentOrders] });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Order;
            store.setData({
              orders: currentOrders.map((o) => (o.id === updated.id ? { ...o, ...updated } : o)),
            });
          }
          updateStatus({ lastSyncedAt: new Date() });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'intake_batches' },
        (payload) => {
          const currentBatches = store.getData().batches;
          if (payload.eventType === 'INSERT') {
            const newBatch = payload.new as IntakeBatch;
            if (!currentBatches.some((b) => b.id === newBatch.id)) {
              store.setData({ batches: [newBatch, ...currentBatches] });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as IntakeBatch;
            store.setData({
              batches: currentBatches.map((b) => (b.id === updated.id ? { ...b, ...updated } : b)),
            });
          }
          updateStatus({ lastSyncedAt: new Date() });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          updateStatus({ isRealtimeActive: true });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          updateStatus({ isRealtimeActive: false });
        }
      });

    return () => {
      if (realtimeChannel && supabase) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
      }
      isSyncInitialized = false;
    };
  } catch (error) {
    console.warn('[SupabaseSync] Cloud sync connection warning:', error);
    updateStatus({ isConnected: false, isRealtimeActive: false, mode: 'local' });
    return () => {};
  }
}

/**
 * Write-through cloud mutation: push new batch to Supabase
 */
export async function cloudCreateBatch(batch: IntakeBatch): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('intake_batches').insert(batch);
  } catch (err) {
    console.warn('[SupabaseSync] cloudCreateBatch fallback:', err);
  }
}

/**
 * Write-through cloud mutation: update clothes item
 */
export async function cloudUpdateItem(itemId: string, updates: Partial<ClothesItem>): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('clothes_items').update(updates).eq('id', itemId);
  } catch (err) {
    console.warn('[SupabaseSync] cloudUpdateItem fallback:', err);
  }
}

/**
 * Write-through cloud mutation: push new order
 */
export async function cloudCreateOrder(order: Order): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('orders').insert(order);
  } catch (err) {
    console.warn('[SupabaseSync] cloudCreateOrder fallback:', err);
  }
}
