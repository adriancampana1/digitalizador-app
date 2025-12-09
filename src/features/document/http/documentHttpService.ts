import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import { createUploadFormData } from '../utils/document';

import type {
  CreateDocumentRequest,
  DocumentHttpServiceType,
  DocumentResponse,
  DocumentSearchRequest,
  DocumentSearchResponse,
} from '../types';

class DocumentHttpService implements DocumentHttpServiceType {
  async uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse> | ApiError> {
    const formData = createUploadFormData(request);

    return apiClient.post('/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Busca documentos por texto no Elasticsearch
   */
  async searchDocuments(
    request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentSearchResponse[]> | ApiError> {
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
}

export default new DocumentHttpService();
