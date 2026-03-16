const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        resolve(data);
                    }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', reject);
    });
}

const BASE_URL = 'http://127.0.0.1:5000/cgpwmu/api';

async function checkMockData() {
    try {
        console.log("Checking local mock database via API...");
        
        console.log("\n--- MARKET AVAILABILITY ---");
        const market = await get(`${BASE_URL}/data/market_availability`);
        console.log(JSON.stringify(market, null, 2));

        console.log("\n--- PWMU CENTERS ---");
        const centers = await get(`${BASE_URL}/data/pwmu_centers`);
        console.log(JSON.stringify(centers, null, 2));

        console.log("\n--- USERS ---");
        const users = await get(`${BASE_URL}/data/users`);
        console.log(JSON.stringify(users.map(u => ({ id: u.id, email: u.email, name: u.registration_data?.pwmuName })), null, 2));

    } catch (err) {
        console.error("API Error:", err.message);
    }
}

checkMockData();
