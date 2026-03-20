import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../server/database.sqlite');
const db = new Database(dbPath);

console.log('Migrating database at:', dbPath);

db.exec(`
  -- 4. PWMU Monthly Reports (Detailed Submission)
  CREATE TABLE IF NOT EXISTS monthly_reports (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    report_month TEXT NOT NULL,
    report_year INTEGER NOT NULL,
    machine_status TEXT, -- JSON string
    electricity_bill REAL DEFAULT 0,
    honorarium REAL DEFAULT 0,
    other_expenses REAL DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    total_expenses REAL DEFAULT 0,
    net_balance REAL DEFAULT 0,
    sales_records TEXT, -- JSON string
    submitted_by TEXT REFERENCES users(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, report_month, report_year)
  );

  -- 5. Village Monthly Reports (Detailed Submission)
  CREATE TABLE IF NOT EXISTS village_monthly_reports (
    id TEXT PRIMARY KEY,
    village_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    village_name TEXT,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE SET NULL,
    report_month TEXT NOT NULL,
    report_year INTEGER NOT NULL,
    recycler_type TEXT,
    waste_sold_kg REAL DEFAULT 0,
    revenue_earned REAL DEFAULT 0,
    num_workers INTEGER DEFAULT 0,
    honorarium_per_worker REAL DEFAULT 0,
    other_expenses REAL DEFAULT 0,
    total_honorarium REAL DEFAULT 0,
    total_expenses REAL DEFAULT 0,
    net_balance REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id, report_month, report_year)
  );
`);

console.log('Migration completed successfully.');
db.close();
