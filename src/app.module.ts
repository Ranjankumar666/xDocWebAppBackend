import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocxService } from './services/docx.service';
import { PdfService } from './services/pdf.service';
import { ImageService } from './services/image.service';
import { ImageController } from './controller/image.controller';

@Module({
    imports: [],
    controllers: [AppController, ImageController],
    providers: [PdfService, DocxService, ImageService],
})
export class AppModule {}
