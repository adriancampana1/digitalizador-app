import { colors } from '@/theme';

import type { CreateDocumentRequest } from '../types';

export type ProviderConfig = {
  label: string;
  textColor: string;
  bgColor: string;
};

const STORAGE_PROVIDER_MAP: Record<string, ProviderConfig> = {
  sharepoint: {
    label: 'SharePoint',
    textColor: colors.accent[700],
    bgColor: colors.accent[50],
  },
  google_drive: {
    label: 'Google Drive',
    textColor: colors.success[700],
    bgColor: colors.success[50],
  },
  onedrive: {
    label: 'OneDrive',
    textColor: colors.info[700],
    bgColor: colors.info[50],
  },
  dropbox: {
    label: 'Dropbox',
    textColor: colors.info[600],
    bgColor: colors.info[50],
  },
  local: {
    label: 'Local',
    textColor: colors.gray[600],
    bgColor: colors.gray[50],
  },
};

const DEFAULT_PROVIDER_CONFIG: ProviderConfig = {
  label: 'Desconhecido',
  textColor: colors.gray[600],
  bgColor: colors.gray[50],
};

export function getProviderConfig(provider: string): ProviderConfig {
  return (
    STORAGE_PROVIDER_MAP[provider.toLowerCase()] ?? DEFAULT_PROVIDER_CONFIG
  );
}

export function getFileTypeIconName(mimeType?: string): string {
  if (!mimeType) return 'file';
  if (mimeType.includes('pdf')) return 'file-text';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel'))
    return 'grid';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint'))
    return 'monitor';
  if (mimeType.includes('word') || mimeType.includes('document'))
    return 'file-text';
  if (mimeType.includes('text/')) return 'file-text';
  return 'file';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  const extension = parts.length > 1 ? parts.pop() : undefined;
  return extension ? extension.toUpperCase() : '';
}

export function createUploadFormData(request: CreateDocumentRequest): FormData {
  const formData = new FormData();

  request.files.forEach(file => {
    formData.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as unknown as Blob);
  });

  if (request.title) {
    formData.append('title', request.title);
  }

  formData.append('storageProvider', request.storageProvider);
  formData.append('documentType', request.documentType);

  if (request.folderPath) {
    formData.append('folderPath', request.folderPath);
  }

  return formData;
}
