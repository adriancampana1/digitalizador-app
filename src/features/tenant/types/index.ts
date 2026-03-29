export type StorageProvider = 'sharepoint' | 'google_drive' | 'onedrive';

export interface SharePointCredentials {
  clientId: string;
  tenantId: string;
  secretKey: string;
  siteId?: string;
  driveId: string;
  baseFolderPath?: string;
}

export interface TenantSetupPayload {
  name: string;
  storageProvider: StorageProvider;
  baseFolderPath?: string;
  credentials: SharePointCredentials;
}

export interface TenantSetupResponse {
  tenantId: string;
  accessCode: string;
  status: string;
}

export interface TenantResponse {
  id: string;
  name: string;
  storageProvider: StorageProvider;
  baseFolderPath?: string;
  accessCode: string;
  status: string;
}
