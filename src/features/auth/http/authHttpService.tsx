import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type { User } from '../types';

interface AuthHttpServicePropsType {
  login(phone: string, password: string): Promise<ApiResponse<User> | ApiError>;
  register(
    phone: string,
    password: string,
    name: string
  ): Promise<ApiResponse<User> | ApiError>;
}

const authHttpService: AuthHttpServicePropsType = {
  async login(
    phone: string,
    password: string
  ): Promise<ApiResponse<User> | ApiError> {
    return apiClient.post('/auth/login', {
      phone,
      password,
    });
  },

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
  },
};

export default authHttpService;
