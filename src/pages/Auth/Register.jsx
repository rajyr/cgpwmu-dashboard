import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Home as HomeIcon, Truck, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const registrationOptions = [
        {
            id: 'village',
            title: 'Village Sarpanch',
            description: 'Register a Gram Panchayat to log daily waste collection, segregated quantities, and manage local sanitization workers.',
            icon: HomeIcon,
            path: '/register/village',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            hoverBorder: 'hover:border-green-500',
        },
        {
            id: 'pwmu',
            title: 'PWMU Center',
            description: 'Onboard a new Plastic Waste Management Unit. Set up processing capacity, asset register, and monthly financial reporting.',
            icon: Building2,
            path: '/register/pwmu',
            color: 'text-[#005DAA]',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            hoverBorder: 'hover:border-[#005DAA]',
        },
        {
            id: 'vendor',
            title: 'Vendor / Recycler',
            description: 'Join the marketplace as an authorized buyer or recycler of processed plastic materials from PWMU centers.',
            icon: Truck,
            path: '/register/vendor',
            color: 'text-[#FF9933]',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            hoverBorder: 'hover:border-[#FF9933]',
        }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] pt-12 pb-20 px-4 relative overflow-hidden flex flex-col items-center">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

            <div className="max-w-4xl w-full relative z-10">
                <div className="mb-6">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#005DAA] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Login
                    </Link>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-4">Select Registration Type</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg hover:text-gray-700 transition-colors">
                        Welcome to the CG-PWMU platform. Choose the entity type you are registering to be directed to the correct onboarding wizard.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {registrationOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <div
                                key={option.id}
                                onClick={() => navigate(option.path)}
                                className={`bg-white/80 backdrop-blur-md border ${option.borderColor} ${option.hoverBorder} rounded-2xl p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group flex flex-col h-full`}
                            >
                                <div className={`w-14 h-14 rounded-xl ${option.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className={`w-7 h-7 ${option.color} group-hover:animate-bounce`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">{option.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                                    {option.description}
                                </p>
                                <div className={`flex items-center text-sm font-semibold ${option.color} group-hover:underline`}>
                                    Start Registration
                                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center text-sm text-gray-500 bg-white/50 backdrop-blur border border-gray-200 rounded-xl p-6 max-w-2xl mx-auto">
                    <p>Are you an Admin or existing Nodal Officer?</p>
                    <p className="mt-1">
                        Government officials do not need to register. Your credentials are provided by the State Directorate. <Link to="/login" className="text-[#005DAA] font-semibold hover:underline">Return to Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
