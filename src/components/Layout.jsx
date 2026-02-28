import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#fafafa]">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <div className="flex flex-col flex-1 overflow-hidden ml-20 md:ml-0">
                <Header setIsMobileOpen={setIsMobileOpen} />
                <main className="flex-1 overflow-y-auto w-full relative">
                    <div className="max-w-[1600px] mx-auto min-h-full flex flex-col p-6 lg:p-10 pb-2">
                        <div className="flex-grow w-full">
                            <Outlet />
                        </div>
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
