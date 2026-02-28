import React from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';
import {
    ScrollText, TrendingUp, Landmark, FileCheck, Users,
    Banknote, Target, Presentation
} from 'lucide-react';

function PolicyPlanDashboard() {
    // Mock Financial Data
    const financialTrends = [
        { month: 'Apr', revenue: 45000, cost: 52000, subsidy: 10000 },
        { month: 'May', revenue: 52000, cost: 51000, subsidy: 10000 },
        { month: 'Jun', revenue: 58000, cost: 53000, subsidy: 8000 },
        { month: 'Jul', revenue: 65000, cost: 55000, subsidy: 5000 },
        { month: 'Aug', revenue: 72000, cost: 58000, subsidy: 2000 },
        { month: 'Sep', revenue: 85000, cost: 60000, subsidy: 0 },
    ];

    const sbmGoals = [
        { id: 1, title: 'Visual Cleanliness (Odf++)', target: '100%', achieved: 85, color: 'bg-green-500' },
        { id: 2, title: 'Plastic Waste Forward Linkage', target: '100%', achieved: 62, color: 'bg-blue-500' },
        { id: 3, title: 'Financial Sustainability (Opex)', target: '100%', achieved: 45, color: 'bg-orange-500' },
        { id: 4, title: 'User Charge Collection', target: '100%', achieved: 38, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Planning & Policy</h1>
                        <p className="text-sm text-gray-500 mt-1">Strategic overview for SBM (G) Phase II milestones and financial viability</p>
                    </div>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                            <Target className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Villages Onboarded</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#005DAA]">12,450</p>
                    <p className="text-xs text-gray-500 mt-1">out of 20,000 target</p>
                    <div className="w-full bg-gray-100 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-[#005DAA] h-full rounded-full" style={{ width: '62%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <Banknote className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">State Revenue</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-700">₹4.2 Cr</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 18% YoY Growth</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">SBM Fund Utilized</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-700">68%</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">Phase II Budget Allocation</p>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold text-gray-600 text-sm">Policy Interventions</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">4</p>
                    <p className="text-xs text-gray-500 mt-1">Active state mandates</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Financial Viability Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Presentation className="w-5 h-5 text-gray-600" />
                            <h3 className="font-bold text-gray-800">Financial Viability Trend (Revenue vs Cost)</h3>
                        </div>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">Projecting Surplus by Q4</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={financialTrends} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="revenue" name="Sale Revenue" fill="#005DAA" radius={[4, 4, 0, 0]} barSize={25} />
                                <Bar dataKey="subsidy" name="Govt. Subsidy" fill="#93C5FD" radius={[4, 4, 0, 0]} barSize={25} stackId="revenue" />
                                <Line type="monotone" dataKey="cost" name="Operating Cost (O&M)" stroke="#DC3545" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SBM Progress Trackers */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-1">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                        <ScrollText className="w-5 h-5 text-gray-600" />
                        <h3 className="font-bold text-gray-800">SBM Phase II Goals</h3>
                    </div>
                    <div className="space-y-6">
                        {sbmGoals.map((goal) => (
                            <div key={goal.id}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-gray-700">{goal.title}</span>
                                    <span className="text-xs font-semibold text-gray-500">{goal.achieved}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div className={`h-2.5 rounded-full ${goal.color} transition-all duration-1000 ease-in-out`} style={{ width: `${goal.achieved}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                        <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">State Advisory</h4>
                        <p className="text-sm text-yellow-700">Focus strongly ordered on increasing <strong>User Charge Collection</strong> across Gram Panchayats trailing below 40%.</p>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default PolicyPlanDashboard;
