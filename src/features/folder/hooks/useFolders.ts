import { useQuery } from '@tanstack/react-query';

import { type StorageProvider } from '@/features/document/types';
import { isApiError } from '@/utils/api';

import folderHttpService from '../http/folderHttpService';

export const folderKeys = {
  all: (provider: StorageProvider) => ['folders', provider] as const,
  list: (provider: StorageProvider, folderPath: string) =>
    [...folderKeys.all(provider), folderPath] as const,
};

export const useFolders = (provider: StorageProvider, folderPath: string) => {
  return useQuery({
    queryKey: folderKeys.list(provider, folderPath),
    queryFn: async () => {
      const response = await folderHttpService.listFolders({
        provider,
        folderPath,
      });
      if (isApiError(response)) throw new Error(response.message);
      return response.data.folders;
    },
    enabled: !!folderPath,
    select: data => data,
  });
};
