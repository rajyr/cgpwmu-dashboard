try {
  const Database = require('better-sqlite3');
  const path = require('path');
  const dbPath = path.join(__dirname, 'server', 'database.sqlite');
  console.log('Opening DB at:', dbPath);
  const db = new Database(dbPath);
  const rows = db.prepare('SELECT id, full_name, role, registration_data FROM users').all();
  console.log('Found', rows.length, 'users');
  rows.forEach(r => {
    console.log(`${r.id} | ${r.full_name} | ${r.role} | ${r.registration_data}`);
  });
  db.close();
} catch (e) {
  console.error('FATAL ERROR:', e);
}
