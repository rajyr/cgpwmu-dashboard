import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('--- USERS ---');
const users = db.prepare('SELECT id, full_name, role, registration_data FROM users').all();
users.forEach(u => {
  console.log(`ID: ${u.id} | Name: ${u.full_name} | Role: ${u.role}`);
  console.log(`RegData: ${u.registration_data}`);
  console.log('---');
});

console.log('\n--- PWMU CENTERS ---');
const centers = db.prepare('SELECT * FROM pwmu_centers').all();
console.log(centers);

console.log('\n--- WASTE COLLECTIONS ---');
const collections = db.prepare('SELECT * FROM waste_collections').all();
console.log(collections);

db.close();
