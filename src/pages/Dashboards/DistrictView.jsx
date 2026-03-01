import React, { useState, useEffect, useMemo } from 'react';
import {
    Activity, ArrowUpRight, CheckCircle2, Factory, Filter,
    IndianRupee, TrendingUp, AlertCircle, Clock, Loader2
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : import.meta.env.VITE_SUPABASE_URL);

const DistrictView = () => {
    const { userRole } = useAuth();
    const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
    const [pwmus, setPwmus] = useState([]);
    const [collections, setCollections] = useState([]);
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;
                const proxyUrl = getProxyUrl();

                const [pwmuRes, collRes, pickRes] = await Promise.all([
                    fetch(`${proxyUrl}/rest/v1/pwmu_centers?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } }),
                    fetch(`${proxyUrl}/rest/v1/waste_collections?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } }),
                    fetch(`${proxyUrl}/rest/v1/vendor_pickups?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } })
                ]);

                if (pwmuRes.ok) setPwmus(await pwmuRes.json());
                if (collRes.ok) setCollections(await collRes.json());
                if (pickRes.ok) setPickups(await pickRes.json());

            } catch (err) {
                console.error('Error fetching district data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filtered data based on location
    const filteredPwmus = useMemo(() =>
        selectedDistrict === 'All Districts' ? pwmus : pwmus.filter(p => p.district === selectedDistrict)
        , [pwmus, selectedDistrict]);

    const filteredCollections = useMemo(() =>
        selectedDistrict === 'All Districts' ? collections : collections.filter(c => c.district === selectedDistrict)
        , [collections, selectedDistrict]);

    // KPI Calculations
    const totalPwmus = filteredPwmus.length;
    const activePwmus = filteredPwmus.filter(p => p.status === 'operational').length;
    const totalWasteMT = useMemo(() => {
        const processed = filteredPwmus.reduce((sum, p) => sum + Number(p.waste_processed_mt || 0), 0);
        const collectedKg = filteredCollections.reduce((sum, c) => sum + Number(c.wet_waste_kg + c.dry_waste_kg), 0);
        return (processed + (collectedKg / 1000)).toFixed(1);
    }, [filteredPwmus, filteredCollections]);

    const totalRevenue = filteredPwmus.reduce((sum, p) => sum + Number(p.revenue || 0), 0);
    const totalExpenditure = filteredPwmus.reduce((sum, p) => sum + Number(p.expenditure || 0), 0);
    const netProfit = totalRevenue - totalExpenditure;

    const kpis = [
        { label: "Total PWMUs", value: totalPwmus, icon: Factory, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active PWMUs", value: activePwmus, icon: Activity, color: "text-green-600", bg: "bg-green-50" },
        { label: "Reporting %", value: totalPwmus > 0 ? `${Math.round((activePwmus / totalPwmus) * 100)}%` : '0%', icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Total Waste", value: `${totalWasteMT} MT`, icon: ArrowUpRight, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Revenue", value: `₹${(totalRevenue / 100000).toFixed(2)}L`, icon: IndianRupee, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Net Profit", value: `₹${(netProfit / 100000).toFixed(2)}L`, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" }
    ];

    // Chart Data: Processing Efficiency
    const processingData = filteredPwmus.map(p => ({
        name: p.name,
        percentage: p.capacity_mt > 0 ? Math.round((p.waste_processed_mt / p.capacity_mt) * 100) : 0,
        fill: '#3b82f6'
    }));

    // Chart Data: Financial Viability (using rates or totals)
    const financialData = filteredPwmus.map(p => ({
        name: p.name,
        cost: p.waste_processed_mt > 0 ? (p.expenditure / (p.waste_processed_mt * 1000)).toFixed(2) : 0,
        revenue: p.waste_processed_mt > 0 ? (p.revenue / (p.waste_processed_mt * 1000)).toFixed(2) : 0,
    }));

    const machineTypes = ['FATKA', 'BALING', 'SHREDDER', 'AGGLOM.', 'MIXER', 'GRANULAR'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-indigo-600">
                <Loader2 className="w-8 h-8 animate-spin mr-3" />
                <span className="font-bold">Aggregating district metrics...</span>
            </div>
        );
    }

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
                        <select
                            className="bg-transparent text-sm text-gray-700 px-3 py-1.5 outline-none cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            <option value="All Districts">All Districts</option>
                            {[...new Set(pwmus.map(p => p.district))].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">State Status</span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 ${activePwmus === totalPwmus ? 'bg-green-500' : 'bg-yellow-500'} rounded-full animate-pulse`}></div>
                            <span className={`text-sm font-bold ${activePwmus === totalPwmus ? 'text-green-600' : 'text-yellow-600'}`}>
                                {activePwmus === totalPwmus ? 'Fully Operational' : 'Partial Maintenance'}
                            </span>
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
                                {filteredPwmus.map((p, i) => (
                                    <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 text-sm font-semibold text-gray-700">{p.name}</td>
                                        {machineTypes.map((_, j) => {
                                            const isOperational = p.status?.toLowerCase() === 'operational';
                                            return (
                                                <td key={j} className="py-4 text-center">
                                                    <div className="flex justify-center">
                                                        <div className={`w-3.5 h-3.5 rounded-sm ${isOperational
                                                            ? 'bg-green-500 shadow-sm shadow-green-200'
                                                            : 'bg-red-500 shadow-sm shadow-red-200 animate-pulse'}`}></div>
                                                    </div>
                                                </td>
                                            );
                                        })}
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
                        <p className="text-xs text-gray-500 mt-1">Submission status based on logs from the last 7 days.</p>
                    </div>
                    <div className="space-y-6">
                        {filteredPwmus.map((p, i) => {
                            const lastWeek = new Date();
                            lastWeek.setDate(lastWeek.getDate() - 7);

                            const hasRecentLogs = collections.some(c =>
                                c.district === p.district &&
                                new Date(c.collection_date) >= lastWeek
                            );

                            const isDelayed = !hasRecentLogs;
                            return (
                                <div key={i} className="w-full">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-700">{p.name}</span>
                                            {isDelayed && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDelayed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {isDelayed ? 'Reporting Gap' : 'Active'}
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${isDelayed ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: isDelayed ? '30%' : '100%' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default DistrictView;
