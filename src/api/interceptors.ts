import * as SecureStore from 'expo-secure-store';

import type { AuthResponse, User } from '@/features/auth/types';

import { triggerLogout } from './authCallback';
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  createApiError,
  type ApiError,
} from './types';

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

export async function getAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearAuthToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  } catch {
    //
  }
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
}
async function handleRequestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = await getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export async function getAuthUser(): Promise<User | null> {
  try {
    const raw = await SecureStore.getItemAsync(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setAuthUser(user: AuthResponse): Promise<void> {
  const serialized = JSON.stringify(user);
  await SecureStore.setItemAsync(AUTH_USER_KEY, serialized);
}
export async function clearAuthUser(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(AUTH_USER_KEY);
  } catch {
    //
  }
}

function handleRequestError(error: AxiosError): Promise<never> {
  return Promise.reject(error);
}

function extractErrorMessage(data: unknown): string {
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.error === 'string') return obj.error;
  }
  return 'Ocorreu um erro inesperado';
}

async function handleResponseError(error: AxiosError): Promise<never> {
  const status = error.response?.status ?? 0;
  const data = error.response?.data;

  // para debug
  console.error('🔴 Request Error:', {
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    baseURL: error.config?.baseURL,
    fullURL: `${error.config?.baseURL}${error.config?.url}`,
    status,
    message: error.message,
  });

  if (status === 401) {
    // callback para não dar dependency cycle com o authStore
    await triggerLogout();
  }

  const apiError: ApiError = createApiError(extractErrorMessage(data), status);

  return Promise.reject(apiError);
}

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    handleRequestInterceptor,
    handleRequestError
  );

  instance.interceptors.response.use(response => response, handleResponseError);
}
