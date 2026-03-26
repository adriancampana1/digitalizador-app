import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type { AuthHttpServicePropsType, AuthResponse } from '../types';

class AuthHttpService implements AuthHttpServicePropsType {
  async login(
    phone: string,
    password: string
  ): Promise<ApiResponse<AuthResponse> | ApiError> {
    return apiClient.post('/auth/login', {
      phone,
      password,
    });
  }

  async register(
    phone: string,
    password: string,
    name: string,
    accessCode: string
  ): Promise<ApiResponse<AuthResponse> | ApiError> {
    return apiClient.post('/auth/register', {
      phone,
      password,
      name,
      accessCode,
    });
  }
}

export default new AuthHttpService();
