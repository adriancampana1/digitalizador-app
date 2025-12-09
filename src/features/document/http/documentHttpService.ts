import type { ApiError, ApiResponse } from '@/api';
import { apiClient } from '@/api';

import type {
  CreateDocumentRequest,
  DocumentResponse,
  DocumentSearchRequest,
  DocumentSearchResponse,
} from '../types';

interface DocumentHttpServiceType {
  uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse> | ApiError>;

  searchDocuments(
    request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentSearchResponse[]> | ApiError>;

  findAllDocuments(): Promise<ApiResponse<DocumentResponse[]> | ApiError>;

  downloadDocument(documentId: string): Promise<ApiResponse<Blob> | ApiError>;
}

function createUploadFormData(request: CreateDocumentRequest): FormData {
  const formData = new FormData();

  formData.append('file', {
    uri: request.file.uri,
    name: request.file.name,
    type: request.file.type,
  } as unknown as Blob);

  formData.append('title', request.title);
  formData.append('storageProvider', request.storageProvider);
  formData.append('documentType', request.documentType);

  if (request.folderPath) {
    formData.append('folderPath', request.folderPath);
  }

  return formData;
}

const documentHttpService: DocumentHttpServiceType = {
  async uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse> | ApiError> {
    const formData = createUploadFormData(request);

    return apiClient.post('/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

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
  },

  async findAllDocuments(): Promise<
    ApiResponse<DocumentResponse[]> | ApiError
  > {
    return apiClient.get('/document');
  },

  async downloadDocument(
    documentId: string
  ): Promise<ApiResponse<Blob> | ApiError> {
    return apiClient.get(`/document/${documentId}/download`, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  },
};

export default documentHttpService;
