import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Truck, CheckCircle2, Calendar, MapPin, Search, RefreshCcw, AlertCircle, Save, ArrowLeft, Loader2, Info } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const VillageDailyReport = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const { user, refreshProfile } = useAuth();
    const [syncing, setSyncing] = useState(false);
    const [sessionWarning, setSessionWarning] = useState(false);

    useEffect(() => {
        if (user && user.role === 'Sarpanch') {
            const reg = user.registration_data || {};
            if (!reg.pwmuId || !reg.district) {
                setSessionWarning(true);
            } else {
                setSessionWarning(false);
            }
        }
    }, [user]);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await refreshProfile();
            console.log('[SYNC] Profile refreshed successfully.');
        } catch (err) {
            console.error('[SYNC] Refresh failed:', err);
        } finally {
            setSyncing(false);
        }
    };

    const villageDailyTranslations = {
        en: {
            title: "Village Daily Log",
            subtitle: "Track segregated waste collection at the Village level.",
            segregatedQuantities: "Segregated Quantities",
            enterInKg: "Enter in Kg",
            totalToday: "Total Collected Today",
            cancel: "Cancel",
            submit: "Submit",
            submitting: "Submitting...",
            successTitle: "Daily Log Saved!",
            successDesc: "Waste collection data for {village} has been successfully submitted for {date}.",
            wetLabel: "Wet Waste (गीला कचरा)",
            plasticLabel: "Plastic (प्लास्टिक)",
            metalLabel: "Metal (धातु)",
            glassLabel: "Glass (कांच)",
            ewasteLabel: "E-Waste (ई-कचरा)",
            otherLabel: "Other/Mixed (अन्य/मिश्रित)",
            sharedPWMULabel: "Plastic Waste Sent to PWMU (PWMU को भेजा गया प्लास्टिक)",
            transferTitle: "Primary Task: Share with PWMU",
            transferSubtitle: "Report the total plastic waste sent to the processing center today.",
            collectionTitle: "Village Record: Internal Collection (Optional)",
            kg: "kg"
        },
        hi: {
            title: "ग्राम दैनिक लॉग",
            subtitle: "ग्राम स्तर पर पृथकीकृत कचरा संग्रह को ट्रैक करें।",
            segregatedQuantities: "अलग की गई मात्रा",
            enterInKg: "किलोग्राम में दर्ज करें",
            totalToday: "आज कुल संग्रह",
            cancel: "रद्द करें",
            submit: "जमा करें",
            submitting: "जमा हो रहा है...",
            successTitle: "दैनिक लॉग सहेजा गया!",
            successDesc: "{village} के लिए कचरा संग्रह डेटा {date} के लिए सफलतापूर्वक सबमिट कर दिया गया है।",
            wetLabel: "गीला कचरा",
            plasticLabel: "प्लास्टिक",
            metalLabel: "धातु",
            glassLabel: "कांच",
            ewasteLabel: "ई-कचरा",
            otherLabel: "अन्य/मिश्रित",
            sharedPWMULabel: "PWMU को भेजा गया प्लास्टिक",
            transferTitle: "मुख्य कार्य: PWMU के साथ साझा करें",
            transferSubtitle: "आज प्रसंस्करण केंद्र को भेजे गए कुल प्लास्टिक कचरे की रिपोर्ट करें।",
            collectionTitle: "ग्राम रिकॉर्ड: आंतरिक संग्रह (वैकल्पिक)",
            kg: "किलो"
        }
    };

    const location = useLocation();

    // Get date from URL or default to today
    const getInitialDate = () => {
        const params = new URLSearchParams(location.search);
        const urlDate = params.get('date');
        return urlDate || new Date().toISOString().split('T')[0];
    };

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [basicInfo, setBasicInfo] = useState({
        villageName: '...',
        date: getInitialDate(),
        fullLocation: '...',
        pwmuName: 'Loading PWMU...'
    });
    const [wasteData, setWasteData] = useState({
        wet: { value: '', color: 'bg-green-50 border-green-100', icon: 'bg-green-100 text-green-600' },
        plastic: { value: '', color: 'bg-blue-50 border-blue-100', icon: 'bg-blue-100 text-blue-600' },
        metal: { value: '', color: 'bg-gray-50 border-gray-100', icon: 'bg-gray-200 text-gray-600' },
        glass: { value: '', color: 'bg-indigo-50 border-indigo-100', icon: 'bg-indigo-100 text-indigo-600' },
        ewaste: { value: '', color: 'bg-purple-50 border-purple-100', icon: 'bg-purple-100 text-purple-600' },
        other: { value: '', color: 'bg-orange-50 border-orange-100', icon: 'bg-orange-100 text-orange-600' },
        sharedPWMU: { value: '', color: 'bg-red-50 border-red-100', icon: 'bg-red-100 text-red-600' }
    });

    React.useEffect(() => {
        if (user) {
            const reg = user.registration_data || {};
            const villageName = reg.villageName || reg.primaryVillage || user.full_name || 'Village';
            const locationStr = [
                reg.district ? `District: ${reg.district}` : null,
                reg.block ? `Block: ${reg.block}` : null,
                reg.gramPanchayat ? `GP: ${reg.gramPanchayat}` : null,
                `Village: ${villageName}`
            ].filter(Boolean).join(' - ');

            setBasicInfo(prev => ({
                ...prev,
                villageName: villageName,
                pwmuId: reg.pwmuId || null,
                district: reg.district || null,
                block: reg.block || null,
                gramPanchayat: reg.gramPanchayat || null,
                fullLocation: locationStr
            }));

            // Fetch Linked PWMU Name
            const fetchPWMU = async () => {
                if (!reg.pwmuId) {
                    setBasicInfo(p => ({ ...p, pwmuName: 'Not Linked' }));
                    return;
                }
                try {
                    const proxyUrl = '/cgpwmu/api';
                    const res = await fetch(`${proxyUrl}/data/pwmu_centers?id=eq.${reg.pwmuId}&select=name`, {
                        headers: { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY }
                    });
                    const data = await res.json();
                    if (data && data[0]) {
                        setBasicInfo(p => ({ ...p, pwmuName: data[0].name }));
                    }
                } catch (err) {
                    console.error("PWMU Name fetch error:", err);
                    setBasicInfo(p => ({ ...p, pwmuName: 'Linked PWMU' }));
                }
            };
            fetchPWMU();
        }
    }, [user]);

    // Dynamic Labels based on language
    const wasteLabels = {
        wet: t('wetLabel', villageDailyTranslations),
        plastic: t('plasticLabel', villageDailyTranslations),
        metal: t('metalLabel', villageDailyTranslations),
        glass: t('glassLabel', villageDailyTranslations),
        ewaste: t('ewasteLabel', villageDailyTranslations),
        other: t('otherLabel', villageDailyTranslations),
        sharedPWMU: t('sharedPWMULabel', villageDailyTranslations)
    };

    const [existingRecordId, setExistingRecordId] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const [pwmuFilledEntry, setPwmuFilledEntry] = useState(null); // PWMU manually filled this date for village

    const checkExistingLog = async (selectedDate) => {
        if (!user?.id) return;
        setIsChecking(true);
        setPwmuFilledEntry(null);
        try {
            const proxyUrl = '/cgpwmu/api';
            const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const reg = user.registration_data || {};
            const villageName = reg.villageName || reg.primaryVillage || user.full_name || 'Village';

            // Check if PWMU has manually entered data for this village on this date
            if (reg.pwmuId) {
                const pwmuRes = await fetch(`${proxyUrl}/data/pwmu_village_intake?pwmu_id=eq.${reg.pwmuId}&collection_date=eq.${selectedDate}&village_name=eq.${encodeURIComponent(villageName)}&select=*`, {
                    headers: { 'apikey': ANON_KEY }
                });
                const pwmuData = await pwmuRes.json();
                if (pwmuData && pwmuData.length > 0) {
                    setPwmuFilledEntry(pwmuData[0]);
                    setIsLocked(true);
                    setWasteData(d => ({
                        ...d,
                        sharedPWMU: { ...d.sharedPWMU, value: pwmuData[0].received_kg || '' }
                    }));
                    setIsChecking(false);
                    return; // PWMU data takes precedence
                }
            }

            // Check village's own submission
            const res = await fetch(`${proxyUrl}/data/village_waste_reports?village_id=eq.${user.id}&collection_date=eq.${selectedDate}&select=*`, {
                headers: { 'apikey': ANON_KEY }
            });
            const data = await res.json();

            if (data && data.length > 0) {
                const record = data[0];
                setExistingRecordId(record.id);
                setIsLocked(true);
                setWasteData({
                    wet: { ...wasteData.wet, value: record.wet_waste_kg || '' },
                    plastic: { ...wasteData.plastic, value: record.dry_waste_kg || '' },
                    metal: { ...wasteData.metal, value: record.metal_waste_kg || '0' },
                    glass: { ...wasteData.glass, value: record.glass_waste_kg || '0' },
                    ewaste: { ...wasteData.ewaste, value: record.ewaste_kg || '0' },
                    other: { ...wasteData.other, value: record.other_waste_kg || '0' },
                    sharedPWMU: { ...wasteData.sharedPWMU, value: record.shared_with_pwmu_kg || '' }
                });
            } else {
                setExistingRecordId(null);
                setIsLocked(false);
                setWasteData({
                    wet: { ...wasteData.wet, value: '' },
                    plastic: { ...wasteData.plastic, value: '' },
                    metal: { ...wasteData.metal, value: '' },
                    glass: { ...wasteData.glass, value: '' },
                    ewaste: { ...wasteData.ewaste, value: '' },
                    other: { ...wasteData.other, value: '' },
                    sharedPWMU: { ...wasteData.sharedPWMU, value: '' }
                });
            }
        } catch (err) {
            console.error('Error checking existing log:', err);
        } finally {
            setIsChecking(false);
        }
    };

    React.useEffect(() => {
        if (user && basicInfo.date) {
            checkExistingLog(basicInfo.date);
        }
    }, [basicInfo.date, user?.id]);

    // Handlers
    const handleBasicInfoChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleWasteChange = (key, value) => {
        setWasteData(prev => ({
            ...prev,
            [key]: { ...prev[key], value: value }
        }));
    };

    // Calculations
    const totalWaste = Object.entries(wasteData)
        .filter(([key]) => key !== 'sharedPWMU')
        .reduce((sum, [_, item]) => sum + (Number(item.value) || 0), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Diagnostic Check: If metadata is missing, warn the user before they try to submit
        const reg = user?.registration_data || {};
        if (!reg.pwmuId || !reg.district) {
            console.warn('[DEBUG] Profile missing metadata. Details:', {
                user_id: user.id,
                registration_data: reg,
                pwmuId: reg.pwmuId,
                district: reg.district
            });
            // Removed the alert here, now handled by sessionWarning state and UI
        }

        setIsSaving(true);
        try {
            const dryWaste = (parseFloat(wasteData.plastic.value) || 0) +
                (parseFloat(wasteData.metal.value) || 0) +
                (parseFloat(wasteData.glass.value) || 0) +
                (parseFloat(wasteData.ewaste.value) || 0) +
                (parseFloat(wasteData.other.value) || 0);

            // Security & Traceability Check
            const finalPwmuId = basicInfo.pwmuId || reg.pwmuId;

            if (!finalPwmuId || finalPwmuId === 'null') {
                console.error('[DEBUG] CRITICAL: PWMU ID is missing!', { basicInfo, reg });
                alert("Error: Your profile is not correctly linked to a PWMU Center. Data cannot be shared. Please log out and log in again.");
                setIsSaving(false);
                return;
            }

            const submission = {
                village_id: user.id,
                village_name: reg.villageName || reg.primaryVillage || basicInfo.villageName || 'Village',
                district: reg.district || basicInfo.district || null,
                block: reg.block || basicInfo.block || null,
                gram_panchayat: reg.gramPanchayat || basicInfo.gramPanchayat || null,
                collection_date: basicInfo.date,
                wet_waste_kg: parseFloat(wasteData.wet.value) || 0,
                dry_waste_kg: dryWaste,
                shared_with_pwmu_kg: parseFloat(wasteData.sharedPWMU.value) || 0,
                metal_waste_kg: parseFloat(wasteData.metal.value) || 0,
                glass_waste_kg: parseFloat(wasteData.glass.value) || 0,
                ewaste_kg: parseFloat(wasteData.ewaste.value) || 0,
                other_waste_kg: parseFloat(wasteData.other.value) || 0,
                pwmu_id: finalPwmuId,
                user_charge_collected: 0,
                submitted: true,
                created_at: existingRecordId ? undefined : new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Validation: Ensure mandatory fields are present
            if (!submission.pwmu_id || !submission.district) {
                console.error('[DEBUG] Metadata missing!', submission);
                alert("Critical Error: Your profile is missing linked PWMU or Location data. Please log out and log in again to refresh your session. If the issue persists, contact the district nodal officer.");
                setIsSaving(false);
                return;
            }

            const proxyUrl = '/cgpwmu/api';
            const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const token = session.access_token || ANON_KEY;

            const headers = {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            };

            // 1. DELETE any existing records for this day/village (Robust Duplication Prevention)
            // This clears multiple entries if they exist from previous bugs
            console.log('[DEBUG] Clearing existing records for:', basicInfo.date);
            await fetch(`${proxyUrl}/data/village_waste_reports?village_id=eq.${user.id}&collection_date=eq.${basicInfo.date}`, {
                method: 'DELETE',
                headers
            });

            // 2. POST the new single record
            const url = `${proxyUrl}/data/village_waste_reports`;
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify([submission])
            });

            console.log('[DEBUG] Response Status:', response.status);

            if (!response.ok) {
                const errText = await response.text();
                console.error('[DEBUG] Save failed:', response.status, errText);
                throw new Error(`Failed to save data: ${errText}`);
            }

            console.log('[DEBUG] Save successful!');

            setIsLocked(true);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/village-hub');
            }, 3000);
        } catch (err) {
            console.error('Save error:', err);
            alert('Failed to save log: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center flex flex-col items-center animate-fade-in-up border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{existingRecordId ? 'Daily Log Updated!' : t('successTitle', villageDailyTranslations)}</h2>
                    <p className="text-gray-500 mb-6">{t('successDesc', villageDailyTranslations).replace('{village}', basicInfo.villageName).replace('{date}', basicInfo.date)}</p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] p-4 lg:p-8 pb-32">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Session Warning Banner */}
                {sessionWarning && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-slow">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-amber-900 font-bold">Session Data Missing</h3>
                                <p className="text-amber-700 text-sm">Your login session is missing linked PWMU or Location codes. This happens if your account was recently updated.</p>
                            </div>
                        </div>
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-sm transition-all disabled:opacity-50"
                        >
                            <RefreshCcw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                            {syncing ? 'Syncing...' : 'Sync Profile Data'}
                        </button>
                    </div>
                )}

                {/* PWMU-Filled Read-Only Banner */}
                {pwmuFilledEntry && (
                    <div className="bg-green-600 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-fade-in">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5" />
                            <div>
                                <span className="font-bold block">Reported by PWMU Center</span>
                                <span className="text-xs text-green-100">Your PWMU recorded {pwmuFilledEntry.received_kg} kg for your village on {basicInfo.date}</span>
                            </div>
                        </div>
                        <span className="text-xs bg-green-500 px-3 py-1 rounded-full">Read Only — You cannot edit PWMU entries</span>
                    </div>
                )}

                {/* Own Edit Mode Badge */}
                {existingRecordId && !pwmuFilledEntry && (
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg animate-fade-in">
                        <div className="flex items-center gap-3">
                            <Info className="w-5 h-5" />
                            <span className="font-bold">EDIT MODE ACTIVE</span>
                        </div>
                        <span className="text-xs bg-blue-500 px-3 py-1 rounded-full">Updating existing record for {basicInfo.date}</span>
                        {isLocked && (
                            <button
                                type="button"
                                onClick={() => setIsLocked(false)}
                                className="ml-4 flex items-center gap-2 px-4 py-2 bg-white border border-blue-500 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition-all shadow-sm"
                            >
                                <RefreshCcw className="w-3 h-3" />
                                Edit Log
                            </button>
                        )}
                    </div>
                )}

                {/* Header Section */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-4 -top-8 opacity-5 transform rotate-12 pointer-events-none">
                        <Leaf className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-green-600 text-white rounded-lg shadow-sm">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{t('title', villageDailyTranslations)}</h1>
                        </div>
                        <p className="text-[#005DAA] text-[11px] font-bold pl-12 uppercase tracking-widest bg-[#005DAA]/5 py-1 rounded-md inline-block px-3 ml-12 mb-1">{basicInfo.fullLocation}</p>
                        <p className="text-gray-600 text-sm pl-12">{t('subtitle', villageDailyTranslations)}</p>
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                name="date"
                                value={basicInfo.date}
                                onChange={handleBasicInfoChange}
                                disabled={isLocked}
                                className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 text-sm cursor-pointer outline-none disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-[#005DAA]/5 px-3 py-2 rounded-xl border border-[#005DAA]/10">
                            <MapPin className="w-4 h-4 text-[#005DAA]" />
                            <span className="text-sm font-semibold text-[#005DAA] truncate max-w-[150px]">{basicInfo.villageName}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Primary Section: PWMU Transfer */}
                    <div className="bg-white rounded-2xl shadow-md border-2 border-indigo-100 overflow-hidden ring-4 ring-indigo-50/50">
                        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                                <Truck className="w-6 h-6" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-bold tracking-wide uppercase text-sm">{t('transferTitle', villageDailyTranslations)}</h2>
                                        <div className="h-1.5 w-1.5 bg-indigo-300 rounded-full"></div>
                                        <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">TO: {basicInfo.pwmuName}</span>
                                    </div>
                                    <p className="text-[10px] text-indigo-100 font-medium">{t('transferSubtitle', villageDailyTranslations)}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-indigo-200 bg-indigo-700/50 px-2 py-1 rounded border border-indigo-500/30 uppercase tracking-tighter">REQUIRED FOR PWMU</span>
                        </div>
                        <div className="p-8 bg-gradient-to-b from-indigo-50/30 to-white text-center">
                            <div className="max-w-md mx-auto">
                                <label className="block text-lg font-bold text-indigo-900 mb-4">{t('sharedPWMULabel', villageDailyTranslations)}</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={wasteData.sharedPWMU.value}
                                        onChange={(e) => handleWasteChange('sharedPWMU', e.target.value)}
                                        min="0"
                                        step="0.1"
                                        placeholder="0.0"
                                        disabled={isLocked}
                                        className="w-full bg-white border-2 border-indigo-200 rounded-2xl py-6 px-8 text-center text-5xl font-black text-indigo-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all shadow-sm group-hover:shadow-md disabled:bg-indigo-50/50 disabled:text-indigo-400 disabled:cursor-not-allowed"
                                        autoFocus
                                    />
                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-300">kg</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-4 italic font-medium">This is the most important data for the PWMU center.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Village Internal Record */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('collectionTitle', villageDailyTranslations)}</h2>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">{t('enterInKg', villageDailyTranslations)}</span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(wasteData)
                                    .filter(([key]) => key !== 'sharedPWMU')
                                    .map(([key, item]) => (
                                        <div
                                            key={key}
                                            className={`relative p-3 rounded-xl border transition-all duration-200 group ${item.color} ${item.value ? 'shadow-sm opacity-100 ring-2 ring-current ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.icon} shadow-sm group-hover:scale-110 transition-transform`}>
                                                    {key === 'wet' && <Leaf className="w-4 h-4" />}
                                                    {key === 'plastic' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" /><path d="M14 4h-4a2 2 0 0 0-2 2v4h8V6a2 2 0 0 0-2-2z" /></svg>}
                                                    {key === 'metal' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>}
                                                    {key === 'glass' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 5-5-5-5 5v3.5a1.5 1.5 0 0 0 .58 1.15l4.89 3.65v4.2A1.5 1.5 0 0 0 12 19h0a1.5 1.5 0 0 0 1.5-1.5v-4.2l4.89-3.65A1.5 1.5 0 0 0 19 8.5V5z" /><path d="M5 5h10" /></svg>}
                                                    {key === 'ewaste' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="8" x="5" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 18h2" /><path d="M12 18h6" /></svg>}
                                                    {key === 'other' && <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                                                </div>
                                                <label className="block text-xs font-bold text-gray-700 truncate" title={wasteLabels[key]}>{wasteLabels[key]}</label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={item.value}
                                                    onChange={(e) => handleWasteChange(key, e.target.value)}
                                                    min="0"
                                                    placeholder="0.0"
                                                    disabled={isLocked}
                                                    className="w-full bg-white/50 backdrop-blur-sm border border-transparent rounded-lg py-1.5 pl-2 pr-6 text-right font-mono text-gray-800 font-bold focus:outline-none focus:bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] transition-all text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                                                />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none uppercase">kg</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Live Total Calculator */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('totalToday', villageDailyTranslations)} (Shed Only)</span>
                                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl flex items-baseline gap-1.5 grayscale opacity-70">
                                    <span className="text-xl font-black tracking-tighter">{totalWaste > 0 ? totalWaste.toFixed(1) : '0.0'}</span>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{t('kg', villageDailyTranslations)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-10"></div> {/* Spacer for fixed footer */}

                    {/* Bottom Action Bar (Fixed position but inside form context for submission) */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-end gap-3">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                            {t('cancel', villageDailyTranslations)}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || (totalWaste === 0 && wasteData.sharedPWMU.value === '')}
                            className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>{t('submitting', villageDailyTranslations)}</span>
                                </div>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    {t('submit', villageDailyTranslations)}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VillageDailyReport;
