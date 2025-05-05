import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';

const pipe = promisify(pipeline);

export async function handleCompress(command, args, currentDir) {
    if (args.length !== 2) {
        console.log('Invalid input');
        return currentDir;
    }

    const source = path.resolve(currentDir, args[0]);
    const destination = path.resolve(currentDir, args[1]);

    const isCompress = command === 'compress';
    const transformer = isCompress ? createBrotliCompress() : createBrotliDecompress();

    try {
        await pipe(
            createReadStream(source),
            transformer,
            createWriteStream(destination)
        );
    } catch {
        console.log('Operation failed');
    }

    return currentDir;
}
