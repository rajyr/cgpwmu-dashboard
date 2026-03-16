const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'server', 'database.sqlite');
const db = new Database(dbPath);

try {
    console.log("Verifying schema for table: market_availability");
    const info = db.prepare("PRAGMA table_info(market_availability)").all();
    console.log("Columns:", info.map(c => c.name).join(', '));
    
    if (info.some(c => c.name === 'pwmu_id')) {
        console.log("SUCCESS: pwmu_id column exists.");
    } else {
        console.error("FAILURE: pwmu_id column NOT found.");
    }
} catch (e) {
    console.error("Error:", e.message);
} finally {
    db.close();
}
