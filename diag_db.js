import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('server/database.sqlite');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables in database:', tables.map(t => t.name));

const expectedTables = [
    'pwmu_centers',
    'users',
    'village_waste_reports',
    'vendor_pickups',
    'monthly_reports',
    'waste_collections'
];

expectedTables.forEach(table => {
    try {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`Table '${table}': ${count.count} rows`);
        if (count.count > 0) {
            const first = db.prepare(`SELECT * FROM ${table} LIMIT 1`).get();
            console.log(`  Sample:`, JSON.stringify(first).slice(0, 100));
        }
    } catch (e) {
        console.log(`Table '${table}': ERROR - ${e.message}`);
    }
});

db.close();
