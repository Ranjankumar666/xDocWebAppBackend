import { readdir, rm, readFile } from 'fs/promises';
import { join } from 'path';

export const removeFilesFromDir = async (dir: string) => {
    const files = await readdir(dir);
    const removeFiles = files.map((file) => {
        return rm(join(process.cwd(), dir, file), {
            force: true,
        });
    });

    await Promise.all(removeFiles);
};

export const readFilesFromDir = async (dir: string) => {
    const files = await readdir(dir);
    const fileContentPromises = files.map((file) => {
        const filePath = join(process.cwd(), dir, file);

        return readFile(filePath);
    });

    const fileContent = await Promise.all(fileContentPromises);

    return fileContent;
};
