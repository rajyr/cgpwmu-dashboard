import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

console.log('Verifying columns in monthly_reports and village_monthly_reports...');

try {
    const mrInfo = db.prepare("PRAGMA table_info(monthly_reports)").all();
    const mrColumns = mrInfo.map(c => c.name);
    console.log('monthly_reports columns:', mrColumns.join(', '));
    
    if (mrColumns.includes('opening_stock') && mrColumns.includes('updated_at')) {
        console.log('monthly_reports verification SUCCESS.');
    } else {
        console.error('monthly_reports verification FAILED.');
    }

    const vmrInfo = db.prepare("PRAGMA table_info(village_monthly_reports)").all();
    const vmrColumns = vmrInfo.map(c => c.name);
    console.log('village_monthly_reports columns:', vmrColumns.join(', '));

    if (vmrColumns.includes('updated_at')) {
        console.log('village_monthly_reports verification SUCCESS.');
    } else {
        console.error('village_monthly_reports verification FAILED.');
    }

} catch (error) {
    console.error('Final verification FAILED:', error.message);
    process.exit(1);
} finally {
    db.close();
}
