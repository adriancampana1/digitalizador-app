import type { User } from '@/features/auth/types';

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

export type AuthStore = AuthState & AuthActions;
