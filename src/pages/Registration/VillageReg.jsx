import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MapPin, Users, Banknote, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const VillageReg = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();

    const [locationData, setLocationData] = useState({});
    React.useEffect(() => {
        fetch('/data/locationData.json')
            .then(res => res.json())
            .then(data => setLocationData(data))
            .catch(err => console.error("Error loading location data:", err));
    }, []);

    const [formData, setFormData] = useState({
        district: '', block: '', gramPanchayat: '', village: '',
        population: '', households: '', doorToDoorActive: false, swachhgrahiCount: '',
        sarpanchName: '', phone: '', accountNumber: '', email: '', password: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'district') { newData.block = ''; newData.gramPanchayat = ''; newData.village = ''; }
            else if (name === 'block') { newData.gramPanchayat = ''; newData.village = ''; }
            else if (name === 'gramPanchayat') { newData.village = ''; }
            return newData;
        });
    };

    const districts = Object.keys(locationData);
    const blocks = formData.district ? Object.keys(locationData[formData.district] || {}) : [];
    const gps = (formData.district && formData.block) ? Object.keys(locationData[formData.district][formData.block] || {}) : [];
    const villages = (formData.district && formData.block && formData.gramPanchayat) ? (locationData[formData.district][formData.block][formData.gramPanchayat] || []) : [];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');
        try {
            if (!formData.email || !formData.password) throw new Error('Email and password are required.');
            if (formData.password.length < 6) throw new Error('Password must be at least 6 characters.');
            await signUp(formData.email, formData.password, {
                full_name: formData.sarpanchName,
                role: 'Sarpanch',
                district: formData.district,
                phone_number: formData.phone,
                registration_data: {
                    type: 'Village',
                    village: formData.village,
                    block: formData.block,
                    gramPanchayat: formData.gramPanchayat,
                    district: formData.district,
                    population: formData.population,
                    households: formData.households,
                    doorToDoorActive: formData.doorToDoorActive,
                    swachhgrahiCount: formData.swachhgrahiCount,
                    accountNumber: formData.accountNumber,
                },
            });
            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(error.message || 'Registration failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const steps = [
        { num: 1, label: 'Location', icon: MapPin },
        { num: 2, label: 'Demographics', icon: Users },
        { num: 3, label: 'Officials', icon: Banknote },
        { num: 4, label: 'Review', icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Home className="w-8 h-8 text-green-200" />
                        <h2 className="text-2xl font-bold">Village / Gram Panchayat Registration</h2>
                    </div>
                    <p className="text-green-100 text-sm">Register a new Gram Panchayat to officially track sanitation and waste management.</p>
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
                                        ${isActive ? 'bg-white border-green-600 text-green-600' :
                                            isCompleted ? 'bg-[#28A745] border-[#28A745] text-white' :
                                                'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                                        ${isActive ? 'text-green-600' : isCompleted ? 'text-[#28A745]' : 'text-gray-400'}`}>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Gram Panchayat Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State District</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Block (Tehsil)</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} required disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gram Panchayat</label>
                                    <select
                                        name="gramPanchayat" value={formData.gramPanchayat} onChange={handleInputChange} required disabled={!formData.block}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">Select Gram Panchayat</option>
                                        {gps.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Village Name</label>
                                    <select
                                        name="village" value={formData.village} onChange={handleInputChange} required disabled={!formData.gramPanchayat}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">Select Village</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Demographics & SBM Coverage</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Population</label>
                                    <input
                                        type="number" name="population" value={formData.population} onChange={handleInputChange} placeholder="E.g. 5000"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Households</label>
                                    <input
                                        type="number" name="households" value={formData.households} onChange={handleInputChange} placeholder="E.g. 1200"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4 pt-2">
                                    <label
                                        className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 
                                            ${formData.doorToDoorActive
                                                ? 'border-green-500 bg-green-50 shadow-md transform -translate-y-1'
                                                : 'border-gray-200 bg-white hover:border-green-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-full mr-4 transition-colors ${formData.doorToDoorActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Trash2 className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <span className={`block text-lg font-bold ${formData.doorToDoorActive ? 'text-green-800' : 'text-gray-800'}`}>
                                                Door-to-Door Collection Active
                                            </span>
                                            <span className="block text-sm text-gray-500 mt-1">
                                                Enable this if the village currently has swachhgrahas actively collecting segregated waste from households.
                                            </span>
                                        </div>
                                        <div className={`mt-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors 
                                            ${formData.doorToDoorActive ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                                        >
                                            {formData.doorToDoorActive && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                        <input
                                            type="checkbox" name="doorToDoorActive" checked={formData.doorToDoorActive} onChange={handleInputChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {formData.doorToDoorActive && (
                                    <div className="md:col-span-2 animate-fade-in-up">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Swachhgrahi (Sanitation Workers)</label>
                                        <input
                                            type="number" name="swachhgrahiCount" value={formData.swachhgrahiCount} onChange={handleInputChange} placeholder="E.g. 5"
                                            className="w-full md:w-1/2 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Sarpanch / Official Contacts & Login</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sarpanch Name</label>
                                    <input type="text" name="sarpanchName" value={formData.sarpanchName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="official@email.com" required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GP Account No.</label>
                                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="Bank Account Number" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Set Password <span className="text-red-500">*</span></label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Min 6 characters" required className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600/20 focus:border-green-600" />
                                    <p className="text-xs text-gray-400 mt-1">This will be your login password. You can log in after admin approval.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Final Review</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">Gram Panchayat:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.gramPanchayat || 'N/A'}</div>

                                    <div className="text-gray-500">Village:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.village || 'N/A'}</div>

                                    <div className="text-gray-500">Location:</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {[formData.block, formData.district].filter(Boolean).join(', ') || 'N/A'}
                                    </div>

                                    <div className="text-gray-500">Households / Pop:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.households} / {formData.population}</div>

                                    <div className="text-gray-500">Collection Status:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.doorToDoorActive ? `Active (${formData.swachhgrahiCount || 0} Workers)` : 'Inactive'}</div>

                                    <div className="text-gray-500">Sarpanch Phone:</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.phone || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="bg-orange-50 text-orange-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-orange-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-orange-600" />
                                <p>Upon submission, the Nodal Officer will verify these details. The specified mobile number will serve as your village portal login credential.</p>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {submitSuccess && (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Registration Submitted!</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-2">Your village registration has been submitted successfully.</p>
                            <p className="text-amber-600 font-semibold mb-8">⏳ Your account is pending admin approval.</p>
                            <button onClick={() => navigate('/login')} className="px-8 py-3 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors">Go to Login Page</button>
                        </div>
                    )}
                    {submitError && (<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center"><p className="text-sm text-red-700 font-medium">{submitError}</p></div>)}

                    {!submitSuccess && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <button onClick={step === 1 ? () => navigate('/register') : prevStep} disabled={submitting} className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center">
                                <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? 'Cancel' : 'Back'}
                            </button>
                            {step < 4 ? (
                                <button onClick={nextStep} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors flex items-center">Continue <ArrowRight className="w-4 h-4 ml-2" /></button>
                            ) : (
                                <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#28A745] hover:bg-[#218838] disabled:bg-gray-300 shadow-sm transition-colors flex items-center">
                                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <>Complete Registration <CheckCircle2 className="w-4 h-4 ml-2" /></>}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VillageReg;
