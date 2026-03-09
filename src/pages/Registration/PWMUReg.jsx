import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Factory, User, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Zap, Cpu, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const PWMUReg = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { t } = useLanguage();

    const pwmuTranslations = {
        en: {
            title: "PWMU Center Registration",
            subtitle: "Onboard a new Plastic Waste Management Unit into the state network.",
            step1: "Location",
            step2: "Infrastructure",
            step3: "Contact",
            step4: "Review",
            basicLocation: "Basic Location Details",
            district: "State District",
            selectDistrict: "Select District",
            block: "Block (Tehsil)",
            selectBlock: "Select Block",
            gp: "Gram Panchayat",
            selectGP: "Select Gram Panchayat",
            village: "Village Name",
            selectVillage: "Select Village",
            facilityName: "PWMU Facility Name",
            facilityPlaceholder: "e.g. Balod Central Resource Recovery Center",
            setupDate: "Date of Setup",
            infraCapacity: "Infrastructure & Capacity",
            capacity: "Processing Capacity (Tons/Day)",
            capacityPlaceholder: "e.g. 5",
            installedMachinery: "Installed Machinery",
            balerTitle: "Hydraulic Baling Machine",
            balerDesc: "Compresses sorted plastic into dense, transportable bales.",
            shredderTitle: "Plastic Shredder Machine",
            shredderDesc: "Cuts hard plastics into smaller, manageable flakes for recycling.",
            nodalContact: "Nodal Contact & Login Details",
            officerName: "Officer Name",
            fullName: "Full Name",
            phone: "Phone Number",
            email: "Email Address",
            setPassword: "Set Password",
            passwordReq: "Min 6 characters",
            passwordDesc: "This will be your login password. You can log in after admin approval.",
            reviewConfirm: "Review & Confirm",
            facilityReview: "Facility Name:",
            locationReview: "Location:",
            capacityReview: "Capacity:",
            officerReview: "Nodal Officer:",
            tonsDay: "Tons/Day",
            verification: "By submitting this form, you verify that the information provided is accurate and official. The dashboard account will be created using the provided email address.",
            successTitle: "Registration Submitted!",
            successDesc: "Your PWMU registration has been submitted successfully.",
            pendingApproval: "⏳ Your account is pending admin approval. You will be able to log in once approved.",
            goToLogin: "Go to Login Page",
            cancel: "Cancel",
            back: "Back",
            continue: "Continue",
            submitting: "Submitting...",
            submitRegistration: "Submit Registration"
        },
        hi: {
            title: "PWMU केंद्र पंजीकरण",
            subtitle: "राज्य नेटवर्क में एक नई प्लास्टिक अपशिष्ट प्रबंधन इकाई को शामिल करें।",
            step1: "स्थान",
            step2: "बुनियादी ढांचा",
            step3: "संपर्क",
            step4: "समीक्षा",
            basicLocation: "बुनियादी स्थान विवरण",
            district: "राज्य जिला",
            selectDistrict: "जिला चुनें",
            block: "ब्लॉक (तहसील)",
            selectBlock: "ब्लॉक चुनें",
            gp: "ग्राम पंचायत",
            selectGP: "ग्राम पंचायत चुनें",
            village: "गांव का नाम",
            selectVillage: "गांव चुनें",
            facilityName: "PWMU सुविधा का नाम",
            facilityPlaceholder: "जैसे बालोद केंद्रीय संसाधन रिकवरी केंद्र",
            setupDate: "स्थापना की तिथि",
            infraCapacity: "बुनियादी ढांचा और क्षमता",
            capacity: "प्रसंस्करण क्षमता (टन/दिन)",
            capacityPlaceholder: "जैसे 5",
            installedMachinery: "स्थापित मशीनरी",
            balerTitle: "हाइड्रोलिक बेलिंग मशीन",
            balerDesc: "सॉर्ट किए गए प्लास्टिक को घने, परिवहन योग्य गांठों में संपीड़ित करता है।",
            shredderTitle: "प्लास्टिक श्रेडर मशीन",
            shredderDesc: "पुनर्चक्रण के लिए कठोर प्लास्टिक को छोटे, प्रबंधनीय टुकड़ों में काटता है।",
            nodalContact: "नोडल संपर्क और लॉगिन विवरण",
            officerName: "अधिकारी का नाम",
            fullName: "पूरा नाम",
            phone: "फ़ोन नंबर",
            email: "ईमेल पता",
            setPassword: "पासवर्ड सेट करें",
            passwordReq: "न्यूनतम 6 अक्षर",
            passwordDesc: "यह आपका लॉगिन पासवर्ड होगा। आप एडमिन की मंजूरी के बाद लॉगिन कर सकते हैं।",
            reviewConfirm: "समीक्षा और पुष्टि करें",
            facilityReview: "सुविधा का नाम:",
            locationReview: "स्थान:",
            capacityReview: "क्षमता:",
            officerReview: "नोडल अधिकारी:",
            tonsDay: "टन/दिन",
            verification: "इस फॉर्म को सबमिट करके, आप सत्यापित करते हैं कि प्रदान की गई जानकारी सटीक और आधिकारिक है। डैशबोर्ड खाता प्रदान किए गए ईमेल पते का उपयोग करके बनाया जाएगा।",
            successTitle: "पंजीकरण सबमिट किया गया!",
            successDesc: "आपका PWMU पंजीकरण सफलतापूर्वक सबमिट कर दिया गया है।",
            pendingApproval: "⏳ आपका खाता एडमिन की मंजूरी के लिए लंबित है। स्वीकृत होने के बाद आप लॉगिन कर पाएंगे।",
            goToLogin: "लॉगिन पेज पर जाएं",
            cancel: "रद्द करें",
            back: "पीछे",
            continue: "जारी रखें",
            submitting: "सबमिट हो रहा है...",
            submitRegistration: "पंजीकरण सबमिट करें"
        }
    };

    const [locationData, setLocationData] = useState({});

    React.useEffect(() => {
        fetch('/data/locationData.json')
            .then(res => res.json())
            .then(data => setLocationData(data))
            .catch(err => console.error("Error loading location data:", err));
    }, []);

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
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };
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
            if (!formData.email || !formData.password) {
                throw new Error('Email and password are required.');
            }
            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters.');
            }

            await signUp(formData.email, formData.password, {
                full_name: formData.nodalName || formData.pwmuName,
                role: 'PWMUManager',
                district: formData.district,
                phone_number: formData.phone,
                registration_data: {
                    type: 'PWMU',
                    pwmuName: formData.pwmuName,
                    setupDate: formData.setupDate,
                    capacity: formData.capacity,
                    hasBaler: formData.hasBaler,
                    hasShredder: formData.hasShredder,
                    village: formData.village,
                    block: formData.block,
                    gramPanchayat: formData.gramPanchayat,
                    district: formData.district,
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
        { num: 1, label: t('step1', pwmuTranslations), icon: MapPin },
        { num: 2, label: t('step2', pwmuTranslations), icon: Factory },
        { num: 3, label: t('step3', pwmuTranslations), icon: User },
        { num: 4, label: t('step4', pwmuTranslations), icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-[#005DAA] to-[#00427A] p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-8 h-8 text-blue-200" />
                        <h2 className="text-2xl font-bold">{t('title', pwmuTranslations)}</h2>
                    </div>
                    <p className="text-blue-100 text-sm">{t('subtitle', pwmuTranslations)}</p>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('basicLocation', pwmuTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('district', pwmuTranslations)}</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    >
                                        <option value="">{t('selectDistrict', pwmuTranslations)}</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('block', pwmuTranslations)}</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} required disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">{t('selectBlock', pwmuTranslations)}</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('gp', pwmuTranslations)}</label>
                                    <select
                                        name="gramPanchayat" value={formData.gramPanchayat} onChange={handleInputChange} required disabled={!formData.block}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">{t('selectGP', pwmuTranslations)}</option>
                                        {gps.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('village', pwmuTranslations)}</label>
                                    <select
                                        name="village" value={formData.village} onChange={handleInputChange} required disabled={!formData.gramPanchayat}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] disabled:opacity-50"
                                    >
                                        <option value="">{t('selectVillage', pwmuTranslations)}</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('facilityName', pwmuTranslations)}</label>
                                    <input
                                        type="text" name="pwmuName" value={formData.pwmuName} onChange={handleInputChange} placeholder={t('facilityPlaceholder', pwmuTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('setupDate', pwmuTranslations)}</label>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('infraCapacity', pwmuTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('capacity', pwmuTranslations)}</label>
                                    <input
                                        type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} placeholder={t('capacityPlaceholder', pwmuTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-4 pt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('installedMachinery', pwmuTranslations)}</label>
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
                                                    {t('balerTitle', pwmuTranslations)}
                                                </span>
                                                <span className="block text-sm text-gray-500 mt-1">
                                                    {t('balerDesc', pwmuTranslations)}
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
                                                    {t('shredderTitle', pwmuTranslations)}
                                                </span>
                                                <span className="block text-sm text-gray-500 mt-1">
                                                    {t('shredderDesc', pwmuTranslations)}
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('nodalContact', pwmuTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('officerName', pwmuTranslations)}</label>
                                    <input
                                        type="text" name="nodalName" value={formData.nodalName} onChange={handleInputChange} placeholder={t('fullName', pwmuTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone', pwmuTranslations)}</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', pwmuTranslations)} <span className="text-red-500">*</span></label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="official@email.com" required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('setPassword', pwmuTranslations)} <span className="text-red-500">*</span></label>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('passwordReq', pwmuTranslations)} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA]"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{t('passwordDesc', pwmuTranslations)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('reviewConfirm', pwmuTranslations)}</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">{t('facilityReview', pwmuTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.pwmuName || 'N/A'}</div>

                                    <div className="text-gray-500">{t('locationReview', pwmuTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {[formData.village, formData.gramPanchayat, formData.block, formData.district].filter(Boolean).join(', ') || 'N/A'}
                                    </div>

                                    <div className="text-gray-500">{t('capacityReview', pwmuTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.capacity ? `${formData.capacity} ${t('tonsDay', pwmuTranslations)}` : 'N/A'}</div>

                                    <div className="text-gray-500">{t('officerReview', pwmuTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.nodalName || 'N/A'} ({formData.phone})</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-blue-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>{t('verification', pwmuTranslations)}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {submitSuccess && (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('successTitle', pwmuTranslations)}</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-2">{t('successDesc', pwmuTranslations)}</p>
                            <p className="text-amber-600 font-semibold mb-8">{t('pendingApproval', pwmuTranslations)}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3 rounded-lg text-sm font-medium text-white bg-[#005DAA] hover:bg-[#00427A] shadow-sm transition-colors"
                            >
                                {t('goToLogin', pwmuTranslations)}
                            </button>
                        </div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                            <p className="text-sm text-red-700 font-medium">{submitError}</p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    {!submitSuccess && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={step === 1 ? () => navigate('/register') : prevStep}
                                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center"
                                disabled={submitting}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {step === 1 ? t('cancel', pwmuTranslations) : t('back', pwmuTranslations)}
                            </button>

                            {step < 4 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#005DAA] hover:bg-[#00427A] shadow-sm transition-colors flex items-center"
                                >
                                    {t('continue', pwmuTranslations)}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-[#28A745] hover:bg-[#218838] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('submitting', pwmuTranslations)}</>
                                    ) : (
                                        <>{t('submitRegistration', pwmuTranslations)} <CheckCircle2 className="w-4 h-4 ml-2" /></>
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

export default PWMUReg;
