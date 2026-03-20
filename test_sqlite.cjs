const Database = require('better-sqlite3');
const path = require('path');

try {
    const dbPath = path.join(__dirname, 'server', 'database.sqlite');
    console.log('Testing connection to:', dbPath);
    const db = new Database(dbPath);
    const result = db.prepare('SELECT 1 as test').get();
    console.log('Success:', result);
    process.exit(0);
} catch (e) {
    console.error('FAILED TO LOAD SQLITE (CJS):', e.message);
    if (e.stack) console.error(e.stack);
    process.exit(1);
}
