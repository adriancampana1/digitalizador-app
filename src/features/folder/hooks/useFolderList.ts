import { useQuery } from '@tanstack/react-query';

import type { StorageProvider } from '@/features/document/types';
import { isApiError } from '@/utils/api';

import folderHttpService from '../http/folderHttpService';

import type { FolderOption } from '../types';

export const folderListKeys = {
  all: (provider: string, folderPath: string) =>
    ['folders', provider, folderPath] as const,
};

export function useFolderList(provider: string, folderPath?: string) {
  return useQuery<FolderOption[]>({
    queryKey: folderListKeys.all(provider, folderPath ?? ''),
    queryFn: async () => {
      const response = await folderHttpService.listFolders({
        provider: provider as StorageProvider,
        folderPath,
      });
      if (isApiError(response)) throw new Error(response.message);
      return response.data.folders;
    },
    enabled: !!provider,
  });
}
