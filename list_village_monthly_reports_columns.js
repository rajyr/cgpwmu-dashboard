import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

try {
    const tableInfo = db.prepare("PRAGMA table_info(village_monthly_reports)").all();
    const columns = tableInfo.map(c => c.name);
    console.log('--- START ---');
    columns.forEach(col => console.log(col));
    console.log('--- END ---');
} catch (error) {
    console.error('Error fetching table info:', error.message);
} finally {
    db.close();
}
