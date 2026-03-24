import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Checking for registered vendors...');

try {
    const vendors = db.prepare("SELECT * FROM users WHERE role = 'Vendor'").all();
    console.log('--- START ---');
    vendors.forEach(v => {
        console.log(`ID: ${v.id}, Name: ${v.full_name}, Email: ${v.email}, RegData: ${v.registration_data}`);
    });
    console.log('--- END ---');
} catch (error) {
    console.error('Error fetching vendors:', error.message);
} finally {
    db.close();
}
