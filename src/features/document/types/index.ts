import type { ApiError, ApiResponse } from '@/api';

export enum StorageProvider {
  sharepoint = 'sharepoint',
  google_drive = 'google-drive',
  onedrive = 'onedrive',
  dropbox = 'dropbox',
  local = 'local',
}

export interface DocumentResponse {
  id: string;
  userId: string;
  title: string;
  documentType: string;
  storageProvider: string;
  storageUrl: string | null;
  storageItemId: string;
  folderPath: string | null;
  fileMetadata: FileMetadata;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface FileMetadata {
  mimeType: string;
  fileSize: number;
  originalFileName: string;
}

export interface CreateDocumentRequest {
  files: Array<{
    uri: string;
    name: string;
    type: string;
  }>;
  title?: string;
  storageProvider: StorageProvider;
  documentType: string;
  folderPath?: string;
}

export interface DocumentSearchRequest {
  searchText: string;
}

export interface DocumentsByFolderRequest {
  folderPath: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export interface DocumentDownloadResult {
  blob: Blob;
  fileName: string;
  contentType: string;
}

export interface DocumentHttpServiceType {
  uploadDocument(
    request: CreateDocumentRequest
  ): Promise<ApiResponse<DocumentResponse[]> | ApiError>;

  refreshThumbnail(
    documentId: string
  ): Promise<ApiResponse<DocumentResponse> | ApiError>;

  searchDocuments(
    request: DocumentSearchRequest
  ): Promise<ApiResponse<DocumentResponse[]> | ApiError>;

  findAllDocuments(
    params?: PaginationParams
  ): Promise<ApiResponse<PagedResponse<DocumentResponse>> | ApiError>;

  findDocumentsByFolder(
    request: DocumentsByFolderRequest & PaginationParams
  ): Promise<ApiResponse<PagedResponse<DocumentResponse>> | ApiError>;

  downloadDocument(documentId: string): Promise<ApiResponse<Blob> | ApiError>;
}
