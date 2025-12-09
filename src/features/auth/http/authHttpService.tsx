import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type { AuthHttpServicePropsType, User } from '../types';

class AuthHttpService implements AuthHttpServicePropsType {
  async login(
    phone: string,
    password: string
  ): Promise<ApiResponse<User> | ApiError> {
    return apiClient.post('/auth/login', {
      phone,
      password,
    });
  }

  async register(
    phone: string,
    password: string,
    name: string
  ): Promise<ApiResponse<User> | ApiError> {
    return apiClient.post('/auth/register', {
      phone,
      password,
      name,
    });
  }
}

export default new AuthHttpService();
