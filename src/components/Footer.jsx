import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full mt-auto pt-8 pb-4">
            <div className="flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-400 gap-3 border-t border-gray-200/60 pt-6">
                <div className="font-medium tracking-wide">
                    © Copyright © United Nations Childrens Fund (UNICEF) Chhattisgarh
                </div>
                <div className="flex items-center gap-3 font-medium">
                    <Link to="/dashboard" className="hover:text-[#005DAA] transition-colors">Dashboard</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/" className="hover:text-[#005DAA] transition-colors">Home</Link>
                    <span className="text-gray-300">|</span>
                    <span>Designed by Raj Yamgar @UNICEF 2025, India. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
};
export default Footer;
