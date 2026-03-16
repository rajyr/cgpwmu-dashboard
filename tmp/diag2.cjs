const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join('f:/UNICEF-AILSG/PWMU report/PWMUapp2/server', 'database.sqlite');
const db = new Database(dbPath);

console.log('=== PWMU USERS ===');
db.prepare("SELECT id, email, full_name FROM users WHERE role = 'PWMUManager'").all().forEach(u => console.log(JSON.stringify(u)));

console.log('=== PWMU CENTERS ===');
db.prepare('SELECT id, name, nodal_officer_id FROM pwmu_centers').all().forEach(c => console.log(JSON.stringify(c)));

console.log('=== MARKET AVAIL ===');
const m = db.prepare('SELECT pwmu_id, material, stock_kg FROM market_availability').all();
if (m.length === 0) console.log('EMPTY');
else m.forEach(r => console.log(JSON.stringify(r)));

db.close();
