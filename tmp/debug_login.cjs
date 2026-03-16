const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'server', 'database.sqlite');
const db = new Database(dbPath);

async function testLogin(email) {
  console.log(`Testing login for: ${email}`);
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      console.log('Result: User not found (Should return 401)');
      return;
    }

    console.log('User found, comparing password...');
    const isPasswordValid = await bcrypt.compare('Password123!', user.password_hash);
    console.log(`Password valid: ${isPasswordValid}`);
  } catch (error) {
    console.error('CRASH DETECTED:');
    console.error(error);
  }
}

testLogin('amorapwmu@pwmu.in');
