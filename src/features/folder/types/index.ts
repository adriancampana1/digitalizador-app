import type { StorageProvider } from '@/features/document/types';

export const ROOT_FOLDER_PATH = 'root';

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

export type CreateFolderRequest = {
  provider: StorageProvider;
  folderPath: string;
  folderName: string;
};

export type CreateFolderResponse = {
  storageItemId: string;
  folderUrl: string;
  folderName: string;
  storageProvider: StorageProvider;
};
