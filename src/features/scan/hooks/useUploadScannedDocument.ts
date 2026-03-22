import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { findAllDocumentKeys } from '@/features/document/hooks/useFindAllDocuments';
import documentHttpService from '@/features/document/http/document.http.service';
import type { StorageProvider } from '@/features/document/types';
import { useAppToast } from '@/hooks';
import { isApiError } from '@/utils/api';

import { convertPagesToPdf } from '../utils/pdfUtils';

import type { OutputFormat, ScannedPage } from '../types';

export type UploadScannedDocumentInput = {
  pages: ScannedPage[];
  documentName: string;
  storageProvider: StorageProvider;
  outputFormat: OutputFormat;
  folderPath?: string;
};

type FilePayload = { uri: string; name: string; type: string };

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
        const { files, title } = await buildUploadPayload(
          pages,
          documentName,
          outputFormat
        );

        const response = await documentHttpService.uploadDocument({
          files,
          title,
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

        const savedCount = response.data.length;
        const toastTitle =
          savedCount === 1
            ? 'Documento enviado!'
            : `${savedCount} documentos enviados!`;
        const toastMessage =
          savedCount === 1
            ? `"${title ?? files[0]?.name}" foi salvo com sucesso.`
            : `${savedCount} documentos foram salvos com sucesso.`;

        toast.success(toastTitle, toastMessage);
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

async function buildUploadPayload(
  pages: ScannedPage[],
  documentName: string,
  outputFormat: OutputFormat
): Promise<{ files: FilePayload[]; title: string | undefined }> {
  if (outputFormat === 'pdf') {
    return buildSinglePdfPayload(pages, documentName);
  }
  return buildMultipleJpegPayload(pages);
}

async function buildSinglePdfPayload(
  pages: ScannedPage[],
  documentName: string
): Promise<{ files: FilePayload[]; title: string }> {
  const fileName = `${documentName}.pdf`;
  const fileUri = await convertPagesToPdf(pages, fileName);

  return {
    files: [{ uri: fileUri, name: fileName, type: 'application/pdf' }],
    title: documentName,
  };
}

function buildMultipleJpegPayload(pages: ScannedPage[]): {
  files: FilePayload[];
  title: undefined;
} {
  const files = pages.map(page => ({
    uri: page.uri,
    name: page.fileName,
    type: 'image/jpeg',
  }));

  return { files, title: undefined };
}
