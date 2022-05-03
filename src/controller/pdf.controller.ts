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

@Controller('pdf')
export class PdfController {
    constructor(private pdfService: PdfService) {}
    @Post('from/image')
    @HttpCode(201)
    @UseInterceptors(FilesInterceptor('files'))
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

    @Post('from/docx')
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
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
