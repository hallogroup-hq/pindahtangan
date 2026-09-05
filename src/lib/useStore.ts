'use client';

import { useState, useEffect } from 'react';
import { getStore, AppStoreData } from './store';
import { Profile } from './types';

export function useStore() {
  const store = getStore();
  const [data, setData] = useState<AppStoreData>(() => store.getData());

  useEffect(() => {
    // Initial sync
    setData(store.getData());
    const unsubscribe = store.subscribe(() => {
      setData({ ...store.getData() });
    });
    return unsubscribe;
  }, [store]);

  const activeUser: Profile =
    data.profiles.find((p) => p.id === data.activeUserId) || data.profiles[0];

  return {
    store,
    data,
    activeUser,
    setActiveUser: (userId: string) => store.setActiveUser(userId),
  };
}
