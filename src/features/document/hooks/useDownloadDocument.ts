import { useCallback, useState } from 'react';

import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { getAuthToken } from '@/api/interceptors';
import { env } from '@/configs/env';
import { useAppToast } from '@/hooks';

export function useDownloadDocument() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const toast = useAppToast();

  const download = useCallback(
    async (documentId: string, fallbackFilename: string) => {
      setDownloadingId(documentId);
      try {
        const token = await getAuthToken();
        const downloadUrl = `${env.apiUrl}/document/${documentId}/download`;

        /**
         * A requisição é feita manualmente para ter acesso aos headers e ao conteúdo do arquivo,
         * pelo apiClient não seria possível lidar com a resposta como blob ou arraybuffer
         */
        const response = await fetch(downloadUrl, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const disposition = response.headers.get('content-disposition') ?? '';
        const match = disposition.match(
          /filename[^;=\n]*=\s*["']?([^"';\n]+)["']?/i
        );
        const resolvedFilename = match?.[1]?.trim() ?? fallbackFilename;
        const mimeType =
          response.headers.get('content-type') ?? 'application/octet-stream';

        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const file = new File(Paths.cache, resolvedFilename);

        file.create({ overwrite: true });
        file.write(bytes);

        if (!file.exists || file.size === 0) {
          throw new Error(
            'Arquivo gravado está vazio — write falhou silenciosamente'
          );
        }

        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) {
          toast.success('Arquivo baixado com sucesso!');
          return;
        }

        await Sharing.shareAsync(file.uri, {
          mimeType,
          dialogTitle: `Salvar ${resolvedFilename}`,
          UTI: mimeType,
        });
      } catch (err) {
        console.error('[download] Erro:', err);
        toast.error('Erro ao baixar o arquivo. Tente novamente.');
      } finally {
        setDownloadingId(null);
      }
    },
    [toast]
  );

  return { download, downloadingId };
}
