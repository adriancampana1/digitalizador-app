import type { ApiError, ApiResponse } from '@/api';

export interface User {
  id: string;
  phone: string;
  password: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthHttpServicePropsType {
  login(phone: string, password: string): Promise<ApiResponse<User> | ApiError>;
  register(
    phone: string,
    password: string,
    name: string
  ): Promise<ApiResponse<User> | ApiError>;
}
