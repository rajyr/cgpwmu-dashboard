import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('--- DIAGNOSTIC START ---');

try {
    console.log('\n[PWMU CENTERS]');
    const centers = db.prepare("SELECT id, name FROM pwmu_centers").all();
    centers.forEach(c => console.log(`ID: ${c.id}, Name: ${c.name}`));

    console.log('\n[USERS BY ROLE]');
    const roles = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();
    roles.forEach(r => console.log(`Role: ${r.role}, Count: ${r.count}`));

    console.log('\n[VILLAGE USERS / SARPANCHES]');
    const users = db.prepare("SELECT id, email, role, registration_data FROM users WHERE role IN ('Sarpanch', 'VillageUser')").all();
    users.forEach(u => {
        let reg = {};
        try { reg = JSON.parse(u.registration_data || '{}'); } catch (e) {}
        console.log(`ID: ${u.id}, Role: ${u.role}, Email: ${u.email}, linked pwmuId: ${reg.pwmuId || 'MISSING'}`);
    });

} catch (error) {
    console.error('Error:', error.message);
} finally {
    db.close();
}
console.log('\n--- DIAGNOSTIC END ---');
