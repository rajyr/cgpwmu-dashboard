import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    console.log(JSON.stringify(tableInfo, null, 2));
} catch (error) {
    console.error('Error fetching table info:', error.message);
} finally {
    db.close();
}
