'use client';

import { useState, useEffect } from 'react';
import { getStore, AppStoreData } from './store';
import { Profile } from './types';
import {
  initSupabaseSync,
  getCloudSyncStatus,
  subscribeSyncStatus,
  CloudSyncStatus,
} from './supabaseSync';

export function useStore() {
  const store = getStore();
  const [data, setData] = useState<AppStoreData>(() => store.getData());
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>(() => getCloudSyncStatus());

  useEffect(() => {
    // Initial store subscription
    setData(store.getData());
    const unsubscribeStore = store.subscribe(() => {
      setData({ ...store.getData() });
    });

    // Cloud Realtime Sync & status listener
    let cleanupCloud: () => void = () => {};
    initSupabaseSync(store).then((cleanup) => {
      cleanupCloud = cleanup;
    });

    const unsubscribeStatus = subscribeSyncStatus((status) => {
      setCloudStatus(status);
    });

    return () => {
      unsubscribeStore();
      unsubscribeStatus();
      if (cleanupCloud) cleanupCloud();
    };
  }, [store]);

  const currentUser: Profile | null =
    data.profiles.find((p) => p.id === data.activeUserId) || null;
  const isLoggedIn: boolean = Boolean(currentUser);
  const activeUser: Profile = currentUser || data.profiles[0];

  return {
    store,
    data,
    activeUser,
    currentUser,
    isLoggedIn,
    cloudStatus,
    setActiveUser: (userId: string) => store.setActiveUser(userId),
    logoutUser: () => store.logoutUser(),
  };
}
