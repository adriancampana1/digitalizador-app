import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type {
  CreateFolderRequest,
  CreateFolderResponse,
  ListFoldersRequest,
  ListFoldersResponse,
} from '../types';

interface FolderHttpServicePropsType {
  listFolders: (
    request: ListFoldersRequest
  ) => Promise<ApiResponse<ListFoldersResponse> | ApiError>;
  createFolder: (
    request: CreateFolderRequest
  ) => Promise<ApiResponse<CreateFolderResponse> | ApiError>;
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
    request: CreateFolderRequest
  ): Promise<ApiResponse<CreateFolderResponse> | ApiError> {
    return apiClient.post('/folders', {
      storageProvider: request.provider,
      parentFolderPath: request.parentFolderPath,
      folderName: request.folderName,
    });
  }
}

export default new FolderHttpService();
