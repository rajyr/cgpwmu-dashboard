import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Running migration to add missing columns to users table...');

try {
    // Check if columns exist first to avoid errors on multiple runs
    const tableInfo = db.prepare("PRAGMA table_info(users)").all();
    const existingColumns = tableInfo.map(c => c.name);

    if (!existingColumns.includes('block')) {
        console.log('Adding column: block');
        db.prepare("ALTER TABLE users ADD COLUMN block TEXT").run();
    } else {
        console.log('Column already exists: block');
    }

    if (!existingColumns.includes('gram_panchayat')) {
        console.log('Adding column: gram_panchayat');
        db.prepare("ALTER TABLE users ADD COLUMN gram_panchayat TEXT").run();
    } else {
        console.log('Column already exists: gram_panchayat');
    }

    if (!existingColumns.includes('village_name')) {
        console.log('Adding column: village_name');
        db.prepare("ALTER TABLE users ADD COLUMN village_name TEXT").run();
    } else {
        console.log('Column already exists: village_name');
    }

    console.log('Migration completed successfully.');

    // Verify
    const updatedTableInfo = db.prepare("PRAGMA table_info(users)").all();
    const updatedColumns = updatedTableInfo.map(c => c.name);
    console.log('Final columns in users table:', updatedColumns.join(', '));

} catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
}
