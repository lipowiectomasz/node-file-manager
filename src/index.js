import os from 'os';
import readline from 'readline';
import { handleCommand } from './cli.js';

const args = process.argv.slice(2);
const usernameArg = args.find(arg => arg.startsWith('--username='));
const username = usernameArg ? usernameArg.split('=')[1] : 'Anonymous';

console.log(`Welcome to the File Manager, ${username}!`);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
});

let currentDir = os.homedir();
printDir();

rl.prompt();

rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (trimmed === '.exit') {
        exitApp();
    } else {
        try {
            currentDir = await handleCommand(trimmed, currentDir);
        } catch {
            console.log('Operation failed');
        }
        printDir();
        rl.prompt();
    }
});

rl.on('SIGINT', () => {
    exitApp();
});

function printDir() {
    console.log(`You are currently in ${currentDir}`);
}

function exitApp() {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
}
