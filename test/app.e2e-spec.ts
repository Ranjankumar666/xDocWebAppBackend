import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { writeFile } from 'fs/promises';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('api/multi/img-to-docx (POST)', async () => {
        return request(app.getHttpServer())
            .post('/api/multi/img-to-docx/')
            .set('Content-Type', 'multipart/form-data')
            .attach(
                'files',
                `${__dirname}/test-images/patrick-schrodter-X2c-eOO4Evo-unsplash.jpg`,
            )
            .expect(async (res) => {
                await writeFile(
                    `${__dirname}/test-images/document.docx`,
                    res.text,
                );
            })
            .expect(201);
    });

    it('api/multi/img-to-pdf (POST)', async () => {
        return request(app.getHttpServer())
            .post('/api/multi/img-to-pdf/')
            .set('Content-Type', 'multipart/form-data')
            .attach(
                'files',
                `${__dirname}/test-images/patrick-schrodter-X2c-eOO4Evo-unsplash.jpg`,
            )
            .expect(async (res) => {
                await writeFile(
                    `${__dirname}/test-images/document.pdf`,
                    res.body,
                );
            })
            .expect(201);
    });
});
