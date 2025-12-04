import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

import type { AppStore } from './types';

const FIRST_LAUNCH_KEY = 'first_launch';

export const useAppStore = create<AppStore>()(set => ({
  isAppReady: false,
  isFirstLaunch: true,
  isOnline: true,

  setAppReady: (ready: boolean) => set({ isAppReady: ready }),
  setFirstLaunch: (firstLaunch: boolean) => set({ isFirstLaunch: firstLaunch }),
  setOnlineStatus: (online: boolean) => set({ isOnline: online }),

  initializeApp: async () => {
    try {
      const hasLaunched = await SecureStore.getItemAsync(FIRST_LAUNCH_KEY);
      if (hasLaunched === null) {
        await SecureStore.setItemAsync(FIRST_LAUNCH_KEY, 'true');
        set({ isFirstLaunch: true });
      } else {
        set({ isFirstLaunch: false });
      }
    } catch {
      set({ isFirstLaunch: false });
    }

    set({ isAppReady: true });
  },
}));
