import { createClient } from '@supabase/supabase-js';

// Accessing environment variables in Vite uses import.meta.env
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// BYPASS FIREWALL: If running in development, route ALL requests through Vite proxy
if (import.meta.env.DEV) {
    supabaseUrl = `${window.location.origin}/supabase`;
}

// Check if variables are present
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        'Supabase URL or Anon Key is missing. Ensure you have created a .env.local file in the root directory with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
}

// Custom fetch with timeout — prevents infinite hangs from network blocks
const fetchWithTimeout = (url, options = {}) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout
    return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeout));
};

// Create and export the Supabase client
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
        global: {
            fetch: fetchWithTimeout, // Force all SDK HTTP calls through our timeout wrapper
        },
        realtime: {
            params: {
                eventsPerSecond: 0, // Disable realtime to prevent direct WebSocket connections
            },
        },
    }
);
