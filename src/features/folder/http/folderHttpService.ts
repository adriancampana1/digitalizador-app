import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type { ListFoldersRequest, ListFoldersResponse } from '../types';

interface FolderHttpServicePropsType {
  listFolders: (
    request: ListFoldersRequest
  ) => Promise<ApiResponse<ListFoldersResponse> | ApiError>;
  createFolder: (
    storageProvider: string,
    parentPath: string,
    folderName: string
  ) => Promise<void>;
  deleteFolder: (storageProvider: string, itemId: string) => Promise<void>;
  renameFolder: (
    storageProvider: string,
    itemId: string,
    newName: string
  ) => Promise<void>;
}

class FolderHttpService implements FolderHttpServicePropsType {
  async listFolders(
    request: ListFoldersRequest
  ): Promise<ApiResponse<ListFoldersResponse> | ApiError> {
    return apiClient.get('/folders', {
      params: {
        storageProvider: request.provider,
        folderPath: request.folderPath ?? '',
      },
    });
  }

  async createFolder(
    storageProvider: string,
    parentPath: string,
    folderName: string
  ): Promise<void> {
    await apiClient.post('/folders', {
      storageProvider,
      parentPath,
      folderName,
    });
  }

  async deleteFolder(storageProvider: string, itemId: string): Promise<void> {
    await apiClient.delete(`/folders/${itemId}`, {
      params: { storageProvider },
    });
  }

  async renameFolder(
    storageProvider: string,
    itemId: string,
    newName: string
  ): Promise<void> {
    await apiClient.patch(`/folders/${itemId}`, { storageProvider, newName });
  }
}

export default new FolderHttpService();
