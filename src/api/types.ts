import { env } from '@/configs/env';

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const AUTH_TOKEN_KEY = env.AUTH_TOKEN_KEY;
export const AUTH_USER_KEY = env.AUTH_USER_KEY;

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

export function createApiError(message: string, status: number): ApiError {
  return { message, status };
}
