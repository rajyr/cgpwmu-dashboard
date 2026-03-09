import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, MapPin, User, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Loader2, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

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
            district: "Operating District",
            selectDistrict: "Select District",
            gst: "GST Number (Optional)",
            gstPlaceholder: "22AAAAA0000A1Z5",
            wasteType: "Primary Waste Types Purchased",
            typeLDPE: "LDPE / HDPE",
            typePET: "PET Bottles",
            typeMLP: "MLP (Multi-Layer)",
            typeHard: "Hard Plastic",
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
            submitting: "Submitting...",
            submitRegistration: "Submit Registration"
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
            district: "परिचालन जिला",
            selectDistrict: "जिला चुनें",
            gst: "जीएसटी नंबर (वैकल्पिक)",
            gstPlaceholder: "22AAAAA0000A1Z5",
            wasteType: "प्राथमिक कचरे के प्रकार",
            typeLDPE: "LDPE / HDPE",
            typePET: "पीईटी बोतलें",
            typeMLP: "MLP (मल्टी-लेयर)",
            typeHard: "हार्ड प्लास्टिक",
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
            submitting: "सबमिट हो रहा है...",
            submitRegistration: "पंजीकरण सबमिट करें"
        }
    };

    const [formData, setFormData] = useState({
        firmName: '',
        district: '',
        gstNumber: '',
        wasteTypes: [],
        ownerName: '',
        phone: '',
        email: '',
        password: '',
    });

    const districts = ["Raipur", "Durg", "Bilaspur", "Bastar", "Korba", "Rajnandgaon"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeToggle = (type) => {
        setFormData(prev => {
            const types = prev.wasteTypes.includes(type)
                ? prev.wasteTypes.filter(t => t !== type)
                : [...prev.wasteTypes, type];
            return { ...prev, wasteTypes: types };
        });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError('');

        try {
            await signUp(formData.email, formData.password, {
                full_name: formData.ownerName,
                role: 'Vendor',
                district: formData.district,
                phone_number: formData.phone,
                registration_data: {
                    firmName: formData.firmName,
                    gstNumber: formData.gstNumber,
                    wasteTypes: formData.wasteTypes,
                    type: 'Vendor',
                },
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
                                        <option value="">{t('selectDistrict', vendorTranslations)}</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('gst', vendorTranslations)}</label>
                                    <input
                                        type="text" name="gstNumber" value={formData.gstNumber} onChange={handleInputChange} placeholder={t('gstPlaceholder', vendorTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('wasteType', vendorTranslations)}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'LDPE', label: t('typeLDPE', vendorTranslations) },
                                            { id: 'PET', label: t('typePET', vendorTranslations) },
                                            { id: 'MLP', label: t('typeMLP', vendorTranslations) },
                                            { id: 'Hard', label: t('typeHard', vendorTranslations) }
                                        ].map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => handleTypeToggle(type.id)}
                                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-all text-left flex items-center justify-between
                                                    ${formData.wasteTypes.includes(type.id)
                                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-blue-200'}`}
                                            >
                                                {type.label}
                                                {formData.wasteTypes.includes(type.id) && <Check className="w-4 h-4" />}
                                            </button>
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

                                    <div className="text-gray-500">{t('ownerReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.ownerName}</div>

                                    <div className="text-gray-500">{t('phoneReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.phone}</div>

                                    <div className="text-gray-500">{t('gstReview', vendorTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.gstNumber || 'N/A'}</div>
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
