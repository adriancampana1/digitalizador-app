import type { StorageProvider } from '@/features/document/types';

export interface ListFoldersRequest {
  provider: StorageProvider;
  folderPath?: string;
}

export interface FolderOption {
  id: string;
  name: string;
  path: string;
  hasChildren: boolean;
}

export interface ListFoldersResponse {
  provider: StorageProvider;
  folders: FolderOption[];
}
