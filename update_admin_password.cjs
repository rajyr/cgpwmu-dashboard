const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

const email = 'admin@cgpwmu.com';
const newPassword = 'Password123!';
const salt = 10;
const hash = bcrypt.hashSync(newPassword, salt);

try {
    const info = db.prepare('UPDATE users SET password_hash = ? WHERE email = ?').run(hash, email);
    if (info.changes > 0) {
        console.log(`Password updated successfully for ${email}`);
    } else {
        console.log(`User ${email} not found.`);
    }
} catch (error) {
    console.error('Error updating password:', error);
} finally {
    db.close();
}
