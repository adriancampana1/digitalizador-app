import axios from 'axios';

import { env } from '@configs/env';

import { setupInterceptors } from './interceptors';

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

setupInterceptors(apiClient);
