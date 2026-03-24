import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Running migration for monthly reports tables...');

try {
    // 1. monthly_reports
    const mrInfo = db.prepare("PRAGMA table_info(monthly_reports)").all();
    const mrColumns = mrInfo.map(c => c.name);

    if (!mrColumns.includes('opening_stock')) {
        console.log('Adding column: opening_stock to monthly_reports');
        db.prepare("ALTER TABLE monthly_reports ADD COLUMN opening_stock TEXT").run();
    }

    if (!mrColumns.includes('updated_at')) {
        console.log('Adding column: updated_at to monthly_reports');
        db.prepare("ALTER TABLE monthly_reports ADD COLUMN updated_at TEXT").run();
    }

    // 2. village_monthly_reports
    const vmrInfo = db.prepare("PRAGMA table_info(village_monthly_reports)").all();
    const vmrColumns = vmrInfo.map(c => c.name);

    if (!vmrColumns.includes('updated_at')) {
        console.log('Adding column: updated_at to village_monthly_reports');
        db.prepare("ALTER TABLE village_monthly_reports ADD COLUMN updated_at TEXT").run();
    }

    console.log('Migration completed successfully.');

} catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
}
