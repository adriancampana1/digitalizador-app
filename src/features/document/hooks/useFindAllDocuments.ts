import { useQuery } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import documentHttpService from '../http/document.http.service';

import type { DocumentResponse } from '../types';

export const findAllDocumentKeys = {
  all: ['documents'] as const,
  detail: (id: string) => ['documents', id] as const,
};

export function useFindAllDocuments() {
  return useQuery<DocumentResponse[]>({
    queryKey: findAllDocumentKeys.all,
    queryFn: async () => {
      const response = await documentHttpService.findAllDocuments();
      if (isApiError(response)) throw new Error(response.message);
      return response.data;
    },
  });
}
