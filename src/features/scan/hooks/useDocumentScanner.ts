import { useCallback, useState } from 'react';

import { Image } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import DocumentScanner, {
  ScanDocumentResponseStatus,
} from 'react-native-document-scanner-plugin';

import type { ScannedPage, ScannerError, ScannerStatus } from '../types';

type UseDocumentScannerPropsType = {
  status: ScannerStatus;
  pages: ScannedPage[];
  error: ScannerError | null;
  scan: () => Promise<void>;
  reset: () => void;
};

export function useDocumentScanner(): UseDocumentScannerPropsType {
  const [status, setStatus] = useState<ScannerStatus>('idle');
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [error, setError] = useState<ScannerError | null>(null);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    const { status: permissionStatus } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (permissionStatus !== 'granted') {
      setError({
        code: 'permission_denied',
        message: 'Permissão para acessar a câmera foi negada.',
      });
      return false;
    }

    return true;
  }, []);

  const scan = useCallback(async () => {
    setError(null);
    setStatus('scanning');

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setStatus('error');
      return;
    }

    try {
      const result = await DocumentScanner.scanDocument({
        croppedImageQuality: 0.9,
      });

      if (result.status === ScanDocumentResponseStatus.Cancel) {
        setStatus('idle');
        return;
      }

      if (!result.scannedImages || result.scannedImages.length === 0) {
        setError({
          code: 'scan_failed',
          message: 'Nenhuma imagem foi capturada.',
        });
        setStatus('error');
        return;
      }

      const resolvedPages = await resolvePageDimensions(result.scannedImages);
      setPages(resolvedPages);
      setStatus('done');
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro desconhecido durante a digitalização.';
      setError({
        code: 'scan_failed',
        message: errorMessage,
      });
      setStatus('error');
    }
  }, [requestCameraPermission]);

  const reset = useCallback(() => {
    setStatus('idle');
    setPages([]);
    setError(null);
  }, []);

  return { status, pages, error, scan, reset };
}

// Helper: resolve as dimensões reais de cada imagem retornada pelo scanner (a lib não retorna width/height).
async function resolvePageDimensions(uris: string[]): Promise<ScannedPage[]> {
  return Promise.all(
    uris.map(
      (uri, index) =>
        new Promise<ScannedPage>((resolve, reject) => {
          Image.getSize(
            uri,
            (width: number, height: number) => {
              resolve({
                uri,
                width,
                height,
                fileName: `page_${index + 1}_${Date.now()}.jpg`,
              });
            },
            (err: Error) => reject(err)
          );
        })
    )
  );
}
