import { Injectable } from '@nestjs/common';
import {
    Document,
    ImageRun,
    IMediaTransformation,
    Packer,
    Paragraph,
} from 'docx';

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
}
