import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Verifying fix with a sample query...');

try {
    const query = 'SELECT id, role, status, created_at, full_name, registration_data, district, block, gram_panchayat, village_name FROM users LIMIT 1';
    const result = db.prepare(query).get();
    console.log('Query result:', JSON.stringify(result, null, 2));
    console.log('Verification SUCCESS: No more SQLITE_ERROR for the requested columns.');
} catch (error) {
    console.error('Verification FAILED:', error.message);
    process.exit(1);
} finally {
    db.close();
}
