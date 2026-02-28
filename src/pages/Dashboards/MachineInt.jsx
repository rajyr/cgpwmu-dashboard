import React, { useState } from 'react';
import {
    Activity, Settings, AlertTriangle, PenTool, Database,
    TrendingUp, ActivitySquare, CheckCircle2, Clock
} from 'lucide-react';
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend
} from 'recharts';

function MachineInt() {
    // Mock Data
    const uptimeData = [
        { name: 'Functional', value: 75, color: '#28A745' },     // Green
        { name: 'Maintenance', value: 15, color: '#FF9933' },    // Orange
        { name: 'Breakdown', value: 10, color: '#DC3545' },      // Red
    ];

    const utilizationData = [
        { name: 'Shredder 1', hours: 45, max: 60 },
        { name: 'Baling Mk-II', hours: 38, max: 60 },
        { name: 'Fatka M/C', hours: 52, max: 60 },
        { name: 'Agglomerator', hours: 25, max: 60 },
        { name: 'Granulator', hours: 40, max: 60 },
    ];

    const alerts = [
        { id: 1, machine: 'Hydraulic Baling', location: 'Balod PWMU', downtime: '3 Days', reason: 'Hydraulic fluid leak', severity: 'High' },
        { id: 2, machine: 'Plastic Shredder', location: 'Durg PWMU', downtime: '1 Day', reason: 'Blade replacement', severity: 'Medium' },
        { id: 3, machine: 'Mixer Machine', location: 'Bastar PWMU', downtime: '5 Hrs', reason: 'Motor Overheat', severity: 'Low' },
    ];

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
                        <h3 className="font-semibold text-gray-600 text-sm">Total Assets</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">142</p>
                    <p className="text-xs text-gray-500 mt-1">Installed across 14 PWMUs</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Uptime Rate</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">85%</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 2% from last month</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Active Breakdowns</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-700">18</p>
                    <p className="text-xs text-red-500 mt-1">Require immediate attention</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Avg. Repair Time</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">2.4 <span className="text-lg text-gray-500">Days</span></p>
                    <p className="text-xs text-gray-500 mt-1">Historical average</p>
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
                            <span className="text-3xl font-bold text-gray-800">142</span>
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
                            {alerts.map((alert) => (
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
                                            Dispatch Tech
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
