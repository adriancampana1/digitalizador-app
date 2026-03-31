import { useQuery } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import documentHttpService from '../http/document.http.service';

import type { DocumentResponse, PaginationParams } from '../types';

export const findAllDocumentKeys = {
  all: ['documents'] as const,
  detail: (id: string) => ['documents', id] as const,
  paginated: (params: PaginationParams) =>
    ['documents', 'page', params] as const,
};

export function useFindAllDocuments(params?: PaginationParams) {
  return useQuery<DocumentResponse[]>({
    queryKey: findAllDocumentKeys.paginated(params ?? { page: 0, size: 10 }),
    queryFn: async () => {
      const response = await documentHttpService.findAllDocuments(params);
      if (isApiError(response)) throw new Error(response.message);
      return response.data.content;
    },
  });
}
