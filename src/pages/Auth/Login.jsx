import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Building2, Home as HomeIcon, Truck, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [activeRole, setActiveRole] = useState('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const roles = [
        { id: 'admin', label: 'Admin / Nodal', icon: Shield },
        { id: 'pwmu', label: 'PWMU Center', icon: Building2 },
        { id: 'village', label: 'Village Sarpanch', icon: HomeIcon },
        { id: 'vendor', label: 'Vendor / Market', icon: Truck },
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // Attempt to sign in via Supabase Auth with a forced timeout to prevent infinite hanging
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Connection to authentication server timed out. Please check your network.')), 15000)
            );

            await Promise.race([
                signIn(email, password),
                timeoutPromise
            ]);

            // If successful, route users to their specific hub based on the selected role tab
            // Note: In a fully production app, we would verify `activeRole` matches `userRole` from context
            switch (activeRole) {
                case 'admin':
                    navigate('/dashboard');
                    break;
                case 'pwmu':
                    navigate('/dashboard/pwmu');
                    break;
                case 'village':
                    navigate('/dashboard/village-hub');
                    break;
                case 'vendor':
                    navigate('/dashboard/vendor-hub');
                    break;
                default:
                    navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login Error:', error.message);
            setErrorMsg(error.message || 'Invalid login credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[100px] opacity-60"></div>

            <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row relative z-10 min-h-[600px]">

                {/* Left Side - Branding / Info */}
                <div className="md:w-5/12 bg-gradient-to-br from-[#005DAA] to-[#00427A] p-10 flex flex-col justify-between relative overflow-hidden text-white hidden md:flex">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-48 h-48 bg-[#FF9933]/20 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                        <img src="/assets/Logo/CGPWMUlogo.webp" alt="CG-PWMU Logo" className="h-16 w-auto object-contain bg-white rounded-lg p-2 mb-8 shadow-md" />
                        <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                        <p className="text-blue-100 text-sm leading-relaxed mb-6">
                            Sign in to access your personalized dashboard. The CG-PWMU Digital Platform streamlines plastic waste management tracking, reporting, and market linkages across Chhattisgarh.
                        </p>
                    </div>

                    <div className="relative z-10 border-t border-white/20 pt-6 mt-8">
                        <p className="text-sm text-blue-100 flexitems-center gap-2">
                            Need help? <a href="#" className="font-semibold text-white hover:underline">Contact Support</a>
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-7/12 p-8 lg:p-12 flex flex-col pt-8">
                    <div className="text-center md:text-left mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Sign In to Dashboard</h3>
                        <p className="text-sm text-gray-500 mt-1">Select your portal role to continue</p>
                    </div>

                    {/* Role Selection Tabs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
                        {roles.map((role) => {
                            const Icon = role.icon;
                            const isActive = activeRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setActiveRole(role.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${isActive
                                        ? 'border-[#005DAA] bg-[#f0f7ff] shadow-sm text-[#005DAA] ring-1 ring-[#005DAA]/20'
                                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-[#005DAA]' : 'text-gray-400'}`} />
                                    <span className={`text-[11px] font-semibold text-center leading-tight ${isActive ? 'text-[#005DAA]' : 'text-gray-600'}`}>
                                        {role.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
                        <div className="space-y-5">
                            {errorMsg && (
                                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 font-medium">
                                    {errorMsg}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {activeRole === 'village' ? 'Gram Panchayat ID / Email' : 'Email Address'}
                                </label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-all"
                                        placeholder={`Enter your ${activeRole === 'village' ? 'ID or email' : 'email'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <a href="#" className="text-[12px] text-[#005DAA] hover:underline font-medium">Forgot Password?</a>
                                </div>
                                <div className="relative">
                                    <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-2.5 px-4 bg-[#005DAA] hover:bg-[#00427A] disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors shadow-sm mt-6 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Registration Link */}
                    <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
                        Don't have an account or need to register a new entity? <br className="hidden md:block" />
                        <Link to="/register" className="text-[#FF9933] font-semibold hover:underline mt-1 inline-block">Go to Registration Portal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
