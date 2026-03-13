import React, { useState, useEffect, useMemo } from 'react';
import { IndianRupee, TrendingDown, TrendingUp, Building2, Banknote, Activity, Loader2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : import.meta.env.VITE_SUPABASE_URL);

const FinancialView = () => {
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
                console.error('Error fetching financial data:', err);
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

    // Profitability Map Data
    const profitabilityData = filteredPwmus.map(p => {
        const margin = p.revenue - p.expenditure;
        const percent = p.expenditure > 0 ? Math.round((margin / p.expenditure) * 100) : (p.revenue > 0 ? 100 : 0);
        return {
            name: p.name,
            status: `${percent > 0 ? '+' : ''}${percent}% ${margin >= 0 ? 'Surplus' : 'Loss'}`,
            isSurplus: margin >= 0
        };
    });

    // Subsidy Dependence Data (approximate splits)
    const totalUserCharge = filteredCollections.reduce((sum, c) => sum + Number(c.user_charge_collected || 0), 0);
    const totalSales = filteredPwmus.reduce((sum, p) => sum + Number(p.revenue || 0), 0);
    const subsidyData = filteredPwmus.map(p => {
        const pCollections = filteredCollections.filter(c => c.district === p.district || c.village_name.includes(p.name)); // Rough match
        const pUserCharge = pCollections.reduce((sum, c) => sum + Number(c.user_charge_collected || 0), 0);
        const total = (pUserCharge + p.revenue) || 1;
        return {
            name: p.name,
            userCharge: Math.round((pUserCharge / total) * 100),
            sale: Math.round((p.revenue / total) * 100),
            grants: 0
        };
    });

    // Break-even Analysis Data (Aggregated monthly simulation)
    const breakEvenData = [
        { month: 'Jul', revenue: Math.round(totalSales * 0.8 / 1000), cost: Math.round(filteredPwmus.reduce((sum, p) => sum + Number(p.expenditure), 0) / 1000) },
        { month: 'Aug', revenue: Math.round(totalSales / 1000), cost: Math.round(filteredPwmus.reduce((sum, p) => sum + Number(p.expenditure), 0) / 1000) },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-green-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="font-bold">Analyzing financial sustainability...</span>
            </div>
        );
    }

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
                        {profitabilityData.length === 0 ? (
                            <div className="col-span-full py-8 text-center text-gray-400 text-sm">No data available for this selection.</div>
                        ) : profitabilityData.map((item, idx) => (
                            <div key={idx} className={`rounded-xl p-4 flex flex-col items-center justify-center text-center border ${item.isSurplus ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                                <h4 className="font-bold text-gray-800 text-sm truncate w-full">{item.name}</h4>
                                <span className={`text-xs font-bold mt-1 ${item.isSurplus ? 'text-green-600' : 'text-red-500'}`}>
                                    {item.status}
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

                {/* Performance Summary (formerly Cost per kg) */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" />
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">State Revenue Split</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Distribution of revenue between Sales and User Charges.</p>
                        </div>
                    </div>

                    <div className="w-full h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Sales', value: totalSales },
                                        { name: 'User Charges', value: totalUserCharge }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#3b82f6" />
                                </Pie>
                                <RechartsTooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default FinancialView;
