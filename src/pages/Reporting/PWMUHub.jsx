import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileBarChart, Bell, MapPin, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, Factory, History, XCircle, ChevronLeft, ChevronRight, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const PWMUHub = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [pwmuData, setPwmuData] = useState(null);
    const [submittedDays, setSubmittedDays] = useState([]);
    const [weeklyKpis, setWeeklyKpis] = useState({
        totalIntake: 0,
        reportingRate: 0,
        transport: 0,
        recovery: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [logDetails, setLogDetails] = useState({});
    const [linkedVillages, setLinkedVillages] = useState({ total: 0, submittedToday: 0 });
    
    // NEW: Selection states for Admins
    const [allCenters, setAllCenters] = useState([]);
    const [selectedCenterId, setSelectedCenterId] = useState(new URLSearchParams(window.location.search).get('centerId'));
    const [searchQuery, setSearchQuery] = useState('');
    const [districtFilter, setDistrictFilter] = useState('All');

    const currentDateObj = new Date();
    const today = currentDateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const hubTranslations = {
        en: {
            welcome: "Welcome, Nodal Officer",
            activeStatus: "PWMU ACTIVE",
            submitDailyLog: "Submit Daily Log",
            dailyDesc: "Record daily plastic waste collection from your linked Gram Panchayats and Villages. Ensure all connected bodies are accounted for.",
            submitMonthly: "Submit Monthly Report",
            monthlyDesc: "File your comprehensive monthly performance report including operational status, financial sales (revenue), and O&M expenses.",
            startDataEntry: "Start Data Entry",
            dailyTracker: "Daily Submission Tracker",
            submitted: "Submitted",
            missed: "Missed",
            pending: "Pending",
            sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
            weeklyPerf: "Weekly Performance",
            totalIntake: "Total Intake (This Week)",
            reportingRate: "Active Reporting Rate",
            secondaryTransport: "Total Secondary Transport",
            recoveryRate: "Resource Recovery Rate",
            actionCenter: "Action Center & Alerts",
            newAlerts: "{count} New",
            recentHistory: "Recent History",
            viewAllHistory: "View All History",
            dataFilled: "100% Data Filled",
            dataMissing: "Data Missing - Click to Log",
            linkedBodies: "{count} / {total} Linked Bodies",
            missedBodies: "0 / {total} Linked Bodies",
            dailyLogTitle: "Daily Waste Log",
            monthlyReportTitle: "Monthly Report (Previous Month)",
            statusSubmitted: "Submitted",
            statusApproved: "Approved",
            unsubmittedLogs: "{count} linked villages have not submitted daily logs today.",
            monthlyDue: "Monthly Performance Report is due in 4 days.",
            logApproved: "Yesterday's daily log approved.",
            kg: "kg"
        },
        hi: {
            welcome: "स्वागत है, नोडल अधिकारी",
            activeStatus: "PWMU सक्रिय",
            submitDailyLog: "दैनिक लॉग सबमिट करें",
            dailyDesc: "अपनी लिंक की गई ग्राम पंचायतों और गांवों से दैनिक प्लास्टिक कचरा संग्रह रिकॉर्ड करें। सुनिश्चित करें कि सभी निकाय शामिल हैं।",
            submitMonthly: "मासिक रिपोर्ट सबमिट करें",
            monthlyDesc: "परिचालन स्थिति, वित्तीय बिक्री (राजस्व) और ओ एंड एम खर्चों सहित अपनी व्यापक मासिक प्रदर्शन रिपोर्ट दर्ज करें।",
            startDataEntry: "डेटा प्रविष्टि शुरू करें",
            dailyTracker: "दैनिक सबमिशन ट्रैकर",
            submitted: "सबमिट किया गया",
            missed: "छूट गया",
            pending: "लंबित",
            sun: "रवि", mon: "सोम", tue: "मंगल", wed: "बुध", thu: "गुरु", fri: "शुक्र", sat: "शनि",
            weeklyPerf: "साप्ताहिक प्रदर्शन",
            totalIntake: "कुल अंतर्ग्रहण (इस सप्ताह)",
            reportingRate: "सक्रिय रिपोर्टिंग दर",
            secondaryTransport: "कुल द्वितीयक परिवहन",
            recoveryRate: "संसाधन रिकवरी दर",
            actionCenter: "एक्शन सेंटर और अलर्ट",
            newAlerts: "{count} नए",
            recentHistory: "हाल का इतिहास",
            viewAllHistory: "पूरा इतिहास देखें",
            dataFilled: "100% डेटा भरा गया",
            dataMissing: "डेटा गायब - लॉग करने के लिए क्लिक करें",
            linkedBodies: "{count} / {total} लिंक किए गए निकाय",
            missedBodies: "0 / {total} लिंक किए गए निकाय",
            dailyLogTitle: "दैनिक अपशिष्ट लॉग",
            monthlyReportTitle: "मासिक रिपोर्ट (पिछला महीना)",
            statusSubmitted: "सबमिट किया गया",
            statusApproved: "अनुमोदित",
            unsubmittedLogs: "{count} लिंक किए गए गांवों ने आज दैनिक लॉग सबमिट नहीं किए हैं।",
            monthlyDue: "मासिक प्रदर्शन रिपोर्ट 4 दिनों में देय है।",
            logApproved: "कल का दैनिक लॉग स्वीकृत हो गया।",
            kg: "किलो"
        }
    };

    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const realToday = new Date();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthName = currentDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });

    useEffect(() => {
        const fetchHubData = async () => {
            if (!user) return;
            
            // Sync URL param if it changes externally
            const urlParams = new URLSearchParams(window.location.search);
            const urlCenterId = urlParams.get('centerId');
            if (urlCenterId && urlCenterId !== selectedCenterId) {
                setSelectedCenterId(urlCenterId);
            }

            setLoading(true);
            let centerData = null;

            try {
                // 1. Identify PWMU Center
                const reg = user.registration_data || {};
                const isAdmin = user.role === 'StateAdmin' || user.role === 'DistrictNodal';

                // Role can be in user.role OR reg.role/type
                const isManager = user.role === 'PWMUManager' || reg.role === 'PWMUManager' || reg.type === 'PWMU';

                if (isManager) {
                    centerData = {
                        id: reg.pwmuId || user.id, // Prioritize standardized pwmuId
                        name: reg.pwmuName || reg.centerName || 'PWMU Center',
                        district: reg.district,
                        block: reg.block,
                        gramPanchayat: reg.gramPanchayat,
                        village: reg.village,
                        status: 'operational'
                    };
                }

                if (!centerData) {
                    // If we have a selectedCenterId (from Admin selector or URL), fetch that specifically
                    if (selectedCenterId) {
                        const { data } = await supabase
                            .from('pwmu_centers')
                            .select('*')
                            .eq('id', selectedCenterId)
                            .maybeSingle();
                        if (data) centerData = data;
                    } 
                    // Otherwise try to find one assigned to this nodal agent (only if NOT state/district admin)
                    else if (!isAdmin) {
                        const { data } = await supabase
                            .from('pwmu_centers')
                            .select('*')
                            .or(`id.eq.${user.id},nodal_officer_id.eq.${user.id}`)
                            .maybeSingle();
                        if (data) {
                            centerData = data;
                            setSelectedCenterId(data.id);
                        }
                    }
                }

                if (centerData) {
                    setPwmuData(centerData);

                    // 2. Fetch Linked Villages
                    const { data: villages } = await supabase
                        .from('users')
                        .select('id, registration_data')
                        .eq('role', 'Village');
                    
                    const linked = villages?.filter(v => {
                        let rd = v.registration_data || {};
                        if (typeof rd === 'string') {
                            try { rd = JSON.parse(rd); } catch(e) {}
                        }
                        return String(rd.pwmuId) === String(centerData.id) || rd.centerName === centerData.name;
                    }) || [];

                    // Get manager's serviceVillages
                    let serviceVillages = [];
                    if (isManager && String(centerData.id) === String(user.registration_data?.pwmuId || user.id)) {
                        serviceVillages = user.registration_data?.serviceVillages || [];
                    } else {
                        const searchId = centerData.nodal_officer_id || centerData.id;
                        const { data: managerUser } = await supabase
                            .from('users')
                            .select('registration_data')
                            .eq('id', searchId)
                            .maybeSingle();
                        if (managerUser) {
                            let mrd = managerUser.registration_data || {};
                            if (typeof mrd === 'string') {
                                try { mrd = JSON.parse(mrd); } catch(e) {}
                            }
                            serviceVillages = mrd.serviceVillages || [];
                        }
                    }

                    const extractCode = (str) => {
                        if (!str) return null;
                        const match = str.match(/\((\d+)\)/);
                        return match ? match[1] : null;
                    };

                    const combinedVillages = [...linked.map(v => {
                        let rd = v.registration_data || {};
                        if (typeof rd === 'string') { try { rd = JSON.parse(rd); } catch(e) {} }
                        return {
                            id: v.id,
                            name: rd.villageName || rd.primaryVillage || rd.gramPanchayat || 'Village'
                        };
                    })];

                    serviceVillages.forEach(vName => {
                        const vCode = extractCode(vName);
                        // Simplified duplicate check
                        const exists = combinedVillages.find(fv => {
                            if (fv.name === vName) return true;
                            const fvCode = extractCode(fv.name);
                            if (vCode && fvCode && vCode === fvCode) return true;
                            return false;
                        });
                        if (!exists) {
                            combinedVillages.push({
                                id: `profile-${vName}`,
                                name: vName
                            });
                        }
                    });

                    // Local-time safe date range (YYYY-MM-DD)
                    const formatLocal = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                    const todayStr = formatLocal(realToday);
                    const startStr = formatLocal(new Date(currentYear, currentMonth, 1));
                    const endStr = formatLocal(new Date(currentYear, currentMonth + 1, 0));

                    // 3. Fetch PWMU Logs & Village Reports
                    const [logsRes, villageReportsRes] = await Promise.all([
                        supabase
                            .from('pwmu_operational_logs')
                            .select('log_date, total_intake_kg, processed_stock_breakdown')
                            .eq('pwmu_id', centerData.id)
                            .gte('log_date', startStr)
                            .lte('log_date', endStr),
                        supabase
                            .from('village_waste_reports')
                            .select('village_id, collection_date')
                            .eq('collection_date', todayStr)
                    ]);

                    const pwmuLogs = logsRes.data || [];
                    const todayReports = villageReportsRes.data || [];

                    const submittedTodayCount = combinedVillages.filter(v => 
                        todayReports.some(r => r.village_id === v.id || r.village_name === v.name)
                    ).length;

                    setLinkedVillages({
                        total: combinedVillages.length,
                        submittedToday: submittedTodayCount
                    });

                    if (pwmuLogs) {
                        const days = [...new Set(pwmuLogs.map(l => parseInt(l.log_date.split('-')[2])))];
                        setSubmittedDays(days);

                        const details = {};
                        pwmuLogs.forEach(l => {
                            const dayNum = parseInt(l.log_date.split('-')[2]);
                            details[dayNum] = l;
                        });
                        setLogDetails(details);

                        // Weekly KPIs
                        const last7 = new Date();
                        last7.setDate(realToday.getDate() - 7);
                        const last7Str = formatLocal(last7);
                        const weeklyLogs = pwmuLogs.filter(l => l.log_date >= last7Str);

                        const totalIntake = weeklyLogs.reduce((sum, l) => sum + (Number(l.total_intake_kg) || 0), 0);
                        setWeeklyKpis({
                            totalIntake: Math.round(totalIntake),
                            reportingRate: Math.round((weeklyLogs.length / 7) * 100),
                            transport: Math.round(totalIntake * 0.4),
                            recovery: centerData.recovery_rate || 76
                        });

                        // Recent History
                        setRecentActivity(pwmuLogs.slice(0, 3).map((l, idx) => ({
                            id: idx,
                            title: t('dailyLogTitle', hubTranslations),
                            date: new Date(l.log_date).toLocaleDateString(),
                            status: t('statusSubmitted', hubTranslations),
                            icon: Truck
                        })));

                        // Alerts
                        const alerts = [];
                        if (!pwmuLogs.some(l => l.log_date === todayStr)) {
                            const unsubmittedCount = combinedVillages.length - submittedTodayCount;
                            if (unsubmittedCount > 0) {
                                alerts.push({ 
                                    id: 1, 
                                    type: 'warning', 
                                    text: t('unsubmittedLogs', hubTranslations).replace('{count}', unsubmittedCount), 
                                    unread: true 
                                });
                            }
                        }
                        if (realToday.getDate() <= 5) {
                            alerts.push({ id: 2, type: 'info', text: t('monthlyDue', hubTranslations), unread: true });
                        }
                        setNotifications(alerts);
                    }
                }
            } catch (err) {
                console.error('Error fetching hub data:', err);
            } finally {
                // If it's an Admin/Nodal and we still don't have centerData, 
                // fetch all centers for the selector
                const reg = user.registration_data || {};
                const isAdmin = user.role === 'StateAdmin' || user.role === 'DistrictNodal';
                
                if (isAdmin && !centerData) {
                    const { data: centers } = await supabase
                        .from('pwmu_centers')
                        .select('*')
                        .order('name');
                    setAllCenters(centers || []);
                }
                
                setLoading(false);
            }
        };

        fetchHubData();
    }, [user, currentMonth, currentYear, selectedCenterId]);

    // Handle switching centers
    const handleSelectCenter = (id) => {
        setSelectedCenterId(id);
        const url = new URL(window.location);
        url.searchParams.set('centerId', id);
        window.history.pushState({}, '', url);
    };

    const handleClearSelection = () => {
        setSelectedCenterId(null);
        setPwmuData(null);
        const url = new URL(window.location);
        url.searchParams.delete('centerId');
        window.history.pushState({}, '', url);
    };

    const missedDays = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => {
        const dDate = new Date(currentYear, currentMonth, d);
        // Important: Use a date threshold for "Missed" that is strictly BEFORE today
        const startOfToday = new Date(realToday.getFullYear(), realToday.getMonth(), realToday.getDate());
        return dDate < startOfToday && !submittedDays.includes(d);
    });

    const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    if (loading && !pwmuData) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-[#005DAA]">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-bold">Loading PWMU Data...</p>
            </div>
        );
    }

    // PWMU Selector View for Admins
    if (!pwmuData && (user?.role === 'StateAdmin' || user?.role === 'DistrictNodal')) {
        const districts = ['All', ...new Set(allCenters.map(c => c.district))];
        const filtered = allCenters.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 c.district.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDistrict = districtFilter === 'All' || c.district === districtFilter;
            return matchesSearch && matchesDistrict;
        });

        return (
            <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Select PWMU Hub</h1>
                            <p className="text-gray-500">Pick a processing center to view its operational status and logs.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search PWMU..." 
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full sm:w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select 
                                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={districtFilter}
                                onChange={(e) => setDistrictFilter(e.target.value)}
                            >
                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(center => (
                            <div 
                                key={center.id} 
                                onClick={() => handleSelectCenter(center.id)}
                                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-3">
                                    <div className={`w-2 h-2 rounded-full ${center.status === 'operational' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Factory className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{center.name}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                                    <MapPin className="w-3 h-3" />
                                    {center.district} • {center.block}
                                </p>
                                <div className="flex items-center text-blue-600 font-bold text-sm">
                                    Open Dashboard <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No PWMU centers found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Safety fallback
    if (!pwmuData) return null;

    return (
        <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#005DAA] to-[#0070CC] rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Factory className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-3xl font-bold">{t('welcome', hubTranslations)}, {user?.full_name?.split(' ')[0]}</h1>
                             {(user?.role === 'StateAdmin' || user?.role === 'DistrictNodal') && (
                                <button 
                                    onClick={handleClearSelection}
                                    className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs font-bold border border-white/20 transition-all flex items-center gap-1.5"
                                >
                                    <ChevronLeft className="w-3 h-3" />
                                    Switch PWMU
                                </button>
                             )}
                        </div>
                        <p className="text-blue-100 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1.5 opacity-90">
                                <CalendarIcon className="w-4 h-4" />
                                {today}
                            </span>
                            <span className="flex items-center gap-1.5 opacity-90 border-l border-white/20 pl-4">
                                <MapPin className="w-4 h-4" />
                                {[pwmuData?.district, pwmuData?.block, pwmuData?.gramPanchayat, pwmuData?.village].filter(Boolean).join(' - ')}
                            </span>
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className={`w-3 h-3 ${pwmuData?.status === 'operational' ? 'bg-green-400' : 'bg-red-400'} rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]`}></div>
                        <span className="font-semibold tracking-wide text-sm">{pwmuData?.name || t('activeStatus', hubTranslations)} {pwmuData?.status?.toUpperCase()}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => navigate('/pwmu/daily-log')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#005DAA]/30 group">
                    <div className="w-14 h-14 bg-blue-50 text-[#005DAA] rounded-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-[#005DAA] group-hover:text-white transition-colors duration-300">
                        <Truck className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitDailyLog', hubTranslations)}</h2>
                    <p className="text-gray-500 mb-6 flex-grow">{t('dailyDesc', hubTranslations)}</p>
                    <div className="flex items-center text-[#005DAA] font-semibold text-sm">
                        {t('startDataEntry', hubTranslations)}
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

                <div onClick={() => navigate('/pwmu/monthly-report')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500/30 group">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                        <FileBarChart className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitMonthly', hubTranslations)}</h2>
                    <p className="text-gray-500 mb-6 flex-grow">{t('monthlyDesc', hubTranslations)}</p>
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                        {t('startDataEntry', hubTranslations)}
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">{t('dailyTracker', hubTranslations)}</h3>
                                <div className="ml-4 flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="px-3 text-sm font-semibold text-[#005DAA] min-w-[120px] text-center">{monthName}</div>
                                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1.5 text-green-700">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div> 
                                    {t('linkedBodies', hubTranslations).replace('{count}', linkedVillages.submittedToday).replace('{total}', linkedVillages.total)}
                                </div>
                                <div className="flex items-center gap-1.5 text-red-700">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div> 
                                    {t('missedBodies', hubTranslations).replace('{total}', linkedVillages.total)}
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div> {t('pending', hubTranslations)}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 overflow-x-auto">
                            <div className="min-w-[400px]">
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {[t('sun', hubTranslations), t('mon', hubTranslations), t('tue', hubTranslations), t('wed', hubTranslations), t('thu', hubTranslations), t('fri', hubTranslations), t('sat', hubTranslations)].map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square"></div>
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const cellDate = new Date(currentYear, currentMonth, day);
                                        const isSubmitted = submittedDays.includes(day);
                                        const isMissed = missedDays.includes(day);
                                        const isToday = cellDate.toDateString() === realToday.toDateString();
                                        const isFuture = cellDate > realToday && !isToday;

                                        let bgClass = "bg-gray-50 border border-gray-100";
                                        let textClass = "text-gray-600";
                                        if (isSubmitted) { bgClass = "bg-green-50 border-green-200"; textClass = "text-green-700 font-bold"; }
                                        else if (isMissed) { bgClass = "bg-red-50 border-red-200"; textClass = "text-red-700 font-bold"; }
                                        else if (isFuture) { bgClass = "bg-transparent border-dashed opacity-50"; textClass = "text-gray-400"; }

                                        return (
                                            <div key={day} onClick={() => (isMissed || isSubmitted) && navigate(`/pwmu/daily-log?date=${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                                                className={`relative group aspect-square rounded-xl p-1.5 flex flex-col items-center justify-center transition-all ${bgClass} ${(isMissed || isSubmitted) ? 'cursor-pointer hover:shadow-md' : 'cursor-default'} ${isToday ? 'ring-2 ring-[#005DAA] ring-offset-2' : ''}`}>
                                                <span className={`text-[13px] ${textClass}`}>{day}</span>
                                                {!isFuture && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max min-w-[180px] bg-gray-900 text-white text-[11px] rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 shadow-2xl border border-white/10 backdrop-blur-md">
                                                        {isSubmitted ? (
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                                                                    <span className="font-bold text-blue-300 tracking-tight">{t('dailyLogTitle', hubTranslations)}</span>
                                                                    <span className="font-black text-white">{day} {monthName.split(' ')[0]}</span>
                                                                </div>
                                                                
                                                                {/* 6 Waste Distribution */}
                                                                <div className="space-y-1">
                                                                    {Object.entries(JSON.parse(logDetails[day]?.processed_stock_breakdown || '{}')).map(([k, v]) => {
                                                                        const val = parseFloat(v);
                                                                        if (!val || val <= 0) return null;
                                                                        // Map keys to labels from DailyLog translations if possible, or just capitalize
                                                                        const label = k.charAt(0) + k.slice(1).toLowerCase();
                                                                        return (
                                                                            <div key={k} className="flex items-center justify-between gap-4 opacity-90">
                                                                                <span className="text-gray-400">{label}:</span>
                                                                                <span className="font-mono font-bold">{val.toFixed(2)} {t('kg', hubTranslations)}</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>

                                                                <div className="pt-2 border-t border-white/20 mt-2 flex items-center justify-between">
                                                                    <span className="font-bold text-gray-400">{t('totalIntake', hubTranslations).split(' (')[0]}:</span>
                                                                    <span className="font-black text-blue-400 text-sm">{Number(logDetails[day]?.total_intake_kg || 0).toFixed(2)} {t('kg', hubTranslations)}</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                                                <span className="font-bold text-red-100">{t('dataMissing', hubTranslations)}</span>
                                                            </div>
                                                        )}
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                            <TrendingUp className="w-5 h-5 text-[#005DAA]" />
                            <h3 className="font-bold text-gray-800">{t('weeklyPerf', hubTranslations)}</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: t('totalIntake', hubTranslations), value: weeklyKpis.totalIntake.toLocaleString(), unit: t('kg', hubTranslations), icon: Activity, color: 'blue' },
                                { label: t('reportingRate', hubTranslations), value: `${weeklyKpis.reportingRate}%`, unit: '', icon: Users, color: 'green' },
                                { label: t('secondaryTransport', hubTranslations), value: weeklyKpis.transport.toLocaleString(), unit: t('kg', hubTranslations), icon: Truck, color: 'orange' },
                                { label: t('recoveryRate', hubTranslations), value: `${weeklyKpis.recovery}%`, unit: '', icon: Factory, color: 'purple' }
                            ].map((kpi, idx) => (
                                <div key={idx} className={`bg-${kpi.color}-50/50 rounded-xl p-4 border border-${kpi.color}-100 flex items-center justify-between`}>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">{kpi.label}</p>
                                        <h4 className={`text-2xl font-bold text-${kpi.color}-700`}>{kpi.value} <span className="text-sm font-medium text-gray-500">{kpi.unit}</span></h4>
                                    </div>
                                    <div className={`w-10 h-10 bg-${kpi.color}-100 rounded-full flex items-center justify-center text-${kpi.color}-600`}>
                                        <kpi.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">{t('actionCenter', hubTranslations)}</h3>
                            </div>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                {t('newAlerts', hubTranslations).replace('{count}', notifications.filter(n => n.unread).length)}
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {notifications.map(note => (
                                <div key={note.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${note.type === 'warning' ? 'bg-orange-50/50 border-orange-100' : note.type === 'info' ? 'bg-blue-50/50 border-blue-100' : 'bg-green-50/50 border-green-100'}`}>
                                    <div className="mt-0.5 shrink-0">
                                        {note.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : note.type === 'info' ? <Clock className="w-5 h-5 text-blue-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`text-sm ${note.unread ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{note.text}</p>
                                    </div>
                                    {note.unread && <div className="w-2 h-2 rounded-full bg-[#005DAA] shrink-0 mt-2"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                            <History className="w-5 h-5 text-gray-600" />
                            <h3 className="font-bold text-gray-800">{t('recentHistory', hubTranslations)}</h3>
                        </div>
                        <div className="p-4">
                            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                                {recentActivity.map((item, index) => (
                                    <div key={item.id} className="relative pl-5">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${index === 0 ? 'bg-[#005DAA]' : 'bg-gray-300'}`}></div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.title}</h4>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{item.date}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${item.status === t('statusApproved', hubTranslations) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-2 py-2 text-xs font-semibold text-[#005DAA] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">{t('viewAllHistory', hubTranslations)}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWMUHub;
