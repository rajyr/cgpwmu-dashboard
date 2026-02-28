import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Map, FileText, Activity, PieChart, Settings,
    TrendingUp, IndianRupee, Recycle, CheckCircle2, XCircle,
    Truck, Factory, Home, Building2, Zap, ShieldCheck,
    BarChart3, Users, PlayCircle
} from 'lucide-react';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-[#f4f7f6] font-sans selection:bg-[#005DAA] selection:text-white">

            {/* 1. HERO SECTION */}
            <header className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent -z-10"></div>
                {/* Abstract background shapes */}
                <div className="absolute top-20 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl -z-10 opacity-50 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-100/30 rounded-full blur-3xl -z-10 opacity-50 -translate-x-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                        {/* Left: Text Content */}
                        <div className="max-w-2xl animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-sm font-semibold mb-6 shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                CG-PWMU Digital Monitoring Platform
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
                                छत्तीसगढ़ में प्लास्टिक अपशिष्ट प्रबंधन की <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005DAA] to-[#00427A]">डिजिटल निगरानी</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-8 font-medium">
                                गाँव से रिसाइक्लर तक — वास्तविक समय डेटा, वित्तीय विश्लेषण और कार्यात्मक मशीन मॉनिटरिंग एक ही प्लेटफ़ॉर्म पर।
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link to="/login" className="px-8 py-3.5 rounded-xl bg-[#005DAA] text-white font-bold text-lg hover:bg-[#00427A] hover:shadow-lg hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    Login <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/register" className="px-8 py-3.5 rounded-xl bg-green-600 text-white font-bold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 transition-all transform hover:-translate-y-0.5">
                                    Register Unit
                                </Link>
                                <Link to="/dashboard" className="px-8 py-3.5 rounded-xl bg-white text-gray-700 font-bold text-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5 text-orange-500" /> Explore Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Right: Animated Visual Concept */}
                        <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-green-50 rounded-[3rem] transform rotate-3 scale-105 -z-10 shadow-inner border border-white/50"></div>
                            <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-2xl w-full h-full relative overflow-hidden group">
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-50">
                                    <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-yellow-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                                    <div className="text-xs font-mono text-gray-400">STATE_MONITORING_VS1</div>
                                </div>

                                {/* Simulated Interactive Flow SVG */}
                                <div className="absolute inset-0 flex items-center justify-center mt-4">
                                    <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        {/* Paths */}
                                        <path d="M50 150 C 150 150, 150 50, 200 50" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
                                        <path d="M50 150 C 150 150, 150 250, 200 250" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6" className="animate-pulse" />
                                        <path d="M200 50 C 300 50, 300 150, 350 150" stroke="#005DAA" strokeWidth="4" strokeLinecap="round" />
                                        <path d="M200 250 C 300 250, 300 150, 350 150" stroke="#005DAA" strokeWidth="4" strokeLinecap="round" />

                                        {/* Animated Particles */}
                                        <circle cx="50" cy="150" r="4" fill="#10B981"><animateMotion dur="3s" repeatCount="indefinite" path="M0 0 C 100 0, 100 -100, 150 -100" /></circle>
                                        <circle cx="50" cy="150" r="4" fill="#3B82F6"><animateMotion dur="3.5s" repeatCount="indefinite" path="M0 0 C 100 0, 100 100, 150 100" /></circle>

                                        {/* Nodes */}
                                        <g className="transform hover:scale-110 transition-transform cursor-pointer group/node">
                                            <circle cx="50" cy="150" r="25" fill="white" stroke="#94A3B8" strokeWidth="2" />
                                            <path d="M42 153l8-8 8 8M46 153v6h8v-6" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            {/* Tooltip */}
                                            <g className="opacity-0 group-hover/node:opacity-100 transition-opacity">
                                                <rect x="15" y="90" width="70" height="24" rx="4" fill="#1E293B" />
                                                <text x="50" y="106" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Villages</text>
                                            </g>
                                        </g>

                                        <g className="transform hover:scale-110 transition-transform cursor-pointer group/node2">
                                            <circle cx="200" cy="50" r="30" fill="white" stroke="#005DAA" strokeWidth="3" />
                                            <rect x="188" y="40" width="24" height="20" rx="2" stroke="#005DAA" strokeWidth="2" />
                                            <path d="M194 40v-6h12v6" stroke="#005DAA" strokeWidth="2" />
                                            <g className="opacity-0 group-hover/node2:opacity-100 transition-opacity">
                                                <rect x="160" y="0" width="80" height="24" rx="4" fill="#1E293B" />
                                                <text x="200" y="16" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">+450 MT Processed</text>
                                            </g>
                                        </g>

                                        <g className="transform hover:scale-110 transition-transform cursor-pointer group/node3">
                                            <circle cx="200" cy="250" r="30" fill="white" stroke="#F59E0B" strokeWidth="3" />
                                            <circle cx="194" cy="256" r="4" stroke="#F59E0B" strokeWidth="2" />
                                            <circle cx="206" cy="256" r="4" stroke="#F59E0B" strokeWidth="2" />
                                            <path d="M188 252h24v-6l-4-4h-16l-4 4v6z" stroke="#F59E0B" strokeWidth="2" fill="none" />
                                            <g className="opacity-0 group-hover/node3:opacity-100 transition-opacity">
                                                <rect x="160" y="280" width="80" height="24" rx="4" fill="#1E293B" />
                                                <text x="200" y="296" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">Active Vendors</text>
                                            </g>
                                        </g>

                                        <g className="transform hover:scale-110 transition-transform cursor-pointer group/node4">
                                            <circle cx="350" cy="150" r="35" fill="white" stroke="#10B981" strokeWidth="4" />
                                            <path d="M340 160l10-10 10 10M345 155v10h10v-10" fill="none" stroke="#10B981" strokeWidth="2" />
                                            <circle cx="350" cy="150" r="10" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" className="animate-spin-slow" />
                                            <g className="opacity-0 group-hover/node4:opacity-100 transition-opacity">
                                                <rect x="310" y="90" width="80" height="24" rx="4" fill="#1E293B" />
                                                <text x="350" y="106" fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">92% Recovery</text>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. LIVE STATE SNAPSHOT */}
            <section className="py-12 bg-white border-y border-gray-100 relative z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">राज्य स्तर की वर्तमान स्थिति</h2>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Last updated: Real-time
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                        {[
                            { label: "Total Waste This Month", value: "1,245 MT", icon: <Recycle className="w-6 h-6 text-green-600" />, color: "bg-green-50", border: "border-green-100" },
                            { label: "Plastic Recovered", value: "84.2%", icon: <PieChart className="w-6 h-6 text-blue-600" />, color: "bg-blue-50", border: "border-blue-100" },
                            { label: "Total Revenue Generated", value: "₹42.5 L", icon: <IndianRupee className="w-6 h-6 text-orange-600" />, color: "bg-orange-50", border: "border-orange-100" },
                            { label: "Machine Functional", value: "92%", icon: <Settings className="w-6 h-6 text-purple-600" />, color: "bg-purple-50", border: "border-purple-100" },
                            { label: "Reporting Compliance", value: "98%", icon: <CheckCircle2 className="w-6 h-6 text-teal-600" />, color: "bg-teal-50", border: "border-teal-100" }
                        ].map((stat, i) => (
                            <div key={i} className={`p-5 rounded-2xl ${stat.color} border ${stat.border} hover:shadow-md transition-shadow relative overflow-hidden group`}>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                                    {stat.icon}
                                </div>
                                <div className="mb-3">{stat.icon}</div>
                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. PROBLEM -> SOLUTION SECTION */}
            <section className="py-24 bg-gradient-to-b from-[#f4f7f6] to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* the Problem */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold tracking-widest text-red-500 uppercase mb-2">The Reality</h3>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">Fragmented infrastructure limits true potential.</h2>
                            <div className="space-y-4">
                                {[
                                    "Paper-based error-prone reporting",
                                    "No district-level comparative analytics",
                                    "Zero visibility into machine downtime",
                                    "Opaque financial & operational metrics"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-red-50/50 p-4 rounded-xl border border-red-100">
                                        <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                                        <span className="font-medium text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* The Solution */}
                        <div className="relative">
                            {/* Transition Arrow for Desktop */}
                            <div className="hidden lg:flex absolute -left-12 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg items-center justify-center z-10">
                                <ArrowRight className="w-6 h-6 text-[#005DAA]" />
                            </div>

                            <div className="bg-[#005DAA] rounded-[2rem] p-8 md:p-10 shadow-2xl text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                                <h3 className="text-sm font-bold tracking-widest text-blue-200 uppercase mb-6 relative z-10">The Digital Solution</h3>
                                <div className="space-y-5 relative z-10">
                                    {[
                                        { text: "Real-time automated reporting", icon: <Activity className="w-6 h-6 text-green-400" /> },
                                        { text: "District & Block level drilldown", icon: <Map className="w-6 h-6 text-orange-400" /> },
                                        { text: "Machine health & usage intelligence", icon: <Settings className="w-6 h-6 text-purple-400" /> },
                                        { text: "End-to-end financial transparency", icon: <IndianRupee className="w-6 h-6 text-yellow-400" /> }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                                            {item.icon}
                                            <span className="font-semibold text-white/90">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. HOW THE SYSTEM WORKS (4 Portals) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">एकीकृत डिजिटल कार्यप्रणाली</h2>
                        <p className="text-lg text-gray-600 font-medium">Four integrated portals ensuring seamless accountability from source to disposal.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Registration Portal", desc: "Onboarding for PWMUs, Villages, and Vendors with verification.", icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, color: "bg-blue-50 hover:bg-blue-600 hover:text-white" },
                            { title: "Reporting Portal", desc: "Bilingual daily/monthly logging for waste tracking and operations.", icon: <FileText className="w-8 h-8 text-green-600" />, color: "bg-green-50 hover:bg-green-600 hover:text-white" },
                            { title: "Monitoring Portal", desc: "Compliance watchlists, machine uptime, and performance tracking.", icon: <Activity className="w-8 h-8 text-orange-600" />, color: "bg-orange-50 hover:bg-orange-600 hover:text-white" },
                            { title: "Analytics Dashboard", desc: "State-level insights, geospatial heatmaps, and financial metrics.", icon: <PieChart className="w-8 h-8 text-purple-600" />, color: "bg-purple-50 hover:bg-purple-600 hover:text-white" },
                        ].map((portal, i) => (
                            <div key={i} className={`p-8 rounded-3xl border border-gray-100 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-xl ${portal.color}`}>
                                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                                    {/* Icon color must be explicitly defined here or inherited. We'll leave it as is, but it might not contrast well on hover. Let's fix icon color on hover via CSS child selectors if needed. */}
                                    <div className="group-hover:opacity-80 transition-opacity">{portal.icon}</div>
                                </div>
                                <h3 className="text-xl font-bold mb-3 transition-colors">{portal.title}</h3>
                                <p className="text-sm font-medium opacity-80 leading-relaxed transition-colors">{portal.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. WASTE FLOW INTERACTIVE MAP (Control Room Dark Section) */}
            <section className="py-24 bg-[#0F172A] relative overflow-hidden text-white border-y border-gray-800 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                            Live Telemetry View
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Statewide Geospatial Dashboard</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Hover interactions, district-level drilldowns, and material flow lines give officials unprecedented oversight.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-center bg-[#1E293B]/50 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-sm">

                        {/* Fake Legend/Info Panel Left */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-300 uppercase tracking-widest text-xs mb-4 border-b border-slate-700 pb-2">Material Flow Legend</h3>
                            {[
                                { color: "bg-blue-500", label: "HDPE / PET Plastics" },
                                { color: "bg-green-500", label: "Wet / Organic Flow" },
                                { color: "bg-purple-500", label: "E-Waste Transit" },
                                { color: "bg-slate-400", label: "Ferrous Metals" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor]`} />
                                    <span className="text-sm font-medium text-slate-300">{item.label}</span>
                                </div>
                            ))}

                            <div className="mt-8 pt-6 border-t border-slate-700 space-y-4">
                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
                                    <div className="text-xs text-slate-400 mb-1">Top Performing District</div>
                                    <div className="font-bold text-lg text-emerald-400 flex items-center justify-between">Durg <TrendingUp className="w-4 h-4" /></div>
                                </div>
                                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/50">
                                    <div className="text-xs text-slate-400 mb-1">Highest Revenue PWMU</div>
                                    <div className="font-bold text-lg text-amber-400 flex items-center justify-between">Balod Central <TrendingUp className="w-4 h-4" /></div>
                                </div>
                            </div>
                        </div>

                        {/* Center Dummy Map visual */}
                        <div className="lg:col-span-2 relative h-[400px] bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden group">
                            {/* Fake Map Grid & Lines */}
                            <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                                {/* Flow line 1 */}
                                <path d="M100 300 Q 300 200 600 150" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse opacity-50" />
                                <circle cx="100" cy="300" r="3" fill="#3B82F6"><animateMotion dur="4s" repeatCount="indefinite" path="M0 0 Q 200 -100 500 -150" /></circle>
                                {/* Flow line 2 */}
                                <path d="M200 350 Q 400 300 650 100" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse opacity-50" />
                                <circle cx="200" cy="350" r="3" fill="#10B981"><animateMotion dur="5s" repeatCount="indefinite" path="M0 0 Q 200 -50 450 -250" /></circle>
                                {/* Nodes */}
                                <circle cx="100" cy="300" r="8" fill="#1E293B" stroke="#3B82F6" strokeWidth="3" />
                                <circle cx="200" cy="350" r="10" fill="#1E293B" stroke="#10B981" strokeWidth="3" />
                                <circle cx="600" cy="150" r="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="4" className="shadow-[0_0_15px_#F59E0B]" />
                                <circle cx="650" cy="100" r="12" fill="#0F172A" stroke="#8B5CF6" strokeWidth="3" />
                            </svg>

                            {/* Overlay UI element */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-800/90 backdrop-blur-md border border-slate-600 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="font-bold text-white mb-2 pb-2 border-b border-slate-600">Durg Central PWMU</div>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                                    <div className="text-slate-400">Intake</div><div className="text-right font-mono text-emerald-400">12.4 MT</div>
                                    <div className="text-slate-400">Stock</div><div className="text-right font-mono text-blue-400">4.1 MT</div>
                                </div>
                            </div>

                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <Link to="/dashboard" className="bg-[#005DAA] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg">
                                    View Live Map <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. IMPACT METRICS */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">सिस्टम का प्रभाव (System Impact)</h2>
                        <div className="w-24 h-1 bg-[#005DAA] mx-auto mt-6 rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Waste Diverted from Landfill", value: "3,450 MT", growth: "+12.5%", color: "text-green-600", bg: "bg-green-50" },
                            { title: "Plastic Recovery Growth", value: "94.2%", growth: "+8.1%", color: "text-blue-600", bg: "bg-blue-50" },
                            { title: "Revenue Increase (YoY)", value: "₹1.2 Cr", growth: "+22.4%", color: "text-amber-600", bg: "bg-amber-50" },
                            { title: "Reporting Compliance", value: "98.5%", growth: "+15.0%", color: "text-purple-600", bg: "bg-purple-50" },
                            { title: "Machine Downtime Reduced", value: "-45%", growth: "Optimal", color: "text-teal-600", bg: "bg-teal-50" },
                            { title: "Active Vendors Registered", value: "142", growth: "+12 New", color: "text-indigo-600", bg: "bg-indigo-50" }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col p-8 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                        {stat.growth}
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. MACHINE INTELLIGENCE & 8. FINANCIAL TRANSPARENCY (Split Section) */}
            <section className="py-24 bg-[#f4f7f6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                    {/* Machine Intelligence */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full -z-10"></div>
                            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-6">
                                <div>
                                    <div className="text-sm font-bold text-gray-400 mb-1">NETWORK STATUS</div>
                                    <div className="text-3xl font-black text-gray-900">82% <span className="text-lg text-green-500 font-semibold">Functional</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-400 mb-1">ISSUES</div>
                                    <div className="text-3xl font-black text-gray-900">18% <span className="text-lg text-red-500 font-semibold">Down</span></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {['Baling Machine', 'Shredder', 'Agglomerator', 'Mixer'].map((machine, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <Settings className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-gray-700">{machine}</span>
                                        </div>
                                        {i === 1 ? (
                                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full border border-red-100">Needs Repair</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-100">Optimal</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-bold">
                                <Zap className="w-4 h-4" /> Machine Intelligence
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">मशीन कार्यक्षमता मॉनिटरिंग</h2>
                            <p className="text-lg text-gray-600">Track equipment uptime, schedule preventative maintenance, and visualize district breakdowns to minimize critical processing downtime.</p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500" /> Automated service alerts</li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500" /> Granular equipment tracking</li>
                                <li className="flex items-center gap-3 text-gray-700 font-medium"><CheckCircle2 className="w-5 h-5 text-green-500" /> Predict maintenance costs</li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gray-200"></div>

                    {/* Financial Transparency */}
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-bold">
                                <BarChart3 className="w-4 h-4" /> Analytics Engine
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">Financial Transparency</h2>
                            <p className="text-lg text-gray-600">Complete visibility into revenue generation, vendor performance, and unit-level operational costs.</p>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-[#005DAA] mt-6">
                                <p className="text-xl font-bold text-gray-800 italic">"डेटा आधारित निर्णय — अनुमानों पर नहीं।"</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                    <span className="text-gray-500 text-sm font-semibold">Revenue/kg Tracking</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full w-4/5"></div></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2">
                                    <span className="text-gray-500 text-sm font-semibold">O&M Cost Visibility</span>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-orange-500 h-1.5 rounded-full w-full"></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
                            {/* Fake Bar Chart Representation */}
                            <div className="flex justify-between items-end h-64 border-b border-gray-100 pb-4 gap-2">
                                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                                    <div key={i} className="w-full flex justify-center group relative cursor-pointer">
                                        <div className="w-full max-w-[40px] bg-blue-100 rounded-t-md relative flex items-end justify-center transition-all group-hover:opacity-80" style={{ height: '100%' }}>
                                            <div className="w-full bg-[#005DAA] rounded-t-md shadow-sm transition-all duration-500" style={{ height: `${height}%` }}></div>
                                        </div>
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{height * 10}k</div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* 9. ROLE-BASED ACCESS */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Role-Based Ecosystem</h2>
                        <p className="text-lg text-gray-600 font-medium">Customized views and secure access levels for every platform stakeholder.</p>
                    </div>

                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                            { title: "State Admin", icon: <ShieldCheck />, desc: "Full geospatial analytics, policy macro-views, system configs." },
                            { title: "District Official", icon: <Building2 />, desc: "Block level compliance, waste flow tracking, approvals." },
                            { title: "PWMU Nodal", icon: <Factory />, desc: "Daily logs, machine status, vendor dispatch management." },
                            { title: "Village Sarpanch", icon: <Home />, desc: "Household collection stats, local dashboard, swachhata attendance." },
                            { title: "Vendor/Market", icon: <Truck />, desc: "Available stock viewing, purchase history, bids." }
                        ].map((role, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-100 p-6 rounded-3xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group cursor-pointer">
                                <div className="w-16 h-16 mx-auto bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-[#005DAA] group-hover:text-white group-hover:border-[#005DAA] transition-colors mb-4 shadow-sm">
                                    {role.icon}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{role.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{role.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 10. TESTIMONIALS (Placeholder) */}
            <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Users className="w-64 h-64" /></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
                    <div className="text-blue-400 mb-6 flex justify-center">
                        <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
                        "इस प्लेटफ़ॉर्म ने रिपोर्टिंग और मॉनिटरिंग को पूरी तरह से पारदर्शी बना दिया है। अब हमारे पास वास्तविक समय के डेटा के आधार पर निर्णय लेने की क्षमता है।"
                    </blockquote>
                    <cite className="block font-bold text-lg text-white">Nodal Officer</cite>
                    <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">CG-PWMU Initiative</span>
                </div>
            </section>

            {/* 11. CTA BANNER */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-[#005DAA] to-[#00427A] rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">आज ही अपनी यूनिट पंजीकृत करें और डिजिटल मॉनिटरिंग से जुड़ें</h2>
                            <p className="text-blue-100 text-lg md:text-xl font-medium mb-10">Join the central network for transparent, efficient, and profitable plastic waste management.</p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Link to="/register/pwmu" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-[#005DAA] font-bold hover:bg-gray-50 hover:shadow-lg transition-all transform hover:-translate-y-1">
                                    Register PWMU
                                </Link>
                                <Link to="/register/village" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-green-500 text-white font-bold hover:bg-green-400 hover:shadow-lg transition-all transform hover:-translate-y-1">
                                    Register Village
                                </Link>
                                <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-white/30 text-white font-bold hover:bg-white/10 transition-all">
                                    Login Portal
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Landing;
