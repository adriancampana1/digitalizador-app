import { useAuthStore } from '@/store/auth/authStore';

export const useViewOnlyMode = () => {
  const user = useAuthStore(state => state.user);
  return { isViewOnly: user?.role === 'MASTER' && !user?.tenantId };
};
