import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import { createUploadFormData } from '../utils/document';

import type {
  CreateDocumentRequest,
  DocumentHttpServiceType,
  DocumentResponse,
  DocumentsByFolderRequest,
  DocumentSearchRequest,
  PagedResponse,
  PaginationParams,
} from '../types';

class DocumentHttpService implements DocumentHttpServiceType {
  async uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse[]> | ApiError> {
    const formData = createUploadFormData(request);

    return apiClient.post('/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async refreshThumbnail(
    documentId: string
  ): Promise<ApiResponse<DocumentResponse> | ApiError> {
    return apiClient.post(`/document/${documentId}/thumbnail/refresh`);
  }

  /**
   * Busca documentos por texto no Elasticsearch
   */
  async searchDocuments(
    request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentResponse[]> | ApiError> {
    return apiClient.get('/document/search', {
      params: {
        searchText: request.searchText,
      },
    });
  }

  async findAllDocuments(
    params?: PaginationParams
  ): Promise<ApiResponse<PagedResponse<DocumentResponse>> | ApiError> {
    return apiClient.get('/document', {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
  }

  async findDocumentsByFolder(
    request: DocumentsByFolderRequest & PaginationParams
  ): Promise<ApiResponse<PagedResponse<DocumentResponse>> | ApiError> {
    return apiClient.get('/document', {
      params: {
        folderPath: request.folderPath,
        page: request.page ?? 0,
        size: request.size ?? 20,
      },
    });
  }

  async downloadDocument(
    documentId: string
  ): Promise<ApiResponse<Blob> | ApiError> {
    return apiClient.get(`/document/${documentId}/download`, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  }

  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/document/${documentId}`);
  }
}

export default new DocumentHttpService();
