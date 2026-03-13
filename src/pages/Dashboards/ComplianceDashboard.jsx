import React, { useState, useEffect } from 'react';
import {
    ShieldAlert, AlertTriangle, CheckCircle2, FileWarning,
    Send, MapPin, BarChart3, TrendingDown, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend, LineChart, Line, ComposedChart
} from 'recharts';

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const getProxyUrl = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? '' : '/api/supabase';
};

function ComplianceDashboard() {
    const [loading, setLoading] = useState(true);
    const [leakageData, setLeakageData] = useState([]);
    const [complianceList, setComplianceList] = useState([]);
    const [stats, setStats] = useState({
        complianceRate: 0,
        missingReports: 0,
        leakagePercent: 0,
        avgDiscrepancy: 0
    });

    useEffect(() => {
        const fetchComplianceData = async () => {
            setLoading(true);
            try {
                const proxyUrl = getProxyUrl();
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const headers = {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                };

                // 1. Fetch all collections and centers
                const [collRes, pwmuRes] = await Promise.all([
                    fetch(`${proxyUrl}/rest/v1/waste_collections?select=*`, { headers }),
                    fetch(`${proxyUrl}/rest/v1/pwmu_centers?select=*`, { headers })
                ]);

                const collections = await collRes.json();
                const centers = await pwmuRes.json();

                // 2. Generate Leakage Trend (Group by month)
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const currentMonthIdx = new Date().getMonth();
                const last6Months = Array.from({ length: 6 }, (_, i) => {
                    const idx = (currentMonthIdx - 5 + i + 12) % 12;
                    return months[idx];
                });

                const trend = last6Months.map(m => {
                    const mColl = collections.filter(c => months[new Date(c.date).getMonth()] === m);
                    const mPwmu = centers.filter(p => p.last_updated && months[new Date(p.last_updated).getMonth()] === m);

                    const intake = mColl.reduce((acc, curr) => acc + (parseFloat(curr.quantity_kg) || 0), 0);
                    const processed = mPwmu.reduce((acc, curr) => acc + (parseFloat(curr.waste_processed) || 0), 0);
                    const sold = mPwmu.reduce((acc, curr) => acc + (parseFloat(curr.revenue) / 10 || 0), 0); // Mocking sold volume vs revenue

                    return {
                        month: m,
                        intake: intake || 0,
                        processed: processed || 0,
                        sold: sold || 0,
                        leakage: Math.max(0, intake - processed)
                    };
                });

                setLeakageData(trend);

                const watchlist = centers.slice(0, 5).map(center => {
                    // Logic to check last reported date from center profile vs today
                    const lastUpdated = new Date(center.last_updated || center.created_at);
                    const today = new Date();
                    const daysAgo = Math.floor((today - lastUpdated) / (1000 * 60 * 60 * 24));
                    const status = daysAgo < 3 ? 'Compliant' : daysAgo < 7 ? 'Warning' : 'Critical';
                    return {
                        id: center.id,
                        name: center.center_name,
                        type: 'PWMU',
                        lastReported: daysAgo === 0 ? 'Today' : `${daysAgo} Days Ago`,
                        status,
                        pending: status === 'Compliant' ? 0 : daysAgo
                    };
                });
                setComplianceList(watchlist);

                // 4. Summary Stats
                const missing = watchlist.reduce((acc, curr) => acc + curr.pending, 0);
                const complianceRate = watchlist.length > 0 ? Math.round((watchlist.filter(w => w.status === 'Compliant').length / watchlist.length) * 100) : 0;
                setStats({
                    complianceRate: complianceRate,
                    missingReports: missing,
                    leakagePercent: trend.length > 0 ? (trend.reduce((acc, t) => acc + t.leakage, 0) / trend.reduce((acc, t) => acc + t.intake, 0)) * 100 || 0 : 0,
                    avgDiscrepancy: trend.length > 0 ? Math.round(trend.reduce((acc, t) => acc + (t.intake - t.processed), 0) / trend.length) : 0
                });

            } catch (err) {
                console.error('Compliance Data Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchComplianceData();
    }, []);

    if (loading) return (
        <div className="w-full h-full flex flex-col items-center justify-center py-20">
            <Activity className="w-10 h-10 text-blue-600 animate-pulse mb-4" />
            <p className="text-lg font-bold text-gray-800">Calculating Mass Balance...</p>
            <p className="text-sm text-gray-500 mt-1">Analyzing discrepancy across 248 nodes</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Waste Leakage & Compliance</h1>
                        <p className="text-sm text-gray-500 mt-1">Monitor operational discrepancies and reporting adherence</p>
                    </div>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">State Compliance Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{stats.complianceRate}%</p>
                    <p className="text-xs text-green-600 mt-1">Villages submitting reports on time</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <FileWarning className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Missing Reports</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-700">{stats.missingReports}</p>
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">Require follow-up</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Est. Waste Leakage</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">{stats.leakagePercent.toFixed(1)}%</p>
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1"></p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Avg. Discrepancy</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stats.avgDiscrepancy} <span className="text-lg text-gray-500">kg</span></p>
                    <p className="text-xs text-gray-500 mt-1">Village Intake vs PWMU Processed</p>
                </div>
            </div>

            {/* Leakage Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-gray-800">Waste Mass Balance & Leakage Trend (in Kg)</h3>
                    </div>
                    <select className="border border-gray-200 text-sm font-medium rounded-lg px-3 py-1.5 bg-gray-50 outline-none">
                        <option>Last 6 Months</option>
                        <option>This Year</option>
                    </select>
                </div>
                <div className="h-80 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={leakageData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                            <RechartsTooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="intake" name="Total Intake" fill="#005DAA" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar yAxisId="left" dataKey="processed" name="Processed" fill="#28A745" radius={[4, 4, 0, 0]} barSize={20} />
                            <Line yAxisId="right" type="monotone" dataKey="leakage" name="Leakage / Loss" stroke="#DC3545" strokeWidth={3} dot={{ r: 4, fill: '#DC3545', strokeWidth: 2, stroke: '#fff' }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Compliance Table & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-gray-600" />
                            <h3 className="font-bold text-gray-800">Reporting Compliance Watchlist</h3>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="px-6 py-4">Entity Name</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Report Status</th>
                                    <th className="px-6 py-4">Pending Logs</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {complianceList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {item.type}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                                ${item.status === 'Critical' ? 'bg-red-100 text-red-700' :
                                                    item.status === 'Warning' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'}`}>
                                                {item.lastReported}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                            {item.pending > 0 ? (
                                                <span className="text-red-600">{item.pending} Missing</span>
                                            ) : (
                                                <span className="text-green-600">Up to date</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                disabled={item.pending === 0}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-end w-full gap-1.5
                                                    ${item.pending === 0
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-[#005DAA] bg-blue-50 hover:bg-blue-100'}`}
                                            >
                                                <Send className="w-3 h-3" /> Send Reminder
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
                            <Send className="w-5 h-5 text-gray-600" />
                            <h3 className="font-bold text-gray-800">Mass Communication</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Send automated SMS/WhatsApp reminders to all non-compliant entities at once.
                        </p>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#005DAA] rounded" />
                                <span className="text-sm font-medium text-gray-700">Include "Warning" states (48h late)</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-[#005DAA] rounded" />
                                <span className="text-sm font-medium text-gray-700">Include "Critical" states (&gt;7 days)</span>
                            </label>
                            <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" className="w-4 h-4 text-[#005DAA] rounded" />
                                <span className="text-sm font-medium text-gray-700">Copy Nodal Officers</span>
                            </label>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-[#005DAA] text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-900/10 flex justify-center items-center gap-2">
                        <Send className="w-4 h-4" /> Broadcast Reminders
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ComplianceDashboard;
