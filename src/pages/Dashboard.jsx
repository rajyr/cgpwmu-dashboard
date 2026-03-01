import React, { useState } from 'react';
import {
    Activity, CheckCircle2, ArrowUpRight, BarChart2, IndianRupee,
    Home, Users, Settings, PlusCircle, FileText, PieChart, Download,
    Calendar as CalendarIcon, Clock, AlertTriangle, Truck, Factory, Info
} from 'lucide-react';
import ChhattisgarhMap from '../components/ChhattisgarhMap';
import { dashboardData } from '../data/mockDashboardData';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend,
    PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { userRole } = useAuth();
    const { overview, valueChain } = dashboardData;
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    // Mapping role for display
    let displayRoleName = userRole || "Admin";
    if (displayRoleName === 'StateAdmin') displayRoleName = 'Admin';
    if (displayRoleName === 'DistrictNodal') displayRoleName = 'Nodal Officer';
    if (displayRoleName === 'PWMUManager') displayRoleName = 'PWMU Manager';
    if (displayRoleName === 'Sarpanch') displayRoleName = 'Village Admin';

    const financialData = [
        { month: 'Apr', revenue: 650000, spending: 580000 },
        { month: 'May', revenue: 720000, spending: 620000 },
        { month: 'Jun', revenue: 850000, spending: 680000 },
        { month: 'Jul', revenue: 1050000, spending: 750000 },
        { month: 'Aug', revenue: 1250000, spending: 810000 },
        { month: 'Sep', revenue: 1450000, spending: 850000 },
    ];

    const wasteComposition = [
        { name: 'Organic Waste', value: 45, color: '#22c55e' },
        { name: 'Recyclable Plastic', value: 25, color: '#3b82f6' },
        { name: 'Paper & Cardboard', value: 15, color: '#eab308' },
        { name: 'Glass & Metal', value: 10, color: '#a855f7' },
        { name: 'Inert / Other', value: 5, color: '#64748b' },
    ];

    const kpis = [
        { label: "ACTIVE PWMUS", hi: "सक्रिय PWMU", value: "138", unit: "Units", sub: "out of 142 registered", icon: Activity, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "REPORTS SUBMITTED", hi: "रिपोर्ट जमा", value: "125", unit: "Units", sub: "out of 142 registered", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
        { label: "WASTE PROCESSED", hi: "कचरा प्रोसेस", value: "1,540.5", unit: "MT", sub: "This Month", icon: ArrowUpRight, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "WASTE SOLD", hi: "कचरा बेचा गया", value: "1,210.2", unit: "MT", sub: "This Month", icon: BarChart2, color: "text-orange-600", bg: "bg-orange-50" },
        { isFinance: true },
        { label: "VILLAGES LINKED", hi: "जुड़े गाँव", value: "2,540", unit: "Villages", sub: "Total Connected", icon: Home, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "SWACHHAGRAHIS", hi: "स्वच्छाग्रही", value: "4,850", unit: "Workers", sub: "Active", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "AVG EFFICIENCY", hi: "औसत दक्षता", value: "94%", unit: "", sub: "Processing Speed", icon: Settings, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    const activities = [
        { id: 1, title: "RPR-ABH-001 submitted Jan 2025 Report", time: "2 mins ago", type: "Submission", icon: Clock, color: "text-green-500", bg: "bg-green-100" },
        { id: 2, title: "RPR-DHR-103 reported machinery breakdown", time: "1 hour ago", type: "Alert", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-100" },
        { id: 3, title: "New PWMU registered in Arang Block", time: "4 hours ago", type: "Registration", icon: Clock, color: "text-blue-500", bg: "bg-blue-100" },
        { id: 4, title: "Vendor VEND-098 picked up 5 MT PET", time: "5 hours ago", type: "Transaction", icon: Clock, color: "text-orange-500", bg: "bg-orange-100" },
        { id: 5, title: "System Maintenance Scheduled", time: "1 day ago", type: "System", icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
    ];

    const actions = [
        { label: "Register New PWMU", hi: "नया PWMU पंजीकृत करें", icon: PlusCircle, route: "/register/pwmu" },
        { label: "Submit Report", hi: "रिपोर्ट जमा करें", icon: FileText, route: "/dashboard/pwmu" },
        { label: "View Analytics", hi: "एनालिटिक्स देखें", icon: PieChart, route: "/dashboard/monitoring" },
        { label: "Download Reports", hi: "रिपोर्ट डाउनलोड करें", icon: Download, route: "#" },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-8 font-sans pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                        Welcome back, {displayRoleName} <span className="text-gray-400 font-normal">/</span> <span className="text-2xl font-semibold">आपका स्वागत है, {displayRoleName === 'Admin' ? 'एडमिन' : 'अधिकारी'}</span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Here is what's happening with the {displayRoleName === 'Admin' ? 'State' : 'Network'} PWMU network today. <span className="text-gray-400 mx-1">/</span> आज नेटवर्क की स्थिति यहां है।
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                    {/* Hierarchical Location Filters */}
                    <div className="flex bg-white border border-gray-200 rounded-lg shadow-sm p-1 overflow-x-auto max-w-[full] md:max-w-none hide-scrollbar">
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

                    {/* System Status Bubble */}
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm shrink-0">
                        <div className="flex flex-col text-right mr-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">System Status</span>
                            <span className="text-sm font-bold text-green-600">Operational <span className="text-xs font-normal">(संचालित)</span></span>
                        </div>
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 8 KPIs + Calendar in 5 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((kpi, index) => (
                        <div key={index} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-gray-200 h-32">
                            {kpi.isFinance ? (
                                <>
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">NET BALANCE <span className="font-normal">(शुद्ध शेष)</span></h3>
                                        </div>
                                        <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
                                            <IndianRupee className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-end flex-1">
                                        <div className="flex justify-between items-end mb-1">
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div> Rev: ₹42.5L</div>
                                            <div className="text-[10px] text-gray-500 font-semibold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400"></div> Exp: ₹21.5L</div>
                                        </div>
                                        <div className="w-full flex h-2 rounded-full overflow-hidden mb-1.5">
                                            <div className="bg-teal-500 transition-all duration-1000" style={{ width: '66%' }} title="Revenue"></div>
                                            <div className="bg-red-400 transition-all duration-1000" style={{ width: '34%' }} title="Expenses"></div>
                                        </div>
                                        <div className="flex justify-between items-baseline box-border">
                                            <span className="text-xl font-bold text-gray-800">+ ₹21.0L</span>
                                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">Net Profit</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.label} <span className="font-normal">({kpi.hi})</span></h3>
                                        </div>
                                        <div className={`p-1.5 rounded-lg ${kpi.bg} ${kpi.color}`}>
                                            <kpi.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-800">{kpi.value}</span>
                                            {kpi.unit && <span className="text-xs font-medium text-gray-500">{kpi.unit}</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-1">{kpi.sub}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Calendar View Stub - Spans 2 Rows relative to the KPI grid implicitly by matching its height */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-800">
                            Calendar <span className="text-xs font-normal text-gray-400">/ कैलेंडर</span>
                        </h2>
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center border border-gray-100 flex-1">
                        <p className="text-2xl font-bold text-gray-800">{date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        <p className="text-xs text-gray-500 mt-1 text-center">{date.toLocaleDateString('hi-IN', { weekday: 'long' })} / {date.toLocaleDateString('en-US', { weekday: 'long' })}</p>

                        <div className="w-full mt-4 pt-4 border-t border-gray-200">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-2">Upcoming Events</p>
                            <div className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                                <div className="w-1.5 h-1.5 mt-1 bg-orange-500 rounded-full shrink-0"></div>
                                <span>Monthly Review (2:00 PM)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Economic & Spatial Overview */}
            <div className="mt-2 pt-6 border-t border-gray-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {displayRoleName === 'Admin' ? 'State' : 'Operational'} Economic & Spatial Overview
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Deep dive into geospatial coverage and material flow value chain.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* State Map Coverage */}
                    <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800">State Map</h2>
                            <p className="text-sm text-gray-500 mt-1">District wise coverage metrics</p>
                        </div>
                        <div className="p-4 flex-1 min-h-[400px]">
                            <ChhattisgarhMap />
                        </div>
                    </div>

                    {/* Value Chain Economic Analysis Chart Space */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">Value Chain Economic Analysis</h2>
                                <p className="text-sm text-gray-500 mt-1">Tracking value generation and costs from Village Collection to Final Disposal</p>
                            </div>
                            <Info className="w-5 h-5 text-gray-400 cursor-pointer hover:text-blue-600 transition-colors" />
                        </div>
                        <div className="p-6 h-[400px] w-full relative bg-[#fafafa]/50 rounded-b-xl overflow-x-auto overflow-y-hidden">
                            {/* Visual mock of the sankey flow */}
                            <div className="absolute left-0 top-0 w-full h-full min-w-[800px]">

                                {/* Animated Flow Lines */}
                                <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="absolute w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                    <defs>
                                        <linearGradient id="flowGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
                                        </linearGradient>
                                        <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#86efac" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#22c55e" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#86efac" stopOpacity="0.2" />
                                        </linearGradient>
                                        <linearGradient id="flowGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.2" />
                                            <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6">
                                                <animate attributeName="offset" values="-1; 2" dur="3s" repeatCount="indefinite" />
                                            </stop>
                                            <stop offset="100%" stopColor="#fca5a5" stopOpacity="0.2" />
                                        </linearGradient>
                                    </defs>

                                    <path d="M 150 200 C 250 195, 350 205, 450 200" fill="none" stroke="url(#flowGrad1)" strokeWidth="40" className="opacity-50" />
                                    <path d="M 500 200 C 650 200, 650 100, 800 100" fill="none" stroke="url(#flowGrad2)" strokeWidth="20" className="opacity-50" />
                                    <path d="M 500 200 C 600 195, 700 205, 800 200" fill="none" stroke="url(#flowGrad3)" strokeWidth="15" className="opacity-50" />
                                    <path d="M 500 200 C 650 200, 650 300, 800 300" fill="none" stroke="#fde047" strokeWidth="10" className="opacity-50" />
                                </svg>

                                {/* Nodes Container */}
                                <div className="absolute inset-0 flex items-center justify-between px-10" style={{ zIndex: 10 }}>

                                    {/* 1. Village Node */}
                                    <div className="group relative w-48 bg-white border-2 border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer z-20">
                                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-[-1] scale-110"></div>
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                <Truck className="text-blue-600 w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-base">Villages</h3>
                                            <p className="text-sm font-semibold text-gray-600 mt-1">{valueChain.villages.volume}</p>
                                            <p className="text-xs font-bold text-red-500 mt-1">{valueChain.villages.financial}</p>
                                        </div>

                                        {/* Tooltip */}
                                        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 bg-gray-900 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 scale-95 group-hover:scale-100">
                                            <p className="text-sm mb-3 text-gray-300">{valueChain.villages.hoverText}</p>
                                            <div className="space-y-2 border-t border-gray-700 pt-3">
                                                {valueChain.villages.details.map((d, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-400">{d.label}</span>
                                                        <span className="font-semibold">{d.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* 2. PWMU Center Node */}
                                    <div className="group relative w-48 bg-white border-2 border-[#005DAA] rounded-xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer z-20 scale-110">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#005DAA] text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-blue-400 shadow-sm whitespace-nowrap">Central Hub</div>
                                        <div className="flex flex-col items-center text-center mt-2">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                                <Factory className="text-[#005DAA] w-6 h-6" />
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-base">PWMU Center</h3>
                                            <p className="text-sm font-semibold text-gray-600 mt-1">{valueChain.pwmuCenter.volume}</p>
                                            <p className="text-xs font-bold text-red-500 mt-1">{valueChain.pwmuCenter.financial}</p>
                                        </div>

                                        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-64 bg-gray-900 text-white p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 scale-95 group-hover:scale-100">
                                            <p className="text-sm mb-3 text-gray-300">{valueChain.pwmuCenter.hoverText}</p>
                                            <div className="space-y-2 border-t border-gray-700 pt-3">
                                                {valueChain.pwmuCenter.details.map((d, i) => (
                                                    <div key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-400">{d.label}</span>
                                                        <span className="font-semibold">{d.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 rotate-45"></div>
                                        </div>
                                    </div>

                                    {/* 3. Sinks */}
                                    <div className="flex flex-col gap-6 w-48 z-20">
                                        {valueChain.sinks.map((sink) => (
                                            <div key={sink.id} className={`group relative bg-white border-2 border-${sink.color}-200 rounded-xl p-3 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer`}>
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 text-sm">{sink.name}</h3>
                                                        <p className={`text-xs font-bold ${sink.financial.startsWith('+') ? 'text-green-600' : 'text-red-500'} mt-1`}>{sink.financial}</p>
                                                    </div>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded bg-${sink.color}-50 text-${sink.color}-700 border border-${sink.color}-100`}>{sink.volume}</span>
                                                </div>

                                                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 w-48 bg-gray-900 text-white p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                                                    <p className="text-xs">{sink.hoverText}</p>
                                                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Charts Row: Financial & Waste */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Financial Performance */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Financial Performance</h2>
                            <p className="text-sm text-gray-500 mt-1">Revenue Generation vs Operational Spending</p>
                        </div>
                        <div className="w-full h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `₹${val / 100000}L`} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={8} />
                                    <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#22c55e" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="spending" name="Total Spending" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpending)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Waste Composition */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Statewide Waste Composition</h2>
                            <p className="text-sm text-gray-500 mt-1">Breakdown of processed material types by volume</p>
                        </div>
                        <div className="w-full h-[250px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={wasteComposition}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {wasteComposition.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value) => `${value}%`}
                                    />
                                    <Legend
                                        layout="vertical"
                                        verticalAlign="middle"
                                        align="right"
                                        wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                                        iconType="circle"
                                        iconSize={8}
                                    />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid: Activity vs Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>

                {/* Left Col: Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800">
                            Recent Activity <span className="text-sm font-normal text-gray-400 ml-1">/ हाल की गतिविधि</span>
                        </h2>
                        <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800">View All</a>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="space-y-6">
                            {activities.map((item) => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">{item.time}</span>
                                            <span className="text-xs text-gray-300">•</span>
                                            <span className="text-xs text-gray-500">{item.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Col: Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Quick Actions <span className="text-sm font-normal text-gray-400 ml-1">/ त्वरित कार्रवाई</span>
                    </h2>
                    <div className="space-y-3">
                        {actions.map((action, idx) => (
                            <a key={idx} href={action.route} className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100 transition-all group">
                                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100">
                                    <action.icon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">{action.label}</span>
                                    <span className="text-[10px] text-gray-500 font-medium">{action.hi}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
