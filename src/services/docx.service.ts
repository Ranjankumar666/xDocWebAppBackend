import { Injectable } from '@nestjs/common';
import {
    Document,
    ImageRun,
    IMediaTransformation,
    Packer,
    Paragraph,
} from 'docx';
import { writeFile } from 'fs/promises';
import { convertPdfToDocx } from 'src/utils/pdf2Docx';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocxService {
    createImageRunFromBuffer(
        image: Express.Multer.File,
        options: IMediaTransformation = null,
    ) {
        const defaultOptions: IMediaTransformation = {
            width: 500,
            height: 500,
        };
        const imageRun = new ImageRun({
            data: image.buffer.buffer,
            transformation: options || defaultOptions,
        });

        return imageRun;
    }

    generateDocxFromImages(images: Express.Multer.File[]): Promise<Buffer> {
        return new Promise((resolve) => {
            const data: Paragraph[] = images.map(
                (img) =>
                    new Paragraph({
                        children: [this.createImageRunFromBuffer(img)],
                    }),
            );

            const doc = new Document({
                sections: [
                    {
                        children: data,
                    },
                ],
            });

            Packer.toBuffer(doc).then((buffer) => {
                resolve(buffer);
            });
        });
    }

    async generateDocxfromPdf(pdf: Express.Multer.File): Promise<Buffer> {
        const filename = uuidv4() + '.pdf';
        const filePath = `./output/${filename}`;
        await writeFile(filePath, pdf.buffer);

        const doc = await convertPdfToDocx(filePath);

        return doc;
    }
}
