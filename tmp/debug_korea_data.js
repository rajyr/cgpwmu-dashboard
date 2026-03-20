import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const db = require('better-sqlite3')('server/database.sqlite');

console.log('--- SARPANCH LINK RESEARCH ---');

const sarpanches = db.prepare("SELECT id, full_name, registration_data FROM users WHERE role = 'Sarpanch'").all();
console.log('Found ' + sarpanches.length + ' Sarpanches.');

sarpanches.forEach(s => {
    console.log('\nName:', s.full_name);
    console.log('Data:', s.registration_data);
});
