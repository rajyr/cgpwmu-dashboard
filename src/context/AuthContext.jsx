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
    const [userName, setUserName] = useState(null);
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
                            await fetchUserProfile(session.user.id, session.access_token, session.user.email);
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

    // Determine the user's role, name, and status from the `users` table
    const fetchUserProfile = async (userId, accessToken, email) => {
        const roleFromEmail = deriveRoleFromEmail(email);
        console.log('[AUTH] fetchUserProfile called for:', email, 'userId:', userId);

        try {
            const proxyUrl = getProxyUrl();
            const response = await fetch(
                `${proxyUrl}/rest/v1/users?id=eq.${userId}&select=role,full_name,status`,
                {
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(8000),
                }
            );

            console.log('[AUTH] Profile fetch HTTP status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('[AUTH] Profile data:', JSON.stringify(data));

                if (data && data.length > 0) {
                    const profile = data[0];
                    console.log('[AUTH] ✅ User found — role:', profile.role, 'status:', profile.status);
                    if (profile.role) setUserRole(profile.role);
                    if (profile.full_name) setUserName(profile.full_name);
                    return profile;
                }

                // Query OK but empty — no row in DB for this user
                console.warn('[AUTH] ⚠️ No row found in users table. Blocking as pending.');
                setUserRole(roleFromEmail);
                return { role: roleFromEmail, status: 'pending' };
            } else {
                // Non-OK response (RLS 403, auth 401, etc.)
                const errBody = await response.text().catch(() => '');
                console.warn('[AUTH] ❌ Server error:', response.status, errBody);
                setUserRole(roleFromEmail);
                return { role: roleFromEmail, status: 'pending' };
            }
        } catch (error) {
            // True network failure / timeout
            console.warn('[AUTH] 🌐 Network error:', error.message);
            setUserRole(roleFromEmail);
            return { role: roleFromEmail, status: 'approved' };
        }
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

    // Sign In — bypasses the Supabase JS SDK, uses direct fetch to the proxy
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
                signal: AbortSignal.timeout(12000),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.msg || data.error_description || data.message || 'Invalid login credentials');
        }

        // Fetch profile to check approval status BEFORE allowing login
        const profile = await fetchUserProfile(data.user.id, data.access_token, data.user.email);

        if (profile.status === 'pending') {
            throw new Error('Your account is pending admin approval. Please wait for the administrator to approve your registration.');
        }
        if (profile.status === 'rejected') {
            throw new Error('Your account registration was rejected. Please contact the administrator.');
        }

        // Save session to localStorage for persistence
        localStorage.setItem('cgpwmu_session', JSON.stringify(data));
        setUser(data.user);

        return { ...data, resolvedRole: profile.role };
    };

    // Sign Up — creates auth user + inserts into users table with pending status
    const signUp = async (email, password, { full_name, role, district, phone_number, registration_data } = {}) => {
        const proxyUrl = getProxyUrl();

        // 1. Create auth user
        const authResponse = await fetch(
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
        const authData = await authResponse.json();
        if (!authResponse.ok) {
            throw new Error(authData.msg || authData.error_description || 'Registration failed');
        }

        // 2. Insert into public.users table with pending status
        const token = authData.access_token || ANON_KEY;
        const userId = authData.user?.id;
        if (userId) {
            const insertResponse = await fetch(
                `${proxyUrl}/rest/v1/users`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify({
                        id: userId,
                        full_name: full_name || '',
                        role: role || 'DistrictNodal',
                        status: 'pending',
                        district: district || null,
                        phone_number: phone_number || null,
                        registration_data: registration_data || null,
                    }),
                    signal: AbortSignal.timeout(8000),
                }
            );

            if (!insertResponse.ok) {
                const errData = await insertResponse.json().catch(() => ({}));
                console.error('Failed to insert user profile:', errData);
                throw new Error('Registration partially failed — could not save your profile. Please try again or contact the administrator.');
            }
        }

        return authData;
    };

    // Sign Out
    const signOut = async () => {
        // Clear local session regardless of server response
        localStorage.removeItem('cgpwmu_session');
        setUser(null);
        setUserRole(null);
        setUserName(null);

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
        userName,
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
