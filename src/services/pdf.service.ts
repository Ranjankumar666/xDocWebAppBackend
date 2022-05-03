import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as mammoth from 'mammoth';
import * as pdf from 'html-pdf';

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

    docxToHtml(file: Express.Multer.File): Promise<Buffer> {
        return new Promise(async (resolve, reject) => {
            const docHtml = await mammoth.convertToHtml(file);
            pdf.create(docHtml.value).toBuffer((err, buffer) => {
                if (err) {
                    reject(err);
                }
                resolve(buffer);
            });
        });
    }
}
