import { useQuery } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import documentService from '../http/document.service';

import type { DocumentSearchResponse } from '../types';

export const searchDocumentKeys = {
  byText: (searchText: string) => ['documents', 'search', searchText] as const,
};

export function useSearchDocuments(searchText: string) {
  return useQuery<DocumentSearchResponse[]>({
    queryKey: searchDocumentKeys.byText(searchText),
    queryFn: async () => {
      const response = await documentService.searchDocuments({ searchText });
      if (isApiError(response)) throw new Error(response.message);
      return response.data;
    },
    enabled: searchText.trim().length > 0,
    staleTime: 1000 * 30,
  });
}
