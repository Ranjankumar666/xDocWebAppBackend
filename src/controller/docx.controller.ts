import {
    Controller,
    HttpCode,
    Post,
    Res,
    StreamableFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocxService } from '../services/docx.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('docx')
export class DocxController {
    constructor(private docxService: DocxService) {}
    @HttpCode(201)
    @Post('from/image')
    @UseInterceptors(FilesInterceptor('files'))
    async generateDocxFromImage(
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
}
