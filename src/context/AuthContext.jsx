import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

const API_URL = '/cgpwmu/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const restoreSession = async () => {
            try {
                const savedSession = localStorage.getItem('cgpwmu_session');
                if (savedSession) {
                    const session = JSON.parse(savedSession);
                    if (session.access_token && session.user) {
                        if (isMounted) {
                            setUser(session.user);
                            setUserRole(session.user.role);
                            // Verify session with server
                            await fetchUserProfile(session.access_token);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to restore session:', err);
                localStorage.removeItem('cgpwmu_session');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    const fetchUserProfile = async (accessToken) => {
        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const profile = await response.json();
                setUser(profile);
                setUserRole(profile.role);
                
                // Persist updated profile to session
                const savedSession = localStorage.getItem('cgpwmu_session');
                if (savedSession) {
                    const session = JSON.parse(savedSession);
                    session.user = profile;
                    localStorage.setItem('cgpwmu_session', JSON.stringify(session));
                }
                
                return { ...profile, status: 'approved' };
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch profile' }));
                console.error('Profile fetch error:', errorData.error);
                return { status: 'error' };
            }
        } catch (error) {
            console.error('Profile fetch network error:', error);
            return { status: 'error' };
        }
    };

    const signIn = async (email, password) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: `Login failed (Status ${response.status})` }));
            throw new Error(errorData.error || 'Invalid login credentials');
        }

        const data = await response.json();

        if (data.user.status === 'pending') {
            throw new Error('Your account is pending admin approval.');
        }

        localStorage.setItem('cgpwmu_session', JSON.stringify(data));
        setUser(data.user);
        setUserRole(data.user.role);

        return { ...data, resolvedRole: data.user.role };
    };

    const signUp = async (email, password, userData = {}) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, ...userData }),
        });

        const data = await response.json().catch(() => ({ error: 'Registration failed' }));
        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        return data;
    };

    const signOut = async () => {
        localStorage.removeItem('cgpwmu_session');
        setUser(null);
        setUserRole(null);
        setUserName(null);
    };

    const value = {
        user,
        userRole,
        userName,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile: () => {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            if (session.access_token) return fetchUserProfile(session.access_token);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#005DAA] border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-[#005DAA] font-semibold">Connecting to local server...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

