import React, { useState } from 'react';
import {
    ShieldAlert, AlertTriangle, CheckCircle2, FileWarning,
    Send, MapPin, BarChart3, TrendingDown
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Legend, LineChart, Line, ComposedChart
} from 'recharts';

function ComplianceDashboard() {
    // Mock Data
    const leakageData = [
        { month: 'Jul', intake: 12000, processed: 11500, sold: 11000, leakage: 500 },
        { month: 'Aug', intake: 14500, processed: 14000, sold: 13200, leakage: 800 },
        { month: 'Sep', intake: 13000, processed: 12800, sold: 12500, leakage: 300 },
        { month: 'Oct', intake: 15500, processed: 14900, sold: 14200, leakage: 700 },
        { month: 'Nov', intake: 16000, processed: 15800, sold: 15500, leakage: 300 },
        { month: 'Dec', intake: 17500, processed: 16000, sold: 15000, leakage: 1000 },
    ];

    const complianceList = [
        { id: 1, name: 'Balod PWMU', type: 'PWMU', lastReported: '2 Days Ago', status: 'Compliant', pending: 0 },
        { id: 2, name: 'Durg PWMU', type: 'PWMU', lastReported: '8 Days Ago', status: 'Warning', pending: 2 },
        { id: 3, name: 'Bemetara PWMU', type: 'PWMU', lastReported: '15 Days Ago', status: 'Critical', pending: 10 },
        { id: 4, name: 'Saja Village', type: 'Village', lastReported: 'On Time', status: 'Compliant', pending: 0 },
        { id: 5, name: 'Gunderdehi Village', type: 'Village', lastReported: '12 Days Ago', status: 'Critical', pending: 6 },
    ];

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
                    <p className="text-3xl font-bold text-green-700">88%</p>
                    <p className="text-xs text-green-600 mt-1">Villages submitting reports on time</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <FileWarning className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Missing Reports</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-700">42</p>
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">Require follow-up</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Est. Waste Leakage</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">3.6%</p>
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Improved by 1.2%</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Avg. Discrepancy</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">450 <span className="text-lg text-gray-500">kg</span></p>
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
