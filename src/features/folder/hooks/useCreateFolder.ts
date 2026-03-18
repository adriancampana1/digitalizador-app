import { useMutation, useQueryClient } from '@tanstack/react-query';

import { type StorageProvider } from '@/features/document/types';
import { isApiError } from '@/utils/api';

import { folderKeys } from './useFolders';
import folderHttpService from '../http/folderHttpService';

type CreateFolderParams = {
  provider: StorageProvider;
  parentFolderPath: string;
  folderName: string;
};

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      parentFolderPath,
      folderName,
    }: CreateFolderParams) => {
      const response = await folderHttpService.createFolder({
        provider,
        parentFolderPath,
        folderName,
      });

      if (isApiError(response)) throw new Error(response.message);

      return response.data;
    },
    onSuccess: (_, { provider, parentFolderPath }) => {
      queryClient.invalidateQueries({
        queryKey: folderKeys.list(provider, parentFolderPath),
      });

      queryClient.invalidateQueries({
        queryKey: folderKeys.all(provider),
      });
    },
  });
};
