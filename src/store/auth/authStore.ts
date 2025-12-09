import { create } from 'zustand';

import { apiClient, clearAuthToken, setAuthToken } from '@/api';

import type { AuthStore, User } from './types';

export const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  token: null,

  login: async (phone: string, password: string) => {
    set({ isLoading: true });

    try {
      const response = await apiClient.post('/auth/login', {
        phone,
        password,
      });

      const { user, accessToken } = response.data;

      await setAuthToken(accessToken);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await clearAuthToken();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  setUser: (user: User | null) => {
    set({ user });
  },
}));
