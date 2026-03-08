import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { findAllDocumentKeys } from '@/features/document/hooks/useFindAllDocuments';
import documentService from '@/features/document/http/document.service';
import type { StorageProvider } from '@/features/document/types';
import { useAppToast } from '@/hooks';
import { isApiError } from '@/utils/api';

import { resolveDocumentName } from '../utils/scanUtils';

import type { ScannedPage } from '../types';

type UploadScannedDocumentInput = {
  pages: ScannedPage[];
  documentName: string;
  storageProvider: StorageProvider;
  outputFormat: 'pdf' | 'jpeg';
  folderPath?: string;
};

export function useUploadScannedDocument() {
  const toast = useAppToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const upload = useCallback(
    async ({
      pages,
      documentName,
      storageProvider,
      outputFormat,
      folderPath,
    }: UploadScannedDocumentInput): Promise<boolean> => {
      if (pages.length === 0) return false;

      setIsLoading(true);

      try {
        const resolvedName = resolveDocumentName(documentName);

        const page = pages[0];
        if (!page) throw new Error('Nenhuma página disponível para envio.');

        const mimeType =
          outputFormat === 'pdf' ? 'application/pdf' : 'image/jpeg';
        const extension = outputFormat === 'pdf' ? 'pdf' : 'jpg';

        const response = await documentService.uploadDocument({
          file: {
            uri: page.uri,
            name: `${resolvedName}.${extension}`,
            type: mimeType,
          },
          title: resolvedName,
          storageProvider,
          documentType: 'scanned',
          folderPath,
        });

        if (isApiError(response)) {
          throw new Error(response.message);
        }

        await queryClient.invalidateQueries({
          queryKey: findAllDocumentKeys.all,
        });

        toast.success(
          'Documento enviado!',
          `"${resolvedName}" foi salvo com sucesso.`
        );
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro desconhecido.';
        toast.error('Falha no envio', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [queryClient, toast]
  );

  return { upload, isLoading };
}
