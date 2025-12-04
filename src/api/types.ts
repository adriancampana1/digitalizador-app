export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export const AUTH_TOKEN_KEY = 'auth_token';

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
}

export function createApiError(
  message: string,
  status: number,
  code?: string
): ApiError {
  return { message, status, code };
}
