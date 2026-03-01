import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Map, DollarSign, Activity,
    ShieldAlert, ScrollText, LineChart, PieChart, Settings, LogOut,
    ChevronLeft, ChevronRight, Menu, X, Home, Store
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse on small screens if not strictly mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024 && window.innerWidth >= 768) {
                setIsCollapsed(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch real userRole, userName and signOut from auth session
    const { userRole, userName, signOut } = useAuth();
    const navigate = useNavigate();

    // Default to 'Village' if null (e.g. while loading or logged out edge-case)
    let effectiveRole = userRole || 'Village';

    // Map database roles to frontend Sidebar roles
    if (effectiveRole === 'StateAdmin') effectiveRole = 'Admin';
    if (effectiveRole === 'DistrictNodal') effectiveRole = 'Nodal';
    if (effectiveRole === 'PWMUManager') effectiveRole = 'PWMU';
    if (effectiveRole === 'Sarpanch') effectiveRole = 'Village';

    const allNavItems = [
        // Main
        { name: 'State Overview', icon: LayoutDashboard, path: '/dashboard', roles: ['Admin', 'Nodal', 'PWMU', 'Village'] },

        // Advanced Analytics
        { name: 'District Directory', icon: Map, path: '/dashboard/district', roles: ['Admin', 'Nodal', 'PWMU'] },
        { name: 'Financial Analytics', icon: DollarSign, path: '/dashboard/financial', roles: ['Admin', 'Nodal', 'PWMU'] },
        { name: 'Machine Intelligence', icon: Activity, path: '/dashboard/machine', roles: ['Admin', 'Nodal', 'PWMU'] },
        { name: 'Compliance & Logs', icon: ShieldAlert, path: '/dashboard/compliance', roles: ['Admin', 'Nodal', 'PWMU'] },
        { name: 'Monitoring Hub', icon: LineChart, path: '/dashboard/monitoring', roles: ['Admin', 'Nodal', 'PWMU'] },
        { name: 'Policy & Plan', icon: ScrollText, path: '/dashboard/policy', roles: ['Admin', 'Nodal'] },

        // Stakeholders
        { name: 'Village Hub', icon: Home, path: '/dashboard/village-hub', roles: ['Admin', 'Nodal', 'PWMU', 'Village'] },
        { name: 'Vendor Hub', icon: Store, path: '/dashboard/vendor-hub', roles: ['Admin', 'Nodal', 'PWMU', 'Vendor'] },

        // System
        { name: 'Settings', icon: Settings, path: '/dashboard/settings', roles: ['Admin'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(effectiveRole));

    const isActuallyCollapsed = isCollapsed || (!isMobileOpen && window.innerWidth < 768);

    // Handle Logout
    const handleLogout = async () => {
        try {
            // Force redirection even if network is slow/blocked
            const logoutTimeout = setTimeout(() => {
                navigate('/login');
            }, 2000);

            await signOut();
            clearTimeout(logoutTimeout);
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error.message);
            // Always redirect on logout click attempt
            navigate('/login');
        }
    };

    // Helper for display
    const displayRole = userRole || effectiveRole;
    const displayName = userName || displayRole;
    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : displayRole.slice(0, 2).toUpperCase();

    // Friendly role labels for subtitle
    const roleLabelMap = {
        'StateAdmin': 'State Admin',
        'DistrictNodal': 'Nodal Officer',
        'PWMUManager': 'PWMU Manager',
        'Sarpanch': 'Village Admin',
        'Vendor': 'Vendor',
    };
    const friendlyRole = roleLabelMap[userRole] || displayRole;

    const sidebarContent = (
        <div className="flex flex-col h-full bg-transparent relative">
            {/* Header/Logo Area */}
            <div className={`flex items-center pt-6 pb-4 px-4 border-b border-gray-100 min-h-[80px] ${isActuallyCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className={`flex items-center gap-2 ${isActuallyCollapsed ? 'hidden' : 'flex'}`}>
                    <img src="/assets/Logo/CGPWMUlogosm.webp" alt="CG-PWMU Logo" className="h-10 w-auto object-contain" />
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-800 text-[15px] leading-tight text-blue-800 tracking-wide">CG-PWMU</span>
                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Dashboard</span>
                    </div>
                </div>
                {/* Collapsed Logo */}
                {isActuallyCollapsed && (
                    <img src="/assets/Logo/CGPWMUlogosm.webp" alt="CG-PWMU Logo" className="h-8 w-auto object-contain" />
                )}

                {/* Collapse Toggle Button - Desktop Only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors absolute -right-3 top-8 border border-gray-200 z-50 shadow-sm"
                >
                    {isActuallyCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Close Button - Mobile Only */}
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="md:hidden text-gray-500 hover:text-gray-900 absolute right-4 top-8"
                    style={{ display: !isMobileOpen ? 'none' : 'block' }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
                <ul className="space-y-1 mt-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.name} className="px-3">
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                            ? 'bg-[#f0f7ff] text-[#005DAA]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        } ${isActuallyCollapsed ? 'justify-center px-0' : 'px-4'}`
                                    }
                                    title={isActuallyCollapsed ? item.name : ""}
                                    onClick={() => window.innerWidth < 768 && setIsMobileOpen(false)}
                                >
                                    <Icon className={`w-5 h-5 ${isActuallyCollapsed ? '' : 'mr-3'} ${(window.location.pathname === item.path || (item.path === '/dashboard' && window.location.pathname === '/dashboard')) ? 'text-[#005DAA]' : 'group-hover:text-blue-600'
                                        }`} />
                                    {!isActuallyCollapsed && <span>{item.name}</span>}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* User Footer Profile */}
            <div className={`p-4 border-t border-gray-100 ${isActuallyCollapsed ? 'flex justify-center' : ''}`}>
                <div onClick={handleLogout} className={`flex items-center cursor-pointer hover:bg-gray-50 rounded-lg transition-colors ${isActuallyCollapsed ? 'justify-center p-1' : 'justify-between p-2'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 uppercase">
                            {initials}
                        </div>
                        {!isActuallyCollapsed && (
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-800 leading-tight truncate capitalize">{displayName}</p>
                                <p className="text-[11px] text-gray-400 truncate">{friendlyRole}</p>
                            </div>
                        )}
                    </div>
                    {!isActuallyCollapsed && <LogOut className="w-4 h-4 text-red-400 hover:text-red-600 flex-shrink-0" />}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:block transition-all duration-300 ease-in-out border-r border-gray-100 shadow-sm z-40 bg-white/80 backdrop-blur-md ${isActuallyCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {sidebarContent}
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar (Always visible as icon strip, expands on click) */}
            <aside
                className={`fixed md:hidden top-0 bottom-0 left-0 bg-white/80 backdrop-blur-md z-50 transition-all duration-300 ease-in-out shadow-lg border-r border-gray-100 ${isMobileOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'
                    }`}
            >
                {sidebarContent}
            </aside>
        </>
    );
};

export default Sidebar;
