import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Checking PWMU operational logs for March 2026...');
const logs = db.prepare(`
    SELECT * FROM pwmu_operational_logs 
    WHERE log_date LIKE '2026-03-%'
`).all();

console.log('Found logs:', logs.length);
logs.forEach(l => {
    console.log(`Date: ${l.log_date}, Intake: ${l.total_intake_kg}, Breakdown: ${l.processed_stock_breakdown}`);
});

db.close();
