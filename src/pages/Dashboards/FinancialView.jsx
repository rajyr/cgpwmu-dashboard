import React from 'react';
import { IndianRupee, PieChart, TrendingDown, TrendingUp, Building2, Banknote, Activity } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    LineChart, Line
} from 'recharts';

const FinancialView = () => {
    // Profitability Map Data (Grid of districts)
    const profitabilityData = [
        { name: "Raipur", status: "+12.5% Surplus", isSurplus: true },
        { name: "Durg", status: "+8.2% Surplus", isSurplus: true },
        { name: "Bastar", status: "-4.5% Loss", isSurplus: false },
        { name: "Bilaspur", status: "+15% Surplus", isSurplus: true },
        { name: "Surguja", status: "-2.1% Loss", isSurplus: false },
        { name: "Korba", status: "+5.4% Surplus", isSurplus: true },
        { name: "Raigarh", status: "-1.8% Loss", isSurplus: false },
        { name: "Rajnandgaon", status: "+3.2% Surplus", isSurplus: true },
    ];

    // Subsidy Dependence Data (100% Stacked Bar Chart)
    const subsidyData = [
        { name: 'Raipur', userCharge: 45, sale: 45, grants: 10 },
        { name: 'Durg', userCharge: 40, sale: 45, grants: 15 },
        { name: 'Bastar', userCharge: 15, sale: 20, grants: 65 }, // High subsidy dependence
        { name: 'Bilaspur', userCharge: 50, sale: 40, grants: 10 },
        { name: 'Surguja', userCharge: 20, sale: 25, grants: 55 }, // High subsidy dependence
        { name: 'Korba', userCharge: 0, sale: 0, grants: 100 }, // Full subsidy (mock extreme)
    ];

    // Break-even Analysis Data (Line Chart: Revenue vs Cost)
    const breakEvenData = [
        { month: 'Apr', revenue: 200, cost: 280 },
        { month: 'May', revenue: 220, cost: 275 },
        { month: 'Jun', revenue: 250, cost: 270 },
        { month: 'Jul', revenue: 290, cost: 285 },
        { month: 'Aug', revenue: 310, cost: 288 }, // Crosses Break-even here
        { month: 'Sep', revenue: 340, cost: 290 },
        { month: 'Oct', revenue: 360, cost: 295 },
        { month: 'Nov', revenue: 380, cost: 300 },
    ];

    // Cost per kg Trend Data (Multi-line Chart)
    const costTrendData = [
        { month: 'Apr', raipur: 3.0, bilaspur: 2.8, bastar: 5.5 },
        { month: 'May', raipur: 2.9, bilaspur: 2.7, bastar: 5.4 },
        { month: 'Jun', raipur: 2.8, bilaspur: 2.6, bastar: 5.6 },
        { month: 'Jul', raipur: 2.7, bilaspur: 2.5, Bastar: 5.2 },
        { month: 'Aug', raipur: 2.6, bilaspur: 2.4, bastar: 4.8 },
        { month: 'Sep', raipur: 2.5, bilaspur: 2.3, bastar: 4.6 },
        { month: 'Oct', raipur: 2.4, bilaspur: 2.2, bastar: 4.5 },
        { month: 'Nov', raipur: 2.3, bilaspur: 2.1, bastar: 4.2 },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-6 font-sans pb-10">

            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 animate-fade-in-up">
                <div>
                    <div className="flex items-center gap-3">
                        <IndianRupee className="w-8 h-8 text-green-600" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Financial Sustainability Dashboard</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Actionable intelligence for financial policy decisions.</p>
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

            {/* Top Grid: Profitability & Subsidy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                {/* Profitability Map (Grid of Cards) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Profitability Map</h2>
                            <p className="text-xs text-gray-500 mt-0.5">District status based on operational surplus or loss.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profitabilityData.map((city, idx) => (
                            <div key={idx} className={`rounded-xl p-4 flex flex-col items-center justify-center text-center border ${city.isSurplus ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                <h4 className="font-bold text-gray-800 text-sm">{city.name}</h4>
                                <span className={`text-xs font-bold mt-1 ${city.isSurplus ? 'text-green-600' : 'text-red-500'}`}>
                                    {city.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subsidy Dependence (100% Stacked Bar) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-purple-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Subsidy Dependence</h2>
                            <p className="text-xs text-gray-500 mt-0.5">% Revenue source coming from User Charges, Sales, or Grants.</p>
                        </div>
                    </div>

                    <div className="w-full h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subsidyData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value) => `${value}%`} />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                <Bar dataKey="userCharge" name="User Charge" stackId="a" fill="#3b82f6" barSize={20} />
                                <Bar dataKey="sale" name="Sale of Recyclables" stackId="a" fill="#22c55e" />
                                <Bar dataKey="grants" name="Grants/Subsidies" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Bottom Grid: Trend Lines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

                {/* Break-even Analysis (Line Chart) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Break-even Analysis</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Monthly Revenue vs Cost timeline.</p>
                        </div>
                    </div>

                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={breakEvenData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${val}k`} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => `₹${value}k`}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} iconType="circle" iconSize={8} />
                                <Line type="monotone" dataKey="cost" name="Total Cost" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="revenue" name="Total Revenue" stroke="#22c55e" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost per kg Trend (Multi-line Chart) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Cost per kg Trend</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Compare operational efficiency over time across key districts.</p>
                        </div>
                    </div>

                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={costTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
                                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${val}`} axisLine={false} tickLine={false} domain={[0, 'auto']} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => `₹${value}`}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} iconType="circle" iconSize={8} />
                                <Line type="monotone" dataKey="bastar" name="Bastar (High Cost)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="bilaspur" name="Bilaspur" stroke="#a855f7" strokeWidth={2} dot={{ fill: 'white', r: 3 }} />
                                <Line type="monotone" dataKey="raipur" name="Raipur" stroke="#3b82f6" strokeWidth={2} dot={{ fill: 'white', r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default FinancialView;
