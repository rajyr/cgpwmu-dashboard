import React, { useState, useEffect, useMemo } from 'react';
import {
    Activity, Settings, AlertTriangle, PenTool, Database,
    TrendingUp, ActivitySquare, CheckCircle2, Clock, Loader2
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : import.meta.env.VITE_SUPABASE_URL);

function MachineInt() {
    const { userRole } = useAuth();
    const [pwmus, setPwmus] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;
                const proxyUrl = getProxyUrl();

                const res = await fetch(`${proxyUrl}/rest/v1/pwmu_centers?select=*`, {
                    headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) setPwmus(await res.json());

            } catch (err) {
                console.error('Error fetching asset data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Derived Metrics
    const totalUnits = pwmus.length;
    const functionalCount = pwmus.filter(p => p.status === 'operational').length;
    const maintenanceCount = pwmus.filter(p => p.status === 'maintenance').length;
    const breakdownCount = pwmus.filter(p => !p.status || p.status === 'shutdown').length;

    const uptimeRate = totalUnits > 0 ? Math.round((functionalCount / totalUnits) * 100) : 0;

    const uptimeData = [
        { name: 'Functional', value: functionalCount, color: '#28A745' },
        { name: 'Maintenance', value: maintenanceCount, color: '#FF9933' },
        { name: 'Breakdown', value: breakdownCount, color: '#DC3545' },
    ];

    const utilizationData = pwmus.slice(0, 5).map(p => ({
        name: p.name.split(' ')[0],
        hours: Math.round((p.waste_processed_mt / (p.capacity_mt || 1)) * 100), // Utilization % as proxy
        max: 100
    }));

    const alerts = pwmus.filter(p => p.status === 'maintenance').map((p, idx) => ({
        id: idx + 1,
        machine: 'System/Oversight',
        location: `${p.district} (${p.name})`,
        downtime: 'Active',
        reason: 'Periodic Maintenance / Reporting issue',
        severity: 'Medium'
    }));

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-blue-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="font-bold">Scanning terminal assets...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Machine & Asset Intelligence</h1>
                        <p className="text-sm text-gray-500 mt-1">Real-time monitoring of PWMU physical assets</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                            <Database className="w-4 h-4" /> Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                            <Settings className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Total PWMU Units</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{totalUnits}</p>
                    <p className="text-xs text-gray-500 mt-1">Monitored Facilities</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Uptime Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">{uptimeRate}%</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Operational Units</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Active Issues</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-700">{maintenanceCount + breakdownCount}</p>
                    <p className="text-xs text-red-500 mt-1">In Maintenance/Shutdown</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Target Uptime</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">95%</p>
                    <p className="text-xs text-gray-500 mt-1">State Target Goal</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Uptime Donut */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <ActivitySquare className="w-5 h-5 text-[#005DAA]" />
                        <h3 className="font-bold text-gray-800">Statewide Machine Status</h3>
                    </div>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={uptimeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {uptimeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${value}%`, 'Share']}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-gray-800">{totalUnits}</span>
                            <span className="text-xs font-semibold uppercase text-gray-400">Total Units</span>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="flex justify-center gap-4 mt-2">
                        {uptimeData.map(item => (
                            <div key={item.name} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                                {item.name} ({item.value}%)
                            </div>
                        ))}
                    </div>
                </div>

                {/* Utilization Bar Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[#005DAA]" />
                            <h3 className="font-bold text-gray-800">Asset Utilization (Weekly Hours)</h3>
                        </div>
                        <select className="border border-gray-200 text-sm font-medium rounded-lg px-3 py-1.5 bg-gray-50 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                            <option>Highest Utilized</option>
                            <option>Lowest Utilized</option>
                        </select>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={utilizationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <RechartsTooltip
                                    cursor={{ fill: '#F3F4F6' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="hours" name="Active Hours" fill="#005DAA" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Actionable Alerts Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <PenTool className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-800">Critical Breakdown Alerts</h3>
                    </div>
                    <button className="text-sm font-semibold text-[#005DAA] hover:underline">View Repair Logs</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                <th className="px-6 py-4">Machine</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Downtime</th>
                                <th className="px-6 py-4">Reported Issue</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {alerts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400 text-sm">No critical breakdowns reported currently.</td>
                                </tr>
                            ) : alerts.map((alert) => (
                                <tr key={alert.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-gray-800 text-sm">{alert.machine}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                        {alert.location}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-red-600">
                                        {alert.downtime}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {alert.reason}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                            ${alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                                                alert.severity === 'Medium' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'}`}>
                                            {alert.severity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-[#005DAA] bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                                            Assess Issue
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

export default MachineInt;
