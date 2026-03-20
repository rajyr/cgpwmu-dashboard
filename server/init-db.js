import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('Initializing database at:', dbPath);

// Create Tables
db.exec(`
  DROP TABLE IF EXISTS waste_collections;
  DROP TABLE IF EXISTS pwmu_daily_logs;
  DROP TABLE IF EXISTS village_waste_reports;
  DROP TABLE IF EXISTS pwmu_village_intake;
  DROP TABLE IF EXISTS pwmu_operational_logs;
  DROP TABLE IF EXISTS pwmu_monthly_reports;
  DROP TABLE IF EXISTS market_availability;
  DROP TABLE IF EXISTS vendor_pickups;

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'DistrictNodal',
    status TEXT DEFAULT 'pending',
    district TEXT,
    phone_number TEXT,
    registration_data TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS pwmu_centers (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    district TEXT,
    block TEXT,
    gram_panchayat TEXT,
    village TEXT,
    nodal_officer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    capacity_mt REAL DEFAULT 0,
    waste_processed_mt REAL DEFAULT 0,
    waste_sold_mt REAL DEFAULT 0,
    revenue REAL DEFAULT 0,
    expenditure REAL DEFAULT 0,
    recovery_rate REAL DEFAULT 75,
    status TEXT DEFAULT 'operational',
    latitude REAL,
    longitude REAL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- 1. Village Waste Reports (Sarpanch Submissions)
  CREATE TABLE IF NOT EXISTS village_waste_reports (
    id TEXT PRIMARY KEY,
    village_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    village_name TEXT NOT NULL,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE SET NULL,
    district TEXT,
    block TEXT,
    gram_panchayat TEXT,
    collection_date TEXT NOT NULL,
    wet_waste_kg REAL DEFAULT 0,
    dry_waste_kg REAL DEFAULT 0,
    shared_with_pwmu_kg REAL DEFAULT 0,
    metal_waste_kg REAL DEFAULT 0,
    glass_waste_kg REAL DEFAULT 0,
    ewaste_kg REAL DEFAULT 0,
    other_waste_kg REAL DEFAULT 0,
    user_charge_collected REAL DEFAULT 0,
    submitted INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending', -- pending, confirmed
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(village_id, collection_date)
  );

  -- 2. PWMU Village Intake (Confirmed received from village)
  CREATE TABLE IF NOT EXISTS pwmu_village_intake (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    village_name TEXT NOT NULL,
    collection_date TEXT NOT NULL,
    received_kg REAL DEFAULT 0,
    village_report_id TEXT REFERENCES village_waste_reports(id) ON DELETE SET NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, collection_date, village_name)
  );

  -- 3. PWMU Operational Logs (Daily center stats)
  CREATE TABLE IF NOT EXISTS pwmu_operational_logs (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    log_date TEXT NOT NULL,
    total_intake_kg REAL DEFAULT 0,
    processed_kg REAL DEFAULT 0,
    sold_kg REAL DEFAULT 0,
    revenue REAL DEFAULT 0,
    expenditure REAL DEFAULT 0,
    status TEXT DEFAULT 'operational',
    reporting_count INTEGER DEFAULT 0,
    processed_stock_breakdown TEXT, -- JSON string
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, log_date)
  );

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
    collection_data TEXT, -- JSON string
    closing_stock TEXT, -- JSON string
    process_loss_kg REAL DEFAULT 0,
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

  -- 6. PWMU Monthly Reports Summary (Optional/Aggregated)
  CREATE TABLE IF NOT EXISTS pwmu_monthly_reports (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- YYYY-MM
    total_intake_mt REAL DEFAULT 0,
    total_processed_mt REAL DEFAULT 0,
    total_sold_mt REAL DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    total_expenditure REAL DEFAULT 0,
    village_participation_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, month_year)
  );

  CREATE TABLE IF NOT EXISTS vendor_pickups (
    id TEXT PRIMARY KEY,
    vendor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    vendor_name TEXT,
    pwmu_name TEXT NOT NULL,
    material TEXT NOT NULL,
    quantity_kg REAL DEFAULT 0,
    amount_paid REAL DEFAULT 0,
    pickup_date TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS market_availability (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    pwmu_name TEXT NOT NULL,
    material TEXT NOT NULL,
    stock_kg REAL DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    distance_km REAL DEFAULT 0,
    is_hot INTEGER DEFAULT 0,
    rate_per_kg REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, material)
  );

  CREATE TABLE IF NOT EXISTS village_workers (
    id TEXT PRIMARY KEY,
    village_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    village_name TEXT NOT NULL,
    worker_name TEXT NOT NULL,
    role TEXT DEFAULT 'Helper',
    status TEXT DEFAULT 'Present',
    log_date TEXT DEFAULT CURRENT_DATE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  -- Migration logic for existing tables: Add columns if they don't exist
  PRAGMA table_info(pwmu_centers);
  -- Handled via Javascript loop below for safety
`);

