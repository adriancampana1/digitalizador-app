import type { CreateDocumentRequest } from '../types';

export function createUploadFormData(request: CreateDocumentRequest): FormData {
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
