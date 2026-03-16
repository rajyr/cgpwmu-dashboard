const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to load from .env in project root
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.error(".env not found at", envPath);
    process.exit(1);
}
const env = fs.readFileSync(envPath, 'utf8');
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

const url = urlMatch ? urlMatch[1].trim() : 'https://wuneyyjazetuzsqyubqx.supabase.co';
const key = keyMatch ? keyMatch[1].trim() : '';

if (!key) {
    console.error("Key not found in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

async function checkData() {
    try {
        console.log("Checking market_availability...");
        const { data: market, error: mError } = await supabase.from('market_availability').select('*');
        if (mError) {
            console.error("Market Error:", mError);
        } else {
            console.log("Market Data:", JSON.stringify(market, null, 2));
        }

        console.log("\nChecking daily logs (first 5)...");
        const { data: logs, error: lError } = await supabase.from('pwmu_operational_logs').select('*').limit(5);
        if (lError) {
            console.error("Logs Error:", lError);
        } else {
            console.log("Daily Logs:", JSON.stringify(logs, null, 2));
        }
    } catch (err) {
        console.error("Script exception:", err);
    }
}

checkData();
