import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { rm } from 'fs/promises';

const pyScript = join(process.cwd(), './python/convertPdfToDocx.py');

export const convertPdfToDocx = (pdfPath: string): Promise<Buffer> => {
    return new Promise((resolve) => {
        const outputFile = uuidv4() + '.docx';
        const outputFilePath = join(process.cwd(), `./output/${outputFile}`);
        const inputFilePath = join(process.cwd(), pdfPath);

        const scp = spawn('python', [pyScript, inputFilePath, outputFilePath]);
        const chunks = [];

        scp.stdout.on('data', (chunk: any) => {
            chunks.push(chunk);
        });

        scp.stdout.on('end', async () => {
            const buffer = Buffer.concat(chunks);

            resolve(buffer);

            await rm(inputFilePath);
            await rm(outputFilePath);
        });

        scp.stderr.on('error', resolve);
    });
};
