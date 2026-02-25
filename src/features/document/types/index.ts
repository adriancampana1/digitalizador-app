import type { ApiError, ApiResponse } from '@/api';

export enum StorageProvider {
  SHAREPOINT = 'sharepoint',
  GOOGLE_DRIVE = 'google_drive',
  ONEDRIVE = 'onedrive',
  DROPBOX = 'dropbox',
  LOCAL = 'local',
}

/**
 * Representa a resposta de um documento armazenado internamente
 */
export interface DocumentResponse {
  id: string;
  userId: string;
  documentType: string;
  title: string;
  storageProvider: string;
  storageUrl: string | null;
  storageItemId: string;
  folderPath: string | null;
}

export interface FileMetadata {
  mimeType: string;
  fileSize: number;
  originalFileName: string;
}

/**
 * Representa o documento indexado no Elasticsearch
 */
export interface DocumentSearchResponse {
  id: string;
  title: string;
  documentType: string;
  fileMetadata: FileMetadata;
}

export interface CreateDocumentRequest {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  title: string;
  storageProvider: StorageProvider;
  documentType: string;
  folderPath?: string;
}

export interface DocumentSearchRequest {
  searchText: string;
}

export interface DocumentDownloadResult {
  blob: Blob;
  fileName: string;
  contentType: string;
}

export interface DocumentHttpServiceType {
  uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse> | ApiError>;

  searchDocuments(
    request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentSearchResponse[]> | ApiError>;

  findAllDocuments(): Promise<ApiResponse<DocumentResponse[]> | ApiError>;

  downloadDocument(documentId: string): Promise<ApiResponse<Blob> | ApiError>;
}
