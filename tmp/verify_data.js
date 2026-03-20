import Database from 'better-sqlite3';
const db = new Database('server/database.sqlite');
const results = db.prepare('SELECT district, SUM(shared_with_pwmu_kg) as total FROM village_waste_reports GROUP BY district').all();
console.log(JSON.stringify(results, null, 2));
db.close();
