import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    const footerTranslations = {
        en: {
            dashboard: "Dashboard",
            home: "Home",
            copyright: "© Copyright © United Nations Childrens Fund (UNICEF) Chhattisgarh",
            designedBy: "Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved."
        },
        hi: {
            dashboard: "डैशबोर्ड",
            home: "होम",
            copyright: "© कॉपीराइट © संयुक्त राष्ट्र बाल कोष (यूनिसेफ) छत्तीसगढ़",
            designedBy: "राज यमगर @UNICEF 2025, भारत द्वारा डिज़ाइन किया गया। सर्वाधिकार सुरक्षित।"
        }
    };

    return (
        <footer className="w-full mt-auto pt-8 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 gap-3 border-t border-gray-200/60 pt-6 px-4">
                <div className="font-medium tracking-wide">
                    {t('copyright', footerTranslations)}
                </div>
                <div className="flex items-center gap-3 font-medium">
                    <Link to="/dashboard" className="hover:text-[#005DAA] transition-colors">{t('dashboard', footerTranslations)}</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/" className="hover:text-[#005DAA] transition-colors">{t('home', footerTranslations)}</Link>
                    <span className="text-gray-300">|</span>
                    <span>{t('designedBy', footerTranslations)}</span>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
