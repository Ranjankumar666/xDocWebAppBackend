import {
    Controller,
    HttpStatus,
    Param,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ImageService } from 'src/services/image.service';
import { ImageFormats } from '../values';

@Controller('image')
export class ImageController {
    constructor(private imageService: ImageService) {}

    @Post('conversion/:type')
    @UseInterceptors(FileInterceptor('file'))
    async changeImageFormat(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);
        let doc: Buffer = await this.imageService.changeFormat(
            sharpObject,
            type,
        );
        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="document.${type}"`,
            'Content-Length': doc.length,
        });
        res.status(HttpStatus.OK).end(doc);
    }

    @Post('compression/:type')
    @UseInterceptors(FileInterceptor('file'))
    async imageCompression(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);

        let doc = await this.imageService.compression(sharpObject, type);

        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="document.${type}"`,
            'Content-Length': doc.length,
        });

        res.status(HttpStatus.OK).end(doc);
    }
}
