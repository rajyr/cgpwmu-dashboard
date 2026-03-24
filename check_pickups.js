import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Checking vendor_pickups...');

try {
    const pickups = db.prepare("SELECT * FROM vendor_pickups ORDER BY id DESC LIMIT 5").all();
    console.log('--- START ---');
    pickups.forEach(p => {
        console.log(`ID: ${p.id}, Vendor: ${p.vendor_name}, Material: ${p.material}, Quantity: ${p.quantity_kg}`);
    });
    console.log('--- END ---');
} catch (error) {
    console.error('Error fetching pickups:', error.message);
} finally {
    db.close();
}
