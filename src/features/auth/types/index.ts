import type { ApiError, ApiResponse } from '@/api';

export interface AuthResponse {
  accessToken: string;
  name: string;
  phone: string;
  tenantId: string | null;
  role: 'MASTER' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  status: string;
  tenantId: string | null;
  role: 'MASTER' | 'USER';
  createdAt: string;
  updatedAt: string;
}

export interface AuthHttpServicePropsType {
  login(
    phone: string,
    password: string
  ): Promise<ApiResponse<AuthResponse> | ApiError>;
  register(
    phone: string,
    password: string,
    name: string,
    accessCode: string
  ): Promise<ApiResponse<AuthResponse> | ApiError>;
}
