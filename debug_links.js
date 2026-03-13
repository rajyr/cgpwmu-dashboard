const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('--- ALL USERS ---');
const users = db.prepare('SELECT id, full_name, role, registration_data FROM users').all();
users.forEach(u => {
  let reg = {};
  try { reg = JSON.parse(u.registration_data); } catch(e) {}
  console.log(`ID: ${u.id} | Name: ${u.full_name} | Role: ${u.role} | LinkedPWMU: ${reg.pwmuId || 'NONE'}`);
});

db.close();
