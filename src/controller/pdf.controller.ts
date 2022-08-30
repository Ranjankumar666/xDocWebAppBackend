import {
    Controller,
    HttpCode,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PdfService } from '../services/pdf.service';
import { v4 as uuidv4 } from 'uuid';
import { ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { FilesUploadDto, FileUploadDto } from '../models/fileUploads';

@Controller('pdf')
export class PdfController {
    constructor(private pdfService: PdfService) {}

    /**
     * Controller for converting a set of images
     * to pdf
     */
    @Post('from/image')
    @HttpCode(201)
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image Files to be converted',
        type: FilesUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends a .pdf as a stream on a successful request',
    })
    async pdfGenratorFromImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Res({ passthrough: true }) res: Response,
    ) {
        const doc = await this.pdfService.generatePdfFromImages(files);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${uuidv4()}.pdf"`,
            'Content-Length': doc.length,
        });

        return new StreamableFile(doc);
    }

    /**
     * Controller for converting a docx
     * to pdf
     */
    @Post('from/docx')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image Files to be converted',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends a .pdf as a stream on a successful request',
    })
    async pdfGeneratorFromDocx(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
    ) {
        const pdfBuffer = await this.pdfService.generatePdfFromDocx(file);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${uuidv4()}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });

        return new StreamableFile(pdfBuffer);
    }
}
