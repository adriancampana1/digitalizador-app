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

/**
 * Hook para exibir toasts de feedback ao usuário
 */
export { useAppToast } from './useAppToast';

/**
 * Hook para acessar tokens do Design System via código
 */
export { theme, useTheme } from './useTheme';
