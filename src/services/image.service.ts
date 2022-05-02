import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { ImageFormats } from 'src/values';

@Injectable()
export class ImageService {
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
}
