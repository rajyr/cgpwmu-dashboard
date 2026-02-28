import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rolesToCreate = [
    { email: 'admin@cgpwmu.in', password: 'Password123!', role: 'StateAdmin' },
    { email: 'nodal@cgpwmu.in', password: 'Password123!', role: 'Nodal' },
    { email: 'pwmu@cgpwmu.in', password: 'Password123!', role: 'PWMU' },
    { email: 'village@cgpwmu.in', password: 'Password123!', role: 'Village' },
    { email: 'vendor@cgpwmu.in', password: 'Password123!', role: 'Vendor' },
];

async function seed() {
    console.log('Starting User Registration Process...');

    for (const user of rolesToCreate) {
        console.log(`\nAttempting to create user: ${user.email} (${user.role})`);

        // 1. Sign Up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });

        if (authError) {
            console.error(`❌ Registration failed for ${user.email}:`, authError.message);
            // If they already exist, we still try to upsert their role just in case
            if (authError.message.includes('already registered')) {
                console.log(`   User already exists. Attempting to assign role anyway...`);
                // To assign role, we need their user ID. We can try to sign in to get their ID.
                const { data: loginData } = await supabase.auth.signInWithPassword({
                    email: user.email,
                    password: user.password
                });

                if (loginData?.user) {
                    await assignRole(loginData.user.id, user.email, user.role);
                }
            }
            continue;
        }

        if (authData?.user) {
            console.log(`✅ Registration successful. User ID: ${authData.user.id}`);
            await assignRole(authData.user.id, user.email, user.role);
        }
    }

    console.log('\nSeed process completed!');
}

async function assignRole(id, email, role) {
    const { error: dbError } = await supabase
        .from('users')
        .upsert({ id: id, role: role, full_name: `Test ${role}` });

    if (dbError) {
        console.error(`❌ Failed to assign role '${role}' to ${email}:`, dbError.message);
    } else {
        console.log(`✅ Successfully assigned role '${role}' to ${email}`);
    }
}

seed();
