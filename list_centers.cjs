const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);
const rows = db.prepare('SELECT id, name FROM pwmu_centers').all();
rows.forEach(r => console.log(`${r.id}|${r.name}`));
db.close();
