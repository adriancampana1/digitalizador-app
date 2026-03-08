export type FilterId = 'original' | 'enhanced' | 'grayscale' | 'binarized';

export type OutputFormat = 'pdf' | 'jpeg';

export type SaveDestinationType = 'upload' | 'download';

export interface DocumentFilter {
  id: FilterId;
  label: string;
}

export interface ScannedPage {
  uri: string;
  width: number;
  height: number;
  fileName: string;
}

export interface ProcessedPage extends ScannedPage {
  filterId: FilterId;
  processedUri: string;
}

export type ScannerStatus =
  | 'idle'
  | 'scanning'
  | 'processing'
  | 'done'
  | 'error';

export interface ScannerError {
  code: 'permission_denied' | 'cancelled' | 'scan_failed' | 'processing_failed';
  message: string;
}
