import { useState } from 'react';
import { Search, Bell, Home, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ setIsMobileOpen }) => {
    const { user, userRole, userName } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();

    const headerTranslations = {
        en: {
            home: "Home",
            search: "Search...",
            notifications: "Notifications",
            admin: "Admin",
            nodal: "Nodal Officer",
            pwmu: "PWMU Manager",
            village: "Village Shed",
            vendor: "Vendor"
        },
        hi: {
            home: "होम",
            search: "खोजें...",
            notifications: "सूचनाएं",
            admin: "प्रशासक",
            nodal: "नोडल अधिकारी",
            pwmu: "PWMU प्रबंधक",
            village: "ग्राम शेड",
            vendor: "विक्रेता"
        }
    };

    // Map database roles to friendly UI strings
    let roleKey = 'village';
    if (userRole === 'StateAdmin') roleKey = 'admin';
    else if (userRole === 'DistrictNodal') roleKey = 'nodal';
    else if (userRole === 'PWMUManager') roleKey = 'pwmu';
    else if (userRole === 'Sarpanch') roleKey = 'village';
    else if (userRole === 'Vendor') roleKey = 'vendor';

    const friendlyRole = t(roleKey, headerTranslations);

    // Notification State
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // Initialize mock notifications based on role
    const [notifications, setNotifications] = useState(() => {
        const mockNotifications = {
            StateAdmin: [
                { id: 1, title: 'New Center Registration', message: "PWMU center 'Balod North' registered and awaiting approval.", time: '2h ago', read: false },
                { id: 2, title: 'Monthly State Report', message: "Monthly State report for March 2026 is now available.", time: '5h ago', read: false },
                { id: 3, title: 'Alert: Reporting Delay', message: "3 Village Sheds in Raipur have not submitted logs for 48 hours.", time: '1d ago', read: true }
            ],
            DistrictNodal: [
                { id: 1, title: 'New Center Registration', message: "PWMU center 'Balod North' registered and awaiting approval.", time: '2h ago', read: false },
                { id: 2, title: 'Alert: Reporting Delay', message: "3 Village Sheds in Raipur have not submitted logs for 48 hours.", time: '1d ago', read: true }
            ],
            PWMUManager: [
                { id: 1, title: 'New Collection Request', message: "New waste collection request from Amora Village.", time: '30m ago', read: false },
                { id: 2, title: 'Machine Maintenance Alert', message: "Shredder #2 is due for service this week.", time: '3h ago', read: false },
                { id: 3, title: 'Vendor Confirmation', message: "Vendor 'Sona Enterprises' confirmed pickup for 5 tons of Plastic.", time: '1d ago', read: true }
            ],
            Sarpanch: [
                { id: 1, title: 'Schedule Updated', message: "Weekly collection schedule updated by PWMU Manager.", time: '1h ago', read: false },
                { id: 2, title: 'Incentive Processed', message: "Incentive payment for February has been processed successfully.", time: '4h ago', read: false },
                { id: 3, title: 'Daily Log Reminder', message: "Please update the daily processing log before 6 PM.", time: '6h ago', read: true }
            ],
            Vendor: [
                { id: 1, title: 'New Purchase Order', message: "New purchase order #PO-1042 issued by state portal.", time: '2h ago', read: false },
                { id: 2, title: 'Payment Initiated', message: "Payment for Invoice #INV-882 has been initiated.", time: '6h ago', read: false },
                { id: 3, title: 'New Tender Notification', message: "New tender for 'Multi-layer plastic' published in Raipur.", time: '2d ago', read: true }
            ]
        };
        return mockNotifications[userRole] || mockNotifications.StateAdmin;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
        setIsNotificationOpen(false);
    };

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
                    {t('home', headerTranslations)}
                </Link>
                <div className="relative group hidden md:block w-full">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder={t('search', headerTranslations)}
                        className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full text-sm bg-[#fafafa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-all"
                    />
                </div>

                {/* Institutional Logos - Desktop Only (Relocated from Dashboard Header) */}
                <div className="hidden lg:flex items-center gap-4 px-4 h-12 border-l border-gray-100 ml-2 animate-fade-in whitespace-nowrap">
                    <img
                        src="/cgpwmu/assets/Logo/Chhattisgarh.webp"
                        alt="Chhattisgarh Government"
                        className="h-10 w-auto object-contain brightness-110"
                    />
                    <div className="h-6 border-l border-gray-200"></div>
                    <img
                        src="/cgpwmu/assets/Logo/unicef.webp"
                        alt="UNICEF"
                        className="h-8 w-auto object-contain"
                    />
                </div>
            </div>

            {/* Right: Profile & Language & Notifications */}
            <div className="flex items-center gap-6 relative">
                {/* Language Toggle */}
                <button
                    onClick={toggleLanguage}
                    className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs font-bold text-gray-700 bg-white shadow-sm"
                >
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    {language === 'en' ? 'हिन्दी' : 'English'}
                </button>

                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className={`relative p-2 rounded-full transition-all ${isNotificationOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        title={t('notifications', headerTranslations)}
                    >
                        <Bell className="w-[22px] h-[22px]" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC3545] text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold animate-bounce-subtle">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsNotificationOpen(false)}></div>
                            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-scale-in">
                                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        {t('notifications', headerTranslations)}
                                        {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                    </h3>
                                    <button onClick={clearAll} className="text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors">Clear All</button>
                                </div>
                                <div className="max-h-[70vh] overflow-y-auto no-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <div 
                                                key={notification.id} 
                                                onClick={() => markAsRead(notification.id)}
                                                className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 flex gap-3 ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className={`text-sm font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>{notification.title}</h4>
                                                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2">{notification.time}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{notification.message}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                                            <Bell className="w-12 h-12 opacity-10 mb-3" />
                                            <p className="text-sm font-medium">All caught up!</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-gray-50/30 text-center border-t border-gray-50">
                                    <button className="text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors">View All Activities</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

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
