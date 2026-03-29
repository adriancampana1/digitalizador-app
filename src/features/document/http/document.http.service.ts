import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import { createUploadFormData } from '../utils/document';

import type {
  CreateDocumentRequest,
  DocumentHttpServiceType,
  DocumentResponse,
  DocumentsByFolderRequest,
  DocumentSearchRequest,
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

  async findAllDocuments(): Promise<
    ApiResponse<DocumentResponse[]> | ApiError
  > {
    return apiClient.get('/document');
  }

  async findDocumentsByFolder(
    request: DocumentsByFolderRequest
  ): Promise<ApiResponse<DocumentResponse[]> | ApiError> {
    return apiClient.get('/document', {
      params: {
        folderPath: request.folderPath,
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
