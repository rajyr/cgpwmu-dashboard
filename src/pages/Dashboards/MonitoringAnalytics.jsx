import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Activity, AlertTriangle, FileText, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const API_BASE = '/cgpwmu/api';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const MonitoringAnalytics = () => {
    const { userRole } = useAuth();
    const { t, language } = useLanguage();
    const [selectedDistrict, setSelectedDistrict] = useState('All Districts');

    const monTrans = {
        en: {
            title: "Monitoring & Compliance Hub",
            subtitle: "Real-time tracking of operational compliance, audits, and facility health.",
            allDistricts: "All Districts",
            totalAudits: "Total Audits",
            loggedCol: "Logged Collections",
            overallCompliance: "Overall Compliance",
            operationalCenters: "Operational Centers",
            openIssues: "Open Issues",
            inMaintenance: "In Maintenance",
            criticalFlags: "Critical Flags",
            overCapacity: "Over Capacity",
            complianceTrend: "Compliance Trend",
            actualVsTarget: "Actual vs Target compliance rate over time.",
            target: "Target (%)",
            actual: "Actual Compliance (%)",
            openIssuesByCat: "Open Issues by Category",
            distribution: "Distribution of current non-compliance flags.",
            complianceMatrix: "PWMU Compliance Matrix",
            facilityHealth: "Facility Health across key reporting and operational standards.",
            exportReport: "Export Report",
            colPwmuUnit: "PWMU Unit",
            colDailyLogs: "Daily Logs",
            colMonthlyReport: "Monthly Report",
            colSafetyCerts: "Safety Certs",
            colRecyclerQuality: "Recycler Quality",
            colScore: "Score",
            fetching: "Syncing compliance oversight...",
            issueCat: {
                maintenance: "Maintenance",
                logDelay: "Log Delay",
                overCapacity: "Over Capacity",
                dataMismatch: "Data Mismatch"
            }
        },
        hi: {
            title: "निगरानी और अनुपालन हब",
            subtitle: "परिचालन अनुपालन, ऑडिट और सुविधा स्वास्थ्य की रीयल-टाइम ट्रैकिंग।",
            allDistricts: "सभी जिले",
            totalAudits: "कुल ऑडिट",
            loggedCol: "ड्रग संग्रह",
            overallCompliance: "कुल अनुपालन",
            operationalCenters: "परिचालन केंद्र",
            openIssues: "खुले मुद्दे",
            inMaintenance: "रखरखाव में",
            criticalFlags: "महत्वपूर्ण झंडे",
            overCapacity: "क्षमता से अधिक",
            complianceTrend: "अनुपालन रुझान",
            actualVsTarget: "समय के साथ वास्तविक बनाम लक्ष्य अनुपालन दर।",
            target: "लक्ष्य (%)",
            actual: "वास्तविक अनुपालन (%)",
            openIssuesByCat: "श्रेणी के अनुसार खुले मुद्दे",
            distribution: "वर्तमान गैर-अनुपालन फ्लैग का वितरण।",
            complianceMatrix: "PWMU अनुपालन मैट्रिक्स",
            facilityHealth: "प्रमुख रिपोर्टिंग और परिचालन मानकों में सुविधा स्वास्थ्य।",
            exportReport: "रिपोर्ट निर्यात करें",
            colPwmuUnit: "PWMU इकाई",
            colDailyLogs: "दैनिक लॉग",
            colMonthlyReport: "मासिक रिपोर्ट",
            colSafetyCerts: "सुरक्षा प्रमाण पत्र",
            colRecyclerQuality: "रीसायकल गुणवत्ता",
            colScore: "स्कोर",
            fetching: "अनुपालन निरीक्षण सिंक किया जा रहा है...",
            issueCat: {
                maintenance: "रखरखाव",
                logDelay: "लॉग विलंब",
                overCapacity: "क्षमता से अधिक",
                dataMismatch: "डेटा बेमेल"
            }
        }
    };
    const [pwmus, setPwmus] = useState([]);
    const [collections, setCollections] = useState([]);
    const [operationalLogs, setOperationalLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;

                const headers = { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` };

                const [pwmuRes, collRes, logsRes] = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=*`, { headers }),
                    fetch(`${API_BASE}/data/village_waste_reports?select=*`, { headers }),
                    fetch(`${API_BASE}/data/pwmu_operational_logs?select=*&order=log_date.asc`, { headers })
                ]);

                if (pwmuRes.ok) setPwmus(await pwmuRes.json());
                if (collRes.ok) setCollections(await collRes.json());
                if (logsRes.ok) setOperationalLogs(await logsRes.json());

            } catch (err) {
                console.error('Error fetching compliance data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtered data
    const filteredPwmus = useMemo(() =>
        selectedDistrict === 'All Districts' ? pwmus : pwmus.filter(p => p.district === selectedDistrict)
        , [pwmus, selectedDistrict]);

    const filteredCollections = useMemo(() =>
        selectedDistrict === 'All Districts' ? collections : collections.filter(c => c.district === selectedDistrict)
        , [collections, selectedDistrict]);

    const filteredLogs = useMemo(() => {
        const pwmuIds = new Set(filteredPwmus.map(p => p.id));
        return operationalLogs.filter(l => pwmuIds.has(l.pwmu_id));
    }, [operationalLogs, filteredPwmus]);

    // KPI Calculations
    const totalAudits = filteredCollections.length;
    const overallCompliance = filteredPwmus.length > 0
        ? Math.round((filteredPwmus.filter(p => p.status === 'operational').length / filteredPwmus.length) * 100)
        : 0;
    const openIssues = filteredPwmus.filter(p => p.status === 'maintenance').length;
    const criticalFlags = filteredPwmus.filter(p => {
        const capacity = Number(p.capacity_mt || 0);
        const processed = Number(p.waste_processed_mt || 0);
        return capacity > 0 && (processed / capacity) > 1.2;
    }).length;

    const kpis = [
        { label: t('totalAudits', monTrans), value: totalAudits, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", text: t('loggedCol', monTrans) },
        { label: t('overallCompliance', monTrans), value: `${overallCompliance}%`, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50", text: t('operationalCenters', monTrans) },
        { label: t('openIssues', monTrans), value: openIssues, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", text: t('inMaintenance', monTrans) },
        { label: t('criticalFlags', monTrans), value: criticalFlags, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", text: t('overCapacity', monTrans) },
    ];

    // Compliance Trend Data (Line Chart) - Calculate from logs
    const trendData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIdx = new Date().getMonth();
        
        // Group logs by month
        const monthlyStats = months.map((m, idx) => ({ 
            month: m, 
            target: 90, 
            actual: 0,
            logCount: 0,
            idx
        })).filter(m => m.idx <= currentMonthIdx);

        filteredLogs.forEach(log => {
            const date = new Date(log.log_date);
            const mIdx = date.getMonth();
            if (monthlyStats[mIdx]) {
                monthlyStats[mIdx].logCount++;
            }
        });

        // Simple compliance: (logs_this_month / days_so_far) / num_pwmus
        const daysInMonth = new Date().getDate();
        const numPwmus = filteredPwmus.length || 1;
        
        return monthlyStats.map(m => {
            if (m.idx === currentMonthIdx) {
                m.actual = Math.min(100, Math.round(((m.logCount / daysInMonth) / numPwmus) * 100));
            } else {
                m.actual = Math.min(100, Math.round(((m.logCount / 30) / numPwmus) * 100));
            }
            // Fallback for demo if no data yet
            if (m.actual === 0 && m.logCount === 0) m.actual = 0; 
            return m;
        });
    }, [filteredLogs, filteredPwmus]);

    // Issue Categories Data (Bar Chart)
    const issueData = [
        { category: t('issueCat', monTrans).maintenance, count: openIssues },
        { category: t('issueCat', monTrans).logDelay, count: filteredPwmus.length - (filteredLogs.filter(l => l.log_date === new Date().toISOString().split('T')[0]).length) },
        { category: t('issueCat', monTrans).overCapacity, count: criticalFlags },
        { category: t('issueCat', monTrans).dataMismatch, count: 0 },
    ];

    const getStatusIcon = (status) => {
        if (status === 'operational') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (status === 'maintenance') return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-indigo-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="font-bold">{t('fetching', monTrans)}</span>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col gap-6 font-sans pb-10">

            {/* Header & Filters */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-fade-in-up">
                <div>
                    <div className="flex items-center gap-3">
                        <Activity className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{t('title', monTrans)}</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{t('subtitle', monTrans)}</p>
                </div>

                {/* Hierarchical Location Filters */}
                <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1 overflow-x-auto w-full xl:w-auto hide-scrollbar shrink-0">
                    <select
                        className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-md transition-colors min-w-[150px]"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                        <option value="All Districts">{t('allDistricts', monTrans)}</option>
                        {[...new Set(pwmus.map(p => p.district))].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-colors group">
                        <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">{kpi.label}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-gray-800">{kpi.value}</h3>
                                <span className="text-[10px] font-bold text-gray-400">{kpi.text}</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                            <kpi.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Compliance Trend Line Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-indigo-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{t('complianceTrend', monTrans)}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{t('actualVsTarget', monTrans)}</p>
                        </div>
                    </div>
                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => `${value}%`}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} iconType="circle" iconSize={8} />
                                <Line type="monotone" dataKey="target" name={t('target', monTrans)} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="actual" name={t('actual', monTrans)} stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Issue Categories Bar Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{t('openIssuesByCat', monTrans)}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{t('distribution', monTrans)}</p>
                        </div>
                    </div>
                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={issueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" name="Issues" fill="#f97316" radius={[0, 4, 4, 0]} barSize={24}>
                                    {issueData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.count > 20 ? '#ef4444' : '#f97316'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Compliance Matrix */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{t('complianceMatrix', monTrans)}</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{t('facilityHealth', monTrans)}</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                        {t('exportReport', monTrans)}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead className="bg-white">
                            <tr>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">{t('colPwmuUnit', monTrans)}</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">{t('colDailyLogs', monTrans)}</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">{t('colMonthlyReport', monTrans)}</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">{t('colSafetyCerts', monTrans)}</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">{t('colRecyclerQuality', monTrans)}</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">{t('colScore', monTrans)}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredPwmus.map((row, i) => {
                                // Calculate real health score based on last 7 days of logs
                                const last7Days = new Set();
                                for (let j = 0; j < 7; j++) {
                                    const d = new Date();
                                    d.setDate(d.getDate() - j);
                                    last7Days.add(d.toISOString().split('T')[0]);
                                }
                                
                                const logsFound = operationalLogs.filter(l => 
                                    l.pwmu_id === row.id && last7Days.has(l.log_date)
                                ).length;
                                
                                // Base score on reporting frequency (weighted 60%) + status (weighted 40%)
                                const reportingScore = (logsFound / 7) * 100;
                                const statusScore = row.status === 'operational' ? 100 : (row.status === 'maintenance' ? 50 : 0);
                                const totalScore = Math.round((reportingScore * 0.6) + (statusScore * 0.4));

                                return (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                        <td className="py-4 px-6 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${totalScore >= 70 ? 'bg-green-500' : totalScore >= 40 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                                            {row.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">{logsFound > 0 ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-gray-300" />}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center"><CheckCircle2 className="w-5 h-5 text-green-500" /></div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${totalScore >= 70 ? 'bg-green-100 text-green-700' : totalScore >= 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {totalScore}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default MonitoringAnalytics;
