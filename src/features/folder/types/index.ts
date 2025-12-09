import type { StorageProvider } from '@/features/document/types';

export interface ListFoldersRequest {
  provider: StorageProvider;
  folderPath?: string;
}

interface FolderOption {
  id: string;
  path: string;
  hasChildren: boolean;
}

export interface ListFoldersResponse {
  provider: StorageProvider;
  folders: FolderOption[];
}
