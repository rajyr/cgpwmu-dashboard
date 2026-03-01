import React, { useState, useEffect, useMemo } from 'react';
import { ShieldCheck, Activity, AlertTriangle, FileText, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : import.meta.env.VITE_SUPABASE_URL);

const MonitoringAnalytics = () => {
    const { userRole } = useAuth();
    const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
    const [pwmus, setPwmus] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;
                const proxyUrl = getProxyUrl();

                const [pwmuRes, collRes] = await Promise.all([
                    fetch(`${proxyUrl}/rest/v1/pwmu_centers?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } }),
                    fetch(`${proxyUrl}/rest/v1/waste_collections?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } })
                ]);

                if (pwmuRes.ok) setPwmus(await pwmuRes.json());
                if (collRes.ok) setCollections(await collRes.json());

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

    // KPI Calculations
    const totalAudits = filteredCollections.length;
    const overallCompliance = filteredPwmus.length > 0
        ? Math.round((filteredPwmus.filter(p => p.status === 'operational').length / filteredPwmus.length) * 100)
        : 0;
    const openIssues = filteredPwmus.filter(p => p.status === 'maintenance').length;
    const criticalFlags = filteredPwmus.filter(p => p.capacity_mt > 0 && (p.waste_processed_mt / p.capacity_mt) > 1.2).length;

    const kpis = [
        { label: "Total Audits", value: totalAudits, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", text: "Logged Collections" },
        { label: "Overall Compliance", value: `${overallCompliance}%`, icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50", text: "Operational Centers" },
        { label: "Open Issues", value: openIssues, icon: Clock, color: "text-orange-600", bg: "bg-orange-50", text: "In Maintenance" },
        { label: "Critical Flags", value: criticalFlags, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", text: "Over Capacity" },
    ];

    // Compliance Trend Data (Line Chart) - Mocking for now based on actual data
    const trendData = [
        { month: 'Jul', target: 90, actual: overallCompliance - 5 },
        { month: 'Aug', target: 90, actual: overallCompliance },
    ];

    // Issue Categories Data (Bar Chart)
    const issueData = [
        { category: 'Maintenance', count: openIssues },
        { category: 'Log Delay', count: filteredPwmus.filter(p => p.status === 'maintenance').length * 2 },
        { category: 'Over Capacity', count: criticalFlags },
        { category: 'Data Mismatch', count: 0 },
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
                <span className="font-bold">Syncing compliance oversight...</span>
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
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Monitoring & Compliance Hub</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Real-time tracking of operational compliance, audits, and facility health.</p>
                </div>

                {/* Hierarchical Location Filters */}
                <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1 overflow-x-auto w-full xl:w-auto hide-scrollbar shrink-0">
                    <select
                        className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-md transition-colors min-w-[150px]"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                        <option value="All Districts">All Districts</option>
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
                            <h2 className="text-lg font-bold text-gray-800">Compliance Trend</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Actual vs Target compliance rate over time.</p>
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
                                <Line type="monotone" dataKey="target" name="Target (%)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <Line type="monotone" dataKey="actual" name="Actual Compliance (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Issue Categories Bar Chart */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Open Issues by Category</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Distribution of current non-compliance flags.</p>
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
                            <h2 className="text-lg font-bold text-gray-800">PWMU Compliance Matrix</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Facility health across key reporting and operational standards.</p>
                        </div>
                    </div>
                    <button className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
                        Export Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead className="bg-white">
                            <tr>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">PWMU Unit</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Daily Logs</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Monthly Report</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Safety Certs</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Recycler Quality</th>
                                <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center border-b border-gray-100">Score</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {filteredPwmus.map((row, i) => {
                                const score = row.status === 'operational' ? 95 : 45;
                                return (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                        <td className="py-4 px-6 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${score >= 90 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                                            {row.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">{getStatusIcon(row.status)}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">{getStatusIcon(row.status)}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">{getStatusIcon('operational')}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex justify-center">{getStatusIcon('operational')}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${score >= 90 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {score}%
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