// Migration: Add columns to existing tables if they don't exist
const migrations = [
  { table: 'pwmu_centers', column: 'nodal_officer_id', type: 'TEXT' },
  { table: 'pwmu_centers', column: 'village', type: 'TEXT' },
  { table: 'pwmu_centers', column: 'recovery_rate', type: 'REAL DEFAULT 75' },
  { table: 'waste_collections', column: 'pwmu_id', type: 'TEXT' },
  { table: 'waste_collections', column: 'village', type: 'TEXT' },
  { table: 'waste_collections', column: 'shared_with_pwmu_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'metal_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'glass_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'ewaste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'other_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'updated_at', type: 'TEXT DEFAULT CURRENT_TIMESTAMP' },
  { table: 'users', column: 'latitude', type: 'REAL' },
  { table: 'users', column: 'longitude', type: 'REAL' },
  { table: 'pwmu_centers', column: 'latitude', type: 'REAL' },
  { table: 'pwmu_centers', column: 'longitude', type: 'REAL' },
  { table: 'pwmu_operational_logs', column: 'processed_stock_breakdown', type: 'TEXT' },
  { table: 'monthly_reports', column: 'collection_data', type: 'TEXT' },
  { table: 'monthly_reports', column: 'closing_stock', type: 'TEXT' },
  { table: 'monthly_reports', column: 'process_loss_kg', type: 'REAL DEFAULT 0' }
];

migrations.forEach(m => {
  try {
    const columns = db.prepare(`PRAGMA table_info(${m.table})`).all();
    if (!columns.some(c => c.name === m.column)) {
      console.log(`Migrating: Adding ${m.column} to ${m.table}...`);
      db.exec(`ALTER TABLE ${m.table} ADD COLUMN ${m.column} ${m.type}`);
    }
  } catch (e) {
    console.warn(`Migration failed for ${m.table}.${m.column}:`, e.message);
  }
});

// Helper to generate simple UUID-like strings
const uuid = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Seed data
const passwordHash = bcrypt.hashSync('admin123', 10);

// Admin user
const adminId = 'admin_user_id';
const primaryPwmuId = 'pwmu_balod'; // Standardized ID for Balod Center
const adminRegData = JSON.stringify({
  pwmuId: primaryPwmuId,
  district: 'Balod',
  block: 'Gunderdehi',
  gramPanchayat: 'Gunderdehi',
  villageName: 'Balod Center'
});

const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users (id, email, password_hash, full_name, role, status, registration_data)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertUser.run(adminId, 'superadmin@cgpwmu.com', passwordHash, 'State Administrator', 'StateAdmin', 'approved', adminRegData);

// Seed PWMUs with stable IDs
const pwmuData = [
  [primaryPwmuId, 'Balod Central PWMU', 'Balod', 'Gunderdehi', 'Gunderdehi', 'Gunderdehi', 50, 42.5, 38.2, 425000, 180000, 'operational', adminId],
  ['pwmu_durg', 'Durg Central PWMU', 'Durg', 'Durg', 'Durg', 'Durg', 80, 68.3, 55.1, 680000, 310000, 'operational', null],
  ['pwmu_bemetara', 'Bemetara PWMU', 'Bemetara', 'Bemetara', 'Bemetara', 'Bemetara', 35, 28.7, 24.5, 287000, 125000, 'operational', null],
  ['pwmu_raipur', 'Raipur East PWMU', 'Raipur', 'Arang', 'Arang', 'Arang', 100, 85.2, 72.8, 852000, 400000, 'operational', null],
  ['pwmu_korba', 'Korba PWMU', 'Korba', 'Korba', 'Korba', 'Korba', 45, 32.1, 28.9, 321000, 155000, 'maintenance', null],
  ['pwmu_bilaspur', 'Bilaspur PWMU', 'Bilaspur', 'Bilaspur', 'Bilaspur', 'Bilaspur', 60, 51.8, 45.3, 518000, 240000, 'operational', null]
];

const insertPWMU = db.prepare(`
  INSERT OR REPLACE INTO pwmu_centers (id, name, district, block, gram_panchayat, village, capacity_mt, waste_processed_mt, waste_sold_mt, revenue, expenditure, status, nodal_officer_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const row of pwmuData) insertPWMU.run(...row);

// Market availability will be populated via PWMU Daily Logs
db.exec('DELETE FROM market_availability');

console.log('Database initialized successfully.');
db.close();
