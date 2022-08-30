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
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FilesUploadDto, FileUploadDto } from '../models/fileUploads';

@Controller('docx')
export class DocxController {
    constructor(private docxService: DocxService) {}

    /**
     * Controller for converting a set of images
     * to docx. Sends the file as a stream
     */
    @HttpCode(201)
    @Post('from/image')
    @UseInterceptors(FilesInterceptor('files'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Image Files to be converted',
        type: FilesUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends a .docx as a stream on a successful request',
    })
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

    /**
     * Controller for converting a pdf file
     * to docx. Sends the file as a stream.
     */
    @HttpCode(201)
    @Post('/from/pdf')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Document to be converted',
        type: FileUploadDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Sends a .docx as a stream on a successful request',
    })
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
