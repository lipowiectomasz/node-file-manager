import fs from 'fs/promises';
import path from 'path';

export async function handleNavigation(command, args, currentDir) {
    switch (command) {
        case 'up':
            return goUp(currentDir);
        case 'cd':
            return await changeDirectory(args, currentDir);
        case 'ls':
            return await listDirectory(currentDir);
        default:
            console.log('Invalid input');
            return currentDir;
    }
}

function goUp(currentDir) {
    const parent = path.dirname(currentDir);
    const root = path.parse(currentDir).root;
    return currentDir === root ? currentDir : parent;
}

async function changeDirectory(args, currentDir) {
    if (args.length === 0) {
        console.log('Invalid input');
        return currentDir;
    }

    const newPath = path.isAbsolute(args[0])
        ? args[0]
        : path.resolve(currentDir, args[0]);

    try {
        const stat = await fs.stat(newPath);
        if (stat.isDirectory()) {
            return newPath;
        } else {
            console.log('Operation failed');
            return currentDir;
        }
    } catch {
        console.log('Operation failed');
        return currentDir;
    }
}

async function listDirectory(currentDir) {
    try {
        const items = await fs.readdir(currentDir, { withFileTypes: true });
        const folders = items
            .filter(item => item.isDirectory())
            .map(dir => ({ Name: dir.name, Type: 'directory' }));
        const files = items
            .filter(item => item.isFile())
            .map(file => ({ Name: file.name, Type: 'file' }));

        const sorted = [...folders.sort(compare), ...files.sort(compare)];

        console.table(sorted);
    } catch {
        console.log('Operation failed');
    }
    return currentDir;
}

function compare(a, b) {
    return a.Name.localeCompare(b.Name);
}
