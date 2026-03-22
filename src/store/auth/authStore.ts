import { create } from 'zustand';

import { apiClient, clearAuthToken, setAuthToken } from '@/api';
import { registerLogoutCallback } from '@/api/authCallback';
import {
  clearAuthUser,
  getAuthToken,
  getAuthUser,
  setAuthUser,
} from '@/api/interceptors';

import type { AuthStore } from './types';

export const useAuthStore = create<AuthStore>()(set => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  token: null,

  rehydrate: async () => {
    try {
      const [token, user] = await Promise.all([getAuthToken(), getAuthUser()]);
      if (token && user) {
        set({ token, user, isAuthenticated: true });
      }
    } catch {
      await Promise.all([clearAuthToken(), clearAuthUser()]);
      set({ token: null, user: null, isAuthenticated: false });
    }
  },

  login: async (phone, password) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/login', { phone, password });

      const { accessToken } = data;
      await Promise.all([setAuthToken(accessToken), setAuthUser(data)]);
      set({
        user: data,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (phone, name, password) => {
    set({ isLoading: true });
    try {
      const { data } = await apiClient.post('/auth/register', {
        phone,
        name,
        password,
      });
      await Promise.all([setAuthToken(data.accessToken), setAuthUser(data)]);
      set({ user: data, token: data.accessToken, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await Promise.all([clearAuthToken(), clearAuthUser()]);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// Registrar o callback de logout para evitar ciclos de dependência com o authStore
registerLogoutCallback(useAuthStore.getState().logout as () => Promise<void>);
