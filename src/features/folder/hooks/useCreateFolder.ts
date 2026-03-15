import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type StorageProvider } from '@/features/document/types';
import { isApiError } from '@/utils/api';

import { folderKeys } from './useFolders';
import folderHttpService from '../http/folderHttpService';

type CreateFolderParams = {
  provider: StorageProvider;
  folderPath: string;
  folderName: string;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      folderPath,
      folderName,
    }: CreateFolderParams) => {
      const response = await folderHttpService.createFolder({
        provider,
        folderPath,
        folderName,
      });

      if (isApiError(response)) throw new Error(response.message);

      return response.data;
    },
    onSuccess: (_, { provider, folderPath }) => {
      queryClient.invalidateQueries({
        queryKey: folderKeys.list(provider, folderPath),
      });

      queryClient.invalidateQueries({
        queryKey: folderKeys.all(provider),
      });
    },
  });
};
