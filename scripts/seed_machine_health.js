import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../server/database.sqlite'));

const machineTypes = ['FATKA', 'BALING', 'SHREDDER', 'AGGLOM.', 'MIXER', 'GRANULAR'];

try {
    const pwmus = db.prepare('SELECT id, name, status FROM pwmu_centers').all();
    const update = db.prepare('UPDATE pwmu_centers SET machine_health = ? WHERE id = ?');

    pwmus.forEach(p => {
        const health = {};
        const isOverallOperational = p.status.toLowerCase() === 'operational';

        machineTypes.forEach(type => {
            // If overall is operational, most machines are 'good' (1), some might be 'warning' (2)
            // If overall is NOT operational, at least one machine must be 'critical' (0)
            let status = 1; // Good
            if (isOverallOperational) {
                if (Math.random() > 0.9) status = 2; // Warning
            } else {
                if (Math.random() > 0.5) status = 0; // Critical
                else if (Math.random() > 0.5) status = 2; // Warning
            }
            health[type] = status;
        });

        // Ensure at least one critical if status is not operational
        if (!isOverallOperational && !Object.values(health).includes(0)) {
            health[machineTypes[0]] = 0;
        }

        update.run(JSON.stringify(health), p.id);
        console.log(`Updated ${p.name} with health:`, health);
    });

    console.log('Machine health seeding completed.');
} catch (error) {
    console.error('Seeding error:', error);
} finally {
    db.close();
}
