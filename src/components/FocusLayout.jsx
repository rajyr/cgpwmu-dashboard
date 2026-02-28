import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, Factory } from 'lucide-react';

const FocusLayout = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa]">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
                <div
                    onClick={() => navigate('/dashboard/pwmu')}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#005DAA] cursor-pointer font-medium transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to PWMU Hub</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-bold text-[#005DAA]">Balod Central PWMU</div>
                        <div className="text-xs text-gray-500">Active Session</div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#005DAA]">
                        <Factory className="w-5 h-5" />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full relative">
                <div className="max-w-[1600px] mx-auto min-h-full flex flex-col pt-0 lg:pt-0">
                    <div className="flex-grow w-full">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FocusLayout;
