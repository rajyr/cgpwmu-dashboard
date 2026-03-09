import React, { useState } from 'react';
import {
    Activity, CheckCircle2, ArrowUpRight, BarChart2, IndianRupee,
    Home, Users, Settings, PlusCircle, FileText, PieChart, Download,
    Calendar as CalendarIcon, Clock, AlertTriangle, Truck, Factory, Info, Globe
} from 'lucide-react';
import ChhattisgarhMap from '../components/ChhattisgarhMap';
import { dashboardData } from '../data/mockDashboardData';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getProxyUrl = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? '' : '/api/supabase';
};

const Dashboard = () => {
    const { userRole, userName } = useAuth();
    const { language, t, toggleLanguage } = useLanguage();

    const dashTranslations = {
        en: {
            welcome: "Welcome back,",
            state: "State",
            network: "Network",
            happening: "Here is what's happening with the",
            pwmuNetwork: "PWMU network today.",
            systemStatus: "System Status",
            operational: "Operational",
            activePwmus: "ACTIVE PWMUS",
            reportsToday: "REPORTS TODAY",
            wasteProcessed: "WASTE PROCESSED",
            wasteSold: "WASTE SOLD",
            villagesLinked: "VILLAGES LINKED",
            swachhagrahis: "SWACHHAGRAHIS",
            avgEfficiency: "AVG EFFICIENCY",
            netBalance: "NET BALANCE",
            revenue: "Rev",
            expense: "Exp",
            netFlow: "Net Flow",
            calendar: "Calendar",
            upcomingEvents: "Upcoming Events",
            monthlyReview: "Monthly Review (2:00 PM)",
            stateMap: "State Map",
            districtCoverage: "District wise coverage metrics",
            economicOverview: "Economic & Spatial Overview",
            valueChainTitle: "Value Chain Economic Analysis",
            valueChainSubtitle: "Tracking value generation and costs from Village Collection to Final Disposal",
            recentActivity: "Recent Activity",
            viewAll: "View All",
            quickActions: "Quick Actions",
            registerNew: "Register New PWMU",
            submitReport: "Submit Report",
            viewAnalytics: "View Analytics",
            downloadReports: "Download Reports",
            operationalStatus: "Operational",
            summarizing: "Summarizing State Data...",
            fetching: "Fetching records from Chhattisgarh Network",
            units: "Units",
            logs: "Logs",
            mt: "MT",
            workers: "Workers",
            villages: "Villages",
            networkCoverage: "Network Coverage",
            fieldForce: "Field Force",
            statewideAvg: "Statewide Avg",
            totalVolume: "Total Volume",
            commercialValue: "Commercial Value",
            villageSubmissions: "Village Submissions",
            districtWise: "District Wise",
            blockWise: "Block Wise",
            gramPanchayat: "Gram Panchayat",
            village: "Village",
            pwmuWise: "PWMU Wise",
            operationalEconomic: "Economic & Spatial Overview",
            deepDive: "Deep dive into geospatial coverage and material flow value chain.",
            villagesNode: "Villages",
            pwmuNode: "PWMU Center",
            centralHub: "Central Hub",
            financialPerf: "Financial Performance",
            revVsExp: "Revenue Generation vs Operational Spending",
            wasteComp: "Statewide Waste Composition",
            breakdown: "Breakdown of processed material types by volume",
            totalRevenueLabel: "Total Revenue",
            totalSpendingLabel: "Total Spending",
            operationalEconomicState: "State Economic & Spatial Overview",
            dryWaste: "Dry Waste",
            wetWaste: "Wet Waste",
            processingLoss: "Processing Loss",
            recovered: "Recovered",
            recyclers: "Recyclers",
            cementKiln: "Cement Kiln",
            roadConst: "Road Construction",
            organicWaste: "Organic Waste",
            plastic: "Plastic",
            paper: "Paper",
            metal: "Metal",
            other: "Other",
            newReg: "New {role} registered: {name}",
            reportSub: "Report submitted for {village}",
            justNow: "Just now"
        },
        hi: {
            welcome: "स्वागत है,",
            state: "राज्य",
            network: "नेटवर्क",
            happening: "आज आपके",
            pwmuNetwork: "PWMU नेटवर्क में क्या हो रहा है, यहाँ देखें।",
            systemStatus: "सिस्टम की स्थिति",
            operational: "संचालित",
            activePwmus: "सक्रिय PWMU",
            reportsToday: "आज की रिपोर्ट",
            wasteProcessed: "कचरा प्रोसेस",
            wasteSold: "कचरा बेचा गया",
            villagesLinked: "जुड़े गाँव",
            swachhagrahis: "स्वच्छाग्रही",
            avgEfficiency: "औसत दक्षता",
            netBalance: "कुल शेष",
            revenue: "आय",
            expense: "व्यय",
            netFlow: "कुल प्रवाह",
            calendar: "कैलेंडर",
            upcomingEvents: "आगामी कार्यक्रम",
            monthlyReview: "मासिक समीक्षा (दोपहर 2:00 बजे)",
            stateMap: "राज्य का नक्शा",
            districtCoverage: "जिला वार कवरेज मेट्रिक्स",
            economicOverview: "आर्थिक और स्थानिक अवलोकन",
            valueChainTitle: "मूल्य श्रृंखला आर्थिक विश्लेषण",
            valueChainSubtitle: "गांव संग्रह से अंतिम निपटान तक मूल्य सृजन और लागत की ट्रैकिंग",
            recentActivity: "हाल की गतिविधि",
            viewAll: "सभी देखें",
            quickActions: "त्वरित कार्रवाई",
            registerNew: "नया PWMU पंजीकृत करें",
            submitReport: "रिपोर्ट जमा करें",
            viewAnalytics: "एनालिटिक्स देखें",
            downloadReports: "रिपोर्ट डाउनलोड करें",
            operationalStatus: "परिचालित",
            summarizing: "राज्य डेटा का सारांश...",
            fetching: "छत्तीसगढ़ नेटवर्क से रिकॉर्ड प्राप्त किए जा रहे हैं",
            units: "इकाइयां",
            logs: "लॉग",
            mt: "मीट्रिक टन",
            workers: "श्रमिक",
            villages: "गाँव",
            networkCoverage: "नेटवर्क कवरेज",
            fieldForce: "फील्ड फोर्स",
            statewideAvg: "राज्यव्यापी औसत",
            totalVolume: "कुल मात्रा",
            commercialValue: "व्यावसायिक मूल्य",
            villageSubmissions: "गांव सबमिशन",
            districtWise: "जिला वार",
            blockWise: "ब्लॉक वार",
            gramPanchayat: "ग्राम पंचायत",
            village: "गाँव",
            pwmuWise: "PWMU वार",
            operationalEconomic: "आर्थिक और स्थानिक अवलोकन",
            deepDive: "भू-स्थानिक कवरेज और सामग्री प्रवाह मूल्य श्रृंखला में गहराई से जानकारी लें।",
            villagesNode: "गाँव",
            pwmuNode: "PWMU केंद्र",
            centralHub: "मुख्य हब",
            financialPerf: "वित्तीय प्रदर्शन",
            revVsExp: "राजस्व सृजन बनाम परिचालन व्यय",
            wasteComp: "राज्यव्यापी कचरा संरचना",
            breakdown: "मात्रा के अनुसार प्रसंस्कृत सामग्री के प्रकारों का विवरण",
            totalRevenueLabel: "कुल राजस्व",
            totalSpendingLabel: "कुल व्यय",
            operationalEconomicState: "राज्य आर्थिक और स्थानिक अवलोकन",
            dryWaste: "सूखा कचरा",
            wetWaste: "गीला कचरा",
            processingLoss: "प्रसंस्करण हानि",
            recovered: "रिकवर किया गया",
            recyclers: "रीसायकलर्स",
            cementKiln: "सीमेंट भट्ठा",
            roadConst: "सड़क निर्माण",
            organicWaste: "जैविक कचरा",
            plastic: "प्लास्टिक",
            paper: "कागज",
            metal: "धातु",
            other: "अन्य",
            newReg: "नया {role} पंजीकृत: {name}",
            reportSub: "{village} के लिए रिपोर्ट सबमिट की गई",
            justNow: "अभी-अभी"
        }
    };

    const { overview, valueChain } = dashboardData;
    const [date, setDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activePwmus: 0,
        reportsSubmitted: 0,
        wasteProcessed: 0,
        wasteSold: 0,
        villagesLinked: 0,
        swachhagrahis: 0,
        totalRevenue: 0,
        totalExpense: 0,
        activities: [],
        financialChart: [],
        wasteComposition: [
            { name: 'Organic Waste', value: 45, color: '#22c55e' },
            { name: 'Plastic', value: 25, color: '#3b82f6' },
            { name: 'Paper', value: 15, color: '#eab308' },
            { name: 'Metal', value: 10, color: '#a855f7' },
            { name: 'Other', value: 5, color: '#64748b' },
        ]
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const proxyUrl = getProxyUrl();
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const headers = {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                };

                // 1. Fetch PWMU Centers for KPIs and Financials
                const pwmuRes = await fetch(`${proxyUrl}/rest/v1/pwmu_centers?select=*`, { headers });
                const pwmuData = await pwmuRes.json();

                // 2. Fetch Waste Collections for Report count and Organic volume
                const today = new Date().toISOString().split('T')[0];
                const [collectionRes, pickupRes] = await Promise.all([
                    fetch(`${proxyUrl}/rest/v1/waste_collections?select=*`, { headers }),
                    fetch(`${proxyUrl}/rest/v1/vendor_pickups?select=*`, { headers })
                ]);
                const collectionData = await collectionRes.json();
                const pickupData = await pickupRes.json();

                // 3. Fetch User counts
                const usersRes = await fetch(`${proxyUrl}/rest/v1/users?select=id,role,status,created_at,full_name`, { headers });
                const usersData = await usersRes.json();

                // Calculations
                const activePwmus = pwmuData.filter(p => p.status === 'Operational' || p.status === 'operational').length;
                const reportsToday = collectionData.filter(c => c.collection_date === today).length;
                const wasteProcessed = pwmuData.reduce((acc, curr) => acc + (parseFloat(curr.waste_processed_mt) || 0), 0);
                const totalRevenue = pwmuData.reduce((acc, curr) => acc + (parseFloat(curr.revenue) || 0), 0);
                const totalExpense = pwmuData.reduce((acc, curr) => acc + (parseFloat(curr.expenditure) || 0), 0);
                const villagesLinked = usersData.filter(u => u.role === 'Sarpanch').length;
                const swachhagrahis = usersData.filter(u => u.role === 'Sarpanch' || u.role === 'PWMUManager').length * 4;

                // Waste Composition Aggregation
                const totalWet = collectionData.reduce((acc, curr) => acc + (parseFloat(curr.wet_waste_kg) || 0), 0);

                const getMaterialTotal = (type) => pickupData
                    .filter(p => p.material.toLowerCase().includes(type.toLowerCase()))
                    .reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0);

                const plastic = getMaterialTotal('plastic');
                const paper = getMaterialTotal('paper');
                const metal = getMaterialTotal('metal');
                const other = pickupData.reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0) - (plastic + paper + metal);

                const totalVolume = totalWet + plastic + paper + metal + Math.max(0, other);
                const composition = totalVolume > 0 ? [
                    { name: t('organicWaste', dashTranslations), value: Math.round((totalWet / totalVolume) * 100), color: '#22c55e' },
                    { name: t('plastic', dashTranslations), value: Math.round((plastic / totalVolume) * 100), color: '#3b82f6' },
                    { name: t('paper', dashTranslations), value: Math.round((paper / totalVolume) * 100), color: '#eab308' },
                    { name: t('metal', dashTranslations), value: Math.round((metal / totalVolume) * 100), color: '#a855f7' },
                    { name: t('other', dashTranslations), value: Math.round((Math.max(0, other) / totalVolume) * 100), color: '#64748b' },
                ] : stats.wasteComposition;

                // Recent Activities
                const activities = [
                    ...usersData.slice(0, 3).map(u => ({
                        id: u.id,
                        title: t('newReg', dashTranslations).replace('{role}', u.role).replace('{name}', u.full_name),
                        time: new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        type: 'Registration',
                        icon: Users,
                        color: 'text-blue-500',
                        bg: 'bg-blue-100'
                    })),
                    ...collectionData.slice(0, 2).map(c => ({
                        id: c.id,
                        title: t('reportSub', dashTranslations).replace('{village}', c.village_name),
                        time: t('justNow', dashTranslations),
                        type: 'Submission',
                        icon: FileText,
                        color: 'text-green-500',
                        bg: 'bg-green-100'
                    }))
                ];

                setStats({
                    activePwmus,
                    reportsSubmitted: reportsToday,
                    wasteProcessed,
                    wasteSold: wasteProcessed * 0.8,
                    villagesLinked,
                    swachhagrahis,
                    totalRevenue,
                    totalExpense,
                    activities,
                    financialChart: [
                        { month: 'Jan', revenue: totalRevenue * 0.7, spending: totalExpense * 0.8 },
                        { month: 'Feb', revenue: totalRevenue * 0.85, spending: totalExpense * 0.9 },
                        { month: 'Mar', revenue: totalRevenue, spending: totalExpense },
                    ],
                    wasteComposition: composition
                });

            } catch (err) {
                console.error('Final Dashboard Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dashTranslations2 = {
        en: {
            village: "Village",
        },
        hi: {
            welcome: "स्वागत है,",
            state: "राज्य",
            network: "नेटवर्क",
            happening: "आज आपके",
            pwmuNetwork: "PWMU नेटवर्क में क्या हो रहा है, यहाँ देखें।",
            systemStatus: "सिस्टम की स्थिति",
            operational: "संचालित",
            activePwmus: "सक्रिय PWMU",
            reportsToday: "आज की रिपोर्ट",
            wasteProcessed: "कचरा प्रोसेस",
            wasteSold: "कचरा बेचा गया",
            villagesLinked: "जुड़े गाँव",
            swachhagrahis: "स्वच्छाग्रही",
            avgEfficiency: "औसत दक्षता",
            netBalance: "कुल शेष",
            revenue: "आय",
            expense: "व्यय",
            netFlow: "कुल प्रवाह",
            calendar: "कैलेंडर",
            upcomingEvents: "आगामी कार्यक्रम",
            monthlyReview: "मासिक समीक्षा (दोपहर 2:00 बजे)",
            stateMap: "राज्य का नक्शा",
            districtCoverage: "जिला वार कवरेज मेट्रिक्स",
            economicOverview: "आर्थिक और स्थानिक अवलोकन",
            valueChainTitle: "मूल्य श्रृंखला आर्थिक विश्लेषण",
            valueChainSubtitle: "गांव संग्रह से अंतिम निपटान तक मूल्य सृजन और लागत की ट्रैकिंग",
            recentActivity: "हाल की गतिविधि",
            viewAll: "सभी देखें",
            quickActions: "त्वरित कार्रवाई",
            registerNew: "नया PWMU पंजीकृत करें",
            submitReport: "रिपोर्ट जमा करें",
            viewAnalytics: "एनालिटिक्स देखें",
            downloadReports: "रिपोर्ट डाउनलोड करें",
            operationalStatus: "परिचालित",
            summarizing: "राज्य डेटा का सारांश...",
            fetching: "छत्तीसगढ़ नेटवर्क से रिकॉर्ड प्राप्त किए जा रहे हैं",
            units: "इकाइयां",
            logs: "लॉग",
            mt: "मीट्रिक टन",
            workers: "श्रमिक",
            villages: "गाँव",
            networkCoverage: "नेटवर्क कवरेज",
            fieldForce: "फील्ड फोर्स",
            statewideAvg: "राज्यव्यापी औसत",
            totalVolume: "कुल मात्रा",
            commercialValue: "व्यावसायिक मूल्य",
            villageSubmissions: "गांव सबमिशन",
            districtWise: "जिला वार",
            blockWise: "ब्लॉक वार",
            gramPanchayat: "ग्राम पंचायत",
            village: "गाँव",
            pwmuWise: "PWMU वार",
            operationalEconomic: "आर्थिक और स्थानिक अवलोकन",
            deepDive: "भू-स्थानिक कवरेज और सामग्री प्रवाह मूल्य श्रृंखला में गहराई से जानकारी लें।",
            villagesNode: "गाँव",
            pwmuNode: "PWMU केंद्र",
            centralHub: "मुख्य हब",
            financialPerf: "वित्तीय प्रदर्शन",
            revVsExp: "राजस्व सृजन बनाम परिचालन व्यय",
            wasteComp: "राज्यव्यापी कचरा संरचना",
            breakdown: "मात्रा के अनुसार प्रसंस्कृत सामग्री के प्रकारों का विवरण",
            totalRevenueLabel: "कुल राजस्व",
            totalSpendingLabel: "कुल व्यय",
            operationalEconomicState: "राज्य आर्थिक और स्थानिक अवलोकन",
            dryWaste: "सूखा कचरा",
            wetWaste: "गीला कचरा",
            processingLoss: "प्रसंस्करण हानि",
            recovered: "रिकवर किया गया",
            recyclers: "रीसायकलर्स",
            cementKiln: "सीमेंट भट्ठा",
            roadConst: "सड़क निर्माण",
            organicWaste: "जैविक कचरा",
            plastic: "प्लास्टिक",
            paper: "कागज",
            metal: "धातु",
            other: "अन्य",
            newReg: "नया {role} पंजीकृत: {name}",
            reportSub: "{village} के लिए रिपोर्ट सबमिट की गई",
            justNow: "अभी-अभी"
        }
    };

    // Derived data for rendering
    let displayRoleName = userRole || "Admin";
    if (displayRoleName === 'StateAdmin') displayRoleName = 'Admin';
    const greeting = userName || displayRoleName;

    const kpis = [
        { label: t('activePwmus', dashTranslations), value: stats.activePwmus, unit: t('units', dashTranslations), sub: t('operationalStatus', dashTranslations), icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
        { label: t('reportsToday', dashTranslations), value: stats.reportsSubmitted, unit: t('logs', dashTranslations), sub: t('villageSubmissions', dashTranslations), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: t('wasteProcessed', dashTranslations), value: stats.wasteProcessed.toLocaleString(), unit: t('mt', dashTranslations), sub: t('totalVolume', dashTranslations), icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
        { label: t('wasteSold', dashTranslations), value: stats.wasteSold.toLocaleString(), unit: t('mt', dashTranslations), sub: t('commercialValue', dashTranslations), icon: BarChart2, color: "text-orange-600", bg: "bg-orange-50" },
        { isFinance: true },
        { label: t('villagesLinked', dashTranslations), value: stats.villagesLinked.toLocaleString(), unit: t('villages', dashTranslations), sub: t('networkCoverage', dashTranslations), icon: Home, color: "text-blue-600", bg: "bg-blue-50" },
        { label: t('swachhagrahis', dashTranslations), value: stats.swachhagrahis.toLocaleString(), unit: t('workers', dashTranslations), sub: t('fieldForce', dashTranslations), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        { label: t('avgEfficiency', dashTranslations), value: "92%", unit: "", sub: t('statewideAvg', dashTranslations), icon: Settings, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    const actions = [
        { label: t('registerNew', dashTranslations), icon: PlusCircle, route: "/register/pwmu" },
        { label: t('submitReport', dashTranslations), icon: FileText, route: "/dashboard/pwmu" },
        { label: t('viewAnalytics', dashTranslations), icon: PieChart, route: "/dashboard/monitoring" },
        { label: t('downloadReports', dashTranslations), icon: Download, route: "#" },
    ];

    if (loading) return (
        <div className="w-full h-full flex flex-col items-center justify-center py-20">
            <Activity className="w-10 h-10 text-blue-600 animate-pulse mb-4" />
            <p className="text-lg font-bold text-gray-800">{t('summarizing', dashTranslations)}</p>
            <p className="text-sm text-gray-500 mt-1">{t('fetching', dashTranslations)}</p>
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col gap-8 font-sans pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        {t('welcome', dashTranslations)} {greeting}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        {t('happening', dashTranslations)} {displayRoleName === 'Admin' ? t('state', dashTranslations) : t('network', dashTranslations)} {t('pwmuNetwork', dashTranslations)}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-xs font-bold text-gray-700 bg-white shadow-sm"
                    >
                        <Globe className="w-3.5 h-3.5 text-blue-500" />
                        {language === 'en' ? 'हिन्दी' : 'English'}
                    </button>

                    {/* Hierarchical Location Filters */}
                    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1 overflow-x-auto max-w-[full] md:max-w-none hide-scrollbar">
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-md transition-colors min-w-[100px]">
                            <option>{t('districtWise', dashTranslations)}</option>
                            <option>Raipur</option>
                            <option>Durg</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors min-w-[100px]">
                            <option>{t('blockWise', dashTranslations)}</option>
                            <option>Arang</option>
                            <option>Abhanpur</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[120px]">
                            <option>{t('gramPanchayat', dashTranslations)}</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[100px]">
                            <option>{t('village', dashTranslations)}</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-r-md transition-colors min-w-[100px]">
                            <option>{t('pwmuWise', dashTranslations)}</option>
                        </select>
                    </div>

                    {/* System Status Bubble */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm shrink-0">
                        <div className="flex flex-col text-right mr-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-sans">{t('systemStatus', dashTranslations)}</span>
                            <span className="text-sm font-bold text-green-600 font-sans">{t('operational', dashTranslations)}</span>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 8 KPIs + Calendar in 5 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-gray-200 h-32">
                            {kpi.isFinance ? (
                                <>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t('netBalance', dashTranslations)}</h3>
                                        </div>
                                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                                            <IndianRupee className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> {t('revenue', dashTranslations)}: ₹{(stats.totalRevenue / 100000).toFixed(1)}L</div>
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> {t('expense', dashTranslations)}: ₹{(stats.totalExpense / 100000).toFixed(1)}L</div>
                                        </div>
                                        <div className="w-full flex h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-teal-500 transition-all duration-1000" style={{ width: `${(stats.totalRevenue / (stats.totalRevenue + stats.totalExpense || 1)) * 100}%` }} title="Revenue"></div>
                                            <div className="bg-red-400 transition-all duration-1000" style={{ width: `${(stats.totalExpense / (stats.totalRevenue + stats.totalExpense || 1)) * 100}%` }} title="Expenses"></div>
                                        </div>
                                        <div className="flex justify-between items-baseline box-border">
                                            <span className="text-xl font-bold text-gray-800">₹{((stats.totalRevenue - stats.totalExpense) / 100000).toFixed(1)}L</span>
                                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">{t('netFlow', dashTranslations)}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label}</h3>
                                        </div>
                                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                            <kpi.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-800">{kpi.value}</span>
                                            {kpi.unit && <span className="text-xs font-medium text-gray-500">{kpi.unit}</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1">{kpi.sub}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Calendar View */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-800">
                            {t('calendar', dashTranslations)}
                        </h2>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 flex-1">
                        <p className="text-2xl font-bold text-gray-800">{date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-gray-500 mt-1 text-center">{date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' })}</p>

                        <div className="w-full mt-4 pt-4 border-t border-gray-200">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">{t('upcomingEvents', dashTranslations)}</p>
                            <div className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                                <div className="w-1.5 h-1.5 mt-1 bg-orange-500 rounded-full shrink-0"></div>
                                <span>{t('monthlyReview', dashTranslations)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Economic & Spatial Overview */}
            <div className="mt-2 pt-6 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {displayRoleName === 'Admin' ? t('operationalEconomicState', dashTranslations) : t('operationalEconomic', dashTranslations)}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{t('deepDive', dashTranslations)}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* State Map Coverage */}
                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">{t('stateMap', dashTranslations)}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('districtCoverage', dashTranslations)}</p>
                        </div>
                        <div className="p-4 flex-1 min-h-[400px]">
                            <ChhattisgarhMap />
                        </div>
                    </div>

                    {/* Value Chain Economic Analysis Chart Space */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{t('valueChainTitle', dashTranslations)}</h2>
                                <p className="text-sm text-gray-500 mt-1">{t('valueChainSubtitle', dashTranslations)}</p>
                            </div>
                            <Info className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="p-6 h-[400px] w-full relative bg-[#fafafa]/50 rounded-b-xl overflow-x-auto overflow-y-hidden">
                            {/* Visual mock of the sankey flow */}
                            <div className="absolute left-0 top-0 w-full h-full min-w-[800px]">

                                {/* Animated Flow Lines */}
                                <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                    <defs>
                                        <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
                                        </linearGradient>
                                        <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#86efac" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#86efac" stopOpacity="0.2" />
                                        </linearGradient>
                                        <linearGradient id="flowGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>

                                    <path d="M 150 200 C 250 195, 350 205, 450 200" fill="none" stroke="url(#flowGrad1)" strokeWidth="40" className="opacity-50" />
                                    <path d="M 500 200 C 650 200, 650 100, 800 100" fill="none" stroke="url(#flowGrad2)" strokeWidth="20" className="opacity-50" />
                                    <path d="M 500 200 C 600 195, 700 205, 800 200" fill="none" stroke="url(#flowGrad3)" strokeWidth="15" className="opacity-50" />
                                    <path d="M 500 200 C 650 200, 650 300, 800 300" fill="none" stroke="#fde047" strokeWidth="10" className="opacity-50" />
                                </svg>

                                {/* Nodes Container */}
                                <div className="absolute inset-0 flex items-center justify-between px-10" style={{ zIndex: 10 }}>

                                    {/* 1. Village Node */}
                                    <div className="group relative w-48 bg-white border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer z-20">
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-[-1] scale-110"></div>
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                <Truck className="text-blue-600 w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-base">{t('villagesNode', dashTranslations)}</h3>
                                            <p className="text-sm font-semibold text-gray-600 mt-1">{valueChain.villages.volume}</p>
                                            <p className="text-xs font-bold text-red-500 mt-1">{valueChain.villages.financial}</p>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 bg-gray-900 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 scale-95 group-hover:scale-100">
                                            <p className="text-sm mb-3 text-gray-300">{valueChain.villages.hoverText}</p>
                                            <div className="space-y-2 border-t border-gray-700 pt-3">
                                                {valueChain.villages.details.map((d, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-400">{t(d.label === 'Dry Waste' ? 'dryWaste' : 'wetWaste', dashTranslations)}</span>
                                                        <span className="font-semibold">{d.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* 2. PWMU Center Node */}
                                    <div className="group relative w-48 bg-white border-2 border-[#005DAA] rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer z-20 scale-110">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005DAA] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-blue-400 shadow-sm whitespace-nowrap">{t('centralHub', dashTranslations)}</div>
                                        <div className="flex flex-col items-center text-center mt-2">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                                <Factory className="text-[#005DAA] w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-base">{t('pwmuNode', dashTranslations)}</h3>
                                            <p className="text-sm font-semibold text-gray-600 mt-1">{valueChain.pwmuCenter.volume}</p>
                                            <p className="text-xs font-bold text-red-500 mt-1">{valueChain.pwmuCenter.financial}</p>
                                        </div>

                                        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 bg-gray-900 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 scale-95 group-hover:scale-100">
                                            <p className="text-sm mb-3 text-gray-300">{valueChain.pwmuCenter.hoverText}</p>
                                            <div className="space-y-2 border-t border-gray-700 pt-3">
                                                {valueChain.pwmuCenter.details.map((d, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-400">{t(d.label === 'Processing Loss' ? 'processingLoss' : 'recovered', dashTranslations)}</span>
                                                        <span className="font-semibold">{d.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* 3. Sinks */}
                                    <div className="flex flex-col gap-6 w-48 z-20">
                                        {valueChain.sinks.map((sink) => (
                                            <div key={sink.id} className={`group relative bg-white border-2 border-${sink.color}-200 rounded-xl p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-sm">
                                                            {t(sink.id === 'recyclers' ? 'recyclers' : sink.id === 'cementKiln' ? 'cementKiln' : 'roadConst', dashTranslations)}
                                                        </h3>
                                                        <p className={`text-xs font-bold ${sink.financial.startsWith('+') ? 'text-green-600' : 'text-red-500'} mt-1`}>{sink.financial}</p>
                                                    </div>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded bg-${sink.color}-50 text-${sink.color}-700 border border-${sink.color}-100`}>{sink.volume}</span>
                                                </div>

                                                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 bg-gray-900 text-white p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                                                    <p className="text-xs">{sink.hoverText}</p>
                                                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Charts Row: Financial & Waste */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Financial Performance */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">{t('financialPerf', dashTranslations)}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('revVsExp', dashTranslations)}</p>
                        </div>
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.financialChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                    <Area type="monotone" dataKey="revenue" name={t('totalRevenueLabel', dashTranslations)} stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="spending" name={t('totalSpendingLabel', dashTranslations)} stroke="#ef4444" fillOpacity={1} fill="url(#colorSpending)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Waste Composition */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">{t('wasteComp', dashTranslations)}</h2>
                            <p className="text-sm text-gray-500 mt-1">{t('breakdown', dashTranslations)}</p>
                        </div>
                        <div className="w-full h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={stats.wasteComposition}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.wasteComposition.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                                        iconType="circle"
                                        iconSize={8}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Activity & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 animate-fade-in-up">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">{t('recentActivity', dashTranslations)}</h2>
                        <button className="text-sm font-semibold text-blue-600 hover:text-blue-800">{t('viewAll', dashTranslations)}</button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {stats.activities.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{item.time} • {item.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">{t('quickActions', dashTranslations)}</h2>
                    <div className="space-y-3">
                        {actions.map((action, idx) => (
                            <a key={idx} href={action.route} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all group">
                                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-blue-600 shadow-sm">
                                    <action.icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{action.label}</span>
                                    <span className="text-[10px] text-gray-500 font-medium">{action.hi}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
