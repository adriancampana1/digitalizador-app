import type { ApiError, ApiResponse } from '@/api';

import { findAllDocumentsMock, searchDocumentsMock } from '../utils/mocks';

import type {
  CreateDocumentRequest,
  DocumentHttpServiceType,
  DocumentResponse,
  DocumentSearchRequest,
  DocumentSearchResponse,
} from '../types';

class DocumentMockService implements DocumentHttpServiceType {
  async uploadDocument(
    _request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse> | ApiError> {
    return {
      data: findAllDocumentsMock[0],
      status: 200,
    } as ApiResponse<DocumentResponse>;
  }

  /**
   * Busca documentos por texto no Elasticsearch
   */
  async searchDocuments(
    _request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentSearchResponse[]> | ApiError> {
    return { data: searchDocumentsMock, status: 200 };
  }

  async findAllDocuments(): Promise<
    ApiResponse<DocumentResponse[]> | ApiError
  > {
    return {
      data: findAllDocumentsMock,
      status: 200,
    };
  }

  async downloadDocument(
    _documentId: string
  ): Promise<ApiResponse<Blob> | ApiError> {
    return {
      data: new Blob(),
      status: 200,
    };
  }
}

export default new DocumentMockService();
