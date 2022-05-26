import { Module } from '@nestjs/common';
import { DocxService } from './services/docx.service';
import { PdfService } from './services/pdf.service';
import { ImageService } from './services/image.service';
import { ImageController } from './controller/image.controller';
import { DocxController } from './controller/docx.controller';
import { PdfController } from './controller/pdf.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [PdfController, ImageController, DocxController],
    providers: [PdfService, DocxService, ImageService],
})
export class AppModule {}
