import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, Droplets, Trash2, CheckCircle2, XCircle, Truck, Plus,
    Banknote, Users, Activity, Target, Loader2,
    ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE = '/cgpwmu/api';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function VillageDashboard() {
    const navigate = useNavigate();
    const { user, userRole: authRole, userName } = useAuth();
    const { t, language } = useLanguage();
    const userRole = authRole || 'Admin';

    const vTrans = {
        en: {
            stateDir: "State Village Directory",
            overview: "Overview of all {count} registered villages and their collection metrics.",
            gpInfo: "District: {district} • Block: {block} • GP: {gp} • Village: {village}",
            totalVillages: "Total Registered Villages",
            stateAvg: "State Avg. Daily Waste",
            totalUserCharge: "Total User Charge",
            perfDir: "Village Performance Directory",
            colVillage: "Village Name",
            colDistrict: "District",
            colDailyAvg: "Daily Avg (kg)",
            colUserCharge: "User Charge",
            colStatus: "Status",
            colAction: "Action",
            noVillages: "No villages registered yet.",
            kg: "kg",
            loggedToday: "Logged Today",
            noLogToday: "No Log Today",
            viewDashboard: "View Dashboard",
            todaySummary: "Today's Collection Summary",
            submitted: "Submitted",
            wetWaste: "Wet Waste",
            dryWaste: "Dry Waste",
            targetProgress: "Daily Target Progress",
            weeklyTrend: "7-Day Collection Trend",
            userChargeTitle: "User Charge Collected",
            totalLogged: "Total Collections Logged",
            target: "Target",
            achievement: "Target Achievement",
            noWorkers: "No workers registered.",
            sentToPWMU: "Sent to Center",
            logDaily: "Log Daily Waste",
            viewMonthly: "Monthly Report"
        },
        hi: {
            stateDir: "राज्य ग्राम निर्देशिका",
            overview: "सभी {count} पंजीकृत गांवों और उनके संग्रह मेट्रिक्स का विवरण।",
            gpInfo: "ज़िला: {district} • ब्लॉक: {block} • ग्राम पंचायत: {gp} • गाँव: {village}",
            totalVillages: "कुल पंजीकृत गाँव",
            stateAvg: "राज्य औसत दैनिक कचरा",
            totalUserCharge: "कुल उपयोगकर्ता शुल्क",
            perfDir: "गाँव प्रदर्शन निर्देशिका",
            colVillage: "गाँव का नाम",
            colDistrict: "ज़िला",
            colDailyAvg: "दैनिक औसत (किलो)",
            colUserCharge: "उपयोगकर्ता शुल्क",
            colStatus: "स्थिति",
            colAction: "कार्रवाई",
            noVillages: "अभी तक कोई गाँव पंजीकृत नहीं है।",
            kg: "किलो",
            loggedToday: "आज दर्ज किया गया",
            noLogToday: "आज दर्ज नहीं हुआ",
            viewDashboard: "डैशबोर्ड देखें",
            todaySummary: "आज का संग्रह सारांश",
            submitted: "सबमिट किया गया",
            wetWaste: "गीला कचरा",
            dryWaste: "सूखा कचरा",
            targetProgress: "दैनिक लक्ष्य प्रगति",
            weeklyTrend: "7-दिवसीय संग्रह रुझान",
            userChargeTitle: "संग्रहित उपयोगकर्ता शुल्क",
            totalLogged: "कुल दर्ज संग्रह",
            target: "लक्ष्य",
            achievement: "लक्ष्य उपलब्धि",
            workers: "स्वच्छता कार्यकर्ता",
            present: "उपस्थित",
            noWorkers: "कोई कार्यकर्ता पंजीकृत नहीं है।",
            sentToPWMU: "केंद्र को भेजा गया",
            logDaily: "दैनिक कचरा दर्ज करें",
            viewMonthly: "मासिक रिपोर्ट"
        }
    };

    const [selectedVillage, setSelectedVillage] = useState(userRole === 'Sarpanch' ? 'self' : 'All Villages');
    const [villageProfile, setVillageProfile] = useState(null);
    const [allVillages, setAllVillages] = useState([]);
    const [collections, setCollections] = useState([]);
    const [workersData, setWorkersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendarDate, setCalendarDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;

                // Helper to safe-fetch JSON
                const safeJson = async (res, label) => {
                    if (!res.ok) {
                        const text = await res.text();
                        console.warn(`[VILLAGE_DASH] ${label} fetch failed(${res.status}): `, text.slice(0, 100));
                        return [];
                    }
                    try {
                        return await res.json();
                    } catch (e) {
                        const text = await res.text();
                        console.error(`[VILLAGE_DASH] ${label} JSON parse error: `, e.message, "Body:", text.slice(0, 100));
                        return [];
                    }
                };

                // 1. Fetch own profile (if Sarpanch)
                if (userRole === 'Sarpanch') {
                    console.log('[VILLAGE_DASH] Fetching profile...');
                    const profileRes = await fetch(
                        `${API_BASE}/data/users?id=eq.${session.user?.id}&select=*`,
                        { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                    );
                    const data = await safeJson(profileRes, 'profile');
                    if (data.length > 0) setVillageProfile(data[0]);
                }

                // 2. Fetch all registered villages (Sarpanch users)
                console.log('[VILLAGE_DASH] Fetching all villages...');
                const villagesRes = await fetch(
                    `${API_BASE}/data/users?role=eq.Sarpanch&status=eq.approved&select=*`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                setAllVillages(await safeJson(villagesRes, 'villages'));

                // 3. Fetch all collections
                console.log('[VILLAGE_DASH] Fetching collections...');
                const [pwmuRes, collRes] = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE}/data/waste_collections?select=*&order=collection_date.asc`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } })
                ]);
                setCollections(await safeJson(collRes, 'collections'));

                // 4. Fetch all workers
                console.log('[VILLAGE_DASH] Fetching workers...');
                const workersRes = await fetch(
                    `${API_BASE}/data/village_workers?select=*`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                setWorkersData(await safeJson(workersRes, 'workers'));

            } catch (err) {
                console.error('Error fetching village data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userRole]);

    // Filtering logic
    const activeVillageName = selectedVillage === 'self'
        ? (villageProfile?.registration_data?.villageName || villageProfile?.registration_data?.primaryVillage || villageProfile?.full_name || userName)
        : (allVillages.find(v => v.id === selectedVillage)?.registration_data?.villageName || allVillages.find(v => v.id === selectedVillage)?.full_name || 'All Villages');

    const filteredCollections = selectedVillage === 'All Villages'
        ? collections
        : collections.filter(c => {
            const targetId = selectedVillage === 'self' ? user?.id : selectedVillage;
            return c.village_id === targetId;
        });

    const filteredWorkers = selectedVillage === 'All Villages'
        ? workersData
        : workersData.filter(w => {
            const vName = selectedVillage === 'self' ? (villageProfile?.full_name || userName) : allVillages.find(v => v.id === selectedVillage)?.full_name;
            return w.village_name === vName;
        });

    // Calculations
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCollections = filteredCollections.filter(c => c.collection_date === todayStr);

    // Latest Record Priority: Handle historical duplicates by showing only the most recent submission
    const latestTodayLog = todayCollections.length > 0
        ? [...todayCollections].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0]
        : null;

    const wetWasteToday = latestTodayLog ? Number(latestTodayLog.wet_waste_kg || 0) : 0;
    const dryWasteToday = latestTodayLog ? Number(latestTodayLog.dry_waste_kg || 0) : 0;
    const sharedPWMUToday = latestTodayLog ? Number(latestTodayLog.shared_with_pwmu_kg || 0) : 0;
    const currentKg = wetWasteToday + Math.max(dryWasteToday, sharedPWMUToday);
    const assumedPopulation = villageProfile?.population || 1000;
    const targetKg = assumedPopulation * 0.25; // 250g per capita approx base target
    const progressPercent = targetKg > 0 ? Math.min(Math.round((currentKg / targetKg) * 100), 100) : 0;

    const weeklyTrend = React.useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last7Days.push({
                dateStr: d.toISOString().split('T')[0],
                name: days[d.getDay()],
                wet: 0,
                dry: 0
            });
        }

        filteredCollections.forEach(c => {
            const dayEntry = last7Days.find(d => d.dateStr === c.collection_date);
            if (dayEntry) {
                dayEntry.wet += Number(c.wet_waste_kg || 0);
                dayEntry.dry += Number(c.dry_waste_kg || 0);
            }
        });
        return last7Days;
    }, [filteredCollections]);

    const totalUserCharge = filteredCollections.reduce((sum, c) => sum + Number(c.user_charge_collected || 0), 0);
    const avgDailyWaste = filteredCollections.length > 0
        ? (filteredCollections.reduce((sum, c) => sum + Number(c.wet_waste_kg + c.dry_waste_kg), 0) / [...new Set(filteredCollections.map(c => c.collection_date))].length).toFixed(1)
        : 0;

    const getPresentCount = () => filteredWorkers.filter(w => w.status === 'Present').length;

    // --- Calendar Logic ---
    const VillageCalendar = () => {
        const [viewDate, setViewDate] = useState(calendarDate);

        const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const days = [];
        // Pad previous month
        for (let i = 0; i < startDay; i++) {
            days.push({ day: null, status: 'empty' });
        }

        // Fill current month
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const relevantLogs = filteredCollections.filter(c => c.collection_date === dateStr);
            const isFuture = new Date(year, month, d) > today;

            // Latest Record Priority: Instead of summing, show the authoritative latest update
            const latestLog = relevantLogs.length > 0
                ? [...relevantLogs].sort((a, b) => new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0))[0]
                : null;

            days.push({
                day: d,
                dateStr,
                log: latestLog,
                status: isFuture ? 'future' : (relevantLogs.length > 0 ? 'filled' : 'pending')
            });
        }

        const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
        const prevMonth = () => setViewDate(new Date(year, month - 1, 1));

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-gray-800 tracking-tight">Monthly Waste Log</h3>
                        <span className="text-sm font-medium text-gray-400 ml-2">{monthNames[month]} {year}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-600">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase pb-2">{d}</div>
                    ))}
                    {days.map((d, i) => {
                        if (d.status === 'empty') return <div key={`empty-${i}`} className="aspect-square"></div>;

                        const isFilled = d.status === 'filled';
                        const isPending = d.status === 'pending';
                        const isFuture = d.status === 'future';

                        return (
                            <div
                                key={d.dateStr}
                                onClick={() => !isFuture && navigate(`/dashboard/village/daily-log?date=${d.dateStr}`)}
                                className={`group relative aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer border-2
                                    ${isFilled ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : ''}
                                    ${isPending ? 'bg-red-50 border-red-100 text-red-400 hover:bg-red-100' : ''}
                                    ${isFuture ? 'bg-gray-50 border-gray-50 text-gray-300 cursor-not-allowed' : ''}
                                `}
                            >
                                {d.day}

                                {isFilled && (
                                    <div className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></div>
                                )}

                                {/* Tooltip */}
                                {isFilled && (
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white rounded-xl text-[10px] w-32 hidden group-hover:block z-50 shadow-xl border border-gray-800 animate-fade-in">
                                        <div className="flex justify-between mb-1">
                                            <span>Wet:</span>
                                            <span className="font-bold text-green-400">{d.log.wet_waste_kg} kg</span>
                                        </div>
                                        <div className="flex justify-between mb-1">
                                            <span>Dry:</span>
                                            <span className="font-bold text-blue-400">{d.log.dry_waste_kg} kg</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shared:</span>
                                            <span className="font-bold text-red-400">{d.log.shared_with_pwmu_kg} kg</span>
                                        </div>
                                        <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-md"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-md"></div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pending</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="font-bold">{language === 'hi' ? 'गाँव के आँकड़े प्राप्त किए जा रहे हैं...' : 'Fetching village metrics...'}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header: My Village or State Overview */}
            <div className={`flex flex - col ${userRole !== 'Sarpanch' ? 'lg:flex-row' : ''} justify - between items - start lg: items - center gap - 4 bg - white rounded - 2xl p - 6 border border - gray - 100 shadow - sm`}>
                <div className="flex items-center gap-4">
                    <div className={`w - 16 h - 16 rounded - 2xl flex items - center justify - center border shadow - inner shrink - 0 ${selectedVillage === 'All Villages' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-[#005DAA] border-blue-100'} `}>
                        {selectedVillage === 'All Villages' ? <Activity className="w-8 h-8" /> : <Home className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {selectedVillage === 'All Villages' ? t('stateDir', vTrans) : activeVillageName}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {selectedVillage === 'All Villages'
                                ? t('overview', vTrans).replace('{count}', allVillages.length)
                                : t('gpInfo', vTrans)
                                    .replace('{district}', (villageProfile?.registration_data?.district || villageProfile?.district || '—'))
                                    .replace('{block}', (villageProfile?.registration_data?.block || villageProfile?.block || '—'))
                                    .replace('{gp}', (villageProfile?.registration_data?.gramPanchayat || villageProfile?.gramPanchayat || '—'))
                                    .replace('{village}', (villageProfile?.registration_data?.villageName || villageProfile?.registration_data?.primaryVillage || activeVillageName || '—'))}
                        </p>
                    </div>
                </div>

                {/* Conditional Admin Location Filters viewable by Nodal/Admin/PWMU to change Villages */}
                {userRole !== 'Sarpanch' && (
                    <div className="flex flex-wrap lg:flex-nowrap bg-gray-50 border border-gray-200 rounded-lg p-1 overflow-x-auto w-full lg:w-auto hide-scrollbar">
                        <select
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            value={selectedVillage}
                            onChange={(e) => setSelectedVillage(e.target.value)}
                        >
                            <option value="All Villages">{t('allVillages', vTrans) || (language === 'hi' ? 'सभी गाँव' : 'All Villages')}</option>
                            {allVillages.map(v => (
                                <option key={v.id} value={v.id}>{v.full_name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* If 'All Villages' is selected, show Directory View. Else show Specific Village details. */}
            {selectedVillage === 'All Villages' ? (
                <div className="space-y-6">
                    {/* Aggregated KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Home className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{t('totalVillages', vTrans)}</p>
                                <p className="text-2xl font-bold text-gray-800">{allVillages.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Droplets className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{t('stateAvg', vTrans)}</p>
                                <p className="text-2xl font-bold text-gray-800">{avgDailyWaste} <span className="text-sm">{t('kg', vTrans)}</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{t('totalUserCharge', vTrans)}</p>
                                <p className="text-2xl font-bold text-gray-800">₹{totalUserCharge.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Directory Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">{t('perfDir', vTrans)}</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                        <th className="p-4 font-medium">{t('colVillage', vTrans)}</th>
                                        <th className="p-4 font-medium">{t('colDistrict', vTrans)}</th>
                                        <th className="p-4 font-medium">{t('colDailyAvg', vTrans)}</th>
                                        <th className="p-4 font-medium">{t('colUserCharge', vTrans)}</th>
                                        <th className="p-4 font-medium">{t('colStatus', vTrans)}</th>
                                        <th className="p-4 font-medium text-right">{t('colAction', vTrans)}</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {allVillages.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">No villages registered yet.</td></tr>
                                    ) : allVillages.map(v => {
                                        const vCollections = collections.filter(c => c.village_name === v.full_name);
                                        const vAvg = vCollections.length > 0
                                            ? (vCollections.reduce((sum, c) => sum + Number(c.wet_waste_kg + c.dry_waste_kg), 0) / [...new Set(vCollections.map(c => c.collection_date))].length).toFixed(0)
                                            : 0;
                                        const vCharge = vCollections.reduce((sum, c) => sum + Number(c.user_charge_collected || 0), 0);
                                        const hasToday = vCollections.some(c => c.collection_date === todayStr);

                                        return (
                                            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-bold text-gray-900">{v.full_name}</td>
                                                <td className="p-4">{v.district || '—'}</td>
                                                <td className="p-4 font-medium text-blue-600">{vAvg} {t('kg', vTrans)}</td>
                                                <td className="p-4 text-green-600 font-bold">₹{vCharge.toLocaleString()}</td>
                                                <td className="p-4">
                                                    {hasToday ? (
                                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{t('loggedToday', vTrans)}</span>
                                                    ) : (
                                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold font-medium opacity-70">{t('noLogToday', vTrans)}</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => setSelectedVillage(v.id)} className="text-[#005DAA] font-medium hover:underline text-xs">{t('viewDashboard', vTrans)}</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Today's Summary & Financials */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Today's Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#005DAA]" />
                                    <h3 className="font-bold text-gray-800">{t('todaySummary', vTrans)}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => navigate('/dashboard/village/daily-log')}
                                        className="bg-[#005DAA] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#004A87] transition-colors flex items-center gap-1.5"
                                    >
                                        <Plus className="w-3 h-3" /> {t('logDaily', vTrans)}
                                    </button>
                                    <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> {t('submitted', vTrans)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                <div className="flex-1 bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Droplets className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{t('wetWaste', vTrans)}</p>
                                        <h4 className="text-2xl font-bold text-green-700">{wetWasteToday} <span className="text-sm text-green-600 font-medium">{t('kg', vTrans)}</span></h4>
                                    </div>
                                </div>
                                <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#005DAA]">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{t('dryWaste', vTrans)}</p>
                                        <h4 className="text-2xl font-bold text-[#005DAA]">{dryWasteToday} <span className="text-sm text-blue-600 font-medium">{t('kg', vTrans)}</span></h4>
                                    </div>
                                </div>
                                <div className="flex-1 bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{t('sentToPWMU', vTrans)}</p>
                                        <h4 className="text-2xl font-bold text-red-700">{sharedPWMUToday} <span className="text-sm text-red-600 font-medium">{t('kg', vTrans)}</span></h4>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-gray-700">{t('targetProgress', vTrans)}</span>
                                    <span className="text-sm font-bold text-[#005DAA]">{currentKg} / {targetKg} {t('kg', vTrans)}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-[#005DAA] h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercent}% ` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly/Monthly View */}
                        {selectedVillage !== 'All Villages' ? (
                            <VillageCalendar />
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">{t('weeklyTrend', vTrans)}</h3>
                                </div>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={weeklyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                            <RechartsTooltip
                                                cursor={{ fill: '#F3F4F6' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                formatter={(value, name) => [`${value} kg`, name]}
                                            />
                                            <Bar dataKey="wet" name={t('wetWaste', vTrans)} fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                                            <Bar dataKey="dry" name={t('dryWaste', vTrans)} fill="#005DAA" radius={[4, 4, 0, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Workers & Finance */}
                    <div className="space-y-6">

                        {/* Financials (User Charge) */}
                        <div className="bg-gradient-to-br from-[#005DAA] to-blue-800 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Banknote className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-blue-50">{t('userChargeTitle', vTrans)}</h3>
                            </div>
                            <p className="text-4xl font-bold mb-2">₹{totalUserCharge.toLocaleString()}</p>
                            <p className="text-sm text-blue-100/80">{t('totalLogged', vTrans)}</p>

                            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-100/70 mb-1">{t('target', vTrans)}</p>
                                    <p className="font-semibold text-sm">₹{(assumedPopulation * 5).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-100/70 mb-1">{t('achievement', vTrans)}</p>
                                    <p className="font-semibold text-sm">{Math.min(Math.round((totalUserCharge / (assumedPopulation * 5)) * 100) || 0, 100)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Swachhata Workers */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">{t('workers', vTrans)}</h3>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">{getPresentCount()}/{filteredWorkers.length} {t('present', vTrans)}</span>
                            </div>
                            <div className="p-2">
                                {filteredWorkers.length === 0 ? (
                                    <p className="text-center py-4 text-gray-400 text-sm">{t('noWorkers', vTrans)}</p>
                                ) : filteredWorkers.map((worker) => (
                                    <div key={worker.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w - 10 h - 10 rounded - full flex items - center justify - center text - sm font - bold text - white shadow - sm ring - 2 ring - offset - 2 transition - all ${worker.status === 'Present' ? 'bg-green-500 ring-green-100' : 'bg-gray-400 ring-gray-100 grayscale'
                                                } `}>
                                                {(worker.worker_name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{worker.worker_name}</p>
                                                <p className="text-xs text-gray-500 font-medium">{worker.role}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {worker.status === 'Present' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default VillageDashboard;
