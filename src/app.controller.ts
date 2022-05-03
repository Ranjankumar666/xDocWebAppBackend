// import {
//     Controller,
//     Post,
//     Res,
//     UploadedFiles,
//     UseInterceptors,
//     Param,
//     UploadedFile,
//     StreamableFile,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { Response } from 'express';
// import { DocxService } from './services/docx.service';
// import { PdfService } from './services/pdf.service';
// import { ImageFormats } from './values';

// enum DocType {
//     IMGTOPDF = 'pdf',
//     IMGTODOCX = 'img-to-docx',
//     PDFTOIMG = 'pdf-to-img',
// }

// @Controller({
//     path: 'pdf',
// })
// export class AppController {
//     constructor(
//         private readonly pdfService: PdfService,
//         private readonly docxService: DocxService,
//     ) {}

//     @Post('/multi/:type')
//     @UseInterceptors(FilesInterceptor('files'))
//     async multiFiles(
//         @UploadedFiles() files: Express.Multer.File[],
//         @Res({ passthrough: true })
//         res: Response,
//         @Param('type') type: DocType,
//     ) {
//         let doc: Buffer = null;
//         if (type === DocType.IMGTOPDF) {
//             doc = await this.pdfService.generatePdfFromImages(files);
//             res.set({
//                 'Content-Type': 'application/pdf',
//                 'Content-Disposition': 'attachment; filename="document.pdf"',
//             });
//         } else if (type === DocType.IMGTODOCX) {
//             doc = await this.docxService.generateDocxFromImages(files);
//             res.set({
//                 'Content-Type':
//                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//                 'Content-Disposition': 'attachment; filename="document.docx"',
//             });
//         }
//         res.set({
//             'Content-Length': doc.length,
//         });

//         res.end(doc);
//     }

//     @Post('/single/:type')
//     @UseInterceptors(FileInterceptor('file'))
//     async singleFile(
//         @Param('type') type: ImageFormats,
//         @Res({ passthrough: true }) res: Response,
//         @UploadedFile() file: Express.Multer.File,
//     ) {
//         let doc;
//         if (type === ImageFormats.PNG) {
//             doc = await this.pdfService.generateImagesFromPdf(file);
//             console.log(doc);
//             res.set({
//                 'Content-Type': 'image/png',
//                 'Content-Disposition': 'attachment; filename="filename.png"',
//             });
//         }
//         return new StreamableFile(doc);
//     }
// }
