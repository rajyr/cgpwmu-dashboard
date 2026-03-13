const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
console.log('Diagnostic for:', dbPath);

if (!fs.existsSync(dbPath)) {
  console.log('ERROR: Database file does not exist at this path!');
  process.exit(1);
}

const stats = fs.statSync(dbPath);
console.log('File Size:', stats.size, 'bytes');
console.log('Last Modified:', stats.mtime);

const db = new Database(dbPath);

console.log('\n--- ALL USERS ---');
const users = db.prepare('SELECT id, email, role, full_name, registration_data FROM users').all();
console.log('Total Users Found:', users.length);
users.forEach(u => {
  console.log(`- ${u.id} | ${u.email} | ${u.role} | ${u.full_name}`);
});

console.log('\n--- PWMU CENTERS ---');
const centers = db.prepare('SELECT id, name, nodal_officer_id FROM pwmu_centers').all();
console.log('Total PWMU Centers Found:', centers.length);
centers.forEach(c => {
  console.log(`- ${c.id} | ${c.name} | Nodal: ${c.nodal_officer_id}`);
});

console.log('\n--- TABLES ---');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name).join(', '));

db.close();
