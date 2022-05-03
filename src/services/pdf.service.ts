import { Injectable } from '@nestjs/common';
// import { ToBase64Response } from 'pdf2pic/dist/types/toBase64Response';
import * as PDFDocument from 'pdfkit';
import * as gm from 'gm';
import * as AdmZip from 'adm-zip';
import { readFilesFromDir, removeFilesFromDir } from 'src/utils/fs';

const im = gm.subClass({
    imageMagick: true,
});

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
                size: 'A4',
                margin: options?.margin || 25,
                autoFirstPage: false,
                bufferPages: true,
            });
            const buffer = [];
            doc.fontSize(options?.fontSize || 12);

            for (const image of images) {
                doc.addPage().image(image.buffer.buffer, { scale: 0.5 });
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

    generateImagesFromPdf(pdf: Express.Multer.File): Promise<Buffer> {
        return new Promise(async (resolve) => {
            im(pdf.buffer)
                .command('magick')
                .write('./output/docu-%03d.png', async () => {
                    const zip = new AdmZip();
                    const directory = './output';

                    const fileBuffer = await readFilesFromDir(directory);

                    fileBuffer.forEach((content, i) => {
                        zip.addFile(`${i}.png`, content);
                    });

                    resolve(zip.toBuffer());

                    await removeFilesFromDir(directory);
                });
        });
    }
}
