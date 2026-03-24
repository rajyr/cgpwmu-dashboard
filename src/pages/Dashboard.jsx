import React, { useState } from 'react';
import {
    Activity, CheckCircle2, ArrowUpRight, BarChart2, IndianRupee,
    Home, Users, Settings, PlusCircle, FileText, PieChart, Download,
    Calendar as CalendarIcon, Clock, AlertTriangle, Truck, Factory, Info, Globe
} from 'lucide-react';
import ChhattisgarhMap from '../components/ChhattisgarhMap';

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useEffect } from 'react';

const API_BASE = '/cgpwmu/api';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const Dashboard = () => {
    console.log('[DASH] Component mounting - Version 3.0 (Interactive Filters)');
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
            roadConst: "Road Const.",
            organicWaste: "Organic Waste",
            plastic: "Plastic",
            metal: "Metal",
            glass: "Glass",
            ewaste: "E-Waste",
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
            metal: "धातु",
            glass: "कांच",
            ewaste: "ई-कचरा",
            other: "अन्य",
            newReg: "नया {role} पंजीकृत: {name}",
            reportSub: "{village} के लिए रिपोर्ट सबमिट की गई",
            justNow: "अभी-अभी"
        }
    };

    // Helper: Scale units for small volumes
    const formatVolume = (kg) => {
        if (!kg) return `0 ${t('mt', dashTranslations)}`;
        if (kg < 1000) return `${Math.round(kg)} Kg`;
        return `${(kg / 1000).toFixed(1)} MT`;
    };

    // Helper: Scale units for small currency
    const formatFinanceValue = (val) => {
        if (!val) return '₹0';
        if (Math.abs(val) < 10000) return `₹${Math.round(val).toLocaleString()}`;
        return `₹${(val / 100000).toFixed(1)}L`;
    };

    // State for live dashboard data
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date());
    const [stats, setStats] = useState({
        activePwmus: 0,
        reportsSubmitted: 0,
        wasteProcessed: 0,
        wasteSold: 0,
        villagesLinked: 0,
        swachhagrahis: 0,
        avgEfficiency: 0,
        totalRevenue: 0,
        totalExpense: 0,
        activities: [],
        financialChart: [],
        wasteComposition: [],
        valueChain: {
            villages: { volume: '0 MT', financial: '₹0', hoverText: 'Village collection centers', details: [] },
            pwmuCenter: { volume: '0 MT', financial: '₹0', hoverText: 'PWMU Processing Center', details: [] },
            sinks: [
                { id: 'recyclers', name: 'Recyclers', volume: '0 MT', financial: '₹0', color: 'green', hoverText: 'Plastic recycling units' },
                { id: 'cementKiln', name: 'Cement Kiln', volume: '0 MT', financial: '₹0', color: 'red', hoverText: 'Co-processing in cement factories' },
                { id: 'roadConst', name: 'Road Const.', volume: '0 MT', financial: '₹0', color: 'yellow', hoverText: 'Waste-to-Road initiatives' }
            ]
        }
    });

    // Filter persistence
    const [locationData, setLocationData] = useState({});
    const [rawData, setRawData] = useState({
        pwmu: [],
        collections: [],
        pickups: [],
        pwmuLogs: [],
        users: []
    });

    // Filter selections
    const [filters, setFilters] = useState({
        district: '',
        block: '',
        gp: '',
        village: '',
        pwmu: ''
    });

    const [mapMetric, setMapMetric] = useState('waste'); // 'waste' or 'revenue'

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const headers = {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                };

                // Helper to safe-fetch JSON
                const safeJson = async (res, label) => {
                    if (!res.ok) {
                        const text = await res.text();
                        console.warn(`[DASH] ${label} fetch failed (${res.status}):`, text.slice(0, 100));
                        return [];
                    }
                    try {
                        return await res.json();
                    } catch (e) {
                        const text = await res.text();
                        console.error(`[DASH] ${label} JSON parse error:`, e.message, "Body:", text.slice(0, 100));
                        return [];
                    }
                };

                // 1. Fetch PWMU Centers for KPIs and Financials
                console.log('[DASH] Fetching raw data for filters...');
                const [pwmuRes, villageReportRes, intakeRes, pickupRes, opLogsRes, usersRes] = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=*`, { headers }),
                    fetch(`${API_BASE}/data/village_waste_reports?select=*`, { headers }),
                    fetch(`${API_BASE}/data/pwmu_village_intake?select=*`, { headers }),
                    fetch(`${API_BASE}/data/vendor_pickups?select=*`, { headers }),
                    fetch(`${API_BASE}/data/pwmu_operational_logs?select=*`, { headers }),
                    fetch(`${API_BASE}/data/users?select=id,role,status,created_at,full_name,registration_data,district,block,gram_panchayat,village_name`, { headers })
                ]);

                const pwmuData = await safeJson(pwmuRes, 'pwmu_centers');
                const villageReports = await safeJson(villageReportRes, 'village_reports');
                const intakeData = await safeJson(intakeRes, 'intake');
                const pickupData = await safeJson(pickupRes, 'pickups');
                const opLogsData = await safeJson(opLogsRes, 'op_logs');
                const usersData = await safeJson(usersRes, 'users');

                setRawData({
                    pwmu: pwmuData,
                    villageReports: villageReports,
                    collections: intakeData, // Mapping intake to 'collections' for downstream compatibility
                    pickups: pickupData,
                    pwmuLogs: opLogsData,
                    users: usersData
                });

                // Load location data (Resilient)
                const locPaths = [
                    `${import.meta.env.BASE_URL}data/locationData.json`,
                    'data/locationData.json',
                    '/cgpwmu/data/locationData.json'
                ];
                let lData = null;
                for (const p of locPaths) {
                    try {
                        const locRes = await fetch(p);
                        if (locRes.ok) {
                            lData = await locRes.json();
                            break;
                        }
                    } catch (e) {}
                }
                
                if (lData) {
                    setLocationData(lData);
                } else {
                    console.error("Failed to load location data from any path");
                }

            } catch (err) {
                console.error('Final Dashboard Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 1.5. Default Filter for PWMUManager
    useEffect(() => {
        if (userRole === 'PWMUManager' && !filters.pwmu) {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const myPwmuId = session.user?.id;
            if (myPwmuId) {
                console.log('[DASH] Auto-setting filter for PWMUManager:', myPwmuId);
                setFilters(prev => ({ ...prev, pwmu: myPwmuId }));
            }
        }
    }, [userRole, rawData.pwmu]);

    // 2. Computed Stats based on Filters
    useEffect(() => {
        if (!rawData.pwmu.length && !rawData.collections.length) return;

        console.log('[DASH] Computing stats for filters:', filters);

        const applyLocationFilter = (item) => {
            const { district, block, gp, village, pwmu } = filters;

            // PWMU Specific Filter (Overrides everything if set)
            if (pwmu) {
                if (item.pwmu_id && item.pwmu_id === pwmu) return true;
                if (item.pwmu_name && item.pwmu_name.includes(pwmu)) return true;
                // If checking users, see if they are linked to this PWMU
                if (item.registration_data?.pwmuId === pwmu) return true;
                return false;
            }

            // Hierarchical Filters
            if (district && !((item.district || '').includes(district.split(' (')[0]))) return false;
            if (block && !((item.block || '').includes(block.split(' (')[0]))) return false;
            if (gp && !((item.gram_panchayat || '').includes(gp.split(' (')[0]))) return false;
            if (village && !((item.village_name || item.village || '').includes(village.split(' (')[0]))) return false;

            return true;
        };

        const filteredPwmu = rawData.pwmu.filter(p => applyLocationFilter(p));
        const filteredVillageReports = (rawData.villageReports || []).filter(v => applyLocationFilter(v));
        const filteredCollections = rawData.collections.filter(c => applyLocationFilter(c));
        const filteredLogs = rawData.pwmuLogs.filter(l => applyLocationFilter(l));
        const filteredPickups = rawData.pickups.filter(p => applyLocationFilter(p));
        const filteredUsers = rawData.users.filter(u => applyLocationFilter(u));

        // Aggregate results
        const today = new Date().toISOString().split('T')[0];
        const activePwmus = filteredPwmu.filter(p => p.status?.toLowerCase() === 'operational').length;
        const reportsToday = filteredVillageReports.filter(c => c.collection_date === today).length;
        const villageSentVolumeKg = filteredVillageReports.reduce((acc, curr) => acc + (parseFloat(curr.shared_with_pwmu_kg) || 0), 0);
        const wasteProcessedKg = filteredLogs.reduce((acc, curr) => acc + (parseFloat(curr.processed_kg || curr.total_intake_kg) || 0), 0);
        const wasteSoldKg = filteredPickups.reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0);
        const totalWetKg = filteredCollections.reduce((acc, curr) => acc + (parseFloat(curr.wet_waste_kg) || 0), 0);
        const intakeVillages = new Set(filteredCollections.map(c => c.village_name)).size;

        const villagesLinked = intakeVillages > 0 ? intakeVillages : filteredUsers.filter(u => u.role === 'Sarpanch').length;
        const swachhagrahis = filteredUsers.filter(u => u.role?.toLowerCase() === 'swachhagrahi').length || (villagesLinked > 0 ? villagesLinked * 4 : 0);
        
        const totalEfficiency = filteredPwmu.reduce((acc, curr) => acc + (parseFloat(curr.recovery_rate) || 0), 0);
        const avgEfficiency = filteredPwmu.length > 0 ? Math.round(totalEfficiency / filteredPwmu.length) : 0;

        const totalRevenue = filteredPickups.reduce((acc, curr) => acc + (parseFloat(curr.amount_paid) || 0), 0);
        const totalExpense = (wasteProcessedKg / 1000) * 2500;

        // Aggregate by District for Map
        const districtWasteMap = {};
        const districtRevenueMap = {};
        (rawData.pwmuLogs || []).forEach(l => {
            const rawD = rawData.pwmu.find(pwm => pwm.id === l.pwmu_id)?.district || '';
            const d = rawD.split(' (')[0];
            if (d) districtWasteMap[d] = (districtWasteMap[d] || 0) + (parseFloat(l.total_intake_kg) || 0);
        });
        rawData.pickups.forEach(p => {
            const rawD = rawData.pwmu.find(pwm => pwm.name === p.pwmu_name)?.district || '';
            const d = rawD.split(' (')[0];
            if (d) districtRevenueMap[d] = (districtRevenueMap[d] || 0) + (parseFloat(p.amount_paid) || 0);
        });

        // Waste Composition Aggregation (Standardized 6 Categories)
        const getMaterialTotal = (type) => filteredPickups
            .filter(p => p.material?.toLowerCase().includes(type.toLowerCase()))
            .reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0);

        const plastic = getMaterialTotal('plastic');
        const metal = getMaterialTotal('metal');
        const glass = getMaterialTotal('glass');
        const ewaste = getMaterialTotal('ewaste');
        const allPickupsTotal = filteredPickups.reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0);
        const other = allPickupsTotal - (plastic + metal + glass + ewaste);

        const totalVolComp = totalWetKg + plastic + metal + glass + ewaste + Math.max(0, other);
        const composition = totalVolComp > 0 ? [
            { name: t('organicWaste', dashTranslations), value: Math.round((totalWetKg / totalVolComp) * 100), color: '#22c55e' },
            { name: t('plastic', dashTranslations), value: Math.round((plastic / totalVolComp) * 100), color: '#3b82f6' },
            { name: t('metal', dashTranslations), value: Math.round((metal / totalVolComp) * 100), color: '#a855f7' },
            { name: t('glass', dashTranslations), value: Math.round((glass / totalVolComp) * 100), color: '#0ea5e9' },
            { name: t('ewaste', dashTranslations), value: Math.round((ewaste / totalVolComp) * 100), color: '#6366f1' },
            { name: t('other', dashTranslations), value: Math.round((Math.max(0, other) / totalVolComp) * 100), color: '#64748b' },
        ] : [
            { name: t('organicWaste', dashTranslations), value: 0, color: '#22c55e' },
            { name: t('plastic', dashTranslations), value: 0, color: '#3b82f6' },
            { name: t('metal', dashTranslations), value: 0, color: '#a855f7' },
            { name: t('glass', dashTranslations), value: 0, color: '#0ea5e9' },
            { name: t('ewaste', dashTranslations), value: 0, color: '#6366f1' },
            { name: t('other', dashTranslations), value: 0, color: '#64748b' },
        ];

        // Recent Activities
        const activities = [
            ...filteredUsers.slice(0, 3).map(u => ({
                id: u.id,
                title: t('newReg', dashTranslations).replace('{role}', u.role).replace('{name}', u.full_name),
                time: new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'Registration',
                icon: Users,
                color: 'text-blue-500',
                bg: 'bg-blue-100'
            })),
            ...filteredCollections.slice(0, 2).map(c => ({
                id: c.id,
                title: t('reportSub', dashTranslations).replace('{village}', c.village_name || 'Village'),
                time: t('justNow', dashTranslations),
                type: 'Submission',
                icon: FileText,
                color: 'text-green-500',
                bg: 'bg-green-100'
            }))
        ];

        setStats(prev => ({
            ...prev,
            activePwmus,
            reportsSubmitted: reportsToday,
            wasteProcessed: wasteProcessedKg / 1000,
            wasteSold: wasteSoldKg / 1000,
            villagesLinked,
            swachhagrahis,
            avgEfficiency,
            totalRevenue,
            totalExpense,
            activities,
            wasteComposition: composition,
            districtWasteMap,
            districtRevenueMap,
            financialChart: [
                { month: 'Jan', revenue: totalRevenue * 0.7, spending: totalExpense * 0.8 },
                { month: 'Feb', revenue: totalRevenue * 0.85, spending: totalExpense * 0.9 },
                { month: 'Mar', revenue: totalRevenue, spending: totalExpense },
            ],
            valueChain: {
                villages: {
                    volume: formatVolume(villageSentVolumeKg),
                    financial: `-` + formatFinanceValue(villageSentVolumeKg * 1.2),
                    hoverText: `Material reported by ${villagesLinked} active villages.`,
                    details: [
                        { label: 'Dry Waste', value: formatVolume(villageSentVolumeKg * 0.7) },
                        { label: 'Wet Waste', value: formatVolume(villageSentVolumeKg * 0.3) }
                    ]
                },
                pwmuCenter: {
                    volume: formatVolume(wasteProcessedKg),
                    financial: `-` + formatFinanceValue(totalExpense),
                    hoverText: "Processing and transport operations.",
                    details: [
                        { label: 'Processing Loss', value: formatVolume(wasteProcessedKg * (1 - avgEfficiency / 100)) },
                        { label: 'Recovered', value: formatVolume(wasteProcessedKg * (avgEfficiency / 100)) }
                    ]
                },
                    sinks: [
                        { id: 'recyclers', name: 'Recyclers', volume: formatVolume(wasteProcessedKg * 0.45), financial: `+` + formatFinanceValue(totalRevenue > 0 ? totalRevenue * 0.65 : wasteProcessedKg * 2.5), color: 'green' },
                        { id: 'cementKiln', name: 'Cement Kiln', volume: formatVolume(wasteProcessedKg * 0.25), financial: `+` + formatFinanceValue(totalRevenue > 0 ? totalRevenue * 0.15 : wasteProcessedKg * 1.5), color: 'red' },
                        { id: 'roadConst', name: 'Road Const.', volume: formatVolume(wasteProcessedKg * 0.20), financial: `+` + formatFinanceValue(totalRevenue > 0 ? totalRevenue * 0.20 : wasteProcessedKg * 1.0), color: 'yellow' }
                    ]
            }
        }));
    }, [filters, rawData]);

    const valueChain = stats.valueChain;

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
        { label: t('avgEfficiency', dashTranslations), value: `${stats.avgEfficiency}%`, unit: "", sub: t('statewideAvg', dashTranslations), icon: Settings, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    const actions = [
        { label: t('registerNew', dashTranslations), icon: PlusCircle, route: "/register/pwmu" },
        { label: t('submitReport', dashTranslations), icon: FileText, route: "/dashboard/pwmu" },
        { label: t('viewAnalytics', dashTranslations), icon: PieChart, route: "/dashboard/monitoring" },
        { label: t('downloadReports', dashTranslations), icon: Download, route: "/dashboard/reports" },
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
                        <select
                            value={filters.district}
                            onChange={(e) => setFilters({ ...filters, district: e.target.value, block: '', gp: '', village: '' })}
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-md transition-colors min-w-[120px]">
                            <option value="">{t('districtWise', dashTranslations)}</option>
                            {Object.keys(locationData).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                            value={filters.block}
                            disabled={!filters.district}
                            onChange={(e) => setFilters({ ...filters, block: e.target.value, gp: '', village: '' })}
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors min-w-[120px]">
                            <option value="">{t('blockWise', dashTranslations)}</option>
                            {filters.district && locationData[filters.district] && Object.keys(locationData[filters.district]).map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <select
                            value={filters.gp}
                            disabled={!filters.block}
                            onChange={(e) => setFilters({ ...filters, gp: e.target.value, village: '' })}
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[150px]">
                            <option value="">{t('gramPanchayat', dashTranslations)}</option>
                            {filters.district && filters.block && locationData[filters.district][filters.block] && Object.keys(locationData[filters.district][filters.block]).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <select
                            value={filters.village}
                            disabled={!filters.gp}
                            onChange={(e) => setFilters({ ...filters, village: e.target.value })}
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[120px]">
                            <option value="">{t('village', dashTranslations)}</option>
                            {filters.district && filters.block && filters.gp && locationData[filters.district][filters.block][filters.gp] && locationData[filters.district][filters.block][filters.gp].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                        <select
                            value={filters.pwmu}
                            onChange={(e) => setFilters({ ...filters, pwmu: e.target.value })}
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-r-md transition-colors min-w-[120px]">
                            <option value="">{t('pwmuWise', dashTranslations)}</option>
                            {rawData.pwmu.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> {t('revenue', dashTranslations)}: {formatFinanceValue(stats.totalRevenue)}</div>
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> {t('expense', dashTranslations)}: {formatFinanceValue(stats.totalExpense)}</div>
                                        </div>
                                        <div className="w-full flex h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-teal-500 transition-all duration-1000" style={{ width: `${(stats.totalRevenue / (stats.totalRevenue + stats.totalExpense || 1)) * 100}%` }} title="Revenue"></div>
                                            <div className="bg-red-400 transition-all duration-1000" style={{ width: `${(stats.totalExpense / (stats.totalRevenue + stats.totalExpense || 1)) * 100}%` }} title="Expenses"></div>
                                        </div>
                                        <div className="flex justify-between items-baseline box-border">
                                            <span className="text-xl font-bold text-gray-800">{formatFinanceValue(stats.totalRevenue - stats.totalExpense)}</span>
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
                        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">{t('stateMap', dashTranslations)}</h2>
                                <p className="text-sm text-gray-500 mt-1">{t('districtCoverage', dashTranslations)}</p>
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1 shadow-inner h-fit self-end">
                                <button 
                                    onClick={() => setMapMetric('waste')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mapMetric === 'waste' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {t('dryWaste', dashTranslations)}
                                </button>
                                <button 
                                    onClick={() => setMapMetric('revenue')}
                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mapMetric === 'revenue' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {t('revenue', dashTranslations)}
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex-1 min-h-[400px]">
                            <ChhattisgarhMap 
                                metricData={mapMetric === 'waste' ? stats.districtWasteMap : stats.districtRevenueMap} 
                                metricType={mapMetric}
                            />
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
                                    <div className="flex flex-col gap-6 w-64 z-20">
                                        {valueChain.sinks.map((sink) => {
                                            const colorMap = {
                                                green: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700', financial: 'text-green-600' },
                                                red: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700', financial: 'text-red-500' },
                                                yellow: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', financial: 'text-amber-600' }
                                            };
                                            const colors = colorMap[sink.color] || colorMap.green;

                                            return (
                                                <div key={sink.id} className={`group relative bg-white border-2 ${colors.border} rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer`}>
                                                    <div className="flex justify-between items-center gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-black text-gray-800 text-base leading-tight mb-1 whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                                                {t(sink.id, dashTranslations)}
                                                            </h4>
                                                            <p className={`text-sm font-bold ${colors.financial}`}>
                                                                {sink.financial}
                                                            </p>
                                                        </div>
                                                        <div className={`px-3 py-1.5 rounded-xl ${colors.bg} ${colors.text} border ${colors.border}/50 flex items-center justify-center shrink-0`}>
                                                            <span className="text-xs font-black whitespace-nowrap">
                                                                {sink.volume.replace(' MT', ' Tn')}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 w-56 bg-gray-900 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                                                        <p className="text-sm">{sink.hoverText || `${sink.volume} processed.`}</p>
                                                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                                    </div>
                                                </div>
                                            );
                                        })}
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
