import { useMutation, useQueryClient } from '@tanstack/react-query';

import folderHttpService from '../http/folderHttpService';

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storageProvider,
      parentPath,
      folderName,
    }: {
      storageProvider: string;
      parentPath: string;
      folderName: string;
    }) =>
      folderHttpService.createFolder(storageProvider, parentPath, folderName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}
