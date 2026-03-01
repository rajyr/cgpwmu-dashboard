import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Build the proxy base URL for direct fetch calls
const getProxyUrl = () => {
    if (import.meta.env.DEV) {
        return `${window.location.origin}/supabase`;
    }
    return import.meta.env.VITE_SUPABASE_URL;
};

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Failsafe: if Supabase takes more than 4 seconds, force UI to render
        const failsafeTimer = setTimeout(() => {
            if (isMounted && loading) {
                console.warn('Supabase auth is taking too long to respond. Bypassing loading screen.');
                setLoading(false);
            }
        }, 4000);

        // Try to restore session from localStorage
        const restoreSession = async () => {
            try {
                // First try to get saved tokens from localStorage
                const savedSession = localStorage.getItem('cgpwmu_session');
                if (savedSession) {
                    const session = JSON.parse(savedSession);
                    if (session.access_token && session.user) {
                        if (isMounted) {
                            setUser(session.user);
                            await fetchUserRole(session.user.id, session.access_token, session.user.email);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to restore session:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
            clearTimeout(failsafeTimer);
        };
    }, []);

    // Determine the user's role — tries the `users` table first, falls back to email-based mapping
    const fetchUserRole = async (userId, accessToken, email) => {
        // 1. Try fetching from the `users` table
        try {
            const proxyUrl = getProxyUrl();
            const response = await fetch(
                `${proxyUrl}/rest/v1/users?id=eq.${userId}&select=role`,
                {
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(5000),
                }
            );
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0 && data[0].role) {
                    setUserRole(data[0].role);
                    return data[0].role;
                }
            }
        } catch (error) {
            console.warn('Could not fetch role from users table, using email mapping:', error.message);
        }

        // 2. Fallback: derive role from email prefix
        const roleFromEmail = deriveRoleFromEmail(email);
        setUserRole(roleFromEmail);
        return roleFromEmail;
    };

    // Map email prefixes to roles
    const deriveRoleFromEmail = (email) => {
        if (!email) return 'DistrictNodal'; // safe default
        const prefix = email.split('@')[0].toLowerCase();
        if (prefix.includes('admin') || prefix.includes('state')) return 'StateAdmin';
        if (prefix.includes('nodal') || prefix.includes('district')) return 'DistrictNodal';
        if (prefix.includes('pwmu') || prefix.includes('manager')) return 'PWMUManager';
        if (prefix.includes('village') || prefix.includes('sarpanch')) return 'Sarpanch';
        if (prefix.includes('vendor') || prefix.includes('market')) return 'Vendor';
        return 'DistrictNodal'; // safe default for unknown
    };

    // --- Authentication Methods ---

    // Sign In — bypasses the Supabase JS SDK entirely, uses direct fetch to the proxy
    const signIn = async (email, password) => {
        const proxyUrl = getProxyUrl();
        const response = await fetch(
            `${proxyUrl}/auth/v1/token?grant_type=password`,
            {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                signal: AbortSignal.timeout(12000), // Hard 12s timeout
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error_description || data.message || 'Invalid login credentials');
        }

        // Save session to localStorage for persistence
        localStorage.setItem('cgpwmu_session', JSON.stringify(data));

        // Set user state
        setUser(data.user);

        // Fetch role (with email fallback)
        const role = await fetchUserRole(data.user.id, data.access_token, data.user.email);

        return { ...data, resolvedRole: role };
    };

    // Sign Up
    const signUp = async (email, password) => {
        const proxyUrl = getProxyUrl();
        const response = await fetch(
            `${proxyUrl}/auth/v1/signup`,
            {
                method: 'POST',
                headers: {
                    'apikey': ANON_KEY,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                signal: AbortSignal.timeout(12000),
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.msg || data.error_description || 'Signup failed');
        }
        return data;
    };

    // Sign Out
    const signOut = async () => {
        // Clear local session regardless of server response
        localStorage.removeItem('cgpwmu_session');
        setUser(null);
        setUserRole(null);

        // Try to invalidate server-side session too (non-blocking)
        try {
            const savedSession = localStorage.getItem('cgpwmu_session');
            const token = savedSession ? JSON.parse(savedSession).access_token : null;
            if (token) {
                const proxyUrl = getProxyUrl();
                fetch(`${proxyUrl}/auth/v1/logout`, {
                    method: 'POST',
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                    signal: AbortSignal.timeout(5000),
                }).catch(() => { }); // Fire and forget
            }
        } catch (e) {
            // Ignore — local state is already cleared
        }
    };

    const value = {
        user,
        userRole,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#005DAA] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-[#005DAA] font-semibold">Connecting to CG-PWMU...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
