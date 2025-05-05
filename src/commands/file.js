import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';

export async function handleFile(command, args, currentDir) {
    switch (command) {
        case 'cat':
            return await cat(args, currentDir);
        case 'add':
            return await add(args, currentDir);
        case 'mkdir':
            return await mkdir(args, currentDir);
        case 'rn':
            return await rename(args, currentDir);
        case 'cp':
            return await copy(args, currentDir);
        case 'mv':
            return await move(args, currentDir);
        case 'rm':
            return await remove(args, currentDir);
        default:
            console.log('Invalid input');
            return currentDir;
    }
}

async function cat(args, currentDir) {
    if (args.length !== 1) return console.log('Invalid input');

    const filePath = path.resolve(currentDir, args[0]);
    const stream = createReadStream(filePath, { encoding: 'utf-8' });

    return new Promise((resolve) => {
        stream.on('data', chunk => process.stdout.write(chunk));
        stream.on('end', () => {
                console.log();
                resolve(currentDir)
        });
        stream.on('error', () => {
            console.log('Operation failed');
            resolve(currentDir);
        });
    });
}

async function add(args, currentDir) {
    if (args.length !== 1) return console.log('Invalid input');

    const filePath = path.resolve(currentDir, args[0]);
    try {
        await fs.writeFile(filePath, '');
    } catch {
        console.log('Operation failed');
    }

    return currentDir;
}

async function mkdir(args, currentDir) {
    if (args.length !== 1) return console.log('Invalid input');

    const dirPath = path.resolve(currentDir, args[0]);
    try {
        await fs.mkdir(dirPath);
    } catch {
        console.log('Operation failed');
    }

    return currentDir;
}

async function rename(args, currentDir) {
    if (args.length !== 2) return console.log('Invalid input');

    const oldPath = path.resolve(currentDir, args[0]);
    const newPath = path.resolve(currentDir, args[1]);

    try {
        await fs.rename(oldPath, newPath);
    } catch {
        console.log('Operation failed');
    }

    return currentDir;
}

async function copy(args, currentDir) {
    if (args.length !== 2) {
        console.log('Invalid input');
        return currentDir;
    }

    const source = path.resolve(currentDir, args[0]);
    let destination = path.resolve(currentDir, args[1]);

    try {
        const stat = await fs.stat(destination);
        if (stat.isDirectory()) {
            destination = path.join(destination, path.basename(source));
        }
    } catch {
    }

    return new Promise((resolve) => {
        const readStream = createReadStream(source);
        const writeStream = createWriteStream(destination);

        readStream.on('error', () => {
            console.log('Operation failed');
            resolve(currentDir);
        });

        writeStream.on('error', () => {
            console.log('Operation failed');
            resolve(currentDir);
        });

        writeStream.on('close', () => resolve(currentDir));

        readStream.pipe(writeStream);
    });
}

async function move(args, currentDir) {
    const result = await copy(args, currentDir);
    if (result === currentDir) {
        const source = path.resolve(currentDir, args[0]);
        try {
            await fs.unlink(source);
        } catch {
            console.log('Operation failed');
        }
    }
    return currentDir;
}

async function remove(args, currentDir) {
    if (args.length !== 1) return console.log('Invalid input');

    const filePath = path.resolve(currentDir, args[0]);
    try {
        await fs.unlink(filePath);
    } catch {
        console.log('Operation failed');
    }

    return currentDir;
}
