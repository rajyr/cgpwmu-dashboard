import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('server/database.sqlite');
console.log('Checking database at:', dbPath);

try {
    const db = new Database(dbPath);
    const users = db.prepare('SELECT id, email, role, status FROM users').all();
    console.log('Users in database:', users);
    
    const settings = db.prepare('SELECT * FROM system_settings').all();
    console.log('System settings:', settings);
} catch (error) {
    console.error('Database check failed:', error.message);
}
