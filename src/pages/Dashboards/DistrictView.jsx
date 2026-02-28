import React, { useState } from 'react';
import {
    Activity, ArrowUpRight, CheckCircle2, Factory, Filter,
    IndianRupee, TrendingUp, AlertCircle, Clock
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis
} from 'recharts';

const DistrictView = () => {
    // Top KPIs Data
    const kpis = [
        { label: "Total PWMUs", value: "45", icon: Factory, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active PWMUs", value: "42", icon: Activity, color: "text-green-600", bg: "bg-green-50" },
        { label: "Reporting %", value: "88%", icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50", trend: "+5%" },
        { label: "Total Waste", value: "450.5 MT", icon: ArrowUpRight, color: "text-orange-600", bg: "bg-orange-50", trend: "+12%" },
        { label: "Revenue", value: "₹12.50L", icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+15%" },
        { label: "Net Profit", value: "₹2.50L", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+8%" }
    ];

    // Processing Comparison Data (Bar Chart)
    const processingData = [
        { name: 'PWMU Alpha', percentage: 95, fill: '#3b82f6' },
        { name: 'PWMU Beta', percentage: 82, fill: '#3b82f6' },
        { name: 'PWMU Gamma', percentage: 45, fill: '#ef4444' }, // Weak performer
        { name: 'PWMU Delta', percentage: 88, fill: '#3b82f6' },
        { name: 'PWMU Epsilon', percentage: 92, fill: '#3b82f6' },
        { name: 'PWMU Zeta', percentage: 30, fill: '#ef4444' },   // Weak performer
        { name: 'PWMU Eta', percentage: 75, fill: '#3b82f6' }
    ];

    // Financial Viability Data (Scatter Plot)
    const financialData = [
        { name: 'PWMU Alpha', cost: 2.5, revenue: 3.8, fill: '#22c55e' }, // High Rev, Low Cost (Good)
        { name: 'PWMU Beta', cost: 4.2, revenue: 4.8, fill: '#3b82f6' },  // High Rev, High Cost 
        { name: 'PWMU Gamma', cost: 5.2, revenue: 1.2, fill: '#ef4444' }, // Low Rev, High Cost (Bad)
        { name: 'PWMU Delta', cost: 2.2, revenue: 3.5, fill: '#22c55e' },
        { name: 'PWMU Epsilon', cost: 3.0, revenue: 3.2, fill: '#22c55e' },
        { name: 'PWMU Zeta', cost: 5.7, revenue: 2.0, fill: '#ef4444' },
        { name: 'PWMU Eta', cost: 2.8, revenue: 1.5, fill: '#eab308' }    // Low Rev, Low Cost (Warning)
    ];

    // Machine Health Matrix Data
    const matrixData = [
        { name: 'PWMU Alpha', machines: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
        { name: 'PWMU Beta', machines: ['ok', 'fail', 'ok', 'ok', 'fail', 'ok'] },
        { name: 'PWMU Gamma', machines: ['fail', 'fail', 'ok', 'fail', 'ok', 'ok'] },
        { name: 'PWMU Delta', machines: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'] },
    ];
    const machineTypes = ['FATKA', 'BALING', 'SHREDDER', 'AGGLOM.', 'MIXER', 'GRANULAR'];

    // Reporting Compliance Data
    const complianceData = [
        { name: 'PWMU Alpha', status: 'Submitted', color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', width: '100%' },
        { name: 'PWMU Beta', status: 'Submitted', color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', width: '100%' },
        { name: 'PWMU Gamma', status: 'Delayed (12d late)', color: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700', width: '25%', alert: true },
        { name: 'PWMU Delta', status: 'Pending (5d late)', color: 'bg-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700', width: '70%' },
        { name: 'PWMU Epsilon', status: 'Submitted', color: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-700', width: '100%' },
        { name: 'PWMU Zeta', status: 'Delayed (15d late)', color: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-700', width: '25%', alert: true },
        { name: 'PWMU Eta', status: 'Pending (2d late)', color: 'bg-yellow-400', bg: 'bg-yellow-100', text: 'text-yellow-700', width: '85%' },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-6 font-sans pb-10">

            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">District Performance Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Overview of all PWMUs across the district.</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Filter Dropdowns */}
                    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1">
                        <select className="bg-transparent text-sm text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 rounded-l-md transition-colors">
                            <option>District Wise</option>
                            <option>Raipur</option>
                            <option>Durg</option>
                        </select>
                        <select className="bg-transparent text-sm text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                            <option>Block Wise</option>
                            <option>Arang</option>
                            <option>Abhanpur</option>
                        </select>
                        <select className="bg-transparent text-sm text-gray-700 px-3 py-1.5 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors hidden lg:block">
                            <option>Gram Panchayat</option>
                        </select>
                        <select className="bg-transparent text-sm text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-r-md transition-colors">
                            <option>PWMU Wise</option>
                        </select>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Overall Status</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-bold text-green-600">Operational</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top 6 KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between hover:border-blue-100 transition-colors group">
                        <div className="flex justify-between items-start mb-3">
                            <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                                <kpi.icon className="w-4 h-4" />
                            </div>
                            {kpi.trend && (
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{kpi.trend}</span>
                            )}
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-800">{kpi.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">{kpi.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Middle Section: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Processing Comparison */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800">PWMU Processing Comparison</h2>
                        <p className="text-xs text-gray-500 mt-1">Processing percentage across units to identify weak performers.</p>
                    </div>
                    <div className="flex-1 min-h-[250px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processingData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} angle={-45} textAnchor="end" />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `${val}%`} />
                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="percentage" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Financial Viability Scatter */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Financial Viability</h2>
                        <p className="text-xs text-gray-500 mt-1">Cost per kg vs Revenue per kg. Identifies profitability quadrants.</p>
                    </div>
                    <div className="flex-1 w-full min-h-[250px] mt-4 relative">
                        {/* Quadrant Backgrounds */}
                        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none z-0 ml-8 mb-6">
                            <div className="bg-green-500 border-r border-b border-gray-400"></div>
                            <div className="bg-blue-500 border-b border-gray-400"></div>
                            <div className="bg-yellow-500 border-r border-gray-400"></div>
                            <div className="bg-red-500"></div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%" className="z-10 relative">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis type="number" dataKey="cost" name="Cost" unit=" (₹/kg)" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} domain={[0, 8]} />
                                <YAxis type="number" dataKey="revenue" name="Revenue" unit=" (₹/kg)" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} domain={[0, 8]} label={{ value: 'Revenue (₹/kg)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#64748b' } }} />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Scatter name="PWMUs" data={financialData} fill="#8884d8" shape="circle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Lists & Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

                {/* Machine Health Matrix */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Machine Health Matrix</h2>
                        <p className="text-xs text-gray-500 mt-1">Quickly identify maintenance clusters across facilities.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="pb-4 text-xs font-bold text-gray-500 w-1/4">PWMU</th>
                                    {machineTypes.map((type, i) => (
                                        <th key={i} className="pb-4 text-[10px] font-bold text-gray-400 text-center tracking-wider">{type}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {matrixData.map((row, i) => (
                                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-sm font-semibold text-gray-700">{row.name}</td>
                                        {row.machines.map((status, j) => (
                                            <td key={j} className="py-4 text-center">
                                                <div className="flex justify-center">
                                                    <div className={`w-3.5 h-3.5 rounded-sm ${status === 'ok' ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-red-500 shadow-sm shadow-red-200 animate-pulse'}`}></div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Reporting Compliance */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Reporting Compliance</h2>
                        <p className="text-xs text-gray-500 mt-1">Submission status with auto-flagging for &gt;10 days delay.</p>
                    </div>
                    <div className="space-y-6">
                        {complianceData.map((item, i) => (
                            <div key={i} className="w-full">
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                        {item.alert && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.bg} ${item.text}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.width }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default DistrictView;
