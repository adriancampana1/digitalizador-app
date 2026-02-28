import type { User } from '@/features/auth/types';

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  rehydrate: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, name: string, password: string) => Promise<void>;
  logout: () => void;
};

export type AuthStore = AuthState & AuthActions;
