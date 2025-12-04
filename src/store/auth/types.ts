/**
 * INTERFACE TEMPORÁRIA DE USUÁRIO
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
};

export type AuthStore = AuthState & AuthActions;
