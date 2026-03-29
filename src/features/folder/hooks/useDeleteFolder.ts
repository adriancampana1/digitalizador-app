import { useMutation, useQueryClient } from '@tanstack/react-query';

import folderHttpService from '../http/folderHttpService';

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storageProvider,
      itemId,
    }: {
      storageProvider: string;
      itemId: string;
    }) => folderHttpService.deleteFolder(storageProvider, itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}
