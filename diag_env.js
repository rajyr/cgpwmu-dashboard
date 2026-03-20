import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('ENV INFO:');
console.log('Node Version:', process.version);
console.log('Arch:', process.arch);
console.log('Platform:', process.platform);

try {
    const { default: Database } = await import('better-sqlite3');
    const dbPath = path.join(__dirname, 'server', 'database.sqlite');
    console.log('Testing connection to:', dbPath);
    const db = new Database(dbPath);
    const result = db.prepare('SELECT 1 as test').get();
    console.log('Success:', result);
    process.exit(0);
} catch (e) {
    console.error('FAILED TO LOAD SQLITE:', e.message);
    if (e.code) console.error('Code:', e.code);
    process.exit(1);
}
