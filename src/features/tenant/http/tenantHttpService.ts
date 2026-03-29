import { apiClient } from '@/api';

import type {
  TenantResponse,
  TenantSetupPayload,
  TenantSetupResponse,
} from '../types';

export const tenantHttpService = {
  setup: async (payload: TenantSetupPayload): Promise<TenantSetupResponse> => {
    const { data } = await apiClient.post<TenantSetupResponse>(
      '/tenant/setup',
      payload
    );
    return data;
  },

  getMyTenant: async (): Promise<TenantResponse> => {
    const { data } = await apiClient.get<TenantResponse>('/tenant/me');
    return data;
  },
};
