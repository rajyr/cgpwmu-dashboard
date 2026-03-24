import dotenv from 'dotenv';
dotenv.config();
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
if (process.env.VITE_SUPABASE_ANON_KEY) {
    console.log('Key Length:', process.env.VITE_SUPABASE_ANON_KEY.length);
    console.log('Key Start:', process.env.VITE_SUPABASE_ANON_KEY.substring(0, 10));
}
