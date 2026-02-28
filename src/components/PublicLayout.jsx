import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-[#fafafa]">
            <Navbar />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout;
