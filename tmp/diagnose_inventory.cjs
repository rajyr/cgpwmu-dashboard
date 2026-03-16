const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'server', 'database.sqlite');
const db = new Database(dbPath);

let output = '';

const pwmuUsers = db.prepare(`SELECT id, email, full_name, role, status FROM users WHERE role = 'PWMUManager'`).all();
output += '\n=== PWMU USERS ===\n';
pwmuUsers.forEach(u => output += `  id=${u.id} | email=${u.email} | name=${u.full_name}\n`);

output += '\n=== PWMU CENTERS ===\n';
const centers = db.prepare(`SELECT id, name, nodal_officer_id FROM pwmu_centers`).all();
centers.forEach(c => output += `  id=${c.id} | name=${c.name} | nodal_officer_id=${c.nodal_officer_id}\n`);

output += '\n=== MARKET AVAILABILITY ===\n';
const market = db.prepare(`SELECT id, pwmu_id, pwmu_name, material, stock_kg FROM market_availability`).all();
if (market.length === 0) {
  output += '  *** EMPTY TABLE - no inventory data saved ***\n';
} else {
  market.forEach(m => output += `  pwmu_id=${m.pwmu_id} | material=${m.material} | stock_kg=${m.stock_kg} | pwmu_name=${m.pwmu_name}\n`);
}

output += '\n=== CROSS REFERENCE (PWMU User → Center → Market) ===\n';
pwmuUsers.forEach(u => {
  const byNodal = db.prepare(`SELECT id FROM pwmu_centers WHERE nodal_officer_id = ?`).get(u.id);
  const byId = db.prepare(`SELECT id FROM pwmu_centers WHERE id = ?`).get(u.id);
  const mktByUser = db.prepare(`SELECT material, stock_kg FROM market_availability WHERE pwmu_id = ?`).all(u.id);
  
  output += `\nUser: ${u.email} (id=${u.id})\n`;
  output += `  pwmu_centers by nodal_officer_id: ${byNodal ? byNodal.id : 'NOT FOUND'}\n`;
  output += `  pwmu_centers by user.id: ${byId ? byId.id : 'NOT FOUND'}\n`;
  output += `  market_availability by user.id: ${mktByUser.length === 0 ? 'NONE' : JSON.stringify(mktByUser)}\n`;
  
  if (byNodal) {
    const mktByCenter = db.prepare(`SELECT material, stock_kg FROM market_availability WHERE pwmu_id = ?`).all(byNodal.id);
    output += `  market_availability by center id: ${mktByCenter.length === 0 ? 'NONE' : JSON.stringify(mktByCenter)}\n`;
  }
});

fs.writeFileSync(path.join(__dirname, 'diag_output.txt'), output);
console.log('Written to tmp/diag_output.txt');
console.log(output);
db.close();
