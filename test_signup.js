const API_URL = 'http://localhost:5000/cgpwmu/api';

async function testSignup() {
    const testEmail = `test_vendor_${Date.now()}@test.com`;
    const userData = {
        full_name: 'Test Vendor',
        role: 'Vendor',
        district: 'Test District',
        registration_data: {
            firmName: 'Test Vendor Firm',
            partnered_pwmus: ['pwmu_test'],
            type: 'Vendor',
            status: 'approved'
        }
    };

    console.log(`Attempting signup with email: ${testEmail}`);

    try {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testEmail, password: 'password123', ...userData }),
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

testSignup();
