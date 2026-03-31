import { useInfiniteQuery } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import documentHttpService from '../http/document.http.service';

import type { DocumentResponse } from '../types';

const PAGE_SIZE = 10;

export const infiniteDocumentKeys = {
  all: ['documents', 'infinite'] as const,
};

export function useInfiniteDocuments() {
  return useInfiniteQuery<
    { content: DocumentResponse[]; last: boolean; page: number },
    Error,
    { pages: { content: DocumentResponse[]; last: boolean; page: number }[] },
    typeof infiniteDocumentKeys.all,
    number
  >({
    queryKey: infiniteDocumentKeys.all,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await documentHttpService.findAllDocuments({
        page: pageParam,
        size: PAGE_SIZE,
      });
      if (isApiError(response)) throw new Error(response.message);
      return {
        content: response.data.content,
        last: response.data.last,
        page: response.data.page,
      };
    },
    getNextPageParam: lastPage =>
      lastPage.last ? undefined : lastPage.page + 1,
  });
}
