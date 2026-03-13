import { Link } from 'react-router-dom';
import { Recycle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    const footerTranslations = {
        en: {
            about: "ABOUT",
            dashboard_nav: "DASHBOARD",
            reporting: "REPORTING",
            compliance: "COMPLIANCE",
            dashboard: "Dashboard",
            home: "Home",
            govCopyright: `Government of Chhattisgarh`,
            copyright: "© Copyright © United Nations Children's Fund (UNICEF) Chhattisgarh",
            designedBy: "Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved."
        },
        hi: {
            about: "हमारे बारे में",
            dashboard_nav: "डैशबोर्ड",
            reporting: "रिपोर्टिंग",
            compliance: "अनुपालन",
            dashboard: "डैशबोर्ड",
            home: "होम",
            govCopyright: `छत्तीसगढ़ सरकार`,
            copyright: "© कॉपीराइट © संयुक्त राष्ट्र बाल कोष (यूनिसेफ) छत्तीसगढ़",
            designedBy: "राज यमगर @UNICEF 2025, भारत द्वारा डिज़ाइन किया गया। सर्वाधिकार सुरक्षित।"
        }
    };

    return (
        <footer className="bg-[#F4F7F6] border-t border-gray-200 py-12 text-gray-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Brand and Navigation */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/cgpwmu/assets/Logo/CGPWMUlogo.webp"
                            alt="CG-PWMU Logo"
                            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 text-xl leading-tight group-hover:text-blue-600 transition-colors">CG-PWMU</span>
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{t('dashboard_nav', footerTranslations)} {t('compliance', footerTranslations)}</span>
                        </div>
                    </Link>

                    <div className="flex flex-wrap justify-center gap-6 text-xs font-bold">
                        {[
                            { label: t('about', footerTranslations), path: '/about' },
                            { label: t('dashboard_nav', footerTranslations), path: '/dashboard' },
                            { label: t('reporting', footerTranslations), path: '/dashboard/pwmu' },
                            { label: t('compliance', footerTranslations), path: '/dashboard/compliance' }
                        ].map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className="hover:text-blue-600 transition-colors tracking-widest text-gray-500"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Sub-Footer (UNICEF & Credits) */}
                <div className="flex flex-col md:flex-row justify-between items-center text-[11px] gap-3 border-t border-gray-200 pt-8 mt-2">
                    <div className="font-medium tracking-wide text-gray-400">
                        {t('copyright', footerTranslations)}
                    </div>
                    <div className="flex items-center gap-3 font-medium flex-wrap justify-center text-gray-500">
                        <Link to="/dashboard" className="hover:text-blue-600 transition-colors">
                            {t('dashboard', footerTranslations)}
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/" className="hover:text-blue-600 transition-colors">
                            {t('home', footerTranslations)}
                        </Link>
                        <span className="text-gray-300">|</span>
                        <span className="text-gray-400">{t('designedBy', footerTranslations)}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
