import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

export async function handleHash(args, currentDir) {
    if (args.length !== 1) {
        console.log('Invalid input');
        return currentDir;
    }

    const filePath = path.resolve(currentDir, args[0]);

    return new Promise((resolve) => {
        const hash = createHash('sha256');
        const stream = createReadStream(filePath);

        stream.on('error', () => {
            console.log('Operation failed');
            resolve(currentDir);
        });

        stream.on('data', chunk => hash.update(chunk));

        stream.on('end', () => {
            const result = hash.digest('hex');
            console.log(result);
            resolve(currentDir);
        });
    });
}
