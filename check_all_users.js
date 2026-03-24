import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Checking all users...');

try {
    const users = db.prepare("SELECT id, email, full_name, role FROM users").all();
    console.log('--- START ---');
    users.forEach(u => {
        console.log(`ID: ${u.id}, Name: ${u.full_name}, Email: ${u.email}, Role: ${u.role}`);
    });
    console.log('--- END ---');
} catch (error) {
    console.error('Error fetching users:', error.message);
} finally {
    db.close();
}
