import { File, Paths } from 'expo-file-system';
import { PDFDocument } from 'pdf-lib';

import type { ScannedPage } from '../types';

/**
 * Converte um conjunto de páginas escaneadas (imagens JPEG) em um único
 * arquivo PDF válido, salvo no diretório de cache do dispositivo.
 *
 * Cada página vira uma folha do PDF com as dimensões exatas da imagem,
 * garantindo que o conteúdo não seja distorcido ou cortado.
 *
 * @param pages    Lista de páginas escaneadas (mínimo 1).
 * @param fileName Nome do arquivo de destino (ex: "documento.pdf").
 * @returns        URI do arquivo PDF gerado no cache.
 */
export async function convertPagesToPdf(
  pages: ScannedPage[],
  fileName: string
): Promise<string> {
  if (pages.length === 0) {
    throw new Error('Nenhuma página disponível para gerar o PDF.');
  }

  const pdfDoc = await PDFDocument.create();

  for (const page of pages) {
    const response = await fetch(page.uri);
    if (!response.ok) {
      throw new Error(`Falha ao carregar imagem da página: ${page.uri}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const jpgBytes = new Uint8Array(arrayBuffer);

    const jpgImage = await pdfDoc.embedJpg(jpgBytes);
    const { width, height } = jpgImage;

    const pdfPage = pdfDoc.addPage([width, height]);
    pdfPage.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();

  const tempFile = new File(Paths.cache, fileName);
  tempFile.create({ overwrite: true });
  tempFile.write(pdfBytes);

  if (!tempFile.exists || tempFile.size === 0) {
    throw new Error('PDF gerado está vazio ou inválido.');
  }

  return tempFile.uri;
}
