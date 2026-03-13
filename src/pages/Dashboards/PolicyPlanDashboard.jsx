import React, { useState, useEffect } from 'react';
import {
    Target, PieChart as PieChartIcon, Clock, Users,
    TrendingUp, Calculator, Gavel, FileText, Activity
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area
} from 'recharts';

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_BASE = '/cgpwmu/api';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

function PolicyPlanDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalExpense: 0,
        centerCount: 0,
        allocation: []
    });

    useEffect(() => {
        const fetchPolicyData = async () => {
            setLoading(true);
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;

                const [pwmuRes, collRes] = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } }),
                    fetch(`${API_BASE}/data/waste_collections?select=*`, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` } })
                ]);

                const centers = await pwmuRes.json();
                const collections = await collRes.json();

                const totalRev = centers.reduce((acc, curr) => acc + (parseFloat(curr.revenue) || 0), 0);
                const totalExp = centers.reduce((acc, curr) => acc + (parseFloat(curr.operating_cost) || 0), 0);

                // Group by district for allocation chart
                const districts = [...new Set(centers.map(c => c.district))];
                const colorScale = ['#005DAA', '#28A745', '#FFC107', '#E83E8C', '#6C757D', '#17A2B8', '#FD7E14', '#20C997'];
                const allocation = districts.map((d, i) => ({
                    name: d,
                    value: centers.filter(c => c.district === d).length,
                    color: colorScale[i % colorScale.length]
                })).slice(0, 4);

                setStats({
                    totalRevenue: totalRev,
                    totalExpense: totalExp,
                    centerCount: centers.length,
                    allocation: allocation.length > 0 ? allocation : []
                });
            } catch (err) {
                console.error('Policy Data Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPolicyData();
    }, []);

    const budgetUtilization = (stats.totalExpense / (stats.totalRevenue || 1)) * 100;

    if (loading) return (
        <div className="w-full h-full flex flex-col items-center justify-center py-20">
            <Activity className="w-10 h-10 text-blue-600 animate-pulse mb-4" />
            <p className="text-lg font-bold text-gray-800">Loading Strategic Framework...</p>
            <p className="text-sm text-gray-500 mt-1">Analyzing state-wide resource allocation</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Planning & Policy Framework</h1>
                        <p className="text-sm text-gray-500 mt-1">Resource allocation, budget forecasting and project timelines</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Project Nodes</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-800">{stats.centerCount}</span>
                                <span className="text-xs font-bold text-green-600">+12% vs last year</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Budget Utilization</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-600">{budgetUtilization.toFixed(1)}%</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden ml-2">
                                    <div className="h-full bg-blue-500" style={{ width: `${budgetUtilization}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expansion Score</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-orange-600">{stats.allocation.length > 0 ? (stats.allocation.length * 1.5).toFixed(1) : "0.0"}</span>
                                <span className="text-xs font-medium text-gray-500">/ 10</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                Strategic Project Roadmap
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {/* Roadmap will be dynamically loaded from a projects table in the future */}
                            {false && [].map((project, i) => (
                                <div key={i} className="relative pl-6 border-l-2 border-gray-100 pb-2">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500"></div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-gray-800">{project.name}</h4>
                                            <p className="text-xs text-gray-500">Scheduled Completion: {project.date}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${project.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                            project.status === 'Planning' ? 'bg-gray-50 text-gray-600' : 'bg-green-50 text-green-600'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-sm text-gray-500 italic">No strategic updates available for this cycle.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#005DAA]" />
                            Resource Allocation
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.allocation} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {stats.allocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            {stats.allocation.map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-gray-600 font-medium">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#005DAA] to-blue-800 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/10">
                        <h2 className="text-lg font-bold mb-2">Policy Documents</h2>
                        <p className="text-sm text-blue-100 mb-6 italic">Access state-wide regulatory frameworks and guidelines.</p>
                        <div className="space-y-3">
                            <p className="text-sm text-blue-100 italic">Policy repository is being synced...</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">State Advisory</h4>
                <p className="text-sm text-yellow-700">Focus strongly ordered on increasing <strong>User Charge Collection</strong> across Gram Panchayats trailing below 40%.</p>
            </div>
        </div>
    );
}

export default PolicyPlanDashboard;
