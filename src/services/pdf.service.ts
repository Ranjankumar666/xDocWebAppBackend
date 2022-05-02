import { Injectable } from '@nestjs/common';
import { fromBuffer } from 'pdf2pic';
import { WriteImageResponse } from 'pdf2pic/dist/types/writeImageResponse';
import * as PDFDocument from 'pdfkit';

interface PdfOptions {
    fontSize: number;
    margin: number;
}

@Injectable()
export class PdfService {
    async generatePdfFromImages(
        images: Express.Multer.File[],
        options: PdfOptions = null,
    ): Promise<Buffer> {
        return new Promise((resolve) => {
            const doc = new PDFDocument({
                size: 'LETTER',
                margin: options?.margin || 25,
                autoFirstPage: false,
                bufferPages: true,
            });
            const buffer = [];
            doc.fontSize(options?.fontSize || 12);

            for (const image of images) {
                doc.addPage().image(image.buffer.buffer, {
                    scale: 0.5,
                });
            }

            doc.on('data', (data) => {
                buffer.push(data);
            });
            doc.on('end', () => {
                const data = Buffer.concat(buffer);
                resolve(data);
            });

            doc.end();
        });
    }

    async generateImagesFromPdf(pdf: Express.Multer.File) {
        const images: WriteImageResponse[] = await fromBuffer(pdf.buffer, {
            quality: 1,
        }).bulk();

        return images;
    }
}
