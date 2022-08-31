import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomHttpExceptionFilter } from './filter/http-exception.filter';
import { UnhandledExceptionFilter } from './filter/unhandled-exception.filter';

const port = process.env.PORT || 3000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalFilters(
        new UnhandledExceptionFilter(),
        new CustomHttpExceptionFilter(),
    );

    const config = new DocumentBuilder()
        .setTitle('xDoc Api Documentation')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    await app.listen(port, () => {
        console.log('App started at port', port);
    });
}
bootstrap();
