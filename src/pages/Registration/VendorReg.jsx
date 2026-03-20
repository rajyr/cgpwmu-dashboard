import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, User, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Loader2, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

const VendorReg = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { t } = useLanguage();

    const vendorTranslations = {
        en: {
            title: "Recycler / Vendor Registration",
            subtitle: "Register as an authorized recycling partner to purchase processed plastic waste from PWMU hubs.",
            step1: "Firm Details",
            step2: "Contact & Login",
            step3: "Review",
            firmDetails: "Firm Details & Operations",
            firmName: "Firm Name",
            firmPlaceholder: "e.g. Green Earth Recyclers",
            district: "District",
            block: "Block",
            address: "Firm Address",
            addressPlaceholder: "Enter full office/factory address",
            gst: "GST Number (Optional)",
            gstPlaceholder: "22AAAAA0000A1Z5",
            contactDetails: "Contact & Authorization",
            ownerName: "Owner / Manager Name",
            fullName: "Full Name",
            phone: "Phone Number",
            email: "Email Address / Login ID",
            emailPlaceholder: "vendor@email.com",
            setPassword: "Set Password",
            passwordReq: "Min 6 characters",
            passwordDesc: "This will be your login password for the vendor dashboard.",
            reviewConfirm: "Review & Confirm",
            firmReview: "Firm Name:",
            ownerReview: "Owner:",
            phoneReview: "Phone:",
            gstReview: "GST:",
            verification: "By registering, you agree to comply with environmental regulations and maintain transparent transaction records on the platform.",
            successTitle: "Registration Submitted!",
            successDesc: "Your vendor registration has been submitted successfully.",
            pendingApproval: "⏳ Your account is pending verification. You will be able to bid and purchase once approved.",
            goToLogin: "Go to Login Page",
            cancel: "Cancel",
            back: "Back",
            continue: "Continue",
            detectLocation: "Detect Firm Location",
            locationDetected: "Location Detected",
            detecting: "Detecting...",
            locationReq: "Please allow location access to find coordinates."
        },
        hi: {
            title: "रीसाइक्लर / वेंडर पंजीकरण",
            subtitle: "PWMU हब से प्रसंस्कृत प्लास्टिक कचरा खरीदने के लिए अधिकृत रीसाइक्लिंग पार्टनर के रूप में पंजीकरण करें।",
            step1: "फर्म विवरण",
            step2: "संपर्क और लॉगिन",
            step3: "समीक्षा",
            firmDetails: "फर्म विवरण और संचालन",
            firmName: "फर्म का नाम",
            firmPlaceholder: "जैसे ग्रीन अर्थ रीसाइक्लर्स",
            district: "जिला",
            block: "ब्लॉक",
            address: "फर्म का पता",
            addressPlaceholder: "कार्यालय/फैक्टरी का पूरा पता दर्ज करें",
            gst: "जीएसटी नंबर (वैकल्पिक)",
            gstPlaceholder: "22AAAAA0000A1Z5",
            contactDetails: "संपर्क और प्राधिकरण",
            ownerName: "मालिक / प्रबंधक का नाम",
            fullName: "पूरा नाम",
            phone: "फ़ोन नंबर",
            email: "ईमेल पता / लॉगिन आईडी",
            emailPlaceholder: "vendor@email.com",
            setPassword: "पासवर्ड सेट करें",
            passwordReq: "न्यूनतम 6 अक्षर",
            passwordDesc: "यह वेंडर डैशबोर्ड के लिए आपका लॉगिन पासवर्ड होगा।",
            reviewConfirm: "समीक्षा और पुष्टि करें",
            firmReview: "फर्म का नाम:",
            ownerReview: "मालिक:",
            phoneReview: "फ़ोन:",
            gstReview: "जीएसटी:",
            verification: "पंजीकरण करके, आप पर्यावरणीय नियमों का पालन करने और प्लेटफॉर्म पर पारदर्शी लेनदेन रिकॉर्ड बनाए रखने के लिए सहमत होते हैं।",
            successTitle: "पंजीकरण सबमिट किया गया!",
            successDesc: "आपका वेंडर पंजीकरण सफलतापूर्वक सबमिट कर दिया गया है।",
            pendingApproval: "⏳ आपका खाता सत्यापन के लिए लंबित है। स्वीकृत होने के बाद आप बोली लगा सकेंगे और खरीदारी कर सकेंगे।",
            goToLogin: "लॉगिन पेज पर जाएं",
            cancel: "रद्द करें",
            back: "पीछे",
            continue: "जारी रखें",
            detectLocation: "फर्म के स्थान का पता लगाएं",
            locationDetected: "स्थान का पता चला",
            detecting: "पता लगाया जा रहा है...",
            locationReq: "निर्देशांक खोजने के लिए कृपया स्थान पहुंच की अनुमति दें।"
        }
    };

    const [formData, setFormData] = useState({
        firmName: '',
        district: '',
        block: '',
        address: '',
        gstNumber: '',
        ownerName: '',
        phone: '',
        email: '',
        password: '',
        partneredPwmus: [], // Array of selected PWMU IDs
        latitude: null,
        longitude: null
    });

    const [locationData, setLocationData] = useState({});
    const [districts, setDistricts] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [pwmuCenters, setPwmuCenters] = useState([]);

    useEffect(() => {
        const fetchLocationData = async () => {
            const paths = [
                `${import.meta.env.BASE_URL}data/locationData.json`,
                './data/locationData.json',
                '/data/locationData.json'
            ];
            
            for (const path of paths) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const data = await res.json();
                        setLocationData(data);
                        setDistricts(Object.keys(data));
                        console.log("[DEBUG] Loaded districts:", Object.keys(data).length);
                        return;
                    }
                } catch (e) {
                    // console.warn(`Failed to load from ${path}`);
                }
            }
        };

        const fetchPwmus = async () => {
            try {
                const { data, error } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district');
                
                if (error) throw error;
                setPwmuCenters(data || []);
            } catch (err) {
                console.error("Failed to fetch PWMUs:", err);
            }
        };

        fetchLocationData();
        fetchPwmus();
    }, []);

    useEffect(() => {
        if (formData.district && locationData[formData.district]) {
            setBlocks(Object.keys(locationData[formData.district]));
        } else {
            setBlocks([]);
        }
    }, [formData.district, locationData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePwmuToggle = (pwmuId) => {
        setFormData(prev => {
            const isSelected = prev.partneredPwmus.includes(pwmuId);
            return {
                ...prev,
                partneredPwmus: isSelected 
                    ? prev.partneredPwmus.filter(id => id !== pwmuId)
                    : [...prev.partneredPwmus, pwmuId]
            };
        });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
 
    const handleDetectLocation = () => {
        // Removed as per request
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        try {
            await signUp(formData.email, formData.password, {
                full_name: formData.ownerName,
                role: 'Vendor',
                phone_number: formData.phone,
                registration_data: {
                    firmName: formData.firmName,
                    district: formData.district,
                    block: formData.block,
                    address: formData.address,
                    gstNumber: formData.gstNumber,
                    type: 'Vendor',
                    partnered_pwmus: formData.partneredPwmus,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                },
                district: formData.district,
                block: formData.block,
                latitude: formData.latitude,
                longitude: formData.longitude
            });
            setSubmitSuccess(true);
        } catch (error) {
            setSubmitError(error.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const steps = [
        { num: 1, label: t('step1', vendorTranslations), icon: Truck },
        { num: 2, label: t('step2', vendorTranslations), icon: User },
        { num: 3, label: t('step3', vendorTranslations), icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-8 h-8 text-blue-200" />
                        <h2 className="text-2xl font-bold">{t('title', vendorTranslations)}</h2>
                    </div>
                    <p className="text-blue-100 text-sm">{t('subtitle', vendorTranslations)}</p>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 transition-all duration-300 z-0 rounded-full"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        {steps.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.num;
                            const isCompleted = step > s.num;

                            return (
                                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 
                                        ${isActive ? 'bg-white border-blue-600 text-blue-600' :
                                            isCompleted ? 'bg-blue-500 border-blue-500 text-white' :
                                                'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                                        ${isActive ? 'text-blue-600' : isCompleted ? 'text-blue-500' : 'text-gray-400'}`}>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('firmDetails', vendorTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('firmName', vendorTranslations)}</label>
                                    <input
                                        type="text" name="firmName" value={formData.firmName} onChange={handleInputChange} placeholder={t('firmPlaceholder', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('district', vendorTranslations)}</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('block', vendorTranslations)}</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('address', vendorTranslations)}</label>
                                    <textarea
                                        name="address" value={formData.address} onChange={handleInputChange} placeholder={t('addressPlaceholder', vendorTranslations)} rows="2"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('gst', vendorTranslations)}</label>
                                    <input
                                        type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder={t('gstPlaceholder', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Partnered PWMU Hubs (Optional)</label>
                                    <p className="text-xs text-gray-500 mb-3">Select the PWMU hubs you plan to purchase waste from.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg bg-gray-50/50">
                                        {pwmuCenters.length === 0 ? (
                                            <p className="text-xs text-gray-400 p-2 col-span-full">Loading PWMU Hubs...</p>
                                        ) : pwmuCenters.map(pwmu => (
                                            <label key={pwmu.id} className={`flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors ${formData.partneredPwmus.includes(pwmu.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.partneredPwmus.includes(pwmu.id)}
                                                    onChange={() => handlePwmuToggle(pwmu.id)}
                                                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-800 leading-tight">{pwmu.name}</span>
                                                    <span className="text-[10px] text-gray-500">{pwmu.district}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('contactDetails', vendorTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('ownerName', vendorTranslations)}</label>
                                    <input
                                        type="text" name="ownerName" value={formData.ownerName} onChange={handleInputChange} placeholder={t('fullName', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone', vendorTranslations)}</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', vendorTranslations)}</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('emailPlaceholder', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('setPassword', vendorTranslations)}</label>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('passwordReq', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{t('passwordDesc', vendorTranslations)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('reviewConfirm', vendorTranslations)}</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">{t('firmReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.firmName}</div>

                                    <div className="text-gray-500">{t('address', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right whitespace-pre-wrap">{formData.district}, {formData.block}, {formData.address}</div>

                                    <div className="text-gray-500">{t('ownerReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.ownerName}</div>

                                    <div className="text-gray-500">{t('phoneReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.phone}</div>

                                    <div className="text-gray-500">{t('gstReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.gstNumber || 'N/A'}</div>

                                    <div className="text-gray-500 col-span-2 mt-2 border-t pt-2">Partnered PWMUs:</div>
                                    <div className="font-semibold text-gray-800 text-left col-span-2">
                                        {formData.partneredPwmus.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {formData.partneredPwmus.map(id => {
                                                    const p = pwmuCenters.find(c => c.id === id);
                                                    return p ? <span key={id} className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{p.name}</span> : null;
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 font-normal">None selected</span>
                                        )}
                                    </div>
                                    
                                    {formData.latitude && (
                                        <>
                                            <div className="text-gray-500">Location:</div>
                                            <div className="font-semibold text-gray-800 text-right">{formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-blue-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>{t('verification', vendorTranslations)}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {submitSuccess && (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('successTitle', vendorTranslations)}</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-2">{t('successDesc', vendorTranslations)}</p>
                            <p className="text-amber-600 font-semibold mb-8">{t('pendingApproval', vendorTranslations)}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                {t('goToLogin', vendorTranslations)}
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                            <p className="text-sm text-red-700 font-medium">{submitError}</p>
                        </div>
                    )}

                    {!submitSuccess && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={step === 1 ? () => navigate('/register') : prevStep}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center"
                                disabled={submitting}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {step === 1 ? t('cancel', vendorTranslations) : t('back', vendorTranslations)}
                            </button>

                            {step < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors flex items-center"
                                >
                                    {t('continue', vendorTranslations)}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('submitting', vendorTranslations)}</>
                                    ) : (
                                        <>{t('submitRegistration', vendorTranslations)} <CheckCircle2 className="w-4 h-4 ml-2" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorReg;
