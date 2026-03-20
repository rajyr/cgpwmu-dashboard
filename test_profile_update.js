import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const JWT_SECRET = 'your-super-secret-key-change-this';
const userId = 'pwmu_raj_korea';
const token = jwt.sign({ id: userId, email: 'koreapwmu@test.com', role: 'PWMUManager' }, JWT_SECRET, { expiresIn: '1h' });

const updateData = {
    full_name: 'Raj Korea Updated',
    phone_number: '9999999999',
    registration_data: {
        capacity: 10,
        hasBaler: true,
        block: 'Baikunthpur'
    }
};

console.log('Testing PUT /cgpwmu/api/users/profile...');
fetch('http://localhost:5000/cgpwmu/api/users/profile', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
})
.then(res => res.json())
.then(json => {
    console.log('Response:', json);
    if (json.message === 'Profile updated successfully') {
        process.exit(0);
    } else {
        process.exit(1);
    }
})
.catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
