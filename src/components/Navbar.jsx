import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language, toggleLanguage, t } = useLanguage();

    const navTranslations = {
        en: {
            home: "Home",
            about: "About Us",
            dashboard: "Dashboard",
            login: "Login",
            register: "Register",
            platform: "Digital Platform"
        },
        hi: {
            home: "होम",
            about: "हमारे बारे में",
            dashboard: "डैशबोर्ड",
            login: "लॉगिन",
            register: "रजिस्टर",
            platform: "डिजिटल प्लेटफॉर्म"
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <img
                                src="/cgpwmu/assets/Logo/CGPWMUlogo.webp"
                                alt="CG-PWMU Logo"
                                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">CG-PWMU</span>
                                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{t('platform', navTranslations)}</span>
                            </div>
                        </Link>
                    </div>

                    {/* Centered Logos - Larger, no frame */}
                    <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-6">
                        <img
                            src="/cgpwmu/assets/Logo/Chhattisgarh.webp"
                            alt="Chhattisgarh Government"
                            className="h-14 w-auto object-contain"
                        />
                        <div className="h-8 border-l border-gray-300 mx-1 opacity-50"></div>
                        <img
                            src="/cgpwmu/assets/Logo/unicef.webp"
                            alt="UNICEF"
                            className="h-10 w-auto object-contain"
                        />
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">{t('home', navTranslations)}</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">{t('about', navTranslations)}</Link>
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">{t('dashboard', navTranslations)}</Link>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-sm font-bold text-gray-700"
                        >
                            <Globe className="w-4 h-4 text-blue-500" />
                            {language === 'en' ? 'हिन्दी' : 'English'}
                        </button>

                        <div className="flex items-center space-x-4 ml-4">
                            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">{t('login', navTranslations)}</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                                {t('register', navTranslations)}
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-700"
                        >
                            <Globe className="w-3.5 h-3.5 text-blue-500" />
                            {language === 'en' ? 'HI' : 'EN'}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 shadow-lg absolute w-full">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>{t('home', navTranslations)}</Link>
                        <Link to="/about" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>{t('about', navTranslations)}</Link>
                        <Link to="/dashboard" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>{t('dashboard', navTranslations)}</Link>
                        <div className="border-t border-gray-100 my-2 pt-2"></div>
                        <Link to="/login" className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>{t('login', navTranslations)}</Link>
                        <Link to="/register" className="block px-3 py-3 mt-2 text-base font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>{t('register', navTranslations)}</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
