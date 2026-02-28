import React from 'react';
import { ShieldCheck, Activity, AlertTriangle, FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';

const MonitoringAnalytics = () => {
    // KPI Data
    const kpis = [
        { label: "Total Audits", value: "342", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", text: "This Month" },
        { label: "Overall Compliance", value: "88%", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50", text: "+5% vs Last Mo" },
        { label: "Open Issues", value: "24", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", text: "-12% vs Last Mo" },
        { label: "Critical Flags", value: "3", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", text: "Requires Attention" },
    ];

    // Compliance Trend Data (Line Chart)
    const trendData = [
        { month: 'Apr', target: 90, actual: 82 },
        { month: 'May', target: 90, actual: 85 },
        { month: 'Jun', target: 90, actual: 84 },
        { month: 'Jul', target: 90, actual: 88 },
        { month: 'Aug', target: 90, actual: 91 },
        { month: 'Sep', target: 95, actual: 89 },
        { month: 'Oct', target: 95, actual: 93 },
        { month: 'Nov', target: 95, actual: 94 },
    ];

    // Issue Categories Data (Bar Chart)
    const issueData = [
        { category: 'Safety Gear', count: 12 },
        { category: 'Log Delay', count: 45 },
        { category: 'Machine Maint.', count: 18 },
        { category: 'Storage Limit', count: 8 },
        { category: 'Data Mismatch', count: 15 },
    ];

    // PWMU Compliance Matrix Data
    const matrixData = [
        { name: 'PWMU Alpha', daily: 'pass', monthly: 'pass', safety: 'pass', quality: 'pass', score: 98 },
        { name: 'PWMU Beta', daily: 'pass', monthly: 'warn', safety: 'pass', quality: 'pass', score: 85 },
        { name: 'PWMU Gamma', daily: 'fail', monthly: 'fail', safety: 'warn', quality: 'pass', score: 45 }, // Critical
        { name: 'PWMU Delta', daily: 'pass', monthly: 'pass', safety: 'pass', quality: 'pass', score: 95 },
        { name: 'PWMU Epsilon', daily: 'warn', monthly: 'pass', safety: 'pass', quality: 'pass', score: 88 },
        { name: 'PWMU Zeta', daily: 'fail', monthly: 'pass', safety: 'fail', quality: 'fail', score: 32 },  // Critical
    ];

    const getStatusIcon = (status) => {
        if (status === 'pass') return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        if (status === 'warn') return <AlertCircle className="w-5 h-5 text-yellow-500" />;
        return <XCircle className="w-5 h-5 text-red-500" />;
    };

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
                    <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-md transition-colors min-w-[100px]">
                        <option>District Wise</option>
                        <option>Raipur</option>
                        <option>Durg</option>
                    </select>
                    <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors min-w-[100px]">
                        <option>Block Wise</option>
                        <option>Arang</option>
                        <option>Abhanpur</option>
                    </select>
                    <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[120px]">
                        <option>Gram Panchayat</option>
                    </select>
                    <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block min-w-[100px]">
                        <option>Village</option>
                    </select>
                    <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-r-md transition-colors min-w-[100px]">
                        <option>PWMU Wise</option>
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
                            {matrixData.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                                    <td className="py-4 px-6 text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${row.score >= 90 ? 'bg-green-500' : row.score >= 60 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'}`}></div>
                                        {row.name}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center">{getStatusIcon(row.daily)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center">{getStatusIcon(row.monthly)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center">{getStatusIcon(row.safety)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center">{getStatusIcon(row.quality)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${row.score >= 90 ? 'bg-green-100 text-green-700' :
                                                row.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {row.score}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default MonitoringAnalytics;
