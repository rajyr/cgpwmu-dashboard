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
    Search
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const materialMap = {
    // English Standard
    'PET (Bottles, Jars...)': 'PET',
    'HDPE (Mugs, Crates...)': 'HDPE',
    'LDPE (Bags, Wraps...)': 'LDPE',
    'PP (Straws, Toys...)': 'PP',
    'MLP (Chips Bags...)': 'MLP',
    'Processed RDF': 'RDF',
    'Mixed Plastic Scraps': 'MIXED',
    // Hindi Standards
    'PET (पानी की बोतलें)': 'PET',
    'HDPE (दूध के जग)': 'HDPE',
    'LDPE (प्लास्टिक बैग)': 'LDPE',
    'PP (टपरवेयर)': 'PP',
    'MLP (मल्टी-लेयर पैकेज)': 'MLP',
    'प्रसंस्कृत RDF': 'RDF',
    'कटा हुआ मिश्रित प्लास्टिक': 'MIXED',
    // Legacy Fallbacks
    'PET (Water Bottles)': 'PET',
    'HDPE (Milk Jugs)': 'HDPE',
    'LDPE (Plastic Bags)': 'LDPE',
    'PP (Tupperware)': 'PP',
    'MLP (Multi-Layer Packages)': 'MLP',
    'Shredded Mixed Plastic': 'MIXED',
    'Other / Mixed': 'MIXED'
};

