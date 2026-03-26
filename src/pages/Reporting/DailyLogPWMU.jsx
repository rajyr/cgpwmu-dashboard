import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Truck, Save, CheckCircle2, TrendingUp, Search, Plus, MapPin, AlertCircle, Wrench, AlertTriangle, Activity, RotateCcw, Trash2, Maximize2, Minimize2 } from 'lucide-react';
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
            autoFillTip: "Data auto-filled from Village Shed submissions",
            existingLog: "Log Already Submitted",
            editLog: "Edit Log",
            updateBtn: "Update Daily Log",
            processedStockTitle: "Daily Waste Distribution",
            processedStockDesc: "Distribute the total waste ({total} kg) into correct categories. Sum must equal the daily total....",
            totalCategorized: "Total Categorized",
            matching: "Perfect Match",
            mismatch: "Check figures: Needs to be exactly {total} kg",
            materialCol: "Material Type",
            stockCol: "Current Stock",
            wetLabel: "Wet Waste (गीला कचरा)",
            plasticLabel: "Plastic (प्लास्टिक)",
            metalLabel: "Metal (धातु)",
            glassLabel: "Glass (कांच)",
            ewasteLabel: "E-Waste (ई-कचरा)",
            otherLabel: "Other/Mixed (अन्य/मिश्रित)"
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
            autoFillTip: "ग्राम शेड सबमिशन से डेटा ऑटो-फिल किया गया",
            existingLog: "लॉग पहले ही जमा किया जा चुका है",
            editLog: "लॉग संपादित करें",
            updateBtn: "दैनिक लॉग अपडेट करें",
            processedStockTitle: "दैनिक अपशिष्ट वितरण",
            processedStockDesc: "कुल कचरे ({total} किलो) को सही श्रेणियों में विभाजित करें। योग दैनिक कुल के बराबर होना चाहिए....",
            totalCategorized: "कुल वर्गीकृत",
            matching: "सटीक मिलान",
            mismatch: "आंकड़ों की जाँच करें: ठीक {total} किलो होना चाहिए",
            materialCol: "सामग्री का प्रकार",
            stockCol: "वर्तमान स्टॉक",
            wetLabel: "गीला कचरा",
            plasticLabel: "प्लास्टिक",
            metalLabel: "धातु",
            glassLabel: "कांच",
            ewasteLabel: "ई-कचरा",
            otherLabel: "अन्य/मिश्रित"
        }
    };

    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');
    const todayObj = new Date();
    const today = todayObj.toISOString().split('T')[0];

    // Calculate min and max dates (last 30 days)
    const minDateObj = new Date();
    minDateObj.setDate(todayObj.getDate() - 30);
    const minDate = minDateObj.toISOString().split('T')[0];

    const maxDate = today; // Restricted to today

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
    const [processedStock, setProcessedStock] = useState({
        'WET': '',
        'PLASTIC': '',
        'METAL': '',
        'GLASS': '',
        'EWASTE': '',
        'OTHER': ''
    });

    // New States for Redesign
    const [groupedData, setGroupedData] = useState({}); // { block: { gp: [villages] } }
    const [weeklyAverages, setWeeklyAverages] = useState({});
    const [lastValues, setLastValues] = useState({});
    const [expandedGPs, setExpandedGPs] = useState({}); // { gpCode: boolean }
    const [activeVillages, setActiveVillages] = useState(new Set());
    const [bulkValue, setBulkValue] = useState('');
    const [activeFilter, setActiveFilter] = useState(null); // 'non-reporting', 'spikes', 'inactive'
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [isCompact, setIsCompact] = useState(true);
    const [isAllExpanded, setIsAllExpanded] = useState(false);

    const toggleAllGPs = () => {
        const newState = !isAllExpanded;
        setIsAllExpanded(newState);
        const newExpanded = {};
        if (newState) {
            Object.values(groupedData).forEach(gps => {
                Object.keys(gps).forEach(gp => {
                    const gpCode = extractCode(gp) || gp;
                    newExpanded[gpCode] = true;
                });
            });
        }
        setExpandedGPs(newExpanded);
    };

    const handleKeyDown = (e, villageId) => {
        const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
        const index = inputs.findIndex(input => input.closest('.village-row')?.getAttribute('data-village-id') === villageId);
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = inputs[index + 1];
            if (next) next.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = inputs[index - 1];
            if (prev) prev.focus();
        }
    };

    const materialLabels = {
        'WET': t('wetLabel', dailyLogTranslations),
        'PLASTIC': t('plasticLabel', dailyLogTranslations),
        'METAL': t('metalLabel', dailyLogTranslations),
        'GLASS': t('glassLabel', dailyLogTranslations),
        'EWASTE': t('ewasteLabel', dailyLogTranslations),
        'OTHER': t('otherLabel', dailyLogTranslations)
    };

    useEffect(() => {
        const fetchCenter = async () => {
            if (!user) return;
            try {
                // PRIORITY 1: Query pwmu_centers by nodal_officer_id (same as MonthlyReport)
                const { data: nodalData } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district')
                    .eq('nodal_officer_id', user.id)
                    .maybeSingle();

                if (nodalData) {
                    console.log("[DEBUG] Center found by nodal_officer_id:", nodalData.id);
                    setCenter(nodalData);
                    setIsLoading(false);
                    return;
                }

                // PRIORITY 2: Try matching by center ID directly
                const { data: centerById } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district')
                    .eq('id', user.id)
                    .maybeSingle();

                if (centerById) {
                    console.log("[DEBUG] Center found by user.id:", centerById.id);
                    setCenter(centerById);
                    setIsLoading(false);
                    return;
                }

                // PRIORITY 3: Use session registration_data as fallback
                const reg = user.registration_data || {};
                if (reg.type === 'PWMU' || reg.role === 'PWMUManager' || reg.pwmuId) {
                    console.log("[DEBUG] Center from registration_data:", reg.pwmuId || user.id);
                    setCenter({
                        id: reg.pwmuId || user.id,
                        name: reg.pwmuName || reg.centerName || 'PWMU Center',
                        district: reg.district
                    });
                    setIsLoading(false);
                    return;
                }
            } catch (err) {
                console.warn("Center lookup failed:", err.message);
            }

            setIsLoading(false);
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
        const dataPath = `${import.meta.env.BASE_URL || '/'}data/locationData.json`.replace('//', '/');
        fetch(dataPath)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => setLocationData(data))
            .catch(err => {
                console.error("Error loading location data:", err);
                // Fallback attempt with relative path
                fetch('data/locationData.json')
                    .then(res => res.json())
                    .then(data => setLocationData(data))
                    .catch(e => console.error("Final fallback failed:", e));
            });
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
                        value: '',
                        reportId: null
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
                                        value: '',
                                        reportId: null
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

    // Grouping logic whenever villages or locationData changes
    useEffect(() => {
        if (villages.length === 0 || !locationData) return;

        const newGrouped = {};
        const activeSet = new Set();

        villages.forEach(v => {
            const vCode = extractCode(v.name);
            let blockName = 'Other';
            let gpName = 'Independent Villages';

            // Find block and GP from locationData
            if (v.block && v.gp) {
                blockName = v.block;
                gpName = v.gp;
            } else {
                for (const dName in locationData) {
                    const blocks = locationData[dName] || {};
                    for (const bName in blocks) {
                        const gps = blocks[bName] || {};
                        for (const gName in gps) {
                            const vList = gps[gName] || [];
                            if (vList.some(vn => extractCode(vn) === vCode)) {
                                blockName = bName;
                                gpName = gName;
                                break;
                            }
                        }
                    }
                }
            }

            if (!newGrouped[blockName]) newGrouped[blockName] = {};
            if (!newGrouped[blockName][gpName]) newGrouped[blockName][gpName] = [];
            
            // Mark as active if it has a value or was recently active (mock logic for now)
            if (Number(v.value) > 0 || v.autoFilled) activeSet.add(v.id);

            newGrouped[blockName][gpName].push(v);
        });

        setGroupedData(newGrouped);
        setActiveVillages(activeSet);
    }, [villages, locationData]);

    // Check if a PWMU log already exists for this date
    useEffect(() => {
        const checkExistingLog = async () => {
            if (!center?.id || !selectedDate) return;
            try {
                const { data, error } = await supabase
                    .from('pwmu_operational_logs')
                    .select('*')
                    .eq('pwmu_id', center.id)
                    .eq('log_date', selectedDate)
                    .maybeSingle();

                if (data) {
                    setIsLocked(true);
                    setExistingRecord(data);
                    
                    // NEW: Load daily category breakdown if it exists
                    if (data.processed_stock_breakdown) {
                        try {
                            const breakdown = typeof data.processed_stock_breakdown === 'string' 
                                ? JSON.parse(data.processed_stock_breakdown) 
                                : data.processed_stock_breakdown;
                            setProcessedStock(breakdown);
                        } catch (e) {
                            console.error("Failed to parse daily breakdown:", e);
                        }
                    }
                } else {
                    setIsLocked(false);
                    setExistingRecord(null);
                    setIsSaved(false);
                    // Reset processed stock for new log
                    setProcessedStock({
                        'WET': '',
                        'PLASTIC': '',
                        'METAL': '',
                        'GLASS': '',
                        'EWASTE': '',
                        'OTHER': ''
                    });
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
                
                // 1. Fetch Sarpanch reports (Suggestions/Auto-fill)
                const { data: sarpanchData, error: sErr } = await supabase
                    .from('village_waste_reports')
                    .select('id, village_id, village_name, gram_panchayat, shared_with_pwmu_kg, updated_at, created_at')
                    .eq('collection_date', selectedDate)
                    .eq('pwmu_id', center.id);

                // 2. Fetch Confirmed Intake (Authoritative - includes manual entries)
                const { data: confirmedData, error: cErr } = await supabase
                    .from('pwmu_village_intake')
                    .select('id, village_name, received_kg, village_report_id')
                    .eq('collection_date', selectedDate)
                    .eq('pwmu_id', center.id);

                if (sErr || cErr) {
                    console.error('Fetch error:', sErr || cErr);
                    console.groupEnd();
                    return;
                }

                console.log('Sarpanch Reports:', sarpanchData?.length || 0);
                console.log('Confirmed Intake:', confirmedData?.length || 0);

                setVillages(prev => {
                    let hasChanges = false;
                    const updated = prev.map(v => {
                        const vCode = extractCode(v.name);
                        
                        // A. Check for Confirmed Intake (Saved by Manager)
                        const confirmedMatch = confirmedData?.find(d => {
                            if (d.village_name === v.name) return true;
                            const dCode = extractCode(d.village_name);
                            return vCode && dCode && vCode === dCode;
                        });

                        if (confirmedMatch) {
                            const val = confirmedMatch.received_kg.toString();
                            if (v.value !== val) {
                                hasChanges = true;
                                return { ...v, value: val, autoFilled: false, manualEntry: true, reportId: confirmedMatch.village_report_id };
                            }
                            return v;
                        }

                        // B. Check for Sarpanch Reports (Auto-fill Suggestions)
                        const sarpanchMatches = sarpanchData?.filter(d => {
                            if (d.village_id && d.village_id === v.id) return true;
                            const dCode = extractCode(d.village_name);
                            if (vCode && dCode && vCode === dCode) return true;
                            const normalize = (str) => str ? str.split('(')[0].trim().toLowerCase() : '';
                            return normalize(v.name) === normalize(d.village_name);
                        });

                        if (sarpanchMatches && sarpanchMatches.length > 0) {
                            const match = sarpanchMatches.sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))[0];
                            const val = (match.shared_with_pwmu_kg || 0).toString();
                            if (v.value !== val && Number(val) > 0) {
                                hasChanges = true;
                                return { ...v, value: val, autoFilled: true, manualEntry: false, reportId: match.id };
                            }
                        }
                        return v;
                    });
                    return hasChanges ? updated : prev;
                });
                console.groupEnd();
            } catch (err) {
                console.error('Auto-fill error:', err);
                console.groupEnd();
            }
        };
        autoFillData();
    }, [selectedDate, center, villages.length]);


    const handleBulkDistribute = (total) => {
        if (!total || isNaN(total) || parseFloat(total) < 0) return;
        const targetVillages = villages; // Distribute across all by default
        const perVillage = (parseFloat(total) / targetVillages.length).toFixed(1);
        
        setVillages(prev => prev.map(v => ({
            ...v,
            value: perVillage,
            manualEntry: true,
            autoFilled: false
        })));
        setBulkValue('');
    };

    const copyYesterdayData = async () => {
        const yesterday = new Date(selectedDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yDate = yesterday.toISOString().split('T')[0];

        try {
            const { data } = await supabase
                .from('pwmu_village_intake')
                .select('village_name, received_kg')
                .eq('pwmu_id', center?.id)
                .eq('collection_date', yDate);

            if (data && data.length > 0) {
                setVillages(prev => prev.map(v => {
                    const match = data.find(d => d.village_name === v.name);
                    return match ? { ...v, value: match.received_kg.toString(), manualEntry: true, autoFilled: false } : v;
                }));
            }
        } catch (err) {
            console.error("Failed to copy yesterday's data:", err);
        }
    };
    const handleValueChange = (id, newValue) => {
        // Prevent negative values
        const normalizedValue = (newValue !== '' && parseFloat(newValue) < 0) ? '0' : newValue;
        setVillages(prev => prev.map(v =>
            v.id === id ? { ...v, value: normalizedValue, autoFilled: false, manualEntry: true } : v
        ));
    };

    const handleClearVillage = (id) => {
        setVillages(prev => prev.map(v => v.id === id ? { ...v, value: '', autoFilled: false, manualEntry: true } : v));
    };

    const handleClearGP = (gpVillages) => {
        const ids = gpVillages.map(v => v.id);
        setVillages(prev => prev.map(v => ids.includes(v.id) ? { ...v, value: '', autoFilled: false, manualEntry: true } : v));
    };

    const addNewVillage = (vName) => {
        if (villages.find(v => v.name === vName)) return;
        setVillages(prev => [...prev, {
            id: `manual-${Date.now()}`,
            name: vName,
            type: 'Village',
            block: selectedBlock,
            gp: selectedGP,
            autoFilled: false,
            value: '',
            reportId: null
        }]);
        setShowAddModal(false);
    };

    const totalIntake = villages.reduce((sum, v) => sum + (Number(v.value) || 0), 0);
    const totalCategorized = Object.values(processedStock).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const isMatch = Math.abs(totalIntake - totalCategorized) < 0.01;

    // Auto-calculate 'OTHER' waste based on total intake minus other categories
    useEffect(() => {
        if (!processedStock || isLocked) return;
        
        const otherCategories = ['WET', 'PLASTIC', 'METAL', 'GLASS', 'EWASTE'];
        const totalCategorizedOthers = otherCategories.reduce((sum, key) => {
            return sum + (parseFloat(processedStock[key]) || 0);
        }, 0);

        const calculatedOther = Math.max(0, totalIntake - totalCategorizedOthers);
        
        // Only update if the value has changed significantly (avoid float jitter)
        const currentOther = parseFloat(processedStock.OTHER) || 0;
        if (Math.abs(currentOther - calculatedOther) > 0.05) {
            setProcessedStock(prev => ({
                ...prev,
                OTHER: calculatedOther > 0 ? calculatedOther.toFixed(1) : ''
            }));
        }
    }, [totalIntake, processedStock.WET, processedStock.PLASTIC, processedStock.METAL, processedStock.GLASS, processedStock.EWASTE, isLocked]);


    const filteredVillages = villages.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = async (e) => {
        e.preventDefault();

        // Validate Total Matching
        if (!isMatch && totalIntake > 0) {
            alert(`Validation Error: The sum of categorized waste (${totalCategorized.toFixed(1)} kg) must exactly match the Daily Total (${totalIntake.toFixed(1)} kg).`);
            return;
        }

        // Validate date range
        if (selectedDate < minDate || selectedDate > maxDate) {
            alert(`Reporting is restricted to the last 30 days (${minDate} to ${maxDate}).`);
            return;
        }

        setIsSaving(true);
        try {
            // 1. Upsert Village Intake Confirmations
            const confirmations = villages
                .filter(v => v.value !== '' && Number(v.value) > 0)
                .map(v => ({
                    // Use a more stable ID: center-village-date
                    id: `vintake-${center?.id}-${(extractCode(v.name) || v.name).replace(/\s+/g, '_')}-${selectedDate}`,
                    pwmu_id: center?.id,
                    village_name: v.name,
                    collection_date: selectedDate,
                    received_kg: parseFloat(v.value),
                    village_report_id: v.autoFilled ? v.reportId : null
                }));

            if (confirmations.length === 0) {
                setIsSaving(false);
                return;
            }

            const { error: intakeErr } = await supabase
                .from('pwmu_village_intake')
                .upsert(confirmations, { onConflict: 'pwmu_id,collection_date,village_name' });

            if (intakeErr) throw intakeErr;

            // 2. Upsert Daily Operational Log
            const intakeTotal = confirmations.reduce((sum, s) => sum + (s.received_kg || 0), 0);
            const { error: logErr } = await supabase
                .from('pwmu_operational_logs')
                .upsert({
                    id: `log-${center?.id}-${selectedDate}`,
                    pwmu_id: center?.id,
                    log_date: selectedDate,
                    total_intake_kg: intakeTotal,
                    processed_kg: totalCategorized, // Sum tracking
                    processed_stock_breakdown: JSON.stringify(processedStock),
                    reporting_count: confirmations.length,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'pwmu_id,log_date' });

            if (logErr) throw logErr;

            // 3. Update Monthly Report Aggregation
            const monthYear = selectedDate.substring(0, 7); // YYYY-MM
            try {
                // Simplified aggregation: In a real app, this should be a backend function
                // Fetch all daily intakes for this month
                const { data: monthData } = await supabase
                    .from('pwmu_operational_logs')
                    .select('total_intake_kg')
                    .eq('pwmu_id', center?.id)
                    .like('log_date', `${monthYear}%`);
                
                const monthTotalKg = monthData?.reduce((s, d) => s + (d.total_intake_kg || 0), 0) || 0;

                await supabase
                    .from('pwmu_monthly_reports')
                    .upsert({
                        id: `mrep-${center?.id}-${monthYear}`,
                        pwmu_id: center?.id,
                        month_year: monthYear,
                        total_intake_mt: monthTotalKg / 1000,
                        village_participation_count: confirmations.length // simplified
                    }, { onConflict: 'pwmu_id,month_year' });
            } catch (mErr) {
                console.warn("Failed to update monthly summary:", mErr);
            }

            // 4. Update Market Availability (CUMULATIVE: add to existing stock)
            // First, fetch current stock for this PWMU
            const { data: existingStock } = await supabase
                .from('market_availability')
                .select('material, stock_kg')
                .eq('pwmu_id', center?.id);
            
            const existingMap = {};
            (existingStock || []).forEach(row => {
                existingMap[row.material] = row.stock_kg || 0;
            });

            const marketUpserts = Object.entries(processedStock)
                .filter(([_, qty]) => qty !== '' && Number(qty) >= 0)
                .map(([material, qty]) => {
                    const materialKey = material; // Already uppercase (WET, PLASTIC, etc.)
                    // Add today's entry to existing stock
                    const newStock = (existingMap[materialKey] || 0) + parseFloat(qty);
                    return {
                        id: `market-${center?.id}-${materialKey}`.toLowerCase().replace(/\s+/g, '_'),
                        pwmu_id: center?.id,
                        pwmu_name: center?.name,
                        material: materialKey,
                        stock_kg: newStock
                    };
                });

            if (marketUpserts.length > 0) {
                const { error: marketErr } = await supabase
                    .from('market_availability')
                    .upsert(marketUpserts, { onConflict: 'pwmu_id,material' });
                if (marketErr) throw marketErr;
            }

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
                            gramPanchayat: v.gp || v.name,
                            block: v.block || center.block,
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
        <div className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
            <div className="p-6 max-w-5xl mx-auto space-y-8">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                {/* Redesigned Grouped Accordion View */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    {/* Left Side: Summary Panel (Sticky) */}
                    <div className="lg:col-span-1 sticky top-6 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Summary Panel
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50/50 rounded-xl">
                                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Intake Today</p>
                                    <p className="text-3xl font-black text-blue-900">{totalIntake.toFixed(1)} <span className="text-sm font-medium">kg</span></p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Reporting</p>
                                        <p className="text-xl font-bold text-gray-800">{villages.filter(v => v.value !== '').length}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Missing</p>
                                        <p className="text-xl font-bold text-red-500">{villages.filter(v => v.value === '').length}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-gray-100 space-y-2">
                                    <button onClick={copyYesterdayData} className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                                        <Plus className="w-4 h-4" /> Copy Yesterday
                                    </button>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input 
                                            type="number" 
                                            placeholder="Distribute Total" 
                                            className="w-full py-2 px-3 text-sm border border-gray-200 rounded-lg focus:ring-blue-500"
                                            value={bulkValue}
                                            min="0"
                                            onChange={(e) => setBulkValue(e.target.value)}
                                        />
                                        <button onClick={() => handleBulkDistribute(bulkValue)} className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95">
                                            <Truck className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                            <p className="text-xs font-semibold text-amber-800 flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4" /> Smart Filters
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setActiveFilter(activeFilter === 'non-reporting' ? null : 'non-reporting')} className={`text-[10px] border px-2 py-1 rounded-md font-bold uppercase transition-all ${activeFilter === 'non-reporting' ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100'}`}>Non-Reporting</button>
                                <button onClick={() => setActiveFilter(activeFilter === 'spikes' ? null : 'spikes')} className={`text-[10px] border px-2 py-1 rounded-md font-bold uppercase transition-all ${activeFilter === 'spikes' ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100'}`}>Sudden Spikes</button>
                                <button onClick={() => setActiveFilter(activeFilter === 'inactive' ? null : 'inactive')} className={`text-[10px] border px-2 py-1 rounded-md font-bold uppercase transition-all ${activeFilter === 'inactive' ? 'bg-amber-600 text-white border-amber-700 shadow-md scale-105' : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-100'}`}>Inactive</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Grouped Accordions */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    Hierarchical Waste Log
                                </h2>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={toggleAllGPs}
                                        className="text-[10px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all flex items-center gap-1.5"
                                    >
                                        {isAllExpanded ? <Minimize2 className="w-3 h-3 text-blue-600" /> : <Maximize2 className="w-3 h-3 text-blue-600" />}
                                        {isAllExpanded ? 'Collapse All' : 'Expand All'}
                                    </button>
                                    <button 
                                        onClick={() => setIsCompact(!isCompact)}
                                        className={`text-[10px] font-black uppercase tracking-tight px-3 py-1.5 rounded-lg border transition-all ${isCompact ? 'bg-blue-600 text-white border-blue-700 shadow-sm' : 'border-gray-200 hover:bg-white hover:shadow-sm'}`}
                                    >
                                        {isCompact ? 'Compact: ON' : 'Compact: OFF'}
                                    </button>
                                    <button onClick={() => setShowAddModal(true)} className="text-[10px] font-black uppercase tracking-tight text-[#005DAA] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors whitespace-nowrap">+ {t('addVillage', dailyLogTranslations)}</button>
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-7 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg w-40 focus:ring-1 focus:ring-blue-500 shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-0">
                                {Object.entries(groupedData).map(([block, gps]) => (
                                    <div key={block} className="border-b border-gray-100 last:border-0 bg-gray-50/50 px-6 py-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Block: {block}</span>
                                        {Object.entries(gps).map(([gp, vlgs]) => {
                                            const gpCode = extractCode(gp) || gp;
                                            const effectiveExpanded = expandedGPs[gpCode] || (searchTerm.length > 0 && vlgs.some(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())));
                                            if (searchTerm.length > 0 && !vlgs.some(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())) && !gp.toLowerCase().includes(searchTerm.toLowerCase())) return null;
                                            return (
                                                <div key={gp} className={`bg-white border-t border-gray-100 text-gray-800 normal-case tracking-normal mt-1 rounded-lg overflow-hidden shadow-sm first:mt-0 ${isCompact ? 'mb-0.5' : 'mb-2'}`}>
                                                    <div className={`${isCompact ? 'px-4 py-2' : 'px-6 py-4'} flex items-center justify-between cursor-pointer group hover:bg-gray-50/50`} onClick={() => setExpandedGPs(prev => ({ ...prev, [gpCode]: !prev[gpCode] }))}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center transition-all ${effectiveExpanded ? 'bg-blue-600 text-white rotate-135' : 'bg-blue-50 text-blue-600'}`}>
                                                                <Plus className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold uppercase">{gp}</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-[10px] font-bold text-gray-400">{vlgs.filter(v => v.value !== '').length} / {vlgs.length} Reporting</span>
                                                                    {vlgs.some(v => v.value !== '') && (
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if(confirm(`Clear all ${vlgs.length} villages in ${gp}?`)) handleClearGP(vlgs);
                                                                            }}
                                                                            className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-tighter flex items-center gap-0.5 px-1 rounded hover:bg-red-50 transition-colors"
                                                                        >
                                                                            <RotateCcw className="w-2.5 h-2.5" /> Clear All
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {effectiveExpanded && (
                                                        <div className={`bg-gray-50/20 ${isCompact ? 'px-4 pb-4 pt-1 space-y-1' : 'px-6 pb-6 space-y-2'}`}>
                                                            {vlgs.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase())).map(v => (
                                                                <div key={v.id} data-village-id={v.id} className={`village-row bg-white rounded-xl border flex items-center justify-between shadow-sm hover:border-blue-200 transition-all ${isCompact ? 'p-2' : 'p-4'}`}>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`rounded-full ${isCompact ? 'w-2 h-2' : 'w-2.5 h-2.5'} ${Number(v.value) > 0 ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}></div>
                                                                        <span className={`${isCompact ? 'text-[13px]' : 'text-sm'} font-bold`}>{v.name}</span>
                                                                    </div>
                                                                    <div className={`flex items-center ${isCompact ? 'gap-1.5' : 'gap-2'}`}>
                                                                        <div className="relative group/input">
                                                                            <input type="number" value={v.value} min="0" onChange={(e) => handleValueChange(v.id, e.target.value)} onKeyDown={(e) => handleKeyDown(e, v.id)} className={`${isCompact ? 'w-20 px-1 py-1 text-xs' : 'w-24 p-2 text-sm'} bg-gray-50 border border-gray-200 rounded-lg text-center font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all`} />
                                                                            {v.value !== '' && (
                                                                                <button 
                                                                                    onClick={() => handleClearVillage(v.id)}
                                                                                    className="absolute -right-2 -top-2 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all opacity-0 group-hover/input:opacity-100"
                                                                                >
                                                                                    <RotateCcw className="w-3 h-3" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                        <span className="text-xs font-bold text-gray-400">kg</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Processed Material Stock Section */}
                <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-500 ${isMatch ? 'border-gray-100' : 'border-orange-300 shadow-lg shadow-orange-50' } overflow-hidden`}>
                    <div className={`p-6 border-b border-gray-100 transition-colors duration-500 ${isMatch ? 'bg-blue-50/20' : 'bg-orange-50/20'} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                            <Activity className={`w-6 h-6 ${isMatch ? 'text-blue-600' : 'text-orange-600'}`} />
                            <h2 className="text-xl font-bold text-gray-800">{t('processedStockTitle', dailyLogTranslations)}</h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase block tracking-tighter leading-none mb-1">Categorized</span>
                                    <span className={`text-lg font-black leading-none ${isMatch ? 'text-blue-600' : 'text-orange-600'}`}>{totalCategorized.toFixed(1)} <small className="text-[10px] uppercase">kg</small></span>
                                </div>
                                <div className="h-8 w-px bg-gray-200"></div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase block tracking-tighter leading-none mb-1">Target Total</span>
                                    <span className="text-lg font-black text-gray-800 leading-none">{totalIntake.toFixed(1)} <small className="text-[10px] uppercase">kg</small></span>
                                </div>
                            </div>

                            {!isMatch && totalIntake > 0 && (
                                <div className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[11px] font-black flex items-center gap-2 shadow-sm animate-pulse">
                                    <AlertTriangle className="w-4 h-4 text-orange-200" />
                                    <span>MISSING: {(totalIntake - totalCategorized).toFixed(1)} KG</span>
                                </div>
                            )}
                            {isMatch && totalIntake > 0 && (
                                <div className="bg-green-600 text-white px-4 py-2 rounded-xl text-[11px] font-black flex items-center gap-2 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-200" />
                                    <span>MATCHED PERFECTLY</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(processedStock).map(([materialKey, value]) => {
                            const isOther = materialKey === 'OTHER';
                            return (
                                <div key={materialKey} className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">{materialLabels[materialKey]}</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={value} 
                                            min="0"
                                            readOnly={isOther}
                                            onChange={(e) => {
                                                if (isOther) return;
                                                const val = e.target.value;
                                                const normalized = (val !== '' && parseFloat(val) < 0) ? '0' : val;
                                                setProcessedStock(prev => ({ ...prev, [materialKey]: normalized }));
                                            }} 
                                            className={`w-full ${isOther ? 'bg-blue-50/50 border-blue-200 text-blue-600' : 'bg-gray-50 border border-gray-200'} rounded-lg p-2.5 text-sm font-bold transition-colors`}
                                            placeholder={isOther ? "Auto-calculated" : "0"}
                                        />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${isOther ? 'text-blue-400' : 'text-gray-400'} uppercase`}>kg</span>
                                    </div>
                                    {isOther && !isLocked && (
                                        <p className="text-[10px] text-blue-500 font-medium italic pl-1">Recalculated from missing total</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Additional Save Button at Bottom */}
                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/10">
                        {!isSaved && !isLocked ? (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center transition-all ${isSaving ? 'bg-[#00427A] opacity-90' : 'bg-[#005DAA] hover:bg-[#00427A] hover:shadow-[#005DAA]/20 hover:-translate-y-0.5'}`}
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {t('saving', dailyLogTranslations)}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-5 h-5" />
                                        <span>{existingRecord ? t('updateBtn', dailyLogTranslations) : t('saveBtn', dailyLogTranslations)}</span>
                                    </div>
                                )}
                            </button>
                        ) : (
                            <div className="w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 shadow-lg flex items-center justify-center animate-fade-in-up">
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                <span>{isLocked ? t('existingLog', dailyLogTranslations) : t('saved', dailyLogTranslations)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddVillageModal
                show={showAddModal}
                onClose={() => setShowAddModal(false)}
                t={t}
                dailyLogTranslations={dailyLogTranslations}
                modalSearchTerm={modalSearchTerm}
                setModalSearchTerm={setModalSearchTerm}
                locationData={locationData}
                setSelectedDistrict={setSelectedDistrict}
                setSelectedBlock={setSelectedBlock}
                setSelectedGP={setSelectedGP}
                addNewVillage={addNewVillage}
                selectedDistrict={selectedDistrict}
                selectedBlock={selectedBlock}
                selectedGP={selectedGP}
            />
        </div>
    );
};

export default DailyLogPWMU;

/* Add Village Modal - Moved outside the main scrollable container */
const AddVillageModal = ({ show, onClose, t, dailyLogTranslations, modalSearchTerm, setModalSearchTerm, locationData, setSelectedDistrict, setSelectedBlock, setSelectedGP, addNewVillage, selectedDistrict, selectedBlock, selectedGP }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 min-h-[300px] flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50/20">
                    <div>
                        <h3 className="font-bold text-gray-800">{t('selectVillage', dailyLogTranslations)}</h3>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight mt-1">Search village name to add it quickly</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold transition-all hover:rotate-90">×</button>
                </div>
                <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    {/* Fast Search to Add */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                        <input 
                            type="text" 
                            placeholder="Type village name (e.g. 'Aamapara')..."
                            className="w-full pl-10 pr-4 py-3 bg-blue-50/30 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm font-semibold text-gray-800 placeholder:text-gray-400"
                            value={modalSearchTerm}
                            onChange={(e) => setModalSearchTerm(e.target.value)}
                        />
                    </div>

                    {modalSearchTerm.length > 2 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {(() => {
                                const matches = [];
                                const term = modalSearchTerm.toLowerCase();
                                for (const d in locationData) {
                                    for (const b in locationData[d]) {
                                        for (const g in locationData[d][b]) {
                                            locationData[d][b][g].forEach(v => {
                                                if (v.toLowerCase().includes(term)) {
                                                    matches.push({ name: v, block: b, gp: g, district: d });
                                                }
                                            });
                                        }
                                    }
                                }
                                if (matches.length === 0) return <p className="text-center py-4 text-gray-400 text-sm italic">No villages found matching "{modalSearchTerm}"</p>;
                                return matches.slice(0, 15).map(m => (
                                    <button
                                        key={`${m.district}-${m.block}-${m.gp}-${m.name}`}
                                        onClick={() => {
                                            setSelectedDistrict(m.district);
                                            setSelectedBlock(m.block);
                                            setSelectedGP(m.gp);
                                            addNewVillage(m.name);
                                            setModalSearchTerm('');
                                        }}
                                        className="w-full text-left p-3 hover:bg-blue-600 hover:text-white rounded-xl border border-gray-100 transition-all group"
                                    >
                                        <div className="font-bold text-sm">{m.name}</div>
                                        <div className="text-[10px] opacity-70 group-hover:opacity-100">{m.district} / {m.block} / {m.gp}</div>
                                    </button>
                                ));
                            })()}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-xs text-gray-500">Or use the dropdowns below</p>
                        </div>
                    )}

                    <div className="relative border-t border-gray-100 pt-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Hierarchical Selection</p>
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
                                                        onClose();
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
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
                    >
                        {t('close', dailyLogTranslations)}
                    </button>
                </div>
            </div>
        </div>
    );
};

