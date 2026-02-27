import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import { findAllDocumentKeys } from './useFindAllDocuments';
import { searchDocumentKeys } from './useSearchDocuments';
import documentHttpService from '../http/document.http.service';

import type { DocumentResponse } from '../types';

export function useRefreshThumbnail() {
  const queryClient = useQueryClient();

  return useCallback(
    async (documentId: string) => {
      const result = await documentHttpService.refreshThumbnail(documentId);
      if (isApiError(result)) return;

      const updatedDocument = result.data;

      const updateList = (prev: DocumentResponse[] | undefined) =>
        prev?.map(doc => (doc.id === documentId ? updatedDocument : doc));

      queryClient.setQueriesData<DocumentResponse[]>(
        { queryKey: findAllDocumentKeys.all },
        updateList
      );

      queryClient.setQueriesData<DocumentResponse[]>(
        { queryKey: searchDocumentKeys.byText(''), exact: false },
        updateList
      );
    },
    [queryClient]
  );
}
