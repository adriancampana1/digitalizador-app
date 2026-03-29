import { useMutation, useQueryClient } from '@tanstack/react-query';

import documentHttpService from '../http/document.http.service';

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) =>
      documentHttpService.deleteDocument(documentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });
}
