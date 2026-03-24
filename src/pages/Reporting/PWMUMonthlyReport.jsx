import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FileBarChart, 
    Settings, 
    IndianRupee, 
    Factory, 
    Plus, 
    Trash2, 
    Calendar, 
    CheckCircle2, 
    AlertTriangle, 
    AlertCircle, 
    Wrench,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Package,
    ArrowLeft,
    ChevronRight,
    Search,
    FileEdit
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const materialMap = {
    // Sales Material Types to Inventory Categories
    'BAILING': 'PLASTIC',
    'SHREDDING': 'PLASTIC',
    'FATKA_CLEANING': 'PLASTIC',
    'BAILING (बेलिंग)': 'PLASTIC',
    'SHREDDING (श्रेडिंग)': 'PLASTIC',
    'FATKA_CLEANING (फटका-क्लीनिंग)': 'PLASTIC',
    'Wet': 'WET',
    'Plastic': 'PLASTIC',
    'Metal': 'METAL',
    'Glass': 'GLASS',
    'EWaste': 'EWASTE',
    'Other': 'OTHER',
    'WET': 'WET',
    'PLASTIC': 'PLASTIC',
    'METAL': 'METAL',
    'GLASS': 'GLASS',
    'EWASTE': 'EWASTE',
    'OTHER': 'OTHER'
};

const sidebarMaterials = [
    { key: 'WET', label: 'Wet Waste' },
    { key: 'PLASTIC', label: 'Plastic' },
    { key: 'METAL', label: 'Metal' },
    { key: 'GLASS', label: 'Glass' },
    { key: 'EWASTE', label: 'E-Waste' },
    { key: 'OTHER', label: 'Other/Mixed' }
];

