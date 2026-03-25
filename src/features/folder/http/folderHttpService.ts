import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type { ListFoldersRequest, ListFoldersResponse } from '../types';

interface FolderHttpServicePropsType {
  listFolders: (
    request: ListFoldersRequest
  ) => Promise<ApiResponse<ListFoldersResponse> | ApiError>;
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
}

export default new FolderHttpService();
