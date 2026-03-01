import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Map, FileText, Activity, PieChart, Settings,
    TrendingUp, IndianRupee, Recycle, CheckCircle2, XCircle,
    Truck, Factory, Home, Building2, Zap, ShieldCheck,
    BarChart3, Users, PlayCircle
} from 'lucide-react';
import { useRef } from 'react';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [toggleWord, setToggleWord] = useState('Value');
    const svgRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const words = ['Value', 'Wealth'];
        let wordIndex = 0;
        const interval = setInterval(() => {
            wordIndex = (wordIndex + 1) % words.length;
            setToggleWord(words[wordIndex]);
        }, 3000);

        // ========== COIN ANIMATION LOGIC ==========
        const createCoinsAtFactory = () => {
            const svg = svgRef.current;
            if (!svg) return;

            // Factory center is roughly 760, 180 in viewBox
            const point = svg.createSVGPoint();
            point.x = 760;
            point.y = 180;

            try {
                const screenPoint = point.matrixTransform(svg.getScreenCTM());
                const screenX = screenPoint.x;
                const screenY = screenPoint.y;

                for (let i = 0; i < 6; i++) {
                    setTimeout(() => {
                        const coin = document.createElement('div');
                        coin.className = 'coin';
                        coin.textContent = '₹';

                        const angle = (i / 6) * Math.PI * 2;
                        const distance = 25 + Math.random() * 20;
                        const spreadX = Math.cos(angle) * distance;
                        const spreadY = Math.sin(angle) * distance * 0.3;

                        coin.style.position = 'fixed';
                        coin.style.left = (screenX + spreadX * 0.2) + 'px';
                        coin.style.top = (screenY + spreadY * 0.2) + 'px';
                        coin.style.zIndex = '9999';
                        coin.style.pointerEvents = 'none';
                        coin.style.setProperty('--tx', (spreadX * 2.5) + 'px');
                        coin.style.setProperty('--ty', (spreadY * 2.5) + 'px');

                        document.body.appendChild(coin);
                        setTimeout(() => coin.remove(), 1200);
                    }, i * 80);
                }
            } catch (e) {
                console.error("Coin animation error:", e);
            }
        };

        // ========== WASTE PARTICLE LOGIC ==========
        const createWasteParticle = () => {
            const container = document.getElementById('particle-container');
            if (!container) return;

            const startX = 80 + Math.random() * 200;
            const startY = 320 + Math.random() * 80;
            const endX = startX + (600 + Math.random() * 200);
            const endY = startY - (200 + Math.random() * 100);

            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('cx', startX);
            particle.setAttribute('cy', startY);
            particle.setAttribute('r', '4');
            particle.setAttribute('fill', `hsl(${160 + Math.random() * 40}, 70%, 50%)`);
            particle.setAttribute('opacity', '0.8');
            particle.setAttribute('class', 'waste-particle');

            const tx = endX - startX;
            const ty = endY - startY;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');

            container.appendChild(particle);
            setTimeout(() => particle.remove(), 3000);
        };

        // Truck cycle is 12s, reaches factory at ~11.5s
        const coinInterval = setInterval(() => {
            setTimeout(createCoinsAtFactory, 11500);
        }, 12000);

        const particleInterval = setInterval(createWasteParticle, 400);

        // Initial trigger
        setTimeout(createCoinsAtFactory, 11500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
            clearInterval(coinInterval);
            clearInterval(particleInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans selection:bg-green-600 selection:text-white overflow-x-hidden">

            {/* =========== HERO SECTION =========== */}
            <section className="hero-container relative pt-20">
                {/* Background Mesh Animation */}
                <div className="hero-bg-mesh"></div>

                {/* Main SVG Scene - Background */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.8, transform: 'translateY(100px)' }}>
                    <svg ref={svgRef} className="w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#E8F5E9', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#C8E6C9', stopOpacity: 1 }} />
                            </linearGradient>
                            <linearGradient id="ground-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#A5D6A7', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#81C784', stopOpacity: 1 }} />
                            </linearGradient>
                            <filter id="soft-shadow">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                            </filter>
                        </defs>

                        {/* Particle Container */}
                        <g id="particle-container"></g>

                        {/* Sky */}
                        <rect width="1000" height="350" fill="url(#sky-gradient)"></rect>

                        {/* Sun */}
                        <circle id="sun-circle" cx="100" cy="100" r="45" fill="#FBBF24" filter="url(#soft-shadow)"></circle>

                        {/* Background Mountains (far) */}
                        <path d="M0 300 Q 250 200 500 300 T 1000 300 L 1000 350 L 0 350 Z" fill="#B5C99F" opacity="0.4"></path>

                        {/* Mid-ground Hills */}
                        <path d="M0 350 Q 150 250 300 350 T 600 350 T 1000 320 L 1000 400 L 0 400 Z" fill="#A5D6A7" opacity="0.6"></path>

                        {/* Foreground Ground */}
                        <rect y="400" width="1000" height="300" fill="url(#ground-gradient)"></rect>

                        {/* VILLAGES ON LEFT (Source) */}
                        <g id="village-left">
                            {/* Village Hut 1 */}
                            <g transform="translate(80, 340)">
                                <rect x="0" y="0" width="60" height="50" fill="#C46430" rx="3"></rect>
                                <path d="M-5 0 L 30 -35 L 65 0 Z" fill="#A0522D"></path>
                                <rect x="15" y="20" width="12" height="12" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="38" y="20" width="12" height="12" fill="#87CEEB" opacity="0.8"></rect>
                                <circle cx="30" cy="45" r="4" fill="#8B4513"></circle>
                            </g>

                            {/* Village Hut 2 */}
                            <g transform="translate(160, 350)">
                                <rect x="0" y="0" width="50" height="40" fill="#CD7F32" rx="3"></rect>
                                <path d="M-4 0 L 25 -28 L 54 0 Z" fill="#8B4513"></path>
                                <rect x="12" y="15" width="10" height="10" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="32" y="15" width="10" height="10" fill="#87CEEB" opacity="0.8"></rect>
                                <circle cx="25" cy="38" r="3" fill="#6B4423"></circle>
                            </g>

                            {/* Village Hut 3 */}
                            <g transform="translate(240, 345)">
                                <rect x="0" y="0" width="55" height="45" fill="#D2691E" rx="3"></rect>
                                <path d="M-4 0 L 27.5 -32 L 59 0 Z" fill="#8B4513"></path>
                                <rect x="14" y="18" width="11" height="11" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="35" y="18" width="11" height="11" fill="#87CEEB" opacity="0.8"></rect>
                            </g>

                            {/* Trees around village */}
                            <g className="dust-particle" style={{ animationDelay: '0s' }}>
                                <rect x="50" y="280" width="8" height="60" fill="#6B4423"></rect>
                                <path d="M 54 280 Q 35 250 54 220 Q 73 250 54 280" fill="#228B22"></path>
                            </g>
                            <g className="dust-particle" style={{ animationDelay: '0.5s' }}>
                                <rect x="310" y="290" width="8" height="50" fill="#6B4423"></rect>
                                <path d="M 314 290 Q 300 270 314 245 Q 328 270 314 290" fill="#228B22"></path>
                            </g>
                        </g>

                        {/* WASTE COLLECTION PATH (Curved) */}
                        <path id="waste-path" d="M 80 340 Q 300 200 500 280 T 780 220"
                            stroke="#10B981" strokeWidth="3" fill="none" strokeDasharray="10 5" opacity="0.3"></path>

                        {/* TRUCK ON PATH */}
                        <g id="truck-element">
                            <rect x="-38" y="-16" width="40" height="16" fill="#2563EB" rx="2"></rect>
                            <rect x="-36" y="-13" width="36" height="10" fill="url(#ground-gradient)" opacity="0.5"></rect>
                            <rect x="2" y="-18" width="24" height="18" fill="#1F2937" rx="2"></rect>
                            <rect x="5" y="-15" width="8" height="8" fill="#87CEEB" opacity="0.9"></rect>
                            <rect x="15" y="-15" width="8" height="8" fill="#87CEEB" opacity="0.7"></rect>
                            <circle cx="-34" cy="2" r="6" fill="#111827"></circle>
                            <circle cx="-28" cy="2" r="6" fill="#111827"></circle>
                            <circle cx="4" cy="2" r="6" fill="#111827"></circle>
                            <circle cx="18" cy="2" r="6" fill="#111827"></circle>
                            <circle cx="-38" cy="-8" r="2" fill="#EF4444" opacity="0.8"></circle>
                            <circle cx="-38" cy="-2" r="2" fill="#EF4444" opacity="0.8"></circle>
                        </g>

                        {/* PROCESSING FACTORY (Destination) */}
                        <g id="factory" transform="translate(700, 200)">
                            <rect x="0" y="20" width="120" height="100" fill="#059669" rx="4"></rect>
                            <rect x="8" y="30" width="15" height="20" fill="#10B981"></rect>
                            <rect x="28" y="30" width="15" height="20" fill="#10B981"></rect>
                            <rect x="48" y="30" width="15" height="20" fill="#10B981"></rect>
                            <rect x="68" y="30" width="15" height="20" fill="#10B981"></rect>
                            <rect x="88" y="30" width="15" height="20" fill="#10B981"></rect>

                            <rect x="8" y="55" width="15" height="20" fill="#34D399"></rect>
                            <rect x="28" y="55" width="15" height="20" fill="#34D399"></rect>
                            <rect x="48" y="55" width="15" height="20" fill="#34D399"></rect>
                            <rect x="68" y="55" width="15" height="20" fill="#34D399"></rect>
                            <rect x="88" y="55" width="15" height="20" fill="#34D399"></rect>

                            <rect x="20" y="-20" width="12" height="40" fill="#1F2937" rx="2"></rect>
                            <circle className="chimney-smoke" cx="26" cy="-25" r="8" fill="#D1D5DB" opacity="0.7" style={{ animationDelay: '0s' }}></circle>
                            <circle className="chimney-smoke" cx="28" cy="-25" r="10" fill="#E5E7EB" opacity="0.5" style={{ animationDelay: '0.3s' }}></circle>
                            <circle className="chimney-smoke" cx="24" cy="-25" r="9" fill="#F3F4F6" opacity="0.4" style={{ animationDelay: '0.6s' }}></circle>

                            <rect x="85" y="-20" width="12" height="40" fill="#1F2937" rx="2"></rect>
                            <circle className="chimney-smoke" cx="91" cy="-25" r="8" fill="#D1D5DB" opacity="0.7" style={{ animationDelay: '0.5s' }}></circle>
                            <circle className="chimney-smoke" cx="93" cy="-25" r="10" fill="#E5E7EB" opacity="0.5" style={{ animationDelay: '0.8s' }}></circle>
                            <circle className="chimney-smoke" cx="89" cy="-25" r="9" fill="#F3F4F6" opacity="0.4" style={{ animationDelay: '1.1s' }}></circle>

                            <g transform="translate(60, 70)">
                                <circle cx="0" cy="0" r="15" fill="#FBBF24" opacity="0.8"></circle>
                                <path d="M -3,-8 L 4,-3 L 2,6 L -7,3 Z" fill="#059669" stroke="#059669" strokeWidth="1.5"></path>
                            </g>
                        </g>

                        {/* OUTPUT/PROCESSED GOODS */}
                        <g transform="translate(850, 320)">
                            <rect x="0" y="0" width="40" height="15" fill="#10B981" rx="2"></rect>
                            <rect x="0" y="18" width="40" height="15" fill="#34D399" rx="2"></rect>
                            <rect x="0" y="36" width="40" height="15" fill="#6EE7B7" rx="2"></rect>
                            <path d="M 50 20 L 65 20 M 60 15 L 65 20 L 60 25" stroke="#FBBF24" strokeWidth="2.5" fill="none" strokeLinecap="round"></path>
                            <circle cx="75" cy="20" r="10" fill="#FBBF24"></circle>
                            <text x="75" y="24" fontSize="12" fill="#1F2937" textAnchor="middle" fontWeight="bold">₹</text>
                        </g>
                    </svg>
                </div>

                {/* FULL WIDTH TITLE SECTION */}
                <div className="relative z-10 w-full pt-20 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-4">
                            Transforming Waste into <span className="text-green-600 transition-opacity duration-300">{toggleWord}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-2 font-medium">
                            छत्तीसगढ़ के लिए एक एकीकृत प्लास्टिक अपशिष्ट प्रबंधन मंच
                        </p>
                        <p className="text-lg md:text-xl text-slate-500 mb-12">
                            An Integrated Plastic Waste Management Platform for Chhattisgarh
                        </p>

                        <div className="flex flex-wrap justify-center items-center gap-6">
                            <Link to="/login" className="btn-primary-new flex items-center gap-2">
                                Get Started <ArrowRight className="w-5 h-5" />
                            </Link>
                            <button className="btn-secondary-new flex items-center gap-2">
                                <PlayCircle className="w-6 h-6 text-orange-500" /> Watch Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* KPI SECTION */}
                <div className="relative z-10 w-full pt-72 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="stat-card" style={{ animationDelay: '0s' }}>
                                <div className="stat-icon bg-gradient-to-br from-blue-400 to-blue-600">
                                    <Recycle className="w-8 h-8" />
                                </div>
                                <div className="stat-number">1250</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">Tons Processed</div>
                            </div>

                            <div className="stat-card" style={{ animationDelay: '0.2s' }}>
                                <div className="stat-icon bg-gradient-to-br from-green-400 to-green-600">
                                    <Map className="w-8 h-8" />
                                </div>
                                <div className="stat-number">100+</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">PWMUs Online</div>
                            </div>

                            <div className="stat-card" style={{ animationDelay: '0.4s' }}>
                                <div className="stat-icon bg-gradient-to-br from-amber-400 to-amber-600">
                                    <IndianRupee className="w-8 h-8" />
                                </div>
                                <div className="stat-number">120</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">Cr Revenue Generated</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
