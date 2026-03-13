import Database from 'better-sqlite3';
const db = new Database('server/database.sqlite');
const logs = db.prepare("SELECT sql FROM sqlite_master WHERE name='pwmu_daily_logs'").get();
if (logs) {
  const isPlural = logs.sql.includes('pwmu_centers');
  console.log('---CHECK---');
  console.log('Contains plural "pwmu_centers":', isPlural);
  if (!isPlural) console.log('ACTUAL SQL:', logs.sql);
}
db.close();
