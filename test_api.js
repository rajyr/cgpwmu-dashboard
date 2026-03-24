const API_LINK = 'http://localhost:5000/cgpwmu/api/data/pwmu_centers?select=id,name';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1bmV5eWphemV0YnFrd25qaGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTE4NzUsImV4cCI6MjA4Nzc4Nzg3NX0.13R5AFmY7PZFRqoszQkyKMdZNFkNq2iEZ0aYGR7RRtk';

async function testApi() {
    console.log('Testing PWMU Fetch API...');
    try {
        const res = await fetch(API_LINK, {
            headers: { 'apikey': ANON_KEY }
        });
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

testApi();
