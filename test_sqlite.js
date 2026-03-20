import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const dbPath = path.join(__dirname, 'server', 'database.sqlite');
    console.log('Testing connection to:', dbPath);
    const db = new Database(dbPath);
    const result = db.prepare('SELECT 1 as test').get();
    console.log('Success:', result);
    process.exit(0);
} catch (e) {
    console.error('FAILED TO LOAD SQLITE:', e.message);
    process.exit(1);
}
