import { handleNavigation } from './commands/navigation.js';
import { handleFile } from './commands/file.js';
import { handleOS } from './commands/os.js';
import { handleHash } from './commands/hash.js';
import { handleCompress } from './commands/compress.js';

export async function handleCommand(input, currentDir) {
    const [command, ...args] = input.trim().split(' ');

    switch (command) {
        case 'up':
        case 'cd':
        case 'ls':
            return await handleNavigation(command, args, currentDir);
        case 'cat':
        case 'add':
        case 'rn':
        case 'cp':
        case 'mv':
        case 'rm':
        case 'mkdir':
            return await handleFile(command, args, currentDir);
        case 'os':
            return await handleOS(args, currentDir);
        case 'hash':
            return await handleHash(args, currentDir);
        case 'compress':
        case 'decompress':
            return await handleCompress(command, args, currentDir);
        default:
            console.log('Invalid input');
            return currentDir;
    }
}
