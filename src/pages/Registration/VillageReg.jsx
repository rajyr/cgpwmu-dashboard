import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, MapPin, User, CheckCircle2, ArrowRight, ArrowLeft, Check, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

const VillageReg = () => {
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const { t } = useLanguage();

    const villageTranslations = {
        en: {
            title: "Gram Panchayat Registration",
            subtitle: "Onboard your village to start logging daily plastic waste collection and processing.",
            step1: "Location",
            step2: "Sarpanch Details",
            step3: "Review",
            basicLocation: "Basic Location Details",
            district: "State District",
            selectDistrict: "Select District",
            block: "Block (Tehsil)",
            selectBlock: "Select Block",
            gp: "Gram Panchayat Name",
            selectGP: "Select Gram Panchayat",
            village: "Primary Village",
            selectVillage: "Select Village",
            totalHH: "Total Households",
            hhPlaceholder: "e.g. 450",
            sarpanchDetails: "Sarpanch & Login Details",
            sarpanchName: "Sarpanch Name",
            fullName: "Full Name",
            phone: "Phone Number",
            email: "Email Address / GP ID",
            emailPlaceholder: "official.gp@email.com",
            setPassword: "Set Password",
            passwordReq: "Min 6 characters",
            passwordDesc: "This will be your login password. You can log in after district nodal approval.",
            reviewConfirm: "Review & Confirm",
            gpReview: "Gram Panchayat:",
            locationReview: "Location:",
            hhReview: "Households:",
            sarpanchReview: "Sarpanch Name:",
            verification: "By submitting this form, you verify that the information provided is accurate and official. The dashboard account will be created using the provided email address.",
            successTitle: "Registration Submitted!",
            successDesc: "Your Gram Panchayat registration has been submitted successfully.",
            pendingApproval: "⏳ Your account is pending district nodal approval. You will be able to log in once approved.",
            goToLogin: "Go to Login Page",
            cancel: "Cancel",
            back: "Back",
            continue: "Continue",
            submitting: "Submitting...",
            submitRegistration: "Submit GP Registration",
            pwmuUnit: "Linked PWMU Unit",
            selectPWMU: "Select PWMU Center",
            pwmuReview: "Linked PWMU:",
            detectLocation: "Detect Village Location",
            locationDetected: "Location Detected",
            detecting: "Detecting...",
            locationReq: "Please allow location access to find coordinates."
        },
        hi: {
            title: "ग्राम पंचायत पंजीकरण",
            subtitle: "दैनिक प्लास्टिक कचरा संग्रह और प्रसंस्करण शुरू करने के लिए अपने गांव को ऑनबोर्ड करें।",
            step1: "स्थान",
            step2: "सरपंच विवरण",
            step3: "समीक्षा",
            basicLocation: "बुनियादी स्थान विवरण",
            district: "राज्य जिला",
            selectDistrict: "जिला चुनें",
            block: "ब्लॉक (तहसील)",
            selectBlock: "ब्लॉक चुनें",
            gp: "ग्राम पंचायत का नाम",
            selectGP: "ग्राम पंचायत चुनें",
            village: "प्राथमिक गांव",
            selectVillage: "गांव चुनें",
            totalHH: "कुल परिवार",
            hhPlaceholder: "जैसे 450",
            sarpanchDetails: "सरपंच और लॉगिन विवरण",
            sarpanchName: "सरपंच का नाम",
            fullName: "पूरा नाम",
            phone: "फ़ोन नंबर",
            email: "ईमेल पता / ग्राम पंचायत आईडी",
            emailPlaceholder: "official.gp@email.com",
            setPassword: "पासवर्ड सेट करें",
            passwordReq: "न्यूनतम 6 अक्षर",
            passwordDesc: "यह आपका लॉगिन पासवर्ड होगा। आप जिला नोडल की मंजूरी के बाद लॉगिन कर सकते हैं।",
            reviewConfirm: "समीक्षा और पुष्टि करें",
            gpReview: "ग्राम पंचायत:",
            locationReview: "स्थान:",
            hhReview: "परिवार:",
            sarpanchReview: "सरपंच का नाम:",
            verification: "इस फॉर्म को सबमिट करके, आप सत्यापित करते हैं कि प्रदान की गई जानकारी सटीक और आधिकारिक है। डैशबोर्ड खाता प्रदान किए गए ईमेल पते का उपयोग करके बनाया जाएगा।",
            successTitle: "पंजीकरण सबमिट किया गया!",
            successDesc: "आपका ग्राम पंचायत पंजीकरण सफलतापूर्वक सबमिट कर दिया गया है।",
            pendingApproval: "⏳ आपका खाता जिला नोडल की मंजूरी के लिए लंबित है। स्वीकृत होने के बाद आप लॉगिन कर पाएंगे।",
            goToLogin: "लॉगिन पेज पर जाएं",
            cancel: "रद्द करें",
            back: "पीछे",
            continue: "जारी रखें",
            submitting: "सबमिट हो रहा है...",
            submitRegistration: "जीपी पंजीकरण सबमिट करें",
            pwmuUnit: "लिंक की गई PWMU इकाई",
            selectPWMU: "PWMU केंद्र चुनें",
            pwmuReview: "लिंक किया गया PWMU:",
            detectLocation: "गांव के स्थान का पता लगाएं",
            locationDetected: "स्थान का पता चला",
            detecting: "पता लगाया जा रहा है...",
            locationReq: "निर्देशांक खोजने के लिए कृपया स्थान पहुंच की अनुमति दें।"
        }
    };

    const [locationData, setLocationData] = useState({});
    const [pwmuCenters, setPwmuCenters] = useState([]);
    const [autoLinkedPWMU, setAutoLinkedPWMU] = useState('');
    const [formData, setFormData] = useState({
        district: '',
        block: '',
        gramPanchayatName: '',
        primaryVillage: '',
        totalHouseholds: '',
        sarpanchName: '',
        phone: '',
        email: '',
        password: '',
        pwmuId: '',
        latitude: null,
        longitude: null
    });

    React.useEffect(() => {
        const loadLocationData = async () => {
            const paths = [
                `${import.meta.env.BASE_URL}data/locationData.json`,
                'data/locationData.json',
                '/cgpwmu/data/locationData.json'
            ];
            for (const path of paths) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const data = await res.json();
                        setLocationData(data);
                        return;
                    }
                } catch (e) {}
            }
            console.error("Failed to load location data from any path");
        };
        loadLocationData();

        const stripCode = (str) => str ? str.replace(/\s*\(\d+\)\s*/g, '').trim() : '';

        const fetchPWMUs = async () => {
            try {
                const proxyUrl = '/cgpwmu/api';
                const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
                const res = await fetch(`${proxyUrl}/data/pwmu_centers?select=id,name,district,block,gram_panchayat,village`, {
                    headers: { 'apikey': ANON_KEY }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    const formatted = data.map(center => {
                        const locString = [
                            stripCode(center.district),
                            stripCode(center.block),
                            stripCode(center.gram_panchayat),
                            stripCode(center.village)
                        ].filter(Boolean).join(', ');

                        return {
                            id: center.id,
                            name: center.name || 'PWMU Center',
                            location: locString,
                            serviceVillages: [] // Note: serviceVillages are currently stored in user manager profile, 
                                              // but for linking we primarily need the center ID.
                        };
                    });
                    setPwmuCenters(formatted);
                } else {
                    console.error("Failed to fetch PWMUs from pwmu_centers table.");
                }
            } catch (err) {
                console.error("Error fetching PWMUs:", err);
            }
        };
        fetchPWMUs();
    }, []);

    // Effect for auto-linking based on selected Village or GP
    React.useEffect(() => {
        const villageToCheck = formData.primaryVillage || formData.gramPanchayatName;
        if (villageToCheck && pwmuCenters.length > 0) {
            const linkedPWMU = pwmuCenters.find(p => p.serviceVillages.includes(villageToCheck));
            if (linkedPWMU) {
                setAutoLinkedPWMU(linkedPWMU.name);
                setFormData(prev => ({ ...prev, pwmuId: linkedPWMU.id }));
            } else {
                setAutoLinkedPWMU('');
            }
        } else {
            setAutoLinkedPWMU('');
        }
    }, [formData.primaryVillage, formData.gramPanchayatName, pwmuCenters]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'district') {
                newData.block = '';
                newData.gramPanchayatName = '';
                newData.primaryVillage = '';
            } else if (name === 'block') {
                newData.gramPanchayatName = '';
                newData.primaryVillage = '';
            } else if (name === 'gramPanchayatName') {
                newData.primaryVillage = '';
            }
            return newData;
        });
    };

    const districts = Object.keys(locationData);
    const blocks = formData.district ? Object.keys(locationData[formData.district] || {}) : [];
    const gps = (formData.district && formData.block) ? Object.keys(locationData[formData.district][formData.block] || {}) : [];
    const villages = (formData.district && formData.block && formData.gramPanchayatName) ? (locationData[formData.district][formData.block][formData.gramPanchayatName] || []) : [];

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
 
    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert(t('locationReq', villageTranslations));
            return;
        }
        
        setSubmitting(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setFormData(prev => ({
                    ...prev,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                }));
                setSubmitting(false);
            },
            (err) => {
                console.error("Location error:", err);
                alert("Failed to get location. Please ensure GPS is on and permissions granted.");
                setSubmitting(false);
            },
            { enableHighAccuracy: true }
        );
    };

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
                full_name: formData.sarpanchName || formData.gramPanchayatName,
                role: 'Sarpanch',
                district: formData.district,
                phone_number: formData.phone,
                registration_data: {
                    type: 'VillageHub',
                    gramPanchayat: formData.gramPanchayatName,
                    primaryVillage: formData.primaryVillage,
                    totalHouseholds: formData.totalHouseholds,
                    block: formData.block,
                    district: formData.district,
                    pwmuId: formData.pwmuId,
                    latitude: formData.latitude,
                    longitude: formData.longitude
                },
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
        { num: 1, label: t('step1', villageTranslations), icon: MapPin },
        { num: 2, label: t('step2', villageTranslations), icon: User },
        { num: 3, label: t('step3', villageTranslations), icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] py-10 px-4 flex justify-center items-start">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                {/* Wizard Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <HomeIcon className="w-8 h-8 text-green-200" />
                        <h2 className="text-2xl font-bold">{t('title', villageTranslations)}</h2>
                    </div>
                    <p className="text-green-100 text-sm">{t('subtitle', villageTranslations)}</p>
                </div>

                {/* Progress Bar */}
                <div className="px-8 pt-8 pb-4">
                    <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 transition-all duration-300 z-0 rounded-full"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        ></div>

                        {steps.map((s) => {
                            const Icon = s.icon;
                            const isActive = step === s.num;
                            const isCompleted = step > s.num;

                            return (
                                <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-2 
                                        ${isActive ? 'bg-white border-green-600 text-green-600' :
                                            isCompleted ? 'bg-green-500 border-green-500 text-white' :
                                                'bg-white border-gray-200 text-gray-400'}`}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : s.num}
                                    </div>
                                    <span className={`text-[11px] font-semibold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap
                                        ${isActive ? 'text-green-600' : isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
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
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('basicLocation', villageTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('district', villageTranslations)}</label>
                                    <select
                                        name="district" value={formData.district} onChange={handleInputChange} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    >
                                        <option value="">{t('selectDistrict', villageTranslations)}</option>
                                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('block', villageTranslations)}</label>
                                    <select
                                        name="block" value={formData.block} onChange={handleInputChange} required disabled={!formData.district}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">{t('selectBlock', villageTranslations)}</option>
                                        {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('gp', villageTranslations)}</label>
                                    <select
                                        name="gramPanchayatName" value={formData.gramPanchayatName} onChange={handleInputChange} required disabled={!formData.block}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">{t('selectGP', villageTranslations)}</option>
                                        {gps.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('village', villageTranslations)}</label>
                                    <select
                                        name="primaryVillage" value={formData.primaryVillage} onChange={handleInputChange} required disabled={!formData.gramPanchayatName}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 disabled:opacity-50"
                                    >
                                        <option value="">{t('selectVillage', villageTranslations)}</option>
                                        {villages.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalHH', villageTranslations)}</label>
                                    <input
                                        type="number" name="totalHouseholds" value={formData.totalHouseholds} onChange={handleInputChange} placeholder={t('hhPlaceholder', villageTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <button
                                        type="button"
                                        onClick={handleDetectLocation}
                                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.latitude ? 'bg-green-50 border-green-200 text-green-700' : 'bg-green-50/50 border-green-100 text-green-700 hover:bg-green-100'}`}
                                    >
                                        <MapPin className={`w-5 h-5 ${formData.latitude ? 'text-green-600' : 'text-green-600'}`} />
                                        <span className="font-bold">
                                            {formData.latitude ? `${t('locationDetected', villageTranslations)} (${formData.latitude.toFixed(4)}, ${formData.longitude.toFixed(4)})` : t('detectLocation', villageTranslations)}
                                        </span>
                                        {formData.latitude && <CheckCircle2 className="w-4 h-4 ml-2" />}
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('pwmuUnit', villageTranslations)}
                                        {autoLinkedPWMU && <span className="ml-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Auto-linked</span>}
                                    </label>
                                    <select
                                        name="pwmuId" value={formData.pwmuId} onChange={handleInputChange} required disabled={!!autoLinkedPWMU}
                                        className={`w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600 ${autoLinkedPWMU ? 'opacity-70 bg-blue-50/50 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">{t('selectPWMU', villageTranslations)}</option>
                                        {pwmuCenters.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.location})
                                            </option>
                                        ))}
                                    </select>
                                    {autoLinkedPWMU && (
                                        <p className="text-xs text-blue-600 mt-1">You are automatically linked to {autoLinkedPWMU}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('sarpanchDetails', villageTranslations)}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('sarpanchName', villageTranslations)}</label>
                                    <input
                                        type="text" name="sarpanchName" value={formData.sarpanchName} onChange={handleInputChange} placeholder={t('fullName', villageTranslations)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('phone', villageTranslations)}</label>
                                    <input
                                        type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('email', villageTranslations)} <span className="text-red-500">*</span></label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('emailPlaceholder', villageTranslations)} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('setPassword', villageTranslations)} <span className="text-red-500">*</span></label>
                                    <input
                                        type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder={t('passwordReq', villageTranslations)} required
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-600"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{t('passwordDesc', villageTranslations)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">{t('reviewConfirm', villageTranslations)}</h3>
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 gap-y-3 text-sm">
                                    <div className="text-gray-500">{t('gpReview', villageTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.gramPanchayatName || 'N/A'}</div>

                                    <div className="text-gray-500">{t('locationReview', villageTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.block}, {formData.district}</div>

                                    <div className="text-gray-500">{t('hhReview', villageTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.totalHouseholds || '0'}</div>

                                    <div className="text-gray-500">{t('sarpanchReview', villageTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">{formData.sarpanchName || 'N/A'} ({formData.phone})</div>

                                    <div className="text-gray-500">{t('pwmuReview', villageTranslations)}</div>
                                    <div className="font-semibold text-gray-800 text-right">
                                        {pwmuCenters.find(p => p.id === formData.pwmuId)?.name || 'N/A'}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start gap-3 text-sm mt-4 border border-blue-100">
                                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <p>{t('verification', villageTranslations)}</p>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {submitSuccess && (
                        <div className="text-center py-12 animate-fade-in-up">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">{t('successTitle', villageTranslations)}</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-2">{t('successDesc', villageTranslations)}</p>
                            <p className="text-amber-600 font-semibold mb-8">{t('pendingApproval', villageTranslations)}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-3 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                            >
                                {t('goToLogin', villageTranslations)}
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
                                {step === 1 ? t('cancel', villageTranslations) : t('back', villageTranslations)}
                            </button>

                            {step < 3 ? (
                                <button
                                    onClick={nextStep}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors flex items-center"
                                >
                                    {t('continue', villageTranslations)}
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm transition-colors flex items-center"
                                >
                                    {submitting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t('submitting', villageTranslations)}</>
                                    ) : (
                                        <>{t('submitRegistration', villageTranslations)} <CheckCircle2 className="w-4 h-4 ml-2" /></>
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

export default VillageReg;