const sidebarMaterials = [
    { key: 'PET', label: 'PET' },
    { key: 'HDPE', label: 'HDPE' },
    { key: 'LDPE', label: 'LDPE' },
    { key: 'PP', label: 'PP' },
    { key: 'MLP', label: 'MLP' },
    { key: 'RDF', label: 'RDF' },
    { key: 'MIXED', label: 'MIXED' }
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
                'PET (Bottles, Jars...)', 
                'HDPE (Mugs, Crates...)', 
                'LDPE (Bags, Wraps...)',
                'PP (Straws, Toys...)', 
                'MLP (Chips Bags...)', 
                'Processed RDF', 
                'Mixed Plastic Scraps'
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
                'PET (पानी की बोतलें)', 'HDPE (दूध के जग)', 'LDPE (प्लास्टिक बैग)',
                'PP (टपरवेयर)', 'MLP (मल्टी-लेयर पैकेज)', 'प्रसंस्कृत RDF', 'कटा हुआ मिश्रित प्लास्टिक'
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

    const [sales, setSales] = useState([]);
    const [expenses, setExpenses] = useState({ electricity: '', honorarium: '', other: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const { user } = useAuth();
    const currentYearNum = new Date().getFullYear();
    const currentMonthNum = new Date().getMonth() + 1;

    // Get allowed months (current and previous)
    const allowedPeriod = useMemo(() => {
        const monthsData = [
            { val: '01', label: t('jan', pwmuMonthlyTranslations) },
            { val: '02', label: t('feb', pwmuMonthlyTranslations) },
            { val: '03', label: t('mar', pwmuMonthlyTranslations) },
            { val: '04', label: t('apr', pwmuMonthlyTranslations) },
            { val: '05', label: t('may', pwmuMonthlyTranslations) },
            { val: '06', label: t('jun', pwmuMonthlyTranslations) },
            { val: '07', label: t('jul', pwmuMonthlyTranslations) },
            { val: '08', label: t('aug', pwmuMonthlyTranslations) },
            { val: '09', label: t('sep', pwmuMonthlyTranslations) },
            { val: '10', label: t('oct', pwmuMonthlyTranslations) },
            { val: '11', label: t('nov', pwmuMonthlyTranslations) },
            { val: '12', label: t('dec', pwmuMonthlyTranslations) }
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
        }
    }, [basicInfo.pwmuId]);

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
            // 1. Prepare Monthly Report Data
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
                sales_records: sales,
                submitted_by: user?.id,
                created_at: new Date().toISOString()
            };

            // 2. Insert into monthly_reports
            const { error: reportError } = await supabase
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
            const flattenedSales = sales.flatMap(vRow => 
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

            // 5. Deduct sold quantities from market_availability (completing the service loop)
            // Group sold quantities by material
            const soldByMaterial = {};
            flattenedSales
                .filter(s => s.wasteType && Number(s.quantity) > 0)
                .forEach(s => {
                    // Normalize material key (extract uppercase code from label like "PET (Bottles...)")
                    const materialKey = s.wasteType.split(' ')[0].toUpperCase();
                    soldByMaterial[materialKey] = (soldByMaterial[materialKey] || 0) + parseFloat(s.quantity);
                });

            if (Object.keys(soldByMaterial).length > 0) {
                // Fetch current stock for this PWMU
                const { data: currentStockRows } = await supabase
                    .from('market_availability')
                    .select('id, material, stock_kg')
                    .eq('pwmu_id', basicInfo.pwmuId);

                if (currentStockRows && currentStockRows.length > 0) {
                    for (const row of currentStockRows) {
                        const materialKey = row.material.toUpperCase();
                        const soldQty = soldByMaterial[materialKey] || 0;
                        if (soldQty > 0) {
                            const newStock = Math.max(0, (row.stock_kg || 0) - soldQty);
                            await supabase
                                .from('market_availability')
                                .upsert([{ ...row, stock_kg: newStock }], { onConflict: 'pwmu_id,material' });
                        }
                    }
                }
            }

            setIsSaving(false);
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
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] p-4 lg:p-8 pb-32">
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
                        <div className="p-6 space-y-6">
                            {/* Machine Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(machineOptions).map(([key, label]) => {
                                    const isSelected = machineStatus[key].selected;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => toggleMachineSelection(key)}
                                            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-200 ${isSelected ? 'border-[#005DAA] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
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
                                onClick={addSaleRow}
                                className="flex items-center gap-1 text-sm font-semibold text-[#005DAA] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            >
                                <Plus className="w-4 h-4" /> {t('addRecord', monthlyTranslations)}
                            </button>
                        </div>
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
                                                            <option value="EcoPlast Recyclers Pvt Ltd">EcoPlast Recyclers Pvt Ltd</option>
                                                            <option value="Ambuja Cement Facility">Ambuja Cement Facility</option>
                                                            <option value="Local PWD Contractor">Local PWD Contractor</option>
                                                            <option value="Other">Other (Register New)</option>
                                                        </select>
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
                    </div>

                    {/* Section 4: Operating Expenses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('opExpenses', monthlyTranslations)}</h2>
                        </div>
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
                    </div>

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
                            <button type="button" onClick={() => navigate('/dashboard/pwmu')} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                {t('cancel', monthlyTranslations)}
                            </button>
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
                                {sidebarMaterials.map(({ key, label }) => {
                                    const currentStock = inventory[key] || 0;
                                    const soldAmount = salesAggregate[key] || 0;
                                    const remaining = currentStock - soldAmount;
                                    const isOverSold = remaining < 0;

                                    return (
                                        <div key={key} className="p-3 rounded-xl border border-gray-100 bg-gray-50/30 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-gray-100 rounded text-gray-400">AVAILABLE</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Stock</div>
                                                    <div className="text-sm font-mono font-bold text-gray-700">{currentStock.toLocaleString()} <small className="text-[10px]">KG</small></div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Sold</div>
                                                    <div className="text-sm font-mono font-bold text-[#005DAA]">{soldAmount > 0 ? `-${soldAmount.toLocaleString()}` : '0'}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Remaining</div>
                                                    <div className={`text-sm font-mono font-black ${isOverSold ? 'text-red-500' : 'text-green-600'}`}>
                                                        {remaining.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Visual Bar */}
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-300 ${isOverSold ? 'bg-red-500' : 'bg-green-500'}`}
                                                    style={{ width: `${Math.min(100, (currentStock > 0 ? (remaining > 0 ? (remaining / currentStock) * 100 : 0) : 0))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
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
