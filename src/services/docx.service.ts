import { Injectable } from '@nestjs/common';
import {
    Document,
    ImageRun,
    IMediaTransformation,
    ISectionOptions,
    Packer,
    Paragraph,
    SectionType,
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
            data: image.buffer,
            transformation: options || defaultOptions,
        });

        return imageRun;
    }
    generateDocxFromImages(images: Express.Multer.File[]): Promise<Buffer> {
        return new Promise((resolve) => {
            const data: ISectionOptions[] = images.map((img) => ({
                properties: {
                    type: SectionType.NEXT_PAGE,
                },
                children: [
                    new Paragraph({
                        children: [this.createImageRunFromBuffer(img)],
                    }),
                ],
            }));
            const doc = new Document({
                sections: data,
            });

            resolve(Packer.toBuffer(doc));
        });
    }
}
