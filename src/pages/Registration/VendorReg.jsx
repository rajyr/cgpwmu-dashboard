import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Store, Contact2, Settings, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Package, Box, Droplets, HardHat, Recycle, Factory } from 'lucide-react';

const VendorReg = () => {
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
        vendorType: '',
        companyName: '',
        gstin: '',
        district: '',
        block: '',
        gramPanchayat: '',
        village: '',
        address: '',
        plasticTypes: [],
        intakeCapacity: '',
        contactName: '',
        phone: '',
        email: ''
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'plasticTypes') {
            // Handle array of checkboxes for plastic types
            setFormData(prev => {
                let updatedTypes = [...prev.plasticTypes];
                if (checked) {
                    updatedTypes.push(value);
                } else {
                    updatedTypes = updatedTypes.filter(t => t !== value);
                }
                return { ...prev, plasticTypes: updatedTypes };
            });
        } else {
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
        }
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
        console.log("Submitting Vendor Data:", formData);
        navigate('/dashboard');
    };

    const steps = [
        { num: 1, label: 'Entity Details', icon: Store },
        { num: 2, label: 'Operations', icon: Settings },
        { num: 3, label: 'Contact', icon: Contact2 },
        { num: 4, label: 'Review', icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-700 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-8 h-8 text-orange-200" />
                        <h2 className="text-2xl font-bold">Vendor & Recycler Onboarding</h2>
                    </div>
                    <p className="text-orange-100 text-sm">Register as an authorized buyer for processed plastic waste from PWMU Centers.</p>
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
                            const isActive = step === s.num;
                            const isCompleted = step > s.num;

                            return (
                                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 
                                        ${isActive ? 'bg-white border-orange-500 text-orange-600' :
                                            isCompleted ? 'bg-[#28A745] border-[#28A745] text-white' :
                                                'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                                        ${isActive ? 'text-orange-600' : isCompleted ? 'text-[#28A745]' : 'text-gray-400'}`}>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Business Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor/Entity Type</label>
                                    <select
                                        name="vendorType" value={formData.vendorType} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    >
                                        <option value="">Select Entity Type</option>
                                        <option value="Plastic Recycler">Plastic Recycler / Kabadiwala</option>
                                        <option value="Cement Factory">Cement Factory</option>
                                        <option value="Road Construction">Road Construction Contractor</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Registered Entity Name</label>
                                    <input
                                        type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} placeholder="e.g. EcoPlast Recyclers Pvt Ltd"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN (Registration No.)</label>
                                    <input
                                        type="text" name="gstin" value={formData.gstin} onChange={handleInputChange} placeholder="22AAAAA0000A1Z5"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State District</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Block (Tehsil)</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} required disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gram Panchayat</label>
                                    <select
                                        name="gramPanchayat" value={formData.gramPanchayat} onChange={handleInputChange} required disabled={!formData.block}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
                                    >
                                        <option value="">Select Gram Panchayat</option>
                                        {gps.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Village Name</label>
                                    <select
                                        name="village" value={formData.village} onChange={handleInputChange} required disabled={!formData.gramPanchayat}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 disabled:opacity-50"
                                    >
                                        <option value="">Select Village</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Primary Operations Address</label>
                                    <textarea
                                        name="address" value={formData.address} onChange={handleInputChange} placeholder="Full facility address" rows="3"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Operational Capacity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Avg. Monthly Requirement/Intake (Tons)</label>
                                    <input
                                        type="number" name="intakeCapacity" value={formData.intakeCapacity} onChange={handleInputChange} placeholder="e.g. 50"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        {formData.vendorType === 'Plastic Recycler' ? 'Accepted Plastic Varieties (Check all that apply)' :
                                            formData.vendorType === 'Cement Factory' ? 'Material Used as Alternate Fuel / Raw Material (Check all that apply)' :
                                                formData.vendorType === 'Road Construction' ? 'Plastic Waste Utilized for Road Construction (Check all that apply)' :
                                                    'Required Waste Materials (Check all that apply)'}
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { id: 'pet', label: 'PET (Water Bottles)', icon: Droplets, show: ['Plastic Recycler', 'Other', ''] },
                                            { id: 'hdpe', label: 'HDPE (Milk Jugs)', icon: Box, show: ['Plastic Recycler', 'Other', ''] },
                                            { id: 'ldpe', label: 'LDPE (Plastic Bags)', icon: Package, show: ['Plastic Recycler', 'Other', ''] },
                                            { id: 'pp', label: 'PP (Tupperware)', icon: Box, show: ['Plastic Recycler', 'Other', ''] },
                                            { id: 'mlp', label: 'MLP (Multi-Layer)', icon: Recycle, show: ['Plastic Recycler', 'Cement Factory', 'Other', ''] },
                                            { id: 'rdf', label: 'RDF (Derived Fuel)', icon: Factory, show: ['Cement Factory', 'Other', ''] },
                                            { id: 'shredded', label: 'Shredded Mixed', icon: HardHat, show: ['Road Construction', 'Cement Factory', 'Other', ''] }
                                        ].filter(opt => opt.show.includes(formData.vendorType) || formData.vendorType === 'Other' || formData.vendorType === '').map((opt) => {
                                            const Icon = opt.icon;
                                            const isSelected = formData.plasticTypes.includes(opt.label);
                                            return (
                                                <label
                                                    key={opt.id}
                                                    className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 
                                                        ${isSelected
                                                            ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                                                            : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-gray-50 text-gray-600'
                                                        }`}
                                                >
                                                    <input
                                                        type="checkbox" name="plasticTypes" value={opt.label}
                                                        checked={isSelected}
                                                        onChange={handleInputChange}
                                                        className="hidden"
                                                    />
                                                    <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
                                                    <span className="text-sm font-semibold text-center leading-tight">{opt.label}</span>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-orange-500 rounded-full">
                                                            <Check className="w-3 h-3 text-white" />
                                                        </div>
                                                    )}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Authorized Point of Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">POC Name (Manager/Director)</label>
                                    <input
                                        type="text" name="contactName" value={formData.contactName} onChange={handleInputChange} placeholder="Full Name"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="official@domain.com"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Final Review</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">Entity Type:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.vendorType || 'N/A'}</div>

                                    <div className="text-gray-500">Business Name:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.companyName || 'N/A'}</div>

                                    <div className="text-gray-500">GSTIN:</div>
                                    <div className="font-semibold text-gray-800 text-right uppercase">{formData.gstin || 'N/A'}</div>

                                    <div className="text-gray-500">Location:</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {[formData.village, formData.gramPanchayat, formData.block, formData.district].filter(Boolean).join(', ') || 'N/A'}
                                    </div>

                                    <div className="text-gray-500">Intake Capacity:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.intakeCapacity ? `${formData.intakeCapacity} Tons/Month` : 'N/A'}</div>

                                    <div className="text-gray-500">Accepted Types:</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {formData.plasticTypes.length > 0 ? formData.plasticTypes.join(', ') : 'None Selected'}
                                    </div>

                                    <div className="text-gray-500">Contact Email:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.email || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-blue-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                <p>By applying for vendor authorization, you agree to comply with CG-PWMU tracking regulations. Background verification will be conducted using the provided GSTIN before account activation.</p>
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
                                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 shadow-sm transition-colors flex items-center"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#28A745] hover:bg-[#218838] shadow-sm transition-colors flex items-center"
                            >
                                Submit Application
                                <CheckCircle2 className="w-4 h-4 ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorReg;
