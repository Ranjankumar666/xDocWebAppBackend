import { Injectable } from '@nestjs/common';
import AdmZip from 'adm-zip';
import * as sharp from 'sharp';
import { readFilesFromDir, removeFilesFromDir } from 'src/utils/fs';
import { im } from 'src/utils/imagemagick';
import { ImageFormats } from '../values';
import { PdfService } from './pdf.service';

@Injectable()
export class ImageService {
    constructor(private readonly pdfService: PdfService) {}

    async createInstance(inp: Express.Multer.File) {
        return await sharp(inp.buffer);
    }

    async changeFormat(sharpObject: sharp.Sharp, type: ImageFormats) {
        if (type === ImageFormats.JPEG) {
            return await sharpObject.jpeg().toBuffer();
        } else if (type === ImageFormats.PNG) {
            return await sharpObject.png().toBuffer();
        }
    }

    async compression(sharpObject: sharp.Sharp, type: ImageFormats) {
        if (type == ImageFormats.JPEG) {
            return await sharpObject.jpeg({ quality: 40 }).toBuffer();
        } else if (type == ImageFormats.PNG) {
            return await sharpObject.png({ quality: 90 }).toBuffer();
        }
    }

    generateImagesFromPdf(pdf: Express.Multer.File | Buffer): Promise<Buffer> {
        return new Promise(async (resolve) => {
            const buf = Buffer.isBuffer(pdf) ? pdf : pdf.buffer;

            im(buf)
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

    async generateImagesFromDocx(docx: Express.Multer.File): Promise<Buffer> {
        const pdf = await this.pdfService.generatePdfFromDocx(docx);
        const buffer = await this.generateImagesFromPdf(pdf);

        return buffer;
    }
}