const PWMUMonthlyReport = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const monthlyTranslations = {
        en: {
            title: "PWMU Monthly Report",
            subtitle: "Submit operational, financial, and asset status data for the selected month.",
            facilityInfo: "Facility Information",
            pwmuCenter: "PWMU Center (Auto-Selected)",
            nodalOfficer: "Logged in as Nodal Officer",
            assetStatus: "Asset & Machinery Status",
            selectMachines: "Select installed machines",
            operationalChecklist: "Operational Condition Checklist",
            functional: "Functional",
            nonFunctional: "Non-Functional",
            wasteCollection: "Monthly Waste Collection (kg)",
            totalCollectedTitle: "Total waste received during the month",
            dateBreakdown: "Date Breakdown Occurred",
            primaryReason: "Primary Reason",
            selectReason: "-- Select Reason --",
            salesRevenue: "Sales & Diversion (Revenue)",
            addRecord: "Add Record",
            noSales: "No sales recorded for this month.",
            vendorCol: "Purchasing Vendor",
            materialCol: "Material Type",
            qtyCol: "Qty (Kg)",
            revenueCol: "Revenue (₹)",
            actionCol: "Action",
            selectVendor: "Select Vendor...",
            selectMaterial: "Select Material...",
            totalRev: "Total Revenue:",
            opExpenses: "Operating Expenses (O&M)",
            electricity: "Electricity Bill (₹)",
            honorarium: "Swachhata Samuh Honorarium (₹)",
            otherExp: "Other Gen. Expenses (₹)",
            reportingMonthDesc: "For the reporting month",
            distWorkersDesc: "Total distributed to workers",
            repairsDesc: "Repairs, transport, consumables",
            totalExp: "Total Expenses:",
            netBalance: "Net Monthly Balance:",
            cancel: "Cancel",
            saveReport: "Save Report",
            saving: "Saving...",
            submitted: "Report Submitted!",
            submittedDesc: "The monthly performance report for {month} {year} has been successfully recorded.",
            jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June",
            jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December",
            kg: "kg",
            reasons: [
                'Electricity/Power supply issue',
                'Operator (Swachhgrahi) unavailable',
                'Unsuitable plastic quality',
                'Technical machine failure',
                'Part replacement required',
                'Other'
            ],
            wasteTypes: [
                'BAILING', 
                'SHREDDING', 
                'FATKA_CLEANING'
            ],
            machines: {
                fatka: 'Fatka / Dust Cleaning Machine',
                baling: 'Hydraulic Baling Machine',
                shredder: 'Plastic Shredder Machine',
                agglomerator: 'Agglomerator Machine',
                mixer: 'Mixer Machine',
                granular: 'Granule Making Machine'
            }
        },
        hi: {
            title: "PWMU मासिक रिपोर्ट",
            subtitle: "चयनित महीने के लिए परिचालन, वित्तीय और संपत्ति की स्थिति का डेटा सबमिट करें।",
            facilityInfo: "सुविधा की जानकारी",
            pwmuCenter: "PWMU केंद्र (स्वत: चयनित)",
            nodalOfficer: "नोडल अधिकारी के रूप में लॉग इन किया गया",
            assetStatus: "संपत्ति और मशीनरी की स्थिति",
            selectMachines: "स्थापित मशीनों का चयन करें",
            operationalChecklist: "परिचालन स्थिति चेकलिस्ट",
            functional: "चालू",
            nonFunctional: "बंद",
            wasteCollection: "मासिक अपशिष्ट संग्रह (किग्रा)",
            totalCollectedTitle: "महीने के दौरान प्राप्त कुल कचरा",
            dateBreakdown: "खराबी होने की तिथि",
            primaryReason: "मुख्य कारण",
            selectReason: "-- कारण चुनें --",
            salesRevenue: "बिक्री और डाइवर्जन (राजस्व)",
            addRecord: "रिकॉर्ड जोड़ें",
            noSales: "इस महीने के लिए कोई बिक्री दर्ज नहीं की गई।",
            vendorCol: "खरीदार विक्रेता",
            materialCol: "सामग्री का प्रकार",
            qtyCol: "मात्रा (किलो)",
            revenueCol: "राजस्व (₹)",
            actionCol: "कार्रवाई",
            selectVendor: "विक्रेता चुनें...",
            selectMaterial: "सामग्री चुनें...",
            totalRev: "कुल राजस्व:",
            opExpenses: "परिचालन व्यय (O&M)",
            electricity: "बिजली बिल (₹)",
            honorarium: "स्वच्छता समूह मानदेय (₹)",
            otherExp: "अन्य सामान्य खर्च (₹)",
            reportingMonthDesc: "रिपोर्टिंग महीने के लिए",
            distWorkersDesc: "श्रमिकों को कुल वितरण",
            repairsDesc: "मरम्मत, परिवहन, उपभोग्य वस्तुएं",
            totalExp: "कुल खर्च:",
            netBalance: "शुद्ध मासिक शेष:",
            cancel: "रद्द करें",
            saveReport: "रिपोर्ट सहेजें",
            saving: "सहेज रहा है...",
            submitted: "रिपोर्ट सबमिट की गई!",
            submittedDesc: "{month} {year} के लिए मासिक प्रदर्शन रिपोर्ट सफलतापूर्वक दर्ज की गई है।",
            jan: "जनवरी", feb: "फरवरी", mar: "मार्च", apr: "अप्रैल", may: "मई", jun: "जून",
            jul: "जुलाई", aug: "अगस्त", sep: "सितंबर", oct: "अक्टूबर", nov: "नवंबर", dec: "दिसंबर",
            kg: "किलो",
            reasons: [
                'बिजली/बिजली आपूर्ति समस्या',
                'ऑपरेटर (स्वच्छाग्राही) अनुपलब्ध',
                'अनुपयुक्त प्लास्टिक गुणवत्ता',
                'तकनीकी मशीन विफलता',
                'पुर्जे बदलने की आवश्यकता',
                'अन्य'
            ],
            wasteTypes: [
                'BAILING (बेलिंग)', 
                'SHREDDING (श्रेडिंग)', 
                'FATKA_CLEANING (फटका-क्लीनिंग)'
            ],
            machines: {
                fatka: 'फटका / धूल सफाई मशीन',
                baling: 'हाइड्रोलिक बेलिंग मशीन',
                shredder: 'प्लास्टिक श्रेडर मशीन',
                agglomerator: 'एग्लोमेरेटर मशीन',
                mixer: 'मिक्सर मशीन',
                granular: 'ग्रेन्यूल बनाने की मशीन'
            }
        }
    };

    const [basicInfo, setBasicInfo] = useState({
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        year: new Date().getFullYear().toString(),
        pwmuName: '',
        pwmuId: ''
    });

    const [inventory, setInventory] = useState({});
    const [isLoadingInventory, setIsLoadingInventory] = useState(false);

    const [machineStatus, setMachineStatus] = useState({
        fatka: { selected: false, functional: true, dateBroke: '', reason: '' },
        baling: { selected: false, functional: true, dateBroke: '', reason: '' },
        shredder: { selected: false, functional: true, dateBroke: '', reason: '' },
        agglomerator: { selected: false, functional: true, dateBroke: '', reason: '' },
        mixer: { selected: false, functional: true, dateBroke: '', reason: '' },
        granular: { selected: false, functional: true, dateBroke: '', reason: '' }
    });

    const [sales, setSales] = useState([{ 
        id: Date.now(), 
        vendor: '', 
        materials: [{ id: `mat-${Date.now()}`, wasteType: '', quantity: '', revenue: '' }] 
    }]);
    const [collection, setCollection] = useState({
        WET: '',
        PLASTIC: '',
        METAL: '',
        GLASS: '',
        EWASTE: '',
        OTHER: ''
    });
    const [closingStock, setClosingStock] = useState({
        WET: '',
        PLASTIC: '',
        METAL: '',
        GLASS: '',
        EWASTE: '',
        OTHER: ''
    });
    const [openingStock, setOpeningStock] = useState({
        WET: 0,
        PLASTIC: 0,
        METAL: 0,
        GLASS: 0,
        EWASTE: 0,
        OTHER: 0
    });
    const [expenses, setExpenses] = useState({ electricity: '', honorarium: '', other: '' });
    const [calculatedProcessLoss, setCalculatedProcessLoss] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [isLoadingVendors, setIsLoadingVendors] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [existingId, setExistingId] = useState(null);
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    const { user, signUp } = useAuth();
    const currentYearNum = new Date().getFullYear();
    const currentMonthNum = new Date().getMonth() + 1;

    // Get allowed months (current and previous)
    const allowedPeriod = useMemo(() => {
        const monthsData = [
            { val: '01', label: t('jan', monthlyTranslations) },
            { val: '02', label: t('feb', monthlyTranslations) },
            { val: '03', label: t('mar', monthlyTranslations) },
            { val: '04', label: t('apr', monthlyTranslations) },
            { val: '05', label: t('may', monthlyTranslations) },
            { val: '06', label: t('jun', monthlyTranslations) },
            { val: '07', label: t('jul', monthlyTranslations) },
            { val: '08', label: t('aug', monthlyTranslations) },
            { val: '09', label: t('sep', monthlyTranslations) },
            { val: '10', label: t('oct', monthlyTranslations) },
            { val: '11', label: t('nov', monthlyTranslations) },
            { val: '12', label: t('dec', monthlyTranslations) }
        ];

        let prevMonth = currentMonthNum - 1;
        let prevYear = currentYearNum;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = currentYearNum - 1;
        }

        const allowed = [];
        // Previous month
        allowed.push({
            month: prevMonth.toString().padStart(2, '0'),
            year: prevYear.toString(),
            label: `${monthsData[prevMonth - 1].label} ${prevYear}`
        });
        // Current month
        allowed.push({
            month: currentMonthNum.toString().padStart(2, '0'),
            year: currentYearNum.toString(),
            label: `${monthsData[currentMonthNum - 1].label} ${currentYearNum}`
        });

        return allowed;
    }, [t]);

    useEffect(() => {
        const fetchCenter = async () => {
            if (!user) return;
            try {
                // Priority 1: Find center where this user is the nodal officer (DB-linked)
                const { data: byNodal } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, status, village')
                    .eq('nodal_officer_id', user.id)
                    .maybeSingle();

                if (byNodal) {
                    setBasicInfo(prev => ({ ...prev, pwmuName: byNodal.name, pwmuId: byNodal.id, village: byNodal.village }));
                    return;
                }

                // Priority 2: Try center where center.id == user.id (seeded data pattern)
                const { data: byId } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, status, village')
                    .eq('id', user.id)
                    .maybeSingle();

                if (byId) {
                    setBasicInfo(prev => ({ ...prev, pwmuName: byId.name, pwmuId: byId.id, village: byId.village }));
                    return;
                }

                // Priority 3: Use reg.pwmuId from registration_data (most common for self-registered users)
                const reg = user.registration_data || {};
                if (reg.pwmuId) {
                    const { data: byRegId } = await supabase
                        .from('pwmu_centers')
                        .select('id, name, status, village')
                        .eq('id', reg.pwmuId)
                        .maybeSingle();

                    if (byRegId) {
                        setBasicInfo(prev => ({ ...prev, pwmuName: byRegId.name, pwmuId: byRegId.id, village: byRegId.village }));
                        return;
                    }

                    // Center record not in DB yet — at minimum, use the pwmuId so fetchInventory runs
                    setBasicInfo(prev => ({ ...prev, pwmuName: reg.pwmuName || 'PWMU Center', pwmuId: reg.pwmuId }));
                }
            } catch (err) {
                console.error('Error fetching center:', err);
            }
        };
        fetchCenter();
    }, [user]);

    // Fetch Previous Month's Closing Stock (Opening Stock for this month)
    useEffect(() => {
        const fetchOpeningStock = async () => {
            if (!basicInfo.pwmuId || !basicInfo.month || !basicInfo.year) return;
            
            // Calculate previous month
            const m = parseInt(basicInfo.month);
            const y = parseInt(basicInfo.year);
            const prevM = (m === 1 ? 12 : m - 1).toString().padStart(2, '0');
            const prevY = (m === 1 ? y - 1 : y);

            try {
                const { data } = await supabase
                    .from('monthly_reports')
                    .select('closing_stock')
                    .eq('pwmu_id', basicInfo.pwmuId)
                    .eq('report_month', prevM)
                    .eq('report_year', prevY)
                    .maybeSingle();

                if (data?.closing_stock) {
                    const stocks = typeof data.closing_stock === 'string' ? JSON.parse(data.closing_stock) : data.closing_stock;
                    const parsed = {};
                    Object.entries(stocks).forEach(([k, v]) => parsed[k] = parseFloat(v) || 0);
                    setOpeningStock(parsed);
                } else {
                    setOpeningStock({ WET: 0, PLASTIC: 0, METAL: 0, GLASS: 0, EWASTE: 0, OTHER: 0 });
                }
            } catch (err) {
                console.error("Failed to fetch opening stock:", err);
            }
        };
        fetchOpeningStock();
    }, [basicInfo.pwmuId, basicInfo.month, basicInfo.year]);

    // Fetch Existing Report for the selected month/year
    useEffect(() => {
        const fetchExisting = async () => {
            if (!basicInfo.pwmuId || !basicInfo.month || !basicInfo.year) return;
            setIsLoadingReport(true);
            try {
                const { data, error } = await supabase
                    .from('monthly_reports')
                    .select('*')
                    .eq('pwmu_id', basicInfo.pwmuId)
                    .eq('report_month', basicInfo.month)
                    .eq('report_year', parseInt(basicInfo.year))
                    .maybeSingle();

                if (data) {
                    setExistingId(data.id);
                    setIsLocked(true);
                    // Populate fields if it's an existing report
                    if (data.machine_status) {
                        try {
                            const status = typeof data.machine_status === 'string' ? JSON.parse(data.machine_status) : data.machine_status;
                            setMachineStatus(status);
                        } catch (e) {}
                    }
                    if (data.opening_stock) {
                        try {
                            const opSt = typeof data.opening_stock === 'string' ? JSON.parse(data.opening_stock) : data.opening_stock;
                            setOpeningStock(opSt);
                        } catch (e) {}
                    }
                    setExpenses({
                        electricity: data.electricity_bill?.toString() || '',
                        honorarium: data.honorarium?.toString() || '',
                        other: data.other_expenses?.toString() || ''
                    });
                    if (data.sales_records) {
                        try {
                            const records = typeof data.sales_records === 'string' ? JSON.parse(data.sales_records) : data.sales_records;
                            setSales(records);
                        } catch (e) {}
                    }
                    if (data.collection_data) {
                        try {
                            const coll = typeof data.collection_data === 'string' ? JSON.parse(data.collection_data) : data.collection_data;
                            setCollection(coll);
                        } catch (e) {}
                    }
                    if (data.closing_stock) {
                        try {
                            const closeSt = typeof data.closing_stock === 'string' ? JSON.parse(data.closing_stock) : data.closing_stock;
                            setClosingStock(closeSt);
                        } catch (e) {}
                    }
                } else {
                    setExistingId(null);
                    setIsLocked(false);
                    // Reset to defaults for new entry
                    const defaultState = { WET: '', PLASTIC: '', METAL: '', GLASS: '', EWASTE: '', OTHER: '' };
                    setCollection(defaultState);
                    setClosingStock(defaultState);
                    setSales([{ 
                        id: Date.now(), 
                        vendor: '', 
                        materials: [{ id: `mat-${Date.now()}`, wasteType: '', quantity: '', revenue: '' }] 
                    }]);
                }

                // ALWAYS: fetch daily logs and merge (Auto-sync)
                console.log("[Aggregator] Fetching daily logs to sync...");
                const yearMonth = `${basicInfo.year}-${basicInfo.month}`;
                const startDate = `${yearMonth}-01`;
                const endDate = `${yearMonth}-31`;

                const { data: logs, error: lErr } = await supabase
                    .from('pwmu_operational_logs')
                    .select('processed_stock_breakdown, total_intake_kg')
                    .eq('pwmu_id', basicInfo.pwmuId)
                    .gte('log_date', startDate)
                    .lte('log_date', endDate);

                if (!lErr && logs && logs.length > 0) {
                    const aggregate = { WET: 0, PLASTIC: 0, METAL: 0, GLASS: 0, EWASTE: 0, OTHER: 0 };
                    logs.forEach(log => {
                        if (log.processed_stock_breakdown) {
                            try {
                                const breakdown = typeof log.processed_stock_breakdown === 'string' 
                                    ? JSON.parse(log.processed_stock_breakdown) 
                                    : log.processed_stock_breakdown;
                                Object.entries(breakdown).forEach(([k, v]) => {
                                    const uk = k.toUpperCase();
                                    if (aggregate.hasOwnProperty(uk)) {
                                        aggregate[uk] += (parseFloat(v) || 0);
                                    }
                                });
                            } catch (e) {
                                console.warn("Failed to parse log breakdown:", e);
                            }
                        }
                    });
                    
                    const stringified = {};
                    let hasAggData = false;
                    Object.entries(aggregate).forEach(([k, v]) => {
                        if (v > 0) hasAggData = true;
                        stringified[k] = v > 0 ? v.toString() : '';
                    });

                    // For an existing report, if true aggregate > saved collection, override to fix desync
                    setCollection(prev => {
                        if (!data) return stringified;
                        
                        const savedTotal = Object.values(prev).reduce((sum, v) => sum + (parseFloat(v)||0), 0);
                        const aggTotal = Object.values(stringified).reduce((sum, v) => sum + (parseFloat(v)||0), 0);
                        if (aggTotal > savedTotal) {
                            console.log("[Aggregator] Aggregate is higher than saved collection. Overriding to fix sync.");
                            return stringified;
                        }
                        return prev;
                    });
                }
            } catch (err) {
                console.error("Error fetching existing report:", err);
            } finally {
                setIsLoadingReport(false);
            }
        };
        fetchExisting();
    }, [basicInfo.pwmuId, basicInfo.month, basicInfo.year, t]);


    const months = [
        { val: '01', label: t('jan', monthlyTranslations) }, { val: '02', label: t('feb', monthlyTranslations) }, { val: '03', label: t('mar', monthlyTranslations) },
        { val: '04', label: t('apr', monthlyTranslations) }, { val: '05', label: t('may', monthlyTranslations) }, { val: '06', label: t('jun', monthlyTranslations) },
        { val: '07', label: t('jul', monthlyTranslations) }, { val: '08', label: t('aug', monthlyTranslations) }, { val: '09', label: t('sep', monthlyTranslations) },
        { val: '10', label: t('oct', monthlyTranslations) }, { val: '11', label: t('nov', monthlyTranslations) }, { val: '12', label: t('dec', monthlyTranslations) }
    ];

    const machineOptions = t('machines', monthlyTranslations);
    const breakdownReasons = t('reasons', monthlyTranslations);
    const wasteTypes = t('wasteTypes', monthlyTranslations);

    // Handlers
    const handleBasicInfoChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleCollectionChange = (e) => setCollection(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleExpenseChange = (e) => setExpenses(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const toggleMachineSelection = (key) => {
        setMachineStatus(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: !prev[key].selected, functional: true } // Reset to functional when turning on
        }));
    };

    const updateMachineIssue = (key, field, value) => {
        setMachineStatus(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    useEffect(() => {
        if (basicInfo.pwmuId) {
            fetchInventory();
            fetchVendors();
        }
    }, [basicInfo.pwmuId]);

    const fetchVendors = async () => {
        try {
            setIsLoadingVendors(true);
            // Fetch users with role 'Vendor'
            const { data, error } = await supabase
                .from('users')
                .select('id, full_name, registration_data')
                .eq('role', 'Vendor');

            if (error) throw error;

            // Filter vendors partnered with this PWMU
            const partneredVendors = (data || []).filter(v => {
                let reg = v.registration_data || {};
                if (typeof reg === 'string') { try { reg = JSON.parse(reg); } catch(e){} }
                const partners = reg.partnered_pwmus || [];
                // Use type-safe comparison
                return partners.some(pId => String(pId) === String(basicInfo.pwmuId));
            });

            setVendors(partneredVendors);
        } catch (err) {
            console.error('Error fetching vendors:', err);
        } finally {
            setIsLoadingVendors(false);
        }
    };

    const fetchInventory = async () => {
        try {
            setIsLoadingInventory(true);
            const { data, error } = await supabase
                .from('market_availability')
                .select('*')
                .eq('pwmu_id', basicInfo.pwmuId);

            if (error) throw error;

            const invMap = {};
            data.forEach(item => {
                invMap[item.material] = item.stock_kg;
            });
            setInventory(invMap);
        } catch (err) {
            console.error('Error fetching inventory:', err);
        } finally {
            setIsLoadingInventory(false);
        }
    };

    const addSaleRow = () => {
        setSales(prev => [...prev, { 
            id: Date.now(), 
            vendor: '', 
            materials: [{ id: `mat-${Date.now()}`, wasteType: '', quantity: '', revenue: '' }] 
        }]);
    };

    const removeSaleRow = (id) => {
        setSales(prev => prev.filter(s => s.id !== id));
    };

    const addMaterialRow = (vendorId) => {
        setSales(prev => prev.map(s => 
            s.id === vendorId 
                ? { ...s, materials: [...s.materials, { id: `mat-${Date.now()}`, wasteType: '', quantity: '', revenue: '' }] }
                : s
        ));
    };

    const removeMaterialRow = (vendorId, materialId) => {
        setSales(prev => prev.map(s => {
            if (s.id !== vendorId) return s;
            const updatedMaterials = s.materials.filter(m => m.id !== materialId);
            // If it's the last material, maybe we should keep it empty or remove the vendor? 
            // Better to keep at least one empty row or allow deleting the vendor separately.
            return { ...s, materials: updatedMaterials };
        }));
    };

    const updateSaleRow = (id, field, value) => {
        setSales(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const updateMaterialRow = (vendorId, materialId, field, value) => {
        setSales(prev => prev.map(s => {
            if (s.id !== vendorId) return s;
            return {
                ...s,
                materials: s.materials.map(m => m.id === materialId ? { ...m, [field]: value } : m)
            };
        }));
    };

    // Calculations
    const totalRevenue = sales.reduce((sum, vendorRow) => {
        const vendorSum = vendorRow.materials.reduce((vSum, m) => vSum + (Number(m.revenue) || 0), 0);
        return sum + vendorSum;
    }, 0);

    // Calculate sales aggregate for inventory deduction
    const salesAggregate = {};
    sales.forEach(vRow => {
        vRow.materials.forEach(m => {
            const key = materialMap[m.wasteType] || 'OTHER';
            salesAggregate[key] = (salesAggregate[key] || 0) + (Number(m.quantity) || 0);
        });
    });
    const totalExpenses = (Number(expenses.electricity) || 0) + (Number(expenses.honorarium) || 0) + (Number(expenses.other) || 0);
    const netBalance = totalRevenue - totalExpenses;

    const totalCollectedWaste = Object.values(collection).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const totalOpeningStock = Object.values(openingStock).reduce((sum, val) => sum + (Number(val) || 0), 0);
    const totalAvailableWaste = totalCollectedWaste + totalOpeningStock;
    const totalSoldWaste = Object.values(salesAggregate).reduce((sum, val) => sum + (Number(val) || 0), 0);
    
    // Auto-calculate Process Loss (Residuals)
    useEffect(() => {
        const totalClosing = Object.values(closingStock).reduce((s, v) => s + (parseFloat(v) || 0), 0);
        const loss = totalAvailableWaste - totalSoldWaste - totalClosing;
        setCalculatedProcessLoss(Math.max(0, parseFloat(loss.toFixed(2))));
    }, [closingStock, totalAvailableWaste, totalSoldWaste]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Date Range Validation
        const isAllowed = allowedPeriod.some(p => p.month === basicInfo.month && p.year === basicInfo.year);
        if (!isAllowed) {
            alert("Reporting is restricted to the last one month only.");
            return;
        }
        if (!basicInfo.pwmuId) {
            alert("No PWMU center assigned to your account.");
            return;
        }

        setIsSaving(true);
        try {
            // 0. Auto-register new vendors if 'Other' was selected
            const newVendorsToRegister = sales.filter(s => s.vendor === 'Other' && s.customVendor);
            for (const nv of newVendorsToRegister) {
                try {
                    console.log(`[Vendor Registry] Registering: ${nv.customVendor}`);
                    // Check if already registered in our local state to avoid redundant calls
                    if (!vendors.some(v => v.full_name?.toLowerCase() === nv.customVendor.toLowerCase())) {
                        // Generate unique-ish email/pass for this placeholder
                        const safeName = nv.customVendor.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                        const dummyEmail = `${safeName}_${Date.now()}@vendor.pwmu.com`; 
                        
                        await signUp(dummyEmail, 'pwmu123!', {
                            full_name: nv.customVendor,
                            role: 'Vendor',
                            district: basicInfo.district,
                            registration_data: {
                                firmName: nv.customVendor,
                                partnered_pwmus: [basicInfo.pwmuId],
                                type: 'Vendor',
                                status: 'approved'
                            }
                        });
                    }
                } catch (e) {
                    console.warn(`Vendor ${nv.customVendor} might already exist or failed:`, e.message);
                }
            }

            // Refresh vendors list so the newly registered one is included in the state
            if (newVendorsToRegister.length > 0) {
                await fetchVendors();
            }

            // 1. Prepare Monthly Report Data
            const processedSales = sales.map(s => ({
                ...s,
                vendor: s.vendor === 'Other' ? (s.customVendor || 'Other Vendor') : s.vendor
            }));

            const reportData = {
                pwmu_id: basicInfo.pwmuId,
                report_month: basicInfo.month,
                report_year: parseInt(basicInfo.year),
                machine_status: machineStatus,
                electricity_bill: parseFloat(expenses.electricity) || 0,
                honorarium: parseFloat(expenses.honorarium) || 0,
                other_expenses: parseFloat(expenses.other) || 0,
                total_revenue: totalRevenue,
                total_expenses: totalExpenses,
                net_balance: netBalance,
                sales_records: processedSales,
                collection_data: collection,
                closing_stock: closingStock,
                opening_stock: openingStock, 
                process_loss_kg: calculatedProcessLoss,
                submitted_by: user?.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            /*
            // PRE-SAVE VALIDATION: Ensure Remaining + Sold <= Opening + Intake
            const categories = Object.keys(collection);
            for (const cat of categories) {
                const avail = (openingStock[cat] || 0) + (parseFloat(collection[cat]) || 0);
                const sold = salesAggregate[cat] || 0;
                const remain = parseFloat(closingStock[cat]) || 0;

                if (remain + sold > avail + 0.1) { // 0.1 margin for rounding
                    alert(`Validation Error [${cat}]: Your Remaining Waste (${remain}kg) + Sold Waste (${sold}kg) is more than what was available (${avail.toFixed(1)}kg). Please correct the figures.`);
                    setIsSaving(false);
                    return;
                }
            }
            */

            // 2. Insert or Update monthly_reports
            const { error: reportError } = existingId 
                ? await supabase
                    .from('monthly_reports')
                    .update(reportData)
                    .eq('id', existingId)
                : await supabase
                    .from('monthly_reports')
                    .insert([reportData]);

            if (reportError) throw reportError;

            // 3. Update PWMU Center with cumulative/latest stats
            // In a real system, we might add to existing. For now, we update snapshots.
            const { error: updateError } = await supabase
                .from('pwmu_centers')
                .update({
                    revenue: totalRevenue, // Should ideally be cumulative in real DB, but for UAT we update snapshot
                    expenditure: totalExpenses,
                    status: Object.values(machineStatus).every(m => m.functional || !m.selected) ? 'operational' : 'maintenance',
                    last_updated: new Date().toISOString()
                })
                .eq('id', basicInfo.pwmuId);

            if (updateError) console.error('Error updating center snapshot:', updateError);

            // 4. Record Vendor Pickups for each sale record
            const flattenedSales = processedSales.flatMap(vRow => 
                vRow.materials.map(m => ({
                    vendor: vRow.vendor,
                    wasteType: m.wasteType,
                    quantity: m.quantity,
                    revenue: m.revenue
                }))
            );

            if (flattenedSales.length > 0) {
                const pickupRecords = flattenedSales
                    .filter(s => s.vendor && s.wasteType && Number(s.quantity) > 0)
                    .map(s => ({
                        pwmu_name: basicInfo.pwmuName,
                        vendor_name: s.vendor,
                        material: s.wasteType,
                        quantity_kg: parseFloat(s.quantity) || 0,
                        amount_paid: parseFloat(s.revenue) || 0,
                        pickup_date: `${basicInfo.year}-${basicInfo.month}-01`,
                    }));

                if (pickupRecords.length > 0) {
                    const { error: pickupError } = await supabase
                        .from('vendor_pickups')
                        .insert(pickupRecords);

                    if (pickupError) console.error('Error recording pickups:', pickupError);
                }
            }

            // 5. Replace market_availability with Closing Stock explicitly reported by user
            const materialsToUpdate = Object.entries(closingStock).filter(([k,v]) => v !== '');
            if (materialsToUpdate.length > 0) {
                const inserts = materialsToUpdate.map(([key, value]) => ({
                    pwmu_id: basicInfo.pwmuId,
                    pwmu_name: basicInfo.pwmuName,
                    material: key,
                    stock_kg: parseFloat(value) || 0,
                    updated_at: new Date().toISOString()
                }));
                
                // Manually delete and insert to ensure clean override and avoid unique constraint failures on mock backend
                await supabase.from('market_availability').delete().eq('pwmu_id', basicInfo.pwmuId);
                await supabase.from('market_availability').insert(inserts);
            }

            setIsSaving(false);
            setIsLocked(true);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/pwmu');
            }, 2500);

        } catch (err) {
            console.error('Submission error:', err);
            alert(`Failed to save report: ${err.message || 'Unknown error'}`);
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitted', monthlyTranslations)}</h2>
                    <p className="text-gray-500 mb-6">
                        {t('submittedDesc', monthlyTranslations)
                            .replace('{month}', allowedPeriod.find(p => p.month === basicInfo.month)?.label.split(' ')[0] || '')
                            .replace('{year}', basicInfo.year)}
                    </p>
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
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] p-4 lg:p-8 pb-48">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Main Form Content */}
                <div className="lg:col-span-8 space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100 text-[#005DAA] rounded-lg">
                                <FileBarChart className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{t('title', monthlyTranslations)}</h1>
                        </div>
                        <p className="text-gray-500 text-sm pl-12">{t('subtitle', monthlyTranslations)}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <select
                            name="period"
                            value={`${basicInfo.month}-${basicInfo.year}`}
                            onChange={(e) => {
                                const [m, y] = e.target.value.split('-');
                                setBasicInfo(prev => ({ ...prev, month: m, year: y }));
                            }}
                            className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 text-right cursor-pointer"
                        >
                            {allowedPeriod.map(p => (
                                <option key={`${p.month}-${p.year}`} value={`${p.month}-${p.year}`}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Factory className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('facilityInfo', monthlyTranslations)}</h2>
                        </div>
                        <fieldset disabled={isLocked}>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('pwmuCenter', monthlyTranslations)}</label>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                        <div className="p-2 bg-blue-100 rounded-lg text-[#005DAA]">
                                            <Factory className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#005DAA] text-lg">{basicInfo.pwmuName}</div>
                                            <div className="text-xs text-gray-500 font-medium">{[basicInfo.village, t('nodalOfficer', monthlyTranslations)].filter(Boolean).join(' | ')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </fieldset>
                    </div>

                    {/* Section 2: Asset Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-500" />
                                <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('assetStatus', monthlyTranslations)}</h2>
                            </div>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">{t('selectMachines', monthlyTranslations)}</span>
                        </div>
                        <fieldset disabled={isLocked}>
                        <div className="p-6 space-y-6">
                            {/* Machine Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(machineOptions).map(([key, label]) => {
                                    const isSelected = machineStatus[key].selected;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => !isLocked && toggleMachineSelection(key)}
                                            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-200 ${isSelected ? 'border-[#005DAA] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                } ${isLocked ? 'cursor-not-allowed opacity-80' : ''}`}
                                        >
                                            <span className={`text-sm font-medium ${isSelected ? 'text-[#005DAA]' : 'text-gray-600'}`}>{label}</span>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#005DAA] border-[#005DAA] text-white' : 'border-gray-300 bg-white'
                                                }`}>
                                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detailed Status for Selected Machines */}
                            {Object.values(machineStatus).some(m => m.selected) && (
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
                                        <Wrench className="w-4 h-4" /> {t('operationalChecklist', monthlyTranslations)}
                                    </h3>
                                    {Object.entries(machineOptions).map(([key, label]) => {
                                        const machine = machineStatus[key];
                                        if (!machine.selected) return null;

                                        return (
                                            <div key={`status-${key}`} className={`p-4 rounded-xl border ${machine.functional ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                                                        {machine.functional ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                                        {label}
                                                    </span>

                                                    {/* Toggle Functional Status */}
                                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateMachineIssue(key, 'functional', true)}
                                                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${machine.functional ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {t('functional', monthlyTranslations)}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateMachineIssue(key, 'functional', false)}
                                                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${!machine.functional ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {t('nonFunctional', monthlyTranslations)}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Issue Details if broken */}
                                                {!machine.functional && (
                                                    <div className="mt-4 pt-4 border-t border-red-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                                                        <div>
                                                            <label className="block text-xs font-medium text-red-800 mb-1">{t('dateBreakdown', monthlyTranslations)}</label>
                                                            <input
                                                                type="date"
                                                                value={machine.dateBroke}
                                                                onChange={(e) => updateMachineIssue(key, 'dateBroke', e.target.value)}
                                                                required={!machine.functional}
                                                                className="w-full p-2 bg-white border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-red-800 mb-1">{t('primaryReason', monthlyTranslations)}</label>
                                                            <select
                                                                value={machine.reason}
                                                                onChange={(e) => updateMachineIssue(key, 'reason', e.target.value)}
                                                                required={!machine.functional}
                                                                className="w-full p-2 bg-white border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                                            >
                                                                <option value="">{t('selectReason', monthlyTranslations)}</option>
                                                                {breakdownReasons.map(r => <option key={r} value={r}>{r}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        </fieldset>
                    </div>

                    {/* Section 3: Financials - Sales */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-gray-500" />
                                <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('salesRevenue', monthlyTranslations)}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLocked(false);
                                    addSaleRow();
                                }}
                                className="flex items-center gap-1 text-sm font-semibold text-[#005DAA] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            >
                                <Plus className="w-4 h-4" /> {t('addRecord', monthlyTranslations)}
                            </button>
                        </div>
                        <fieldset disabled={isLocked}>
                        <div className="p-6">
                            {sales.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                    <p className="text-sm font-medium">{t('noSales', monthlyTranslations)}</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {sales.map((sale, saleIndex) => (
                                        <div key={sale.id} className="bg-gray-50/50 rounded-2xl border border-gray-100 p-5 space-y-4 animate-fade-in-up">
                                            {/* Vendor Header Row */}
                                            <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-200 pb-4">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{t('vendorCol', monthlyTranslations)}</label>
                                                    <div className="flex items-center gap-2">
                                                        <select
                                                            value={sale.vendor} 
                                                            onChange={(e) => updateSaleRow(sale.id, 'vendor', e.target.value)} 
                                                            required
                                                            className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 font-semibold text-gray-700 shadow-sm"
                                                        >
                                                            <option value="">{t('selectVendor', monthlyTranslations)}</option>
                                                            {vendors.map(v => (
                                                                <option key={v.id} value={v.full_name}>{v.full_name}</option>
                                                            ))}
                                                            <option value="Other">Other (Register New)</option>
                                                        </select>
                                                        {sale.vendor === 'Other' && (
                                                            <input
                                                                type="text"
                                                                value={sale.customVendor || ''}
                                                                onChange={(e) => updateSaleRow(sale.id, 'customVendor', e.target.value)}
                                                                placeholder="Type Vendor Name"
                                                                required
                                                                className="flex-1 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 font-bold text-[#005DAA] shadow-sm animate-fade-in"
                                                            />
                                                        )}
                                                        <button
                                                            type="button" 
                                                            onClick={() => removeSaleRow(sale.id)}
                                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-200 hover:border-red-100 bg-white shadow-sm"
                                                            title="Remove Vendor"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <div className="bg-blue-100 text-[#005DAA] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Vendor {saleIndex + 1}</div>
                                                </div>
                                            </div>

                                            {/* Materials Table for this Vendor */}
                                            <div className="space-y-3 pl-0 md:pl-4">
                                                <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <div className="col-span-5">{t('materialCol', monthlyTranslations)}</div>
                                                    <div className="col-span-3 text-right">{t('qtyCol', monthlyTranslations)}</div>
                                                    <div className="col-span-3 text-right">{t('revenueCol', monthlyTranslations)}</div>
                                                    <div className="col-span-1"></div>
                                                </div>

                                                {sale.materials.map((mat, matIndex) => (
                                                    <div key={mat.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end md:items-center bg-white p-4 md:p-0 rounded-xl md:rounded-none border border-gray-100 md:border-none shadow-sm md:shadow-none animate-fade-in-up">
                                                        <div className="col-span-1 md:col-span-5">
                                                            <label className="md:hidden block text-xs font-bold text-gray-400 uppercase mb-1">{t('materialCol', monthlyTranslations)}</label>
                                                            <select
                                                                value={mat.wasteType} 
                                                                onChange={(e) => updateMaterialRow(sale.id, mat.id, 'wasteType', e.target.value)} 
                                                                required
                                                                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20"
                                                            >
                                                                <option value="">{t('selectMaterial', monthlyTranslations)}</option>
                                                                {wasteTypes.map(w => <option key={w} value={w}>{w}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="col-span-1 md:col-span-3">
                                                            <label className="md:hidden block text-xs font-bold text-gray-400 uppercase mb-1">{t('qtyCol', monthlyTranslations)}</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number" 
                                                                    value={mat.quantity} 
                                                                    onChange={(e) => updateMaterialRow(sale.id, mat.id, 'quantity', e.target.value)} 
                                                                    required min="0" placeholder="0"
                                                                    className="w-full p-2 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#005DAA]/20 font-mono shadow-inner"
                                                                />
                                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold uppercase">{t('kg', monthlyTranslations)}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 md:col-span-3">
                                                            <label className="md:hidden block text-xs font-bold text-gray-400 uppercase mb-1">{t('revenueCol', monthlyTranslations)}</label>
                                                            <div className="relative">
                                                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                                                                <input
                                                                    type="number" 
                                                                    value={mat.revenue} 
                                                                    onChange={(e) => updateMaterialRow(sale.id, mat.id, 'revenue', e.target.value)} 
                                                                    required min="0" placeholder="0"
                                                                    className="w-full p-2 pl-6 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#005DAA]/20 font-mono text-green-700 font-bold shadow-inner"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-span-1 md:col-span-1 flex justify-end">
                                                            <button
                                                                type="button" 
                                                                onClick={() => removeMaterialRow(sale.id, mat.id)}
                                                                disabled={sale.materials.length === 1}
                                                                className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-0"
                                                                title="Remove Material"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add Material Row Button */}
                                                <div className="pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => addMaterialRow(sale.id)}
                                                        className="flex items-center gap-1.5 text-[11px] font-bold text-[#005DAA] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all border border-dashed border-blue-200"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" /> Add Another Material for {sale.vendor || 'this Vendor'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Vendor Subtotal */}
                                            <div className="pt-4 mt-2 border-t border-gray-100 flex justify-end">
                                                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 pr-2">
                                                    Vendor Subtotal: 
                                                    <span className="text-gray-600 font-mono text-xs">₹{sale.materials.reduce((s, m) => s + (Number(m.revenue) || 0), 0).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Overall Total */}
                                    <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                                        <div className="text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                                            Total Vendors: <span className="text-gray-700 font-bold">{sales.length}</span> | 
                                            Total Records: <span className="text-gray-700 font-bold">{sales.reduce((s, v) => s + v.materials.length, 0)}</span>
                                        </div>
                                        <div className="bg-[#005DAA] px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center gap-4 border border-blue-400/30">
                                            <span className="text-xs font-bold text-blue-100 uppercase tracking-widest">{t('totalRev', monthlyTranslations)}</span>
                                            <span className="text-2xl font-black text-white font-mono leading-none">₹{totalRevenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        </fieldset>
                    </div>

                    {/* Section 4: Operating Expenses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('opExpenses', monthlyTranslations)}</h2>
                        </div>
                        <fieldset disabled={isLocked}>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('electricity', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="electricity" value={expenses.electricity} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('reportingMonthDesc', monthlyTranslations)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('honorarium', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="honorarium" value={expenses.honorarium} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('distWorkersDesc', monthlyTranslations)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('otherExp', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="other" value={expenses.other} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('repairsDesc', monthlyTranslations)}</p>
                                </div>
                            </div>

                            {/* Expense Subtotal */}
                            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
                                <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100 flex items-center gap-3">
                                    <span className="text-sm font-semibold text-red-800">{t('totalExp', monthlyTranslations)}</span>
                                    <span className="text-lg font-bold text-red-700 font-mono">₹{totalExpenses.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        </fieldset>
                    </div>

                    <div className="h-24"></div> {/* Extra spacer so the fixed bar doesn't hide the last card content */}

                    {/* Bottom Action Bar (Sticky) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Summary Pill */}
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-4 text-sm font-bold border ${netBalance >= 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <span>{t('netBalance', monthlyTranslations)}</span>
                            <span className="text-xl font-mono tracking-tight">
                                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            {isLocked && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsLocked(false);
                                        if (sales.length === 0) {
                                            setSales([{ 
                                                id: Date.now(), 
                                                vendor: '', 
                                                materials: [{ id: `mat-${Date.now()}`, wasteType: '', quantity: '', revenue: '' }] 
                                            }]);
                                        }
                                    }}
                                    className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center min-w-[160px]"
                                >
                                    <FileEdit className="w-5 h-5 mr-2" />
                                    Edit Report
                                </button>
                            )}
                            
                            <button type="button" onClick={() => navigate('/dashboard/pwmu')} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                {t('cancel', monthlyTranslations)}
                            </button>
                            
                            {!isLocked && (
                                <button
                                    type="submit"
                                    disabled={isSaving || !basicInfo.pwmuName}
                                    className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-[#005DAA] text-white font-bold hover:bg-[#00427A] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                                >
                                    {isSaving ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>{t('saving', monthlyTranslations)}</span>
                                        </div>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            {t('saveReport', monthlyTranslations)}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Calculation Sidebar */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 pb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[#005DAA]" />
                            <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Stock Status & Balance</h3>
                        </div>
                        <div className="bg-white border border-gray-200 px-2 py-1 rounded-md text-[10px] font-black text-gray-400">Current Stock</div>
                    </div>
                    
                    <div className="p-5 space-y-5">
                        {isLoadingInventory ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <div className="w-8 h-8 border-4 border-[#005DAA]/10 border-t-[#005DAA] rounded-full animate-spin"></div>
                                <p className="text-xs text-gray-400 font-medium">Loading Inventory...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Summary Headers */}
                                <div className="grid grid-cols-2 gap-3 mb-2">
                                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex flex-col items-center justify-center text-center">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Waste</div>
                                        <div className="text-lg font-black text-[#005DAA] font-mono">{totalCollectedWaste.toLocaleString()} <span className="text-[10px] text-gray-400">KG</span></div>
                                    </div>
                                    <div className="bg-green-50/50 p-3 rounded-xl border border-green-100 flex flex-col items-center justify-center text-center">
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Sold</div>
                                        <div className="text-lg font-black text-green-600 font-mono">{totalSoldWaste.toLocaleString()} <span className="text-[10px] text-gray-400">KG</span></div>
                                    </div>
                                </div>

                                {sidebarMaterials.map(({ key, label }) => {
                                    const open = openingStock[key] || 0;
                                    const intake = parseFloat(collection[key]) || 0;
                                    const available = open + intake;
                                    const soldAmount = salesAggregate[key] || 0;
                                    const remainingAfterSales = Math.max(0, available - soldAmount);
                                    const maxAllowed = remainingAfterSales;

                                    return (
                                        <div key={key} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</span>
                                                <div className="flex flex-col items-end gap-0.5">
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Opening: {open.toLocaleString()} kg</div>
                                                    <div className="text-[9px] text-gray-400 font-bold uppercase">Intake: {intake.toLocaleString()} kg</div>
                                                    <div className="text-[10px] text-blue-600 font-black uppercase">Available: {available.toLocaleString()} kg</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-200/50">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Remaining Waste</span>
                                                    <span className="text-[9px] text-gray-400 font-bold italic">Max: {maxAllowed.toLocaleString()} kg</span>
                                                </div>
                                                <div className="relative max-w-[120px]">
                                                    <input
                                                        type="number"
                                                        value={closingStock[key] || ''}
                                                        onChange={(e) => {
                                                            let val = e.target.value;
                                                            if (val !== '' && parseFloat(val) > maxAllowed + 0.1) val = maxAllowed.toString();
                                                            setClosingStock(prev => ({ ...prev, [key]: val }));
                                                        }}
                                                        disabled={isLocked}
                                                        placeholder="0"
                                                        min="0"
                                                        max={maxAllowed}
                                                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-mono font-bold text-[#005DAA] text-right pr-9 shadow-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-all disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-black">KG</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Processing Loss / Residuals */}
                                <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 space-y-3 mt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider">Lost in Processing</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-[10px] font-semibold text-orange-600 leading-tight flex-1">Auto-calculated unusable waste removed during recycling (e.g., dust, moisture)</span>
                                        <div className="bg-white border border-orange-200 px-4 py-2.5 rounded-lg font-mono font-bold text-orange-600 shadow-sm text-right min-w-[120px]">
                                            {calculatedProcessLoss.toLocaleString()} <span className="text-[10px] text-orange-400 font-black ml-1">KG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Summary Footer */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-blue-600" />
                                    <div className="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Total Sales Revenue</div>
                                </div>
                                <div className="text-lg font-black text-[#005DAA] font-mono leading-none">₹{totalRevenue.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Tips */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-lg space-y-3 border border-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-blue-300">Live Inventory Note</h4>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                        Stock numbers are pulled directly from your <span className="text-blue-400">Daily Logs</span>. Ensure categories are filled correctly in the log for accurate balance tracking here.
                    </p>
                </div>
            </div>
        </div>
    </div>
);
};

export default PWMUMonthlyReport;
