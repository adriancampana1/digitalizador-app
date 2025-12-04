import { useAppStore } from '@/store/app';
import { useAuthStore } from '@/store/auth';

/**
 * Hook para acessar o estado e ações de autenticação
 */
export const useAuth = useAuthStore;

/**
 * Hook para acessar o estado e ações globais do app
 */
export const useApp = useAppStore;
