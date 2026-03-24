import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'server', 'database.sqlite');
const db = new Database(dbPath);

const results = {
    centers: [],
    roles: [],
    villageUsers: []
};

try {
    results.centers = db.prepare("SELECT id, name FROM pwmu_centers").all();
    results.roles = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();
    
    const users = db.prepare("SELECT id, email, role, registration_data FROM users").all();
    results.villageUsers = users.filter(u => u.role === 'VillageUser' || u.role === 'Sarpanch').map(u => {
        let reg = {};
        try { 
            reg = typeof u.registration_data === 'string' ? JSON.parse(u.registration_data) : (u.registration_data || {});
        } catch (e) {}
        return {
            id: u.id,
            role: u.role,
            email: u.email,
            pwmuId: reg.pwmuId,
            regData: reg
        };
    });

    fs.writeFileSync('debug_results.json', JSON.stringify(results, null, 2));
    console.log('Results written to debug_results.json');
} catch (error) {
    console.error('Error:', error.message);
} finally {
    db.close();
}
