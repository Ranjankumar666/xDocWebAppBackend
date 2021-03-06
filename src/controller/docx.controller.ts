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
import { DocxService } from '../services/docx.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('docx')
export class DocxController {
    constructor(private docxService: DocxService) {}
    @HttpCode(201)
    @Post('from/image')
    @UseInterceptors(FilesInterceptor('files'))
    async generateDocxFromImages(
        @UploadedFiles() files: Express.Multer.File[],
        @Res({ passthrough: true }) res: Response,
    ) {
        const docxBuffer = await this.docxService.generateDocxFromImages(files);
        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${uuidv4()}.docx"`,
            'Content-Length': docxBuffer.length,
        });
        return new StreamableFile(docxBuffer);
    }

    @HttpCode(201)
    @Post('/from/pdf')
    @UseInterceptors(FileInterceptor('file'))
    async generateDocxFromPdf(
        @UploadedFile() file: Express.Multer.File,
        @Res({ passthrough: true }) res: Response,
    ) {
        const docxBuffer = await this.docxService.generateDocxfromPdf(file);

        res.set({
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition': `attachment; filename="${uuidv4()}.docx"`,
            'Content-Length': docxBuffer.length,
        });
        return new StreamableFile(docxBuffer);
    }
}
