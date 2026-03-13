import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { AlertCircle, RefreshCcw, FileText, IndianRupee, Users, ShoppingCart, CheckCircle2, Calendar, MapPin, Leaf } from 'lucide-react';

const VillageMonthlyReport = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { user, refreshProfile } = useAuth();

    const villageMonthlyTranslations = {
        en: {
            title: "Village Monthly Report",
            disposalRevenue: "Disposal & Revenue",
            whereSoldLabel: "Where was the segregated waste sold?",
            totalWasteSold: "Total Waste Sold (kg)",
            totalRevenueEarned: "Total Revenue Earned (₹)",
            workersExpenses: "Swachhata Workers & Expenses",
            numWorkersLabel: "Number of Swachhata Workers",
            activeWorkersDesc: "Active workers during this month",
            honorariumPerWorker: "Honorarium per Worker (₹)",
            paidIndividualDesc: "Amount paid to each individual",
            totalHonorariumCalculated: "Total Honorarium Calculated:",
            otherOpExpenses: "Other Operating Expenses (₹)",
            transportMaintenanceDesc: "Transport, maintenance, etc.",
            villageNetBalance: "Village Net Balance:",
            cancel: "Cancel",
            saveReport: "Save Report",
            saving: "Saving...",
            successTitle: "Monthly Report Saved!",
            successDesc: "Financial and operational data for {village} recorded successfully.",
            kg: "kg",
            recyclers: [
                { id: 'kabadiwala', label: 'Local Kabadiwala', desc: 'Informal scrap dealer' },
                { id: 'vendor', label: 'Registered Vendor', desc: 'Authorized aggregator' },
                { id: 'recycler', label: 'Direct to Recycler', desc: 'Processing facility' }
            ],
            jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June",
            jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December"
        },
        hi: {
            title: "ग्राम मासिक रिपोर्ट",
            disposalRevenue: "निस्तारण और राजस्व",
            whereSoldLabel: "अलग किया गया कचरा कहाँ बेचा गया?",
            totalWasteSold: "कुल बेचा गया कचरा (किलो)",
            totalRevenueEarned: "कुल अर्जित राजस्व (₹)",
            workersExpenses: "स्वच्छता कार्यकर्ता और खर्च",
            numWorkersLabel: "स्वच्छता कार्यकर्ताओं की संख्या",
            activeWorkersDesc: "इस महीने के दौरान सक्रिय कार्यकर्ता",
            honorariumPerWorker: "प्रति कार्यकर्ता मानदेय (₹)",
            paidIndividualDesc: "प्रत्येक व्यक्ति को भुगतान की गई राशि",
            totalHonorariumCalculated: "कुल गणना किया गया मानदेय:",
            otherOpExpenses: "अन्य परिचालन व्यय (₹)",
            transportMaintenanceDesc: "परिवहन, रखरखाव, आदि।",
            villageNetBalance: "ग्राम शुद्ध शेष:",
            cancel: "रद्द करें",
            saveReport: "रिपोर्ट सहेजें",
            saving: "सहेज रहा है...",
            successTitle: "मासिक रिपोर्ट सहेज ली गई!",
            successDesc: "{village} के लिए वित्तीय और परिचालन डेटा सफलतापूर्वक दर्ज किया गया।",
            kg: "किलो",
            recyclers: [
                { id: 'kabadiwala', label: 'स्थानीय कबाड़ीवाला', desc: 'अनौपचारिक कबाड़ डीलर' },
                { id: 'vendor', label: 'पंजीकृत विक्रेता', desc: 'अधिकृत एग्रीगेटर' },
                { id: 'recycler', label: 'सीधे पुनर्चक्रणकर्ता को', desc: 'प्रसंस्करण सुविधा' }
            ],
            jan: "जनवरी", feb: "फरवरी", mar: "मार्च", apr: "अप्रैल", may: "मई", jun: "जून",
            jul: "जुलाई", aug: "अगस्त", sep: "सितंबर", oct: "अक्टूबर", nov: "नवंबर", dec: "दिसंबर"
        }
    };

    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [basicInfo, setBasicInfo] = useState({
        villageName: '...',
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        year: new Date().getFullYear().toString()
    });
    const [salesInfo, setSalesInfo] = useState({
        recyclerType: '',
        wasteSold: '',
        earningAmount: ''
    });
    const [expensesInfo, setExpensesInfo] = useState({
        numWorkers: '',
        honorariumPerWorker: '',
        otherExpenses: ''
    });

    const [syncing, setSyncing] = useState(false);
    const [sessionWarning, setSessionWarning] = useState(false);
    const [existingId, setExistingId] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [loadingReport, setLoadingReport] = useState(false);

    // Profile Sync Logic (Same as Daily Log)
    const handleSync = async () => {
        setSyncing(true);
        try {
            await refreshProfile();
            console.log('[SYNC] Profile refreshed successfully.');
            setSessionWarning(false);
        } catch (err) {
            console.error('[SYNC] Refresh failed:', err);
        } finally {
            setSyncing(false);
        }
    };

    const currentYearNum = new Date().getFullYear();
    const years = [(currentYearNum - 1).toString(), currentYearNum.toString(), (currentYearNum + 1).toString()];

    const months = [
        { val: '01', label: t('jan', villageMonthlyTranslations) }, { val: '02', label: t('feb', villageMonthlyTranslations) }, { val: '03', label: t('mar', villageMonthlyTranslations) },
        { val: '04', label: t('apr', villageMonthlyTranslations) }, { val: '05', label: t('may', villageMonthlyTranslations) }, { val: '06', label: t('jun', villageMonthlyTranslations) },
        { val: '07', label: t('jul', villageMonthlyTranslations) }, { val: '08', label: t('aug', villageMonthlyTranslations) }, { val: '09', label: t('sep', villageMonthlyTranslations) },
        { val: '10', label: t('oct', villageMonthlyTranslations) }, { val: '11', label: t('nov', villageMonthlyTranslations) }, { val: '12', label: t('dec', villageMonthlyTranslations) }
    ];

    const recyclerOptions = t('recyclers', villageMonthlyTranslations);

    // Handlers
    const handleBasicChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSalesChange = (e) => setSalesInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleExpensesChange = (e) => setExpensesInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const selectRecycler = (type) => setSalesInfo(prev => ({ ...prev, recyclerType: type }));

    // Calculations
    const totalHonorarium = (Number(expensesInfo.numWorkers) || 0) * (Number(expensesInfo.honorariumPerWorker) || 0);
    const totalExpenses = totalHonorarium + (Number(expensesInfo.otherExpenses) || 0);
    const totalEarnings = Number(salesInfo.earningAmount) || 0;
    const netBalance = totalEarnings - totalExpenses;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        // Strict Blocking Check
        const reg = user?.registration_data || {};
        if (!reg.pwmuId) {
            console.error('[MONTHLY_REPORT] ❌ Blocked submission due to missing pwmuId:', {
                user_id: user.id,
                full_name: user.full_name,
                reg_data: reg
            });
            alert("⚠️ CANNOT SAVE REPORT: Your account is not properly linked to a PWMU center in the database.\n\nACTION: Click the 'Sync Profile Data' button at the top and try again.\n\nIf the error persists, please contact support and provide your Village Name: " + (reg.villageName || 'Unknown'));
            setIsSaving(false);
            setSessionWarning(true);
            return;
        }

        setIsSaving(true);
        try {
            const reportData = {
                village_id: user.id,
                village_name: basicInfo.villageName,
                pwmu_id: reg.pwmuId,
                report_month: basicInfo.month,
                report_year: parseInt(basicInfo.year),
                recycler_type: salesInfo.recyclerType,
                waste_sold_kg: parseFloat(salesInfo.wasteSold) || 0,
                revenue_earned: parseFloat(salesInfo.earningAmount) || 0,
                num_workers: parseInt(expensesInfo.numWorkers) || 0,
                honorarium_per_worker: parseFloat(expensesInfo.honorariumPerWorker) || 0,
                other_expenses: parseFloat(expensesInfo.otherExpenses) || 0,
                total_honorarium: totalHonorarium,
                total_expenses: totalExpenses,
                net_balance: netBalance
            };

            const { data, error } = existingId
                ? await supabase
                    .from('village_monthly_reports')
                    .update(reportData)
                    .eq('id', existingId)
                : await supabase
                    .from('village_monthly_reports')
                    .insert([reportData]);

            if (error) throw error;

            setIsSaving(false);
            setIsLocked(true);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Submission error:', err);
            alert(`Failed to save report: ${err.message || 'Unknown error'}`);
            setIsSaving(false);
        }
    };

    // Fetch Existing Report Logic
    useEffect(() => {
        const fetchExisting = async () => {
            if (!user || !basicInfo.month || !basicInfo.year) return;
            setLoadingReport(true);
            try {
                const { data, error } = await supabase
                    .from('village_monthly_reports')
                    .select('*')
                    .eq('village_id', user.id)
                    .eq('report_month', basicInfo.month)
                    .eq('report_year', parseInt(basicInfo.year))
                    .maybeSingle();

                if (data) {
                    setExistingId(data.id);
                    setSalesInfo({
                        recyclerType: data.recycler_type || '',
                        wasteSold: data.waste_sold_kg?.toString() || '',
                        earningAmount: data.revenue_earned?.toString() || ''
                    });
                    setExpensesInfo({
                        numWorkers: data.num_workers?.toString() || '',
                        honorariumPerWorker: data.honorarium_per_worker?.toString() || '',
                        otherExpenses: data.other_expenses?.toString() || ''
                    });
                    setIsLocked(true);
                } else {
                    setExistingId(null);
                    setIsLocked(false);
                    // Reset fields for new entry
                    setSalesInfo({ recyclerType: '', wasteSold: '', earningAmount: '' });
                    setExpensesInfo({ numWorkers: '', honorariumPerWorker: '', otherExpenses: '' });
                }
            } catch (err) {
                console.error("Error fetching existing report:", err);
            } finally {
                setLoadingReport(false);
            }
        };
        fetchExisting();
    }, [user, basicInfo.month, basicInfo.year]);

    useEffect(() => {
        if (user) {
            const reg = user.registration_data || {};
            setBasicInfo(prev => ({
                ...prev,
                villageName: reg.villageName || reg.primaryVillage || reg.gramPanchayat || user.full_name || 'Village'
            }));

            // Check if vital metadata is missing
            if (!reg.pwmuId || !reg.district) {
                setSessionWarning(true);
            } else {
                setSessionWarning(false);
            }
        }
    }, [user]);

    if (showSuccess) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center flex flex-col items-center animate-fade-in-up border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('successTitle', villageMonthlyTranslations)}</h2>
                    <p className="text-gray-500 mb-6">{t('successDesc', villageMonthlyTranslations).replace('{village}', basicInfo.villageName)}</p>
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

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    {/* Loading Overlay for Report Fetching */}
                    {loadingReport && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                            <RefreshCcw className="w-6 h-6 text-green-600 animate-spin" />
                        </div>
                    )}

                    <div className="relative z-0">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{t('title', villageMonthlyTranslations)}</h1>
                                {existingId && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider border border-blue-200">
                                            Existing Report
                                        </span>
                                        {isLocked && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase tracking-wider border border-red-200 animate-pulse">
                                                Locked
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm pl-12 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" /> {basicInfo.villageName}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {existingId && isLocked && (
                            <button
                                type="button"
                                onClick={() => setIsLocked(false)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all shadow-sm"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Edit Report
                            </button>
                        )}

                        <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <select
                                name="month" value={basicInfo.month} onChange={handleBasicChange}
                                className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-1 text-right cursor-pointer outline-none text-sm"
                            >
                                {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                            </select>
                            <select
                                name="year" value={basicInfo.year} onChange={handleBasicChange}
                                className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-1 md:pl-2 cursor-pointer outline-none md:border-l md:border-gray-300 text-sm"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Sales to Recyclers */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('disposalRevenue', villageMonthlyTranslations)}</h2>
                        </div>
                        <div className="p-6 space-y-6">

                            {/* Recycler Selection */}
                            <div className={isLocked ? 'opacity-70 pointer-events-none' : ''}>
                                <label className="block text-sm font-medium text-gray-700 mb-3">{t('whereSoldLabel', villageMonthlyTranslations)}</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {recyclerOptions.map(type => (
                                        <div
                                            key={type.id}
                                            onClick={() => !isLocked && selectRecycler(type.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${salesInfo.recyclerType === type.id
                                                ? 'border-green-500 bg-green-50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold ${salesInfo.recyclerType === type.id ? 'text-green-700' : 'text-gray-800'}`}>{type.label}</h3>
                                                {salesInfo.recyclerType === type.id && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                            </div>
                                            <p className="text-xs text-gray-500">{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sales Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('totalWasteSold', villageMonthlyTranslations)}</label>
                                    <div className="relative">
                                        <input
                                            type="number" name="wasteSold" value={salesInfo.wasteSold} onChange={handleSalesChange} required min="0" placeholder="0"
                                            disabled={isLocked}
                                            className="w-full p-2.5 pl-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{t('kg', villageMonthlyTranslations)}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('totalRevenueEarned', villageMonthlyTranslations)}</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        <input
                                            type="number" name="earningAmount" value={salesInfo.earningAmount} onChange={handleSalesChange} required min="0" placeholder="0"
                                            disabled={isLocked}
                                            className="w-full p-2.5 pl-8 bg-white border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono text-green-700 font-bold disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Section 2: Honorarium & Expenses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('workersExpenses', villageMonthlyTranslations)}</h2>
                        </div>
                        <div className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Workers Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('numWorkersLabel', villageMonthlyTranslations)}</label>
                                    <input
                                        type="number" name="numWorkers" value={expensesInfo.numWorkers} onChange={handleExpensesChange} required min="0" placeholder="0"
                                        disabled={isLocked}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono disabled:bg-gray-200 disabled:text-gray-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('activeWorkersDesc', villageMonthlyTranslations)}</p>
                                </div>

                                {/* Honorarium Per Worker */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('honorariumPerWorker', villageMonthlyTranslations)}</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        <input
                                            type="number" name="honorariumPerWorker" value={expensesInfo.honorariumPerWorker} onChange={handleExpensesChange} required min="0" placeholder="0"
                                            disabled={isLocked}
                                            className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono disabled:bg-gray-200 disabled:text-gray-500"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{t('paidIndividualDesc', villageMonthlyTranslations)}</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100 flex items-center gap-4 w-full md:w-auto mt-2">
                                    <span className="text-sm font-medium text-blue-800">{t('totalHonorariumCalculated', villageMonthlyTranslations)}</span>
                                    <span className="text-xl font-bold text-blue-700 font-mono border-b pb-0.5 border-blue-300">₹{totalHonorarium.toLocaleString()}</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Other Expenses */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('otherOpExpenses', villageMonthlyTranslations)}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number" name="otherExpenses" value={expensesInfo.otherExpenses} onChange={handleExpensesChange} min="0" placeholder="0"
                                        disabled={isLocked}
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono disabled:bg-gray-200 disabled:text-gray-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{t('transportMaintenanceDesc', villageMonthlyTranslations)}</p>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Action Bar (Sticky) */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Summary Pill */}
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-4 text-sm font-bold border ${netBalance >= 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <span>{t('villageNetBalance', villageMonthlyTranslations)}</span>
                            <span className="text-xl font-mono tracking-tight">
                                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                {t('cancel', villageMonthlyTranslations)}
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving || !salesInfo.recyclerType || isLocked}
                                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{t('saving', villageMonthlyTranslations)}</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        {existingId ? 'Update Report' : t('saveReport', villageMonthlyTranslations)}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default VillageMonthlyReport;
