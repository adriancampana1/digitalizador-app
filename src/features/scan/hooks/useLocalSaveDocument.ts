import { useCallback, useState } from 'react';

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { useAppToast } from '@/hooks';

import { resolveDocumentName } from '../utils/scanUtils';

import type { ScannedPage } from '../types';

type LocalSaveInput = {
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
        const resolvedName = resolveDocumentName(documentName);
        const extension = outputFormat === 'pdf' ? 'pdf' : 'jpg';
        const mimeType =
          outputFormat === 'pdf' ? 'application/pdf' : 'image/jpeg';
        const fileName = `${resolvedName}.${extension}`;

        const canShare = await Sharing.isAvailableAsync();
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

        if (!canShare) {
          toast.success('Arquivo salvo!', `"${fileName}" foi salvo no cache.`);
          return true;
        }

        await Sharing.shareAsync(sourceFile.uri, {
          mimeType,
          dialogTitle: `Salvar ${fileName}`,
          UTI: mimeType,
        });

        toast.success('Download concluído!', `"${fileName}" está pronto.`);
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
