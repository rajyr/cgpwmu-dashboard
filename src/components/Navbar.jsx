import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/assets/Logo/CGPWMUlogo.webp"
                            alt="CG-PWMU Logo"
                            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-lg leading-tight group-hover:text-blue-600 transition-colors">CG-PWMU</span>
                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Digital Platform</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">About Us</Link>
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                        <div className="flex items-center space-x-4 ml-4">
                            <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm">
                                Register
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
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
                        <Link to="/" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/about" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                        <Link to="/dashboard" className="block px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                        <div className="border-t border-gray-100 my-2 pt-2"></div>
                        <Link to="/login" className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md" onClick={() => setIsMenuOpen(false)}>Login</Link>
                        <Link to="/register" className="block px-3 py-3 mt-2 text-base font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Register</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
