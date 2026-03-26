import { apiClient } from '@/api';

import type { TenantSetupPayload, TenantSetupResponse } from '../types';

export const tenantHttpService = {
  setup: async (payload: TenantSetupPayload): Promise<TenantSetupResponse> => {
    const { data } = await apiClient.post<TenantSetupResponse>(
      '/tenant/setup',
      payload
    );
    return data;
  },
};
