import Database from 'better-sqlite3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBackup() {
    const url = process.env.BACKUP_APPSCRIPT_URL;
    if (!url) {
        console.error("Error: BACKUP_APPSCRIPT_URL not found in .env. Please set it to your Google Apps Script Web App URL.");
        process.exit(1);
    }

    const dbPath = path.join(__dirname, '../server/database.sqlite');
    if (!path.extname(dbPath)) {
        console.error("Invalid database path");
        process.exit(1);
    }

    console.log(`[Backup] Connecting to database at: ${dbPath}`);
    const db = new Database(dbPath);

    try {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();
        const backupData = {};

        for (const table of tables) {
            console.log(`[Backup] Fetching data from table: ${table.name}...`);
            backupData[table.name] = db.prepare(`SELECT * FROM ${table.name}`).all();
        }

        console.log(`[Backup] Sending ${Object.keys(backupData).length} tables to Google Apps Script...`);

        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(backupData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            const result = await response.text();
            console.log("[Backup] Success:", result);
        } else {
            const text = await response.text();
            console.error("[Backup] Failed with status:", response.status, text);
        }
    } catch (error) {
        console.error("[Backup] Error during execution:", error.message);
    } finally {
        db.close();
        console.log("[Backup] Database connection closed.");
    }
}

runBackup();
