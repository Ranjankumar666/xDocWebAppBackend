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
import { ImageService } from '../services/image.service';
import { ImageFormats, DocFormats } from '../values';
import { v4 as uuidv4 } from 'uuid';
import { ApiBody, ApiConsumes, ApiParam, ApiResponse } from '@nestjs/swagger';
import { FileUploadDto } from '../models/fileUploads';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    /**
     * Controller for converting a jpeg
     * image to png and vice versa
     */
    @Post('convert/:type')
    @ApiParam({
        name: 'type',
        enum: ImageFormats,
    })
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'convert jpeg tpo png and vice versa',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends request image as a stream on a successful request',
    })
    async changeImageFormat(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);
        const doc: Buffer = await this.imageService.changeFormat(
            sharpObject,
            type,
        );
        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="${uuidv4()}.${type}"`,
            'Content-Length': doc.length,
        });
        return new StreamableFile(doc);
    }

    /**
     * Controller for compressing a image
     */
    @Post('compress/:type')
    @ApiParam({
        name: 'type',
        enum: ImageFormats,
    })
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'convert jpeg or png',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends request image as a stream on a successful request',
    })
    async imageCompression(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
        @Param('type') type: ImageFormats,
    ) {
        const sharpObject = await this.imageService.createInstance(file);

        const doc = await this.imageService.compression(sharpObject, type);

        res.set({
            'Content-Type': `image/${type}`,
            'Content-Disposition': `attachment; filename="${uuidv4()}.${type}"`,
            'Content-Length': doc.length,
        });

        return new StreamableFile(doc);
    }

    /**
     * Controller for extracting images
     * from a pdf
     */
    @Post('from/:type')
    @ApiParam({
        name: 'type',
        enum: DocFormats,
    })
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'convert jpeg or png',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends images as a zip stream on a successful request',
    })
    async imagesFromPdf(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
        @Param('type') type: DocFormats,
    ) {
        let doc: Buffer = null;

        if (type === DocFormats.PDF)
            doc = await this.imageService.generateImagesFromPdf(file);
        else if (type === DocFormats.DOCX)
            doc = await this.imageService.generateImagesFromDocx(file);

        res.set({
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${uuidv4()}.zip"`,
            'Content-Length': doc.length,
        });

        return new StreamableFile(doc);
    }
}
