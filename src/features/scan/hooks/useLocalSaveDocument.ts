import { useCallback, useState } from 'react';

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { useAppToast } from '@/hooks';

import { convertPagesToPdf } from '../utils/pdfUtils';

import type { ScannedPage } from '../types';

export type LocalSaveInput = {
  pages: ScannedPage[];
  documentName: string;
  outputFormat: 'pdf' | 'jpeg';
};

export function useLocalSaveDocument() {
  const toast = useAppToast();
  const [isLoading, setIsLoading] = useState(false);

  const save = useCallback(
    async ({
      pages,
      documentName,
      outputFormat,
    }: LocalSaveInput): Promise<boolean> => {
      if (pages.length === 0) return false;

      setIsLoading(true);

      try {
        const extension = outputFormat === 'pdf' ? 'pdf' : 'jpg';
        const mimeType =
          outputFormat === 'pdf' ? 'application/pdf' : 'image/jpeg';
        const fileName = `${documentName}.${extension}`;

        const canShare = await Sharing.isAvailableAsync();

        let fileUri: string;
        if (outputFormat === 'pdf') {
          fileUri = await convertPagesToPdf(pages, fileName);
        } else {
          const page = pages[0];
          if (!page) throw new Error('Nenhuma página disponível para salvar.');

          const sourceFile = new File(Paths.cache, fileName);
          sourceFile.create({ overwrite: true });

          const response = await fetch(page.uri);
          const arrayBuffer = await response.arrayBuffer();
          sourceFile.write(new Uint8Array(arrayBuffer));

          if (!sourceFile.exists || sourceFile.size === 0) {
            throw new Error('Arquivo temporário está vazio.');
          }

          fileUri = sourceFile.uri;
        }

        if (!canShare) {
          toast.success('Arquivo salvo!', `"${fileName}" foi salvo no cache.`);
          return true;
        }

        await Sharing.shareAsync(fileUri, {
          mimeType,
          dialogTitle: `Salvar ${fileName}`,
          UTI: mimeType,
        });

        toast.success(
          'Exportação concluída!',
          `"${fileName}" está pronto para salvar.`
        );
        return true;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro desconhecido.';
        toast.error('Falha ao salvar', message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  return { save, isLoading };
}
