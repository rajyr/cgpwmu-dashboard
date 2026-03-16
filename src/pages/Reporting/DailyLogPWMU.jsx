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
            updateBtn: "Update Daily Log",
            processedStockTitle: "Daily Waste Categorization",
            processedStockDesc: "Distribute the total waste ({total} kg) into correct categories. Sum must equal the daily total....",
            totalCategorized: "Total Categorized",
            matching: "Perfect Match",
            mismatch: "Check figures: Needs to be exactly {total} kg",
            materialCol: "Material Type",
            stockCol: "Current Stock"
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
            updateBtn: "दैनिक लॉग अपडेट करें",
            processedStockTitle: "दैनिक अपशिष्ट वर्गीकरण",
            processedStockDesc: "कुल कचरे ({total} किलो) को सही श्रेणियों में विभाजित करें। योग दैनिक कुल के बराबर होना चाहिए....",
            totalCategorized: "कुल वर्गीकृत",
            matching: "सटीक मिलान",
            mismatch: "आंकड़ों की जाँच करें: ठीक {total} किलो होना चाहिए",
            materialCol: "सामग्री का प्रकार",
            stockCol: "वर्तमान स्टॉक"
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
        'PET': '',
        'HDPE': '',
        'LDPE': '',
        'PP': '',
        'MLP': '',
        'RDF': '',
        'Mixed': ''
    });

    const materialLabels = {
        'PET': 'PET (Bottles, Jars, Food Trays....)',
        'HDPE': 'HDPE (Milk Jugs, Cleaning Bottles, Crates....)',
        'LDPE': 'LDPE (Shopping Bags, Wraps, Thin Films....)',
        'PP': 'PP (Containers, Caps, Straws, Toys....)',
        'MLP': 'MLP (Chips Bags, Foil Wraps, Sachets....)',
        'RDF': 'Processed RDF (Fuel pellets, Textile waste....)',
        'Mixed': 'Mixed Plastic (Non-recyclable scraps, Shreds....)'
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
                } else {
                    setIsLocked(false);
                    setExistingRecord(null);
                    setIsSaved(false);
                }

                // Also fetch current market availability for this PWMU to pre-fill
                if (center?.name) {
                    const { data: stockData, error: sErr } = await supabase
                        .from('market_availability')
                        .select('material, stock_kg')
                        .eq('pwmu_name', center.name);
                    
                    if (sErr) console.error("Fetch Stock Error:", sErr);

                    if (stockData && stockData.length > 0) {
                        setProcessedStock(prev => {
                            const newStock = { ...prev };
                            stockData.forEach(s => {
                                const m = s.material.toUpperCase();
                                if (newStock.hasOwnProperty(m)) {
                                    newStock[m] = (s.stock_kg || 0).toString();
                                } else {
                                    // Robust migration check
                                    if (m.startsWith('PET')) newStock['PET'] = s.stock_kg.toString();
                                    else if (m.startsWith('HDPE')) newStock['HDPE'] = s.stock_kg.toString();
                                    else if (m.startsWith('LDPE')) newStock['LDPE'] = s.stock_kg.toString();
                                    else if (m.startsWith('PP')) newStock['PP'] = s.stock_kg.toString();
                                    else if (m.startsWith('MLP')) newStock['MLP'] = s.stock_kg.toString();
                                    else if (m.includes('RDF')) newStock['RDF'] = s.stock_kg.toString();
                                    else if (m.includes('MIXED')) newStock['Mixed'] = s.stock_kg.toString();
                                }
                            });
                            return newStock;
                        });
                    }
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
    }, [selectedDate, center, villages.length]); // Focus on length to avoid infinite loops
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
            value: '',
            reportId: null
        }]);
        setShowAddModal(false);
    };

    const totalIntake = villages.reduce((sum, v) => sum + (Number(v.value) || 0), 0);
    const totalCategorized = Object.values(processedStock).reduce((sum, v) => sum + (Number(v) || 0), 0);
    const isMatch = Math.abs(totalIntake - totalCategorized) < 0.01;

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
                    const materialKey = material.toUpperCase();
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

            {/* Processed Material Stock Section */}
            <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="p-6 border-b border-gray-100 bg-blue-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-[#005DAA] rounded-lg">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{t('processedStockTitle', dailyLogTranslations)}</h2>
                            <p className="text-xs text-gray-500">{t('processedStockDesc', dailyLogTranslations).replace('{total}', totalIntake.toFixed(1))}</p>
                        </div>
                    </div>
                    
                    {totalIntake > 0 && (
                        <div className={`px-4 py-2 rounded-xl border flex items-center gap-3 transition-all ${isMatch ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            {isMatch ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 animate-pulse" />}
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase tracking-wider">
                                    {isMatch ? t('matching', dailyLogTranslations) : t('mismatch', dailyLogTranslations).replace('{total}', totalIntake.toFixed(1))}
                                </p>
                                <p className="text-lg font-black">{totalCategorized.toFixed(1)} / {totalIntake.toFixed(1)} <span className="text-xs font-medium">kg</span></p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(processedStock).map(([materialKey, value]) => (
                            <div key={materialKey} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-all flex flex-col justify-between">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    {materialLabels[materialKey]}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={value}
                                        onChange={(e) => setProcessedStock(prev => ({ ...prev, [materialKey]: e.target.value }))}
                                        disabled={isLocked}
                                        placeholder="0.0"
                                        className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block p-2.5 pr-10 shadow-sm"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">{t('kg', dailyLogTranslations)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
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
