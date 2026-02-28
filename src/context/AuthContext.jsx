import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null); // 'StateAdmin', 'Village', 'Vendor', etc.
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

        // Fetch current session on mount 
        const getSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) console.error('Supabase getSession error:', error);

                if (session && isMounted) {
                    setUser(session.user);
                    await fetchUserRole(session.user.id);
                }
            } catch (err) {
                console.error('Failed to connect to Supabase backend:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes (Login, Logout, Token Refresh)
        const { data } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                try {
                    if (session && isMounted) {
                        setUser(session.user);
                        await fetchUserRole(session.user.id);
                    } else if (isMounted) {
                        setUser(null);
                        setUserRole(null);
                    }
                } catch (err) {
                    console.error('Error during auth state change:', err);
                } finally {
                    if (isMounted) setLoading(false);
                }
            }
        );

        return () => {
            isMounted = false;
            clearTimeout(failsafeTimer);
            if (data?.subscription) data.subscription.unsubscribe();
        };
    }, []);

    // Fetch the extended user profile (e.g., Role) from the `users` table
    const fetchUserRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (data) {
                setUserRole(data.role);
            }
        } catch (error) {
            console.error('Error fetching user role:', error.message);
            // Removed: setUserRole('Village'); // This was a bypass for firewall
        }
    };

    // --- Authentication Methods ---

    // 1. Sign Up (Used currently during registration workflows)
    const signUp = async (email, password, roleData) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        // If signup is successful, we theoretically insert their role into the custom 'users' table.
        // For security, this is often done via a Supabase Database Trigger on auth.users in production.
        return data;
    };

    // 2. Sign In 
    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    };

    // 3. Sign Out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        userRole, // Exposing the role for Sidebar RBAC
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
