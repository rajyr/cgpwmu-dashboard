import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Vite uses import.meta.env
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// BYPASS FIREWALL: If running in development, route API requests through Vite proxy
if (import.meta.env.DEV) {
    supabaseUrl = `${window.location.origin}/supabase`;
}

// Check if variables are present, otherwise surface a helpful console warning during development
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase URL or Anon Key is missing. Ensure you have created a .env.local file in the root directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
}

// Create and export the Supabase client
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
