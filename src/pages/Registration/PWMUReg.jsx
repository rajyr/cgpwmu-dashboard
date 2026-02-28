import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Factory, User, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Zap, Cpu } from 'lucide-react';

const PWMUReg = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const [locationData, setLocationData] = useState({});

    React.useEffect(() => {
        fetch('/data/locationData.json')
            .then(res => res.json())
            .then(data => setLocationData(data))
            .catch(err => console.error("Error loading location data:", err));
    }, []);

    // Mock form state
    const [formData, setFormData] = useState({
        district: '',
        block: '',
        gramPanchayat: '',
        village: '',
        pwmuName: '',
        setupDate: '',
        capacity: '',
        hasBaler: false,
        hasShredder: false,
        nodalName: '',
        phone: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            // Cascade reset dependent fields when location hierarchy changes
            if (name === 'district') {
                newData.block = '';
                newData.gramPanchayat = '';
                newData.village = '';
            } else if (name === 'block') {
                newData.gramPanchayat = '';
                newData.village = '';
            } else if (name === 'gramPanchayat') {
                newData.village = '';
            }

            return newData;
        });
    };

    // Derived Location Options
    const districts = Object.keys(locationData);
    const blocks = formData.district ? Object.keys(locationData[formData.district] || {}) : [];
    const gps = (formData.district && formData.block) ? Object.keys(locationData[formData.district][formData.block] || {}) : [];
    const villages = (formData.district && formData.block && formData.gramPanchayat) ? (locationData[formData.district][formData.block][formData.gramPanchayat] || []) : [];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock submission
        console.log("Submitting PWMU Data:", formData);
        navigate('/dashboard'); // Route to dashboard on success simulation
    };

    const steps = [
        { num: 1, label: 'Location', icon: MapPin },
        { num: 2, label: 'Infrastructure', icon: Factory },
        { num: 3, label: 'Contact', icon: User },
        { num: 4, label: 'Review', icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-[#005DAA] to-[#00427A] p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-8 h-8 text-blue-200" />
                        <h2 className="text-2xl font-bold">PWMU Center Registration</h2>
                    </div>
                    <p className="text-blue-100 text-sm">Onboard a new Plastic Waste Management Unit into the state network.</p>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#28A745] transition-all duration-300 z-0 rounded-full"
                            style={{ width: `${((step - 1) / 3) * 100}%` }}
                        ></div>

                        {steps.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.num;
                            const isCompleted = step > s.num;

                            return (
                                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 
                                        ${isActive ? 'bg-white border-[#005DAA] text-[#005DAA]' :
                                            isCompleted ? 'bg-[#28A745] border-[#28A745] text-white' :
                                                'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                                        ${isActive ? 'text-[#005DAA]' : isCompleted ? 'text-[#28A745]' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-8 mt-6">
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Basic Location Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State District</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Block (Tehsil)</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} required disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gram Panchayat</label>
                                    <select
                                        name="gramPanchayat" value={formData.gramPanchayat} onChange={handleInputChange} required disabled={!formData.block}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">Select Gram Panchayat</option>
                                        {gps.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Village Name</label>
                                    <select
                                        name="village" value={formData.village} onChange={handleInputChange} required disabled={!formData.gramPanchayat}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">Select Village</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PWMU Facility Name</label>
                                    <input
                                        type="text" name="pwmuName" value={formData.pwmuName} onChange={handleInputChange} placeholder="e.g. Balod Central Resource Recovery Center"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Setup</label>
                                    <input
                                        type="date" name="setupDate" value={formData.setupDate} onChange={handleInputChange}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Infrastructure & Capacity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Processing Capacity (Tons/Day)</label>
                                    <input
                                        type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder="e.g. 5"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4 pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Installed Machinery</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <label
                                            className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 
                                                ${formData.hasBaler
                                                    ? 'border-[#005DAA] bg-blue-50 shadow-md transform -translate-y-1'
                                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full mr-4 transition-colors ${formData.hasBaler ? 'bg-blue-100 text-[#005DAA]' : 'bg-gray-100 text-gray-400'}`}>
                                                <Zap className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <span className={`block text-lg font-bold ${formData.hasBaler ? 'text-[#00427A]' : 'text-gray-800'}`}>
                                                    Hydraulic Baling Machine
                                                </span>
                                                <span className="block text-sm text-gray-500 mt-1">
                                                    Compresses sorted plastic into dense, transportable bales.
                                                </span>
                                            </div>
                                            <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                                                ${formData.hasBaler ? 'bg-[#005DAA] border-[#005DAA]' : 'border-gray-300'}`}
                                            >
                                                {formData.hasBaler && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox" name="hasBaler" checked={formData.hasBaler} onChange={handleInputChange}
                                                className="hidden"
                                            />
                                        </label>

                                        <label
                                            className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 
                                                ${formData.hasShredder
                                                    ? 'border-[#005DAA] bg-blue-50 shadow-md transform -translate-y-1'
                                                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full mr-4 transition-colors ${formData.hasShredder ? 'bg-blue-100 text-[#005DAA]' : 'bg-gray-100 text-gray-400'}`}>
                                                <Cpu className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <span className={`block text-lg font-bold ${formData.hasShredder ? 'text-[#00427A]' : 'text-gray-800'}`}>
                                                    Plastic Shredder Machine
                                                </span>
                                                <span className="block text-sm text-gray-500 mt-1">
                                                    Cuts hard plastics into smaller, manageable flakes for recycling.
                                                </span>
                                            </div>
                                            <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                                                ${formData.hasShredder ? 'bg-[#005DAA] border-[#005DAA]' : 'border-gray-300'}`}
                                            >
                                                {formData.hasShredder && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <input
                                                type="checkbox" name="hasShredder" checked={formData.hasShredder} onChange={handleInputChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Nodal Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Officer Name</label>
                                    <input
                                        type="text" name="nodalName" value={formData.nodalName} onChange={handleInputChange} placeholder="Full Name"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="official@email.com"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Review & Confirm</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">Facility Name:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.pwmuName || 'N/A'}</div>

                                    <div className="text-gray-500">Location:</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {[formData.village, formData.gramPanchayat, formData.block, formData.district].filter(Boolean).join(', ') || 'N/A'}
                                    </div>

                                    <div className="text-gray-500">Capacity:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.capacity ? `${formData.capacity} Tons/Day` : 'N/A'}</div>

                                    <div className="text-gray-500">Nodal Officer:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.nodalName || 'N/A'} ({formData.phone})</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-blue-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>By submitting this form, you verify that the information provided is accurate and official. The dashboard account will be created using the provided email address.</p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <button
                            onClick={step === 1 ? () => navigate('/register') : prevStep}
                            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#005DAA] hover:bg-[#00427A] shadow-sm transition-colors flex items-center"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#28A745] hover:bg-[#218838] shadow-sm transition-colors flex items-center"
                            >
                                Submit Registration
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWMUReg;
