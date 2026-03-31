import { useQuery } from '@tanstack/react-query';

import { isApiError } from '@/utils/api';

import documentHttpService from '../http/document.http.service';

import type { DocumentResponse } from '../types';

export const documentsByFolderKeys = {
  all: (folderPath: string) => ['documents', 'folder', folderPath] as const,
};

export function useFindDocumentsByFolder(folderPath: string) {
  return useQuery<DocumentResponse[]>({
    queryKey: documentsByFolderKeys.all(folderPath),
    queryFn: async () => {
      const response = await documentHttpService.findDocumentsByFolder({
        folderPath,
      });
      if (isApiError(response)) throw new Error(response.message);
      return response.data.content;
    },
    enabled: !!folderPath,
  });
}
