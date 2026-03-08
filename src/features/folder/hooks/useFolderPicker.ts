import { useCallback, useEffect, useRef, useState } from 'react';

import type { StorageProvider } from '@/features/document/types';
import { useAppToast } from '@/hooks';
import { isApiError } from '@/utils/api';

import folderHttpService from '../http/folderHttpService';

import type { FolderOption } from '../types';

type BreadcrumbEntry = {
  label: string;
  path: string;
};

type UseFolderPickerReturn = {
  folders: FolderOption[];
  breadcrumb: BreadcrumbEntry[];
  currentPath: string;
  isLoading: boolean;
  // Navega para uma sub-pasta (empilha no breadcrumb)
  enterFolder: (folder: FolderOption) => void;
  // Volta para um nível do breadcrumb pelo índice
  navigateTo: (index: number) => void;
  // Inicializa/reseta o picker para o provider informado
  initialize: (provider: StorageProvider) => void;
};

export function useFolderPicker(): UseFolderPickerReturn {
  const { error: toastError } = useAppToast();

  // useToast() do GlueStack pode retornar novas referências a cada render,
  // tornando toastError potencialmente instável. Capturamos o valor mais
  // recente num ref atualizado via useEffect — o único lugar permitido pelo
  // React 19 para mutações de ref. Isso mantém fetchFolders referencialmente
  // estável sem precisar de workarounds no corpo do render.
  const toastErrorRef = useRef(toastError);
  useEffect(() => {
    toastErrorRef.current = toastError;
  });

  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbEntry[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<StorageProvider | null>(
    null
  );

  const fetchFolders = useCallback(
    async (provider: StorageProvider, folderPath: string) => {
      setIsLoading(true);
      try {
        const response = await folderHttpService.listFolders({
          provider,
          folderPath: folderPath || undefined,
        });

        if (isApiError(response)) {
          throw new Error(response.message);
        }

        setFolders(response.data.folders);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar pastas.';
        toastErrorRef.current('Erro', message);
        setFolders([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const initialize = useCallback(
    (provider: StorageProvider) => {
      setActiveProvider(provider);
      setBreadcrumb([]);
      setCurrentPath('');
      setFolders([]);
      fetchFolders(provider, '');
    },
    [fetchFolders]
  );

  const enterFolder = useCallback(
    (folder: FolderOption) => {
      if (!activeProvider) return;

      setBreadcrumb(prev => [
        ...prev,
        { label: folder.name, path: folder.path },
      ]);
      setCurrentPath(folder.path);
      fetchFolders(activeProvider, folder.path);
    },
    [activeProvider, fetchFolders]
  );

  const navigateTo = useCallback(
    (index: number) => {
      if (!activeProvider) return;

      if (index < 0) {
        // Voltar para raiz
        setBreadcrumb([]);
        setCurrentPath('');
        fetchFolders(activeProvider, '');
        return;
      }

      const target = breadcrumb[index];
      if (!target) return;

      setBreadcrumb(prev => prev.slice(0, index + 1));
      setCurrentPath(target.path);
      fetchFolders(activeProvider, target.path);
    },
    [activeProvider, breadcrumb, fetchFolders]
  );

  return {
    folders,
    breadcrumb,
    currentPath,
    isLoading,
    enterFolder,
    navigateTo,
    initialize,
  };
}
