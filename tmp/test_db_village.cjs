const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../server/database.sqlite');
const db = new Database(dbPath);

console.log('Checking database schema for pwmu_centers table...');

const info = db.pragma('table_info(pwmu_centers)');
const villageCol = info.find(r => r.name === 'village');

if (villageCol) {
    console.log('✅ Found "village" column in pwmu_centers table.');
    console.log('Column details:', villageCol);
} else {
    console.error('❌ "village" column NOT found in pwmu_centers table.');
    console.log('Existing columns:', info.map(r => r.name).join(', '));
}

console.log('\nChecking some data in pwmu_centers...');
const data = db.prepare('SELECT id, name, district, block, village FROM pwmu_centers LIMIT 5').all();
console.table(data);

db.close();
