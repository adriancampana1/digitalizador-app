import type { ApiError } from '@/api';

export function isApiError(response: unknown): response is ApiError {
  return (
    typeof response === 'object' && response !== null && 'message' in response
  );
}
