const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);
const rows = db.prepare('SELECT id, role, full_name FROM users').all();
rows.forEach(r => console.log(`${r.role}|${r.id}|${r.full_name}`));
db.close();
