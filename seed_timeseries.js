import Database from 'better-sqlite3';

const db = new Database('server/database.sqlite');

console.log('Seeding monthly reports for Financial Sustainability...');

db.pragma('foreign_keys = OFF');

// Clear existing
db.exec('DELETE FROM village_waste_reports');
db.exec('DELETE FROM vendor_pickups');
db.exec('DELETE FROM monthly_reports');
db.exec('DELETE FROM village_monthly_reports');

const pwmuIds = ['pwmu_balod', 'pwmu_durg', 'pwmu_bemetara', 'pwmu_raipur', 'pwmu_korba', 'pwmu_bilaspur', 'pwmu_raj_korea_vyrt'];
const pwmuNames = {
    'pwmu_balod': 'Balod Central PWMU',
    'pwmu_durg': 'Durg Central PWMU',
    'pwmu_bemetara': 'Bemetara PWMU',
    'pwmu_raipur': 'Raipur East PWMU',
    'pwmu_korba': 'Korba PWMU',
    'pwmu_bilaspur': 'Bilaspur PWMU',
    'pwmu_raj_korea_vyrt': 'Raj Korea'
};

const insertIntake = db.prepare(`
    INSERT INTO village_waste_reports (id, village_id, village_name, pwmu_id, district, collection_date, wet_waste_kg, dry_waste_kg, shared_with_pwmu_kg, submitted, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertPickup = db.prepare(`
    INSERT INTO vendor_pickups (id, vendor_id, vendor_name, pwmu_name, material, quantity_kg, amount_paid, pickup_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertMonthly = db.prepare(`
    INSERT INTO monthly_reports (id, pwmu_id, report_month, report_year, total_revenue, total_expenses, net_balance, submitted_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Helper for random in range
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Seed data for Feb and March 2026
const dates = [
    '2026-02-01', '2026-02-05', '2026-02-10', '2026-02-15', '2026-02-20', '2026-02-25',
    '2026-03-01', '2026-03-05', '2026-03-10', '2026-03-15', '2026-03-19'
];

const pwmus = db.prepare('SELECT id, name, district FROM pwmu_centers').all();

dates.forEach((date, di) => {
    pwmus.forEach((pwm, pi) => {
        const id = `intake_${di}_${pi}`;
        const intakeVal = rnd(100, 600);
        insertIntake.run(id, `village_${pi}`, `Village ${pi}`, pwm.id, pwm.district, date, intakeVal/2, intakeVal/2, intakeVal, 1, 'confirmed');

        if (di % 2 === 0) {
            const pid = `pickup_${di}_${pi}`;
            const qty = rnd(50, 400);
            insertPickup.run(pid, 'vendor_1', 'Eco Recycle', pwm.name, 'PET', qty, qty * 12, date);
        }
    });
});

// Seed Monthly Reports
['February', 'March'].forEach((month, mi) => {
    pwmus.forEach((pwm, pi) => {
        const id = `monthly_${mi}_${pi}`;
        const rev = rnd(15000, 45000);
        const exp = rnd(10000, 30000);
        insertMonthly.run(id, pwm.id, month, 2026, rev, exp, rev - exp, 'admin_user_id');
    });
});

db.pragma('foreign_keys = ON');
console.log('Seeding completed.');
db.close();
