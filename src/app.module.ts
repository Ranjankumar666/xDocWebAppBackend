import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocxService } from './services/docx.service';
import { PdfService } from './services/pdf.service';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [PdfService, DocxService],
})
export class AppModule {}
