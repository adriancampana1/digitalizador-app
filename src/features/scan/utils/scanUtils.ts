import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function generateDocumentName(): string {
  const now = new Date();
  return `Documento - ${format(now, 'dd MMM yyyy HH:mm', { locale: ptBR })}`;
}

export function resolveDocumentName(userInput: string): string {
  const trimmed = userInput.trim();
  return trimmed.length > 0 ? trimmed : generateDocumentName();
}
