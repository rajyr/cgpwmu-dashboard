import { Search, Bell, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ setIsMobileOpen }) => {
    const { user, userRole, userName } = useAuth();

    // Map database roles to friendly UI strings
    let friendlyRole = userRole || 'Village';
    if (friendlyRole === 'StateAdmin') friendlyRole = 'Admin';
    if (friendlyRole === 'DistrictNodal') friendlyRole = 'Nodal Officer';
    if (friendlyRole === 'PWMUManager') friendlyRole = 'PWMU Manager';
    if (friendlyRole === 'Sarpanch') friendlyRole = 'Village Admin';
    if (friendlyRole === 'Vendor') friendlyRole = 'Vendor';

    // Fallbacks if not fully loaded or no session
    const displayEmail = user?.email || 'admin@sbm.gov.in';
    const displayName = userName || friendlyRole;
    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
        : friendlyRole.slice(0, 2).toUpperCase();
    return (
        <header className="bg-white/80 backdrop-blur-md h-[80px] border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm w-full transition-all duration-300">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-4 md:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 text-gray-500 hover:text-[#005DAA] focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20 rounded-md transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
            </div>

            {/* Center: Home Link & Search */}
            <div className="flex items-center gap-8 flex-1 justify-center max-w-2xl px-8">
                <Link to="/" className="flex items-center text-gray-600 hover:text-[#005DAA] font-medium transition-colors text-sm whitespace-nowrap">
                    <Home className="w-[18px] h-[18px] mr-2" />
                    Home
                </Link>
                <div className="relative group hidden md:block w-full">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full text-sm bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-all"
                    />
                </div>
            </div>

            {/* Right: Profile & Notifications */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-[22px] h-[22px]" />
                    <span className="absolute top-1 right-1.5 w-2 h-2 bg-[#DC3545] rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-800 leading-tight capitalize">{displayName}</p>
                        <p className="text-[11px] text-gray-400">{displayEmail}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#f0ebfb] text-[#6f42c1] flex items-center justify-center font-bold text-sm uppercase">
                        {initials}
                    </div>
                </div>
            </div>
        </header>
    );
};
export default Header;
