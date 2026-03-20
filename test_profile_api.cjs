const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-super-secret-key-change-this';
const userId = 'pwmu_raj_korea';
const token = jwt.sign({ id: userId, email: 'koreapwmu@test.com', role: 'PWMUManager' }, JWT_SECRET, { expiresIn: '1h' });

const updateData = JSON.stringify({
    full_name: 'Raj Korea Updated Final',
    phone_number: '9876543210',
    registration_data: {
        capacity: 15,
        hasFatka: true,
        block: 'Baikunthpur'
    }
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/cgpwmu/api/users/profile',
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updateData)
    }
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data);
        if (res.statusCode === 200) {
            process.exit(0);
        } else {
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('Problem with request:', e.message);
    process.exit(1);
});

req.write(updateData);
req.end();
