const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join('f:/UNICEF-AILSG/PWMU report/PWMUapp2/server', 'database.sqlite');
const db = new Database(dbPath);

// Patch: Link pwmu_balod center to adjalpwmu@pwmu.in user (id=ok5bj41tnb)
const userId = 'ok5bj41tnb';
const centerId = 'pwmu_balod';

// 1. Set nodal_officer_id
const r1 = db.prepare('UPDATE pwmu_centers SET nodal_officer_id = ? WHERE id = ?').run(userId, centerId);
console.log(`Updated pwmu_centers: ${r1.changes} rows changed`);

// 2. Verify
const c = db.prepare('SELECT id, name, nodal_officer_id FROM pwmu_centers WHERE id = ?').get(centerId);
console.log('Updated center:', JSON.stringify(c));

// 3. Check market_availability for this center
const market = db.prepare('SELECT pwmu_id, material, stock_kg FROM market_availability WHERE pwmu_id = ?').all(centerId);
console.log(`Market availability for ${centerId}:`, market.length === 0 ? 'EMPTY' : JSON.stringify(market));

// 4. If market is empty, we need to know why daily log wasn't saving correctly
// Check if any old market data exists under any other key  
const allMarket = db.prepare('SELECT pwmu_id, material, stock_kg FROM market_availability').all();
console.log('ALL market_availability data:', allMarket.length === 0 ? 'EMPTY' : JSON.stringify(allMarket));

db.close();
console.log('Done.');
