import { useMutation, useQueryClient } from '@tanstack/react-query';

import folderHttpService from '../http/folderHttpService';

export function useRenameFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      storageProvider,
      itemId,
      newName,
    }: {
      storageProvider: string;
      itemId: string;
      newName: string;
    }) => folderHttpService.renameFolder(storageProvider, itemId, newName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}
