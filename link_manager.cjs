const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

// 1. Find the Balod center
const center = db.prepare('SELECT id FROM pwmu_centers WHERE name LIKE "%Balod%" LIMIT 1').get();
const manager = db.prepare('SELECT id FROM users WHERE role = "PWMUManager" LIMIT 1').get();

if (center && manager) {
  console.log(`Linking Center ${center.id} to Manager ${manager.id}`);
  db.prepare('UPDATE pwmu_centers SET nodal_officer_id = ? WHERE id = ?').run(manager.id, center.id);
  console.log('Update successful.');
} else {
  console.error('Failed to find center or manager!');
}

db.close();
