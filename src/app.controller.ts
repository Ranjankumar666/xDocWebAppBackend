import {
    Controller,
    Post,
    Res,
    StreamableFile,
    UploadedFiles,
    UseInterceptors,
    Param,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { DocxService } from './services/docx.service';
import { PdfService } from './services/pdf.service';

enum DocType {
    PDF = 'pdf',
    DOCX = 'docx',
}

@Controller({
    path: '/api',
    version: '1',
})
export class AppController {
    constructor(
        private readonly pdfService: PdfService,
        private readonly docxService: DocxService,
    ) {}

    @Post('/generate/:type')
    @UseInterceptors(FilesInterceptor('files'))
    async getPDF(
        @UploadedFiles() files: Express.Multer.File[],
        @Res({
            passthrough: true,
        })
        res: Response,
        @Param('type') type: DocType,
    ) {
        let doc: Buffer = null;

        if (type === DocType.PDF) {
            doc = await this.pdfService.generatePdfFromImages(files);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="document.pdf"',
            });
        } else if (type === DocType.DOCX) {
            doc = await this.docxService.generateDocxFromImages(files);
            res.set({
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'Content-Disposition': 'attachment; filename="document.docx"',
            });
        }

        res.set({
            'Content-Length': doc.length,
        });

        return new StreamableFile(doc);
    }
}
