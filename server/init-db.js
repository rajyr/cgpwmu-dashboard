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
    nodal_officer_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    capacity_mt REAL DEFAULT 0,
    waste_processed_mt REAL DEFAULT 0,
    waste_sold_mt REAL DEFAULT 0,
    revenue REAL DEFAULT 0,
    expenditure REAL DEFAULT 0,
    recovery_rate REAL DEFAULT 75,
    status TEXT DEFAULT 'operational',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS waste_collections (
    id TEXT PRIMARY KEY,
    village_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    village_name TEXT NOT NULL,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE SET NULL,
    district TEXT,
    block TEXT,
    gram_panchayat TEXT,
    village TEXT,
    collection_date TEXT NOT NULL,
    wet_waste_kg REAL DEFAULT 0,
    dry_waste_kg REAL DEFAULT 0,
    metal_waste_kg REAL DEFAULT 0,
    glass_waste_kg REAL DEFAULT 0,
    ewaste_kg REAL DEFAULT 0,
    other_waste_kg REAL DEFAULT 0,
    shared_with_pwmu_kg REAL DEFAULT 0,
    user_charge_collected REAL DEFAULT 0,
    submitted INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, collection_date, village_name)
  );

  CREATE TABLE IF NOT EXISTS pwmu_daily_logs (
    id TEXT PRIMARY KEY,
    pwmu_id TEXT REFERENCES pwmu_centers(id) ON DELETE CASCADE,
    log_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    total_intake_kg REAL DEFAULT 0,
    reporting_count INTEGER DEFAULT 0,
    total_villages INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pwmu_id, log_date)
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
    pwmu_name TEXT NOT NULL,
    material TEXT NOT NULL,
    stock_kg REAL DEFAULT 0,
    unit TEXT DEFAULT 'kg',
    distance_km REAL DEFAULT 0,
    is_hot INTEGER DEFAULT 0,
    rate_per_kg REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
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
  { table: 'pwmu_centers', column: 'recovery_rate', type: 'REAL DEFAULT 75' },
  { table: 'waste_collections', column: 'pwmu_id', type: 'TEXT' },
  { table: 'waste_collections', column: 'village', type: 'TEXT' },
  { table: 'waste_collections', column: 'shared_with_pwmu_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'metal_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'glass_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'ewaste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'other_waste_kg', type: 'REAL DEFAULT 0' },
  { table: 'waste_collections', column: 'updated_at', type: 'TEXT DEFAULT CURRENT_TIMESTAMP' }
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
const passwordHash = bcrypt.hashSync('Password123!', 10);

// Admin user
const adminId = 'admin_user_id';
const primaryPwmuId = 'ok5bj41tnb'; // Use the ID the user already has in their session (with a 5)
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
insertUser.run(adminId, 'admin@cgpwmu.com', passwordHash, 'State Administrator', 'StateAdmin', 'approved', adminRegData);

// Seed PWMUs with stable IDs
const pwmuData = [
  [primaryPwmuId, 'Balod Central PWMU', 'Balod', 'Gunderdehi', 'Gunderdehi', 50, 42.5, 38.2, 425000, 180000, 'operational', adminId],
  ['pwmu_durg', 'Durg Central PWMU', 'Durg', 'Durg', 'Durg', 80, 68.3, 55.1, 680000, 310000, 'operational', null],
  ['pwmu_bemetara', 'Bemetara PWMU', 'Bemetara', 'Bemetara', 'Bemetara', 35, 28.7, 24.5, 287000, 125000, 'operational', null],
  ['pwmu_raipur', 'Raipur East PWMU', 'Raipur', 'Arang', 'Arang', 100, 85.2, 72.8, 852000, 400000, 'operational', null],
  ['pwmu_korba', 'Korba PWMU', 'Korba', 'Korba', 'Korba', 45, 32.1, 28.9, 321000, 155000, 'maintenance', null],
  ['pwmu_bilaspur', 'Bilaspur PWMU', 'Bilaspur', 'Bilaspur', 'Bilaspur', 60, 51.8, 45.3, 518000, 240000, 'operational', null]
];

const insertPWMU = db.prepare(`
  INSERT OR REPLACE INTO pwmu_centers (id, name, district, block, gram_panchayat, capacity_mt, waste_processed_mt, waste_sold_mt, revenue, expenditure, status, nodal_officer_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const row of pwmuData) insertPWMU.run(...row);

// CLEAN UP: Forcefully remove any PWMU center that is NOT in our stable list
const stableIds = pwmuData.map(d => `'${d[0]}'`).join(',');
console.log('Force cleaning PWMU centers...');
db.exec(`
  DELETE FROM pwmu_centers WHERE id NOT IN (${stableIds});
  DELETE FROM waste_collections WHERE pwmu_id NOT IN (SELECT id FROM pwmu_centers) AND pwmu_id != 'pwmu_balod';
  DELETE FROM pwmu_daily_logs WHERE pwmu_id NOT IN (SELECT id FROM pwmu_centers) AND pwmu_id != 'pwmu_balod';
`);

console.log('Database initialized successfully.');
db.close();
