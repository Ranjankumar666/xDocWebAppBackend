import {
    Controller,
    HttpCode,
    Param,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import { ImageFormats } from '../values';
import { v4 as uuidv4 } from 'uuid';

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post('convert/:type')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async changeImageFormat(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);
        let doc: Buffer = await this.imageService.changeFormat(
            sharpObject,
            type,
        );
        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="${uuidv4}.${type}"`,
            'Content-Length': doc.length,
        });
        return new StreamableFile(doc);
    }

    @Post('compress/:type')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async imageCompression(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);

        let doc = await this.imageService.compression(sharpObject, type);

        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="${uuidv4()}.${type}"`,
            'Content-Length': doc.length,
        });

        return new StreamableFile(doc);
    }
}
