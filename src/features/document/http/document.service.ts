import documentHttpService from './document.http.service';
import documentMockService from './document.mock.service';

import type { DocumentHttpServiceType } from '../types';

const isMockEnabled = true;

const documentService: DocumentHttpServiceType = isMockEnabled
  ? documentMockService
  : documentHttpService;

export default documentService;
