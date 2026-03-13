import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Truck, Save, CheckCircle2, TrendingUp, Search, Plus, MapPin, AlertCircle, Wrench, AlertTriangle, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const API_BASE = '/cgpwmu/api';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const DailyLogPWMU = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { t, language } = useLanguage();

    const dailyLogTranslations = {
        en: {
            title: "Daily Waste Intake Log",
            subtitle: "Record daily plastic waste collection from linked Gram Panchayats and Villages.",
            totalIntake: "Total Intake Today",
            reportingVillages: "Reporting Villages",
            saving: "Saving...",
            saveBtn: "Save Daily Log",
            saved: "Saved Successfully",
            linkedVillages: "Linked Villages & GPs",
            searchPlaceholder: "Search village...",
            colLocation: "Location Name",
            colType: "Type",
            colStatus: "Status/Source",
            colIntake: "Intake kg",
            autoFilled: "Auto-filled",
            manualEntry: "Manual",
            submitted: "Submitted",
            noMatch: "No linked villages matching \"{term}\" found.",
            dailyTotal: "Daily Total:",
            kg: "kg",
            gp: "Gram Panchayat",
            village: "Village",
            block: "Block",
            addVillage: "Add New Village",
            selectVillage: "Select Village to Add",
            close: "Close",
            noDataForDate: "No village reports found for this date.",
            autoFillTip: "Data auto-filled from Sarpanch submissions",
            existingLog: "Log Already Submitted",
            editLog: "Edit Log",
            updateBtn: "Update Daily Log"
        },
        hi: {
            title: "दैनिक अपशिष्ट अंतर्ग्रहण लॉग",
            subtitle: "लिंक की गई ग्राम पंचायतों और गांवों से दैनिक प्लास्टिक कचरा संग्रह रिकॉर्ड करें।",
            totalIntake: "आज का कुल अंतर्ग्रहण",
            reportingVillages: "रिपोर्टिंग गांव",
            saving: "सहेज रहा है...",
            saveBtn: "दैनिक लॉग सहेजें",
            saved: "सफलतापूर्वक सहेजा गया",
            linkedVillages: "लिंक किए गए गांव और ग्राम पंचायतें",
            searchPlaceholder: "गांव खोजें...",
            colLocation: "स्थान का नाम",
            colType: "प्रकार",
            colStatus: "स्थिति/स्रोत",
            colIntake: "अंतर्ग्रहण किलो",
            autoFilled: "ऑटो-फ़िल्ड",
            manualEntry: "मैनुअल",
            submitted: "सबमिट किया गया",
            noMatch: "\"{term}\" से मेल खाने वाला कोई गांव नहीं मिला।",
            dailyTotal: "दैनिक कुल:",
            kg: "किलो",
            gp: "ग्राम पंचायत",
            village: "गांव",
            block: "ब्लॉक",
            addVillage: "नया गांव जोड़ें",
            selectVillage: "जोड़ने के लिए गांव चुनें",
            close: "बंद करें",
            noDataForDate: "इस तिथि के लिए कोई ग्राम रिपोर्ट नहीं मिली।",
            autoFillTip: "सरपंच सबमिशन से डेटा ऑटो-फिल किया गया",
            existingLog: "लॉग पहले ही जमा किया जा चुका है",
            editLog: "लॉग संपादित करें",
            updateBtn: "दैनिक लॉग अपडेट करें"
        }
    };

    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');
    const todayObj = new Date();
    const today = todayObj.toISOString().split('T')[0];

    // Calculate min and max dates (+/- 30 days)
    const minDateObj = new Date();
    minDateObj.setDate(todayObj.getDate() - 30);
    const minDate = minDateObj.toISOString().split('T')[0];

    const maxDateObj = new Date();
    maxDateObj.setDate(todayObj.getDate() + 30);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(dateParam || today);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filter states for Add Village Modal
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedGP, setSelectedGP] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [center, setCenter] = useState(null);
    const [villages, setVillages] = useState([]);
    const [locationData, setLocationData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [existingRecord, setExistingRecord] = useState(null);

    useEffect(() => {
        const fetchCenter = async () => {
            if (!user) return;
            try {
                // Prioritize user's own registration_data (Session based)
                const reg = user.registration_data || {};
                if (reg.type === 'PWMU' || reg.role === 'PWMUManager') {
                    console.log("[DEBUG] Identified Center from Session:", reg.pwmuName || reg.centerName);
                    setCenter({
                        id: user.id, // Using user ID as primary identifier for Manager-led centers
                        name: reg.pwmuName || reg.centerName || 'PWMU Center',
                        district: reg.district
                    });
                    setIsLoading(false);
                    return;
                }

                // If not in session, query the database explicitly
                const { data, error } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district')
                    .eq('id', user.id)
                    .maybeSingle();

                if (data) {
                    setCenter(data);
                    setIsLoading(false);
                    return;
                }

                // Try as Nodal Officer link
                const { data: nodalData } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district')
                    .eq('nodal_officer_id', user.id)
                    .maybeSingle();

                if (nodalData) {
                    setCenter(nodalData);
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Center lookup failed, falling back to profile:", err.message);
            }

            // Fallback: Use the user's own profile as the center if they are a new PWMU Manager
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;

                if (token) {
                    const profileRes = await fetch(
                        `${API_BASE}/data/users?id=eq.${user.id}&select=registration_data`,
                        {
                            headers: {
                                'apikey': ANON_KEY,
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        if (profileData && profileData.length > 0) {
                            const managerProfile = profileData[0];
                            if (managerProfile?.registration_data?.type === 'PWMU') {
                                setCenter({
                                    id: user.id, // Using the user ID as the center ID for linking
                                    name: managerProfile.registration_data.pwmuName || 'PWMU Center',
                                    district: managerProfile.registration_data.district
                                });
                                return;
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile fallback for center:", err);
            }

            setIsLoading(false); // Stop loading if all methods fail
        };
        fetchCenter();
    }, [user]);

    const extractCode = (str) => {
        if (!str) return null;
        const match = str.match(/\((\d+)\)/);
        return match ? match[1] : null;
    };

    const getGPCodeForVillageCode = (vString) => {
        if (!locationData || !vString) return null;
        const vCode = extractCode(vString);
        if (!vCode) return null;

        // Optimize search if district is known
        const dNames = center?.district ? [center.district] : Object.keys(locationData);
        for (const dName of dNames) {
            const blocks = locationData[dName] || {};
            for (const bName in blocks) {
                const gps = blocks[bName] || {};
                for (const gpName in gps) {
                    const villages = gps[gpName] || [];
                    if (villages.some(v => extractCode(v) === vCode)) {
                        return extractCode(gpName);
                    }
                }
            }
        }
        return null;
    };

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/locationData.json`)
            .then(res => res.json())
            .then(data => setLocationData(data))
            .catch(err => console.error("Error loading location data:", err));
    }, []);

    // 1. URL Date Sync: Keep URL in sync with date picker
    useEffect(() => {
        const url = new URL(window.location.href);
        if (url.searchParams.get('date') !== selectedDate) {
            url.searchParams.set('date', selectedDate);
            window.history.pushState({}, '', url);
        }
    }, [selectedDate]);

    // Fetch villages from the users table (filtered by linked PWMU) 
    useEffect(() => {
        const fetchLinkedVillages = async () => {
            if (!center?.id) {
                console.warn("[FetchVillages] Skipping - NO CENTER ID", center);
                setIsLoading(false);
                return;
            }
            console.log("[FetchVillages] Starting for center:", center.id);
            setIsLoading(true);
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;

                if (!token) {
                    console.error("No auth token available");
                    setIsLoading(false);
                    return;
                }

                // 1. Fetch Sarpanch users linked to this center
                console.log("[FetchVillages] Querying Sarpanch users...");
                const sarpanchRes = await fetch(
                    `${API_BASE}/data/users?role=eq.Sarpanch&select=id,full_name,registration_data`,
                    {
                        headers: {
                            'apikey': ANON_KEY,
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                let fetchedVillages = [];
                if (sarpanchRes.ok) {
                    const sarpanchUsers = await sarpanchRes.json();
                    console.log("[FetchVillages] Found total Sarpanches:", sarpanchUsers.length);
                    const filtered = sarpanchUsers.filter(u => {
                        const reg = u.registration_data || {};
                        return String(reg.pwmuId) === String(center.id);
                    });
                    console.log("[FetchVillages] Filtered Sarpanches:", filtered.length);
                    
                    fetchedVillages = filtered.map(v => ({
                        id: v.id,
                        name: v.registration_data?.villageName || v.registration_data?.primaryVillage || v.registration_data?.gramPanchayat || v.full_name || 'Village',
                        type: 'Village',
                        autoFilled: false,
                        manualEntry: true, // Show "Manual" label
                        value: ''
                    }));
                }

                // 2. Fetch manager's profile to get service villages (selected during registration)
                console.log("[FetchVillages] Querying Manager profile (ID:", user.id, ") for serviceVillages...");
                const profileRes = await fetch(
                    `${API_BASE}/data/users?id=eq.${user.id}&select=registration_data`,
                    {
                        headers: {
                            'apikey': ANON_KEY,
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    console.log("[FetchVillages] Profile Result:", profileData);
                    if (profileData && profileData.length > 0) {
                        const managerProfile = profileData[0];
                        const reg = managerProfile?.registration_data || {};
                        if (reg.serviceVillages) {
                            const profileVillages = reg.serviceVillages;
                            console.log("[FetchVillages] Found serviceVillages in profile:", profileVillages);
                            profileVillages.forEach(vName => {
                                // Smart Deduplication:
                                // 1. Check for exact name match
                                // 2. Check if this village's parent GP is already in the list
                                const vCode = extractCode(vName);
                                const parentGPCode = getGPCodeForVillageCode(vCode);

                                const exists = fetchedVillages.find(fv => {
                                    // Exact name match
                                    if (fv.name === vName) return true;

                                    // Code match: If the village code matches a GP code in the list 
                                    // (e.g., Amora 124051 vs Amora 443193)
                                    const fvCode = extractCode(fv.name);
                                    if (vCode && fvCode && vCode === fvCode) return true;

                                    // Hierarchical match: If this village belongs to a GP already in the list
                                    if (parentGPCode && fvCode && parentGPCode === fvCode) return true;

                                    return false;
                                });

                                if (!exists) {
                                    fetchedVillages.push({
                                        id: `profile-${vName}`,
                                        name: vName,
                                        type: 'Village',
                                        autoFilled: false,
                                        manualEntry: true,
                                        value: ''
                                    });
                                }
                            });
                        }
                    }
                }

                setVillages(fetchedVillages);
            } catch (err) {
                console.error('Failed to fetch linked villages:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLinkedVillages();
    }, [center]);

    // Check if a PWMU log already exists for this date
    useEffect(() => {
        const checkExistingLog = async () => {
            if (!center?.id || !selectedDate) return;
            try {
                const { data, error } = await supabase
                    .from('pwmu_daily_logs')
                    .select('*')
                    .eq('pwmu_id', center.id)
                    .eq('log_date', selectedDate)
                    .maybeSingle();

                if (data) {
                    setIsLocked(true);
                    setExistingRecord(data);
                } else {
                    setIsLocked(false);
                    setExistingRecord(null);
                    setIsSaved(false);
                }
            } catch (err) {
                // No record found or other error
                setIsLocked(false);
                setExistingRecord(null);
                setIsSaved(false);
            }
        };
        checkExistingLog();
    }, [selectedDate, center]);

    // Auto-fill logic when date changes
    useEffect(() => {
        const autoFillData = async () => {
            if (!selectedDate || villages.length === 0 || !locationData || !center?.id) return;

            try {
                console.group(`[PWMU_AUTOFETCH] Checking data for ${selectedDate}`);
                console.log('Center ID:', center.id);

                // Fetch all records for this date and PWMU
                const { data, error } = await supabase
                    .from('waste_collections')
                    .select('village_id, village_name, gram_panchayat, shared_with_pwmu_kg, pwmu_id, collection_date, updated_at, created_at')
                    .eq('collection_date', selectedDate)
                    .eq('pwmu_id', center.id);

                if (error) {
                    console.error('Fetch error:', error);
                    console.groupEnd();
                    return;
                }

                console.log('Database Records Found:', data?.length || 0);

                if (data && data.length > 0) {
                    // Latest Record Priority: Sort by most recent update to handle historical duplicates
                    const sortedData = [...data].sort((a, b) =>
                        new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
                    );

                    console.log('Authoritative Records (Sorted):', sortedData);

                    setVillages(prev => {
                        let hasChanges = false;
                        const updated = prev.map(v => {
                            const vCode = extractCode(v.name);

                            // 1. Filter ALL records for this specific village using multiple criteria
                            const matches = sortedData.filter(d => {
                                // 1a. Match by UUID (Most Reliable)
                                if (d.village_id && d.village_id === v.id) return true;

                                // 1b. Match by Unique Code in name
                                const dVillageCode = extractCode(d.village_name);
                                const dGPCode = extractCode(d.gram_panchayat);
                                if (vCode && (vCode === dVillageCode || vCode === dGPCode)) return true;

                                // 1c. Match by Normalized Name
                                const normalize = (str) => str ? str.split('(')[0].trim().toLowerCase() : '';
                                const vNorm = normalize(v.name);
                                if (vNorm && (normalize(d.village_name) === vNorm || normalize(d.gram_panchayat) === vNorm)) return true;

                                return false;
                            });

                            if (matches.length > 0) {
                                // Pick the latest one that has a value > 0
                                const match = matches.find(m => Number(m.shared_with_pwmu_kg) > 0) || matches[0];
                                const newValue = (match.shared_with_pwmu_kg || 0).toString();

                                if (v.value !== newValue && Number(newValue) > 0) {
                                    hasChanges = true;
                                    console.log(`✅ Matched ${v.name}: ${newValue}kg (from ${matches.length} records)`);
                                    return { ...v, value: newValue, autoFilled: true, manualEntry: false };
                                }
                                return v;
                            } else {
                                // console.log(`❌ No match for village: ${v.name}`);
                                return v;
                            }
                        });
                        return hasChanges ? updated : prev;
                    });
                } else {
                    console.log('No records found in database for this center on this date.');
                }
                console.groupEnd();
            } catch (err) {
                console.error('Auto-fill error:', err);
                console.groupEnd();
            }
        };

        autoFillData();
    }, [selectedDate, center, locationData, villages]); // Re-added villages to ensure trigger after list load

    const handleValueChange = (id, newValue) => {
        setVillages(prev => prev.map(v =>
            v.id === id ? { ...v, value: newValue, autoFilled: false, manualEntry: true } : v
        ));
    };

    const addNewVillage = (vName) => {
        if (villages.find(v => v.name === vName)) return;
        setVillages(prev => [...prev, {
            id: `manual-${Date.now()}`,
            name: vName,
            type: 'Manual Entry',
            autoFilled: false,
            value: ''
        }]);
        setShowAddModal(false);
    };

    const totalIntake = villages.reduce((sum, v) => sum + (Number(v.value) || 0), 0);

    const filteredVillages = villages.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (e) => {
        e.preventDefault();

        // Validate date range
        if (selectedDate < minDate || selectedDate > maxDate) {
            alert(`Date must be between ${minDate} and ${maxDate}`);
            return;
        }

        setIsSaving(true);
        try {
            // Prepare submissions for all villages with values
            const submissions = villages
                .filter(v => v.value !== '' && Number(v.value) > 0)
                .map(v => ({
                    village_id: (v.id.startsWith('manual-') || v.id.startsWith('profile-')) ? null : v.id,
                    village_name: v.name,
                    pwmu_id: center?.id, // Link to the center
                    district: center?.district || null,
                    block: null, // Depending on if we have block context inside village
                    gram_panchayat: center?.district ? null : null, // Set to null if unavailable
                    collection_date: selectedDate,
                    wet_waste_kg: 0,
                    dry_waste_kg: parseFloat(v.value),
                    shared_with_pwmu_kg: parseFloat(v.value),
                    user_charge_collected: 0,
                    submitted: true
                }));

            if (submissions.length === 0) {
                setIsSaving(false);
                return;
            }

            // 1. Upsert Waste Collections
            const { error: collectErr } = await supabase
                .from('waste_collections')
                .upsert(submissions, { onConflict: 'pwmu_id,collection_date,village_name' });

            if (collectErr) throw collectErr;

            // 2. Mark day as Processed
            const intakeTotal = submissions.reduce((sum, s) => sum + (s.shared_with_pwmu_kg || 0), 0);
            const { error: logErr } = await supabase
                .from('pwmu_daily_logs')
                .upsert({
                    pwmu_id: center?.id,
                    log_date: selectedDate,
                    status: 'completed',
                    total_intake_kg: intakeTotal,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'pwmu_id,log_date' });

            if (logErr) throw logErr;

            // Optional: Register manual/profile villages to persist for the next day
            if (center?.id) {
                const manualVillages = villages.filter(v => (v.id.startsWith('manual-') || v.id.startsWith('profile-')) && v.value !== '' && Number(v.value) > 0);
                if (manualVillages.length > 0) {
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
                    const registerPayload = manualVillages.map(v => ({
                        full_name: v.name,
                        role: 'Sarpanch',
                        uid: `v_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                        registration_data: {
                            pwmuId: center.id,
                            gramPanchayat: v.name,
                            district: center.district,
                            source: 'auto-registered'
                        }
                    }));

                    fetch(`${API_BASE}/data/users`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(registerPayload)
                    }).catch(regErr => console.warn("Failed to auto-register manual villages:", regErr));
                }
            }

            // Success Updates
            setIsSaved(true);
            setIsLocked(true);
            setExistingRecord({
                pwmu_id: center?.id,
                log_date: selectedDate,
                status: 'completed',
                total_intake_kg: intakeTotal
            });

            setTimeout(() => navigate('/dashboard/pwmu'), 2000);
        } catch (err) {
            console.error('Save Error:', err);
            alert('Failed to save log: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in-up">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <Truck className="w-7 h-7 text-[#005DAA]" />
                        {t('title', dailyLogTranslations)}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {t('subtitle', dailyLogTranslations)}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            min={minDate}
                            max={maxDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block w-full pl-10 p-2.5 shadow-sm"
                        />
                    </div>
                </div>

                {isLocked && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-4 rounded-xl animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <div>
                            <p className="text-sm font-bold text-green-800">{t('existingLog', dailyLogTranslations)}</p>
                            <p className="text-xs text-green-600">You have already submitted the waste intake for this date.</p>
                        </div>
                        <button
                            onClick={() => setIsLocked(false)}
                            className="ml-auto text-xs font-bold text-[#005DAA] bg-white border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <Wrench className="w-3.5 h-3.5" />
                            {t('editLog', dailyLogTranslations)}
                        </button>
                    </div>
                )}
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp className="w-20 h-20" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 mb-2 z-10">{t('totalIntake', dailyLogTranslations)}</span>
                    <div className="flex items-baseline gap-2 z-10 transition-all duration-300">
                        <span className="text-4xl font-bold text-gray-900">{totalIntake.toFixed(1)}</span>
                        <span className="text-sm font-medium text-gray-500">{t('kg', dailyLogTranslations)}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                    <span className="text-sm font-medium text-gray-500 mb-2 z-10">{t('reportingVillages', dailyLogTranslations)}</span>
                    <div className="flex items-baseline gap-2 z-10">
                        <span className="text-4xl font-bold text-gray-900">
                            {villages.filter(v => v.value !== '').length}
                        </span>
                        <span className="text-sm font-medium text-gray-500">/ {villages.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden mb-auto justify-center">
                    {!isSaved && !isLocked ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm flex items-center justify-center transition-all ${isSaving ? 'bg-[#00427A] opacity-90' : 'bg-[#005DAA] hover:bg-[#00427A]'}`}
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('saving', dailyLogTranslations)}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    {existingRecord ? t('updateBtn', dailyLogTranslations) : t('saveBtn', dailyLogTranslations)}
                                </div>
                            )}
                        </button>
                    ) : (
                        <div className="w-full py-3 px-4 rounded-lg font-medium text-white bg-green-600 shadow-sm flex items-center justify-center animate-fade-in-up">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            {isLocked ? t('existingLog', dailyLogTranslations) : t('saved', dailyLogTranslations)}
                        </div>
                    )}
                </div>
            </div>

            {/* Data Entry Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="font-semibold text-gray-800">{t('linkedVillages', dailyLogTranslations)}</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="text-xs font-bold text-[#005DAA] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            + {t('addVillage', dailyLogTranslations)}
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder', dailyLogTranslations)}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block w-full sm:w-64 pl-9 p-2"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-8 h-8 border-4 border-[#005DAA] border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-gray-500 font-medium">Fetching linked villages...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-gray-600 min-w-[600px]">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">{t('colLocation', dailyLogTranslations)}</th>
                                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">{t('colType', dailyLogTranslations)}</th>
                                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold">{t('colStatus', dailyLogTranslations)}</th>
                                    <th scope="col" className="px-4 md:px-6 py-4 font-semibold text-right">{t('colIntake', dailyLogTranslations)}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredVillages.map((village) => (
                                    <tr key={village.id} className="hover:bg-gray-50 transition-colors group border-b border-gray-50/50 last:border-0">
                                        <td className="px-4 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {village.name}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {t(village.type.toLowerCase().includes('panchayat') ? 'gp' : village.type.toLowerCase().includes('block') ? 'block' : 'village', dailyLogTranslations)}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            {isLocked ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                    <CheckCircle2 className="w-3 h-3" /> {t('submitted', dailyLogTranslations)}
                                                </span>
                                            ) : village.autoFilled ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle2 className="w-3 h-3" /> {t('autoFilled', dailyLogTranslations)}
                                                </span>
                                            ) : village.manualEntry ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                                    <Activity className="w-3 h-3" /> {t('manualEntry', dailyLogTranslations)}
                                                </span>
                                            ) : null}
                                        </td>
                                        <td className="px-4 md:px-6 py-3 text-right">
                                            <div className="flex justify-end items-center">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.1"
                                                    value={village.value}
                                                    onChange={(e) => handleValueChange(village.id, e.target.value)}
                                                    disabled={isLocked}
                                                    placeholder="0.0"
                                                    className="w-24 md:w-32 bg-white border border-gray-200 text-gray-900 text-xs md:text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block p-2 text-right transition-all hover:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                />
                                                <span className="ml-2 text-gray-400 font-medium w-4">{t('kg', dailyLogTranslations)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredVillages.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            {t('noMatch', dailyLogTranslations).replace('{term}', searchTerm)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="bg-blue-50/50 border-t border-blue-100 font-semibold text-gray-900">
                                <tr>
                                    <td colSpan="3" className="px-4 md:px-6 py-4 text-right">{t('dailyTotal', dailyLogTranslations)}</td>
                                    <td className="px-4 md:px-6 py-4 text-right text-lg text-[#005DAA]">
                                        {totalIntake.toFixed(1)} <span className="text-sm font-medium text-gray-500">{t('kg', dailyLogTranslations)}</span>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </div>
            </div>

            {/* Add Village Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-800">{t('selectVillage', dailyLogTranslations)}</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
                        </div>
                        <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                            {locationData && Object.keys(locationData).length > 0 ? (
                                <div className="space-y-4">
                                    {/* District Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                        <select
                                            value={selectedDistrict}
                                            onChange={(e) => {
                                                setSelectedDistrict(e.target.value);
                                                setSelectedBlock('');
                                                setSelectedGP('');
                                            }}
                                            className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-[#005DAA] focus:border-[#005DAA]"
                                        >
                                            <option value="">Select District</option>
                                            {Object.keys(locationData).map(dist => (
                                                <option key={dist} value={dist}>{dist}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Block Selection */}
                                    {selectedDistrict && locationData[selectedDistrict] && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
                                            <select
                                                value={selectedBlock}
                                                onChange={(e) => {
                                                    setSelectedBlock(e.target.value);
                                                    setSelectedGP('');
                                                }}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-[#005DAA] focus:border-[#005DAA]"
                                            >
                                                <option value="">Select Block</option>
                                                {Object.keys(locationData[selectedDistrict]).map(block => (
                                                    <option key={block} value={block}>{block}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* GP Selection */}
                                    {selectedDistrict && selectedBlock && locationData[selectedDistrict][selectedBlock] && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gram Panchayat</label>
                                            <select
                                                value={selectedGP}
                                                onChange={(e) => setSelectedGP(e.target.value)}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-[#005DAA] focus:border-[#005DAA]"
                                            >
                                                <option value="">Select Gram Panchayat</option>
                                                {Object.keys(locationData[selectedDistrict][selectedBlock]).map(gp => (
                                                    <option key={gp} value={gp}>{gp}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Village Selection Form */}
                                    {selectedDistrict && selectedBlock && selectedGP && locationData[selectedDistrict][selectedBlock][selectedGP] && (
                                        <div className="pt-2 border-t border-gray-100">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Available Villages</label>
                                            <div className="flex flex-wrap gap-2">
                                                {locationData[selectedDistrict][selectedBlock][selectedGP].map(v => (
                                                    <button
                                                        key={v}
                                                        onClick={() => {
                                                            addNewVillage(v);
                                                            setShowAddModal(false);
                                                            // Reset filters after adding
                                                            setSelectedDistrict('');
                                                            setSelectedBlock('');
                                                            setSelectedGP('');
                                                        }}
                                                        className="text-sm bg-blue-50 text-[#005DAA] hover:bg-[#005DAA] hover:text-white px-3 py-1.5 rounded-lg border border-blue-100 transition-colors"
                                                    >
                                                        + {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-[#005DAA] border-t-transparent rounded-full animate-spin mb-2"></div>
                                    <p className="text-sm text-gray-500">Loading location data...</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                            >
                                {t('close', dailyLogTranslations)}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyLogPWMU;
