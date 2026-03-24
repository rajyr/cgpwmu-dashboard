import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Checking pwmu_centers...');

try {
    const centers = db.prepare("SELECT * FROM pwmu_centers").all();
    console.log('--- START ---');
    centers.forEach(c => {
        console.log(`ID: ${c.id}, Name: ${c.name}, District: ${c.district}`);
    });
    console.log('--- END ---');
} catch (error) {
    console.error('Error fetching centers:', error.message);
} finally {
    db.close();
}
