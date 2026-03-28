import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Map, FileText, Activity, PieChart, Settings,
    TrendingUp, IndianRupee, Recycle, CheckCircle2, XCircle,
    Truck, Factory, Home, Building2, Zap, ShieldCheck,
    BarChart3, Users, PlayCircle
} from 'lucide-react';
import { useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
    const [scrolled, setScrolled] = useState(false);
    const [toggleWordIndex, setToggleWordIndex] = useState(0);
    const [stats, setStats] = useState({
        tons: 1250,
        pwmus: 100,
        revenue: 120,
        compliance: 98,
        recovery: 84.2
    });
    const svgRef = useRef(null);
    const { language, t } = useLanguage();

    const API_BASE = '/cgpwmu/api';
    const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    useEffect(() => {
        const fetchGlobalStats = async () => {
            try {
                const headers = { 'apikey': ANON_KEY };
                const [centersRes, reportsRes] = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=capacity_mt,waste_processed_mt,revenue,status`, { headers }),
                    fetch(`${API_BASE}/data/pwmu_operational_logs?select=total_intake_kg,revenue`, { headers })
                ]);

                if (centersRes.ok && reportsRes.ok) {
                    const centers = await centersRes.json();
                    const logs = await reportsRes.json();

                    const totalProcessed = centers.reduce((sum, c) => sum + (Number(c.waste_processed_mt) || 0), 0);
                    const totalRevenue = centers.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);
                    const activeCenters = centers.filter(c => c.status === 'operational').length;
                    
                    setStats({
                        tons: Math.round(totalProcessed) || 1250,
                        pwmus: centers.length || 100,
                        revenue: (totalRevenue / 10000000).toFixed(1) || 1.2, // Convert to Cr
                        compliance: 98, // Mocked for now
                        recovery: 82.5
                    });
                }
            } catch (err) {
                console.error('Landing stats fetch failed:', err);
            }
        };
        fetchGlobalStats();
    }, []);

    const translations = {
        en: {
            heroTitle: "Transforming Waste into",
            value: "Value",
            wealth: "Wealth",
            opportunity: "Opportunity",
            sustainability: "Sustainability",
            resources: "Resources",
            platformSubtitle: "An Integrated Plastic Waste Management Platform for Chhattisgarh",
            getStarted: "Get Started",
            watchDemo: "Watch Demo",
            tonsProcessed: "Tons Processed",
            pwmuOnline: "PWMUs Online",
            revenueGenerated: "Cr Revenue Generated",
            stateStatusTitle: "Current State Level Status",
            lastUpdated: "Last updated: Real-time",
            totalWasteMonth: "Total Waste This Month",
            plasticRecovered: "Plastic Recovery",
            totalRevenue: "Total Revenue Generated",
            machineFunctional: "Machine Functional",
            reportingCompliance: "Reporting Compliance",
            realityTitle: "The Reality",
            fragmentedInfra: "Fragmented infrastructure limits true potential.",
            problem1: "Paper-based error-prone reporting",
            problem2: "No district-level comparative analytics",
            problem3: "Zero visibility into machine downtime",
            problem4: "Opaque financial & operational metrics",
            digitalSolution: "The Digital Solution",
            solution1: "Real-time automated reporting",
            solution2: "District & Block level drilldown",
            solution3: "Machine health & usage intelligence",
            solution4: "End-to-end financial transparency",
            integratedWorkflow: "Integrated Digital Workflow",
            fourPortalsDesc: "Four integrated portals ensuring seamless accountability from source to disposal.",
            regPortal: "Registration Portal",
            regDesc: "Onboarding for PWMUs, Villages, and Vendors with verification.",
            repPortal: "Reporting Portal",
            repDesc: "Bilingual daily/monthly logging for waste tracking and operations.",
            monPortal: "Monitoring Portal",
            monDesc: "Compliance watchlists, machine uptime, and performance tracking.",
            anaPortal: "Analytics Dashboard",
            anaDesc: "State-level insights, geospatial heatmaps, and financial metrics.",
            liveTelemetry: "Live Telemetry View",
            geospatialTitle: "Statewide Geospatial Dashboard",
            geospatialDesc: "Hover interactions, district-level drilldowns, and material flow lines give officials unprecedented oversight.",
            flowLegend: "Material Flow Legend",
            hdpe: "Plastic Recovery",
            wetflow: "Wet / Organic Flow",
            ewaste: "E-Waste Transit",
            metals: "Ferrous Metals",
            topDistrict: "Top Performing District",
            topPWMU: "Highest Revenue PWMU",
            systemImpact: "System Impact",
            wasteDiverted: "Waste Diverted from Landfill",
            plasticGrowth: "Plastic Recovery Growth",
            revenueIncrease: "Revenue Increase (YoY)",
            downtimeReduced: "Machine Downtime Reduced",
            activeVendors: "Active Vendors Registered",
            machineIntel: "Machine Intelligence",
            machineMonitoring: "Machine Efficiency Monitoring",
            machineIntelDesc: "Track equipment uptime, schedule preventative maintenance, and visualize district breakdowns to minimize critical processing downtime.",
            serviceAlerts: "Automated service alerts",
            granularTracking: "Granular equipment tracking",
            predictCosts: "Predict maintenance costs",
            networkStatus: "NETWORK STATUS",
            functional: "Functional",
            issues: "ISSUES",
            down: "Down",
            needsRepair: "Needs Repair",
            optimal: "Optimal",
            analyticsEngine: "Analytics Engine",
            financialTrans: "Financial Transparency",
            financialDesc: "Complete visibility into revenue generation, vendor performance, and unit-level operational costs.",
            dataDriven: "Data driven decisions — not guesses.",
            revenueTracking: "Revenue/kg Tracking",
            omCost: "O&M Cost Visibility",
            roleEcosystem: "Role-Based Ecosystem",
            roleDesc: "Customized views and secure access levels for every platform stakeholder.",
            role1Title: "State Admin",
            role1Desc: "Full geospatial analytics, policy macro-views, system configs.",
            role2Title: "District Official",
            role2Desc: "Block level compliance, waste flow tracking, approvals.",
            role3Title: "PWMU Nodal",
            role3Desc: "Daily logs, machine status, vendor dispatch management.",
            role4Title: "Village Shed",
            role4Desc: "Household collection stats, local dashboard, swachhata attendance.",
            role5Title: "Vendor/Market",
            role5Desc: "Available stock viewing, purchase history, bids.",
            testimonial: "This platform has made reporting and monitoring completely transparent. We now have the ability to make decisions based on real-time data.",
            nodalOfficer: "Nodal Officer",
            ctaTitle: "Register your unit today and join the digital monitoring",
            ctaDesc: "Join the central network for transparent, efficient, and profitable plastic waste management.",
            regPWMU: "Register PWMU",
            regVillage: "Register Village",
            loginPortal: "Login Portal",
            durg: "Durg",
            balod: "Balod",
            durgCentral: "Durg Central PWMU",
            balodCentral: "Balod Central",
            intake: "Intake",
            stock: "Stock",
            viewLiveMap: "View Live Map",
            balingMachine: "Baling Machine",
            shredder: "Shredder",
            agglomerator: "Agglomerator",
            mixer: "Mixer",
            jan: "Jan",
            feb: "Feb",
            mar: "Mar",
            apr: "Apr",
            may: "May",
            jun: "Jun",
            jul: "Jul"
        },
        hi: {
            heroTitle: "अपशिष्ट से",
            value: "मूल्य-सृजन",
            wealth: "संपत्ति",
            opportunity: "अवसर",
            sustainability: "सतत विकास",
            resources: "संसाधन",
            platformSubtitle: "छत्तीसगढ़ के लिए एक एकीकृत प्लास्टिक अपशिष्ट प्रबंधन मंच",
            getStarted: "शुरू करें",
            watchDemo: "डेमो देखें",
            tonsProcessed: "टन संसाधित",
            pwmuOnline: "PWMU ऑनलाइन",
            revenueGenerated: "करोड़ राजस्व उत्पन्न",
            stateStatusTitle: "राज्य स्तर की वर्तमान स्थिति",
            lastUpdated: "अंतिम अपडेट: रीयल-टाइम",
            totalWasteMonth: "इस महीने कुल कचरा",
            plasticRecovered: "प्लास्टिक रिकवरी",
            totalRevenue: "कुल राजस्व उत्पन्न",
            machineFunctional: "मशीन कार्यात्मक",
            reportingCompliance: "रिपोर्टिंग अनुपालन",
            realityTitle: "वास्तविकता",
            fragmentedInfra: "खंडित बुनियादी ढांचा वास्तविक क्षमता को सीमित करता है।",
            problem1: "कागज आधारित त्रुटिपूर्ण रिपोर्टिंग",
            problem2: "कोई जिला-स्तरीय तुलनात्मक विश्लेषण नहीं",
            problem3: "मशीन डाउनटाइम में शून्य दृश्यता",
            problem4: "अपारदर्शी वित्तीय और परिचालन मेट्रिक्स",
            digitalSolution: "डिजिटल समाधान",
            solution1: "रीयल-टाइम स्वचालित रिपोर्टिंग",
            solution2: "जिला और ब्लॉक स्तर ड्रिलडाउन",
            solution3: "मशीन स्वास्थ्य और उपयोग बुद्धिमत्ता",
            solution4: "एंड-टू-एंड वित्तीय पारदर्शिता",
            integratedWorkflow: "एकीकृत डिजिटल कार्यप्रणाली",
            fourPortalsDesc: "स्रोत से निपटान तक निर्बाध जवाबदेही सुनिश्चित करने वाले चार एकीकृत पोर्टल।",
            regPortal: "पंजीकरण पोर्टल",
            regDesc: "सत्यापन के साथ PWMU, गांवों और विक्रेताओं के लिए ऑनबोर्डिंग।",
            repPortal: "रिपोर्टिंग पोर्टल",
            repDesc: "कचरा ट्रैकिंग और संचालन के लिए द्विभाषी दैनिक/मासिक लॉगिंग।",
            monPortal: "निगरानी पोर्टल",
            monDesc: "अनुपालन निगरानी सूची, मशीन अपटाइम, और प्रदर्शन ट्रैकिंग।",
            anaPortal: "एनालिटिक्स डैशबोर्ड",
            anaDesc: "राज्य-स्तरीय अंतर्दृष्टि, भू-स्थानिक हीटमैप और वित्तीय मेट्रिक्स।",
            liveTelemetry: "लाइव टेलीमेट्री दृश्य",
            geospatialTitle: "राज्यव्यापी भू-स्थानिक डैशबोर्ड",
            geospatialDesc: "होवर इंटरैक्शन, जिला-स्तरीय ड्रिलडाउन और सामग्री प्रवाह रेखाएं अधिकारियों को अभूतपूर्व निरीक्षण देती हैं।",
            flowLegend: "सामग्री प्रवाह लीजेंड",
            hdpe: "प्लास्टिक रिकवरी",
            wetflow: "गीला / जैविक प्रवाह",
            ewaste: "ई-कचरा पारगमन",
            metals: "लौह धातुएं",
            topDistrict: "सर्वश्रेष्ठ प्रदर्शन करने वाला जिला",
            topPWMU: "उच्चतम राजस्व वाला PWMU",
            systemImpact: "सिस्टम का प्रभाव",
            wasteDiverted: "लैंडफिल से हटाया गया कचरा",
            plasticGrowth: "प्लास्टिक रिकवरी वृद्धि",
            revenueIncrease: "राजस्व में वृद्धि (YoY)",
            downtimeReduced: "मशीन डाउनटाइम कम हुआ",
            activeVendors: "सक्रिय विक्रेता पंजीकृत",
            machineIntel: "मशीन इंटेलिजेंस",
            machineMonitoring: "मशीन कार्यक्षमता मॉनिटरिंग",
            machineIntelDesc: "महत्वपूर्ण प्रसंस्करण डाउनटाइम को कम करने के लिए उपकरणों के अपटाइम को ट्रैक करें, निवारक रखरखाव शेड्यूल करें और जिला विश्लेषण देखें।",
            serviceAlerts: "स्वचालित सेवा अलर्ट",
            granularTracking: "विस्तृत उपकरण ट्रैकिंग",
            predictCosts: "रखरखाव लागत का अनुमान",
            networkStatus: "नेटवर्क स्थिति",
            functional: "कार्यात्मक",
            issues: "मुद्दे",
            down: "डाउन",
            needsRepair: "मरम्मत की आवश्यकता",
            optimal: "सर्वश्रेष्ठ",
            analyticsEngine: "एनालिटिक्स इंजन",
            financialTrans: "वित्तीय पारदर्शिता",
            financialDesc: "राजस्व सृजन, विक्रेता प्रदर्शन और इकाई-स्तरीय परिचालन लागत में पूर्ण दृश्यता।",
            dataDriven: "डेटा आधारित निर्णय — अनुमानों पर नहीं।",
            revenueTracking: "राजस्व/किग्रा ट्रैकिंग",
            omCost: "O&M लागत दृश्यता",
            roleEcosystem: "भूमिका आधारित पारिस्थितिकी तंत्र",
            roleDesc: "प्रत्येक प्लेटफॉर्म हितधारक के लिए अनुकूलित विचार और सुरक्षित पहुंच स्तर।",
            role1Title: "राज्य प्रशासक",
            role1Desc: "पूर्ण भू-स्थानिक विश्लेषण, नीति मैक्रो-व्यू, सिस्टम कॉन्फ़िग।",
            role2Title: "जिला अधिकारी",
            role2Desc: "ब्लॉक स्तर अनुपालन, अपशिष्ट प्रवाह ट्रैकिंग, अनुमोदन।",
            role3Title: "PWMU नोडल",
            role3Desc: "दैनिक लॉग, मशीन की स्थिति, विक्रेता प्रेषण प्रबंधन।",
            role4Title: "ग्राम शेड",
            role4Desc: "घरेलू संग्रह के आंकड़े, स्थानीय डैशबोर्ड, स्वच्छता उपस्थिति।",
            role5Title: "विक्रेता/बाजार",
            role5Desc: "उपलब्ध स्टॉक देखना, खरीद इतिहास, बोलियां।",
            testimonial: "इस प्लेटफ़ॉर्म ने रिपोर्टिंग और मॉनिटरिंग को पूरी तरह से पारदर्शी बना दिया है। अब हमारे पास वास्तविक समय के डेटा के आधार पर निर्णय लेने की क्षमता है।",
            nodalOfficer: "नोडल अधिकारी",
            ctaTitle: "आज ही अपनी यूनिट पंजीकृत करें और डिजिटल मॉनिटरिंग से जुड़ें",
            ctaDesc: "पारदर्शी, कुशल और लाभदायक प्लास्टिक अपशिष्ट प्रबंधन के लिए केंद्रीय नेटवर्क में शामिल हों।",
            regPWMU: "PWMU रजिस्टर करें",
            regVillage: "गांव रजिस्टर करें",
            loginPortal: "लॉगिन पोर्टल",
            durg: "दुर्ग",
            balod: "बालोद",
            durgCentral: "दुर्ग सेंट्रल PWMU",
            balodCentral: "बालोद सेंट्रल",
            intake: "अंतर्ग्रहण (Intake)",
            stock: "स्टॉक",
            viewLiveMap: "लाइव मैप देखें",
            balingMachine: "बेलिंग मशीन",
            shredder: "श्रेडर",
            agglomerator: "एग्लोमेरेटर",
            mixer: "मिक्सर",
            jan: "जनवरी",
            feb: "फरवरी",
            mar: "मार्च",
            apr: "अप्रैल",
            may: "मई",
            jun: "जून",
            jul: "जुलाई"
        }
    };

    const words = language === 'en'
        ? [t('value', translations), t('wealth', translations), t('opportunity', translations), t('sustainability', translations), t('resources', translations)]
        : [t('opportunity', translations), t('sustainability', translations), t('value', translations), t('resources', translations)];

    // For seamless loop we add the first word at the end
    const animatedWords = [...words, words[0]];
    const [isTransitioning, setIsTransitioning] = useState(true);

    useEffect(() => {
        setToggleWordIndex(0);
    }, [language, words.length]);

    // ========== COIN ANIMATION LOGIC ==========
    const createCoinsAtFactory = () => {
        const svg = svgRef.current;
        if (!svg) return;
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

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setToggleWordIndex((prev) => (prev + 1) % animatedWords.length);
        }, 3000);

        if (toggleWordIndex === animatedWords.length - 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setToggleWordIndex(0);
            }, 1000);
            return () => {
                clearTimeout(timer);
                clearInterval(interval);
            };
        }

        const coinInterval = setInterval(() => {
            setTimeout(createCoinsAtFactory, 11500);
        }, 12000);

        const particleInterval = setInterval(createWasteParticle, 400);
        setTimeout(createCoinsAtFactory, 11500);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
            clearInterval(coinInterval);
            clearInterval(particleInterval);
        };
    }, [animatedWords.length, toggleWordIndex]);

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans selection:bg-green-600 selection:text-white overflow-x-hidden">
            {/* =========== HERO SECTION =========== */}
            <section className="hero-container relative">
                <div className="hero-bg-mesh"></div>
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ opacity: 0.8 }}>
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
                        <g id="particle-container"></g>
                        <rect width="1000" height="350" fill="url(#sky-gradient)"></rect>
                        <circle id="sun-circle" cx="100" cy="100" r="45" fill="#FBBF24" filter="url(#soft-shadow)"></circle>
                        <path d="M0 300 Q 250 200 500 300 T 1000 300 L 1000 350 L 0 350 Z" fill="#B5C99F" opacity="0.4"></path>
                        <path d="M0 350 Q 150 250 300 350 T 600 350 T 1000 320 L 1000 400 L 0 400 Z" fill="#A5D6A7" opacity="0.6"></path>
                        <rect y="400" width="1000" height="300" fill="url(#ground-gradient)"></rect>
                        <g id="village-left">
                            <g transform="translate(80, 340)">
                                <rect x="0" y="0" width="60" height="50" fill="#C46430" rx="3"></rect>
                                <path d="M-5 0 L 30 -35 L 65 0 Z" fill="#A0522D"></path>
                                <rect x="15" y="20" width="12" height="12" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="38" y="20" width="12" height="12" fill="#87CEEB" opacity="0.8"></rect>
                                <circle cx="30" cy="45" r="4" fill="#8B4513"></circle>
                            </g>
                            <g transform="translate(160, 350)">
                                <rect x="0" y="0" width="50" height="40" fill="#CD7F32" rx="3"></rect>
                                <path d="M-4 0 L 25 -28 L 54 0 Z" fill="#8B4513"></path>
                                <rect x="12" y="15" width="10" height="10" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="32" y="15" width="10" height="10" fill="#87CEEB" opacity="0.8"></rect>
                                <circle cx="25" cy="38" r="3" fill="#6B4423"></circle>
                            </g>
                            <g transform="translate(240, 345)">
                                <rect x="0" y="0" width="55" height="45" fill="#D2691E" rx="3"></rect>
                                <path d="M-4 0 L 27.5 -32 L 59 0 Z" fill="#8B4513"></path>
                                <rect x="14" y="18" width="11" height="11" fill="#87CEEB" opacity="0.8"></rect>
                                <rect x="35" y="18" width="11" height="11" fill="#87CEEB" opacity="0.8"></rect>
                            </g>
                            <g className="dust-particle" style={{ animationDelay: '0s' }}>
                                <rect x="50" y="280" width="8" height="60" fill="#6B4423"></rect>
                                <path d="M 54 280 Q 35 250 54 220 Q 73 250 54 280" fill="#228B22"></path>
                            </g>
                            <g className="dust-particle" style={{ animationDelay: '0.5s' }}>
                                <rect x="310" y="290" width="8" height="50" fill="#6B4423"></rect>
                                <path d="M 314 290 Q 300 270 314 245 Q 328 270 314 290" fill="#228B22"></path>
                            </g>
                        </g>
                        <path id="waste-path" d="M 80 340 Q 300 200 500 280 T 780 220" stroke="#10B981" strokeWidth="3" fill="none" strokeDasharray="10 5" opacity="0.3"></path>
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
                <div className="relative z-10 w-full pt-20 pb-12">
                    {/* Mobile-Only Logos Banner - More compact and larger logos */}
                    <div className="lg:hidden max-w-7xl mx-auto px-4 mb-10 flex justify-center animate-fade-in">
                        <div className="bg-white/30 backdrop-blur-xl px-6 py-2 rounded-full border border-white/40 shadow-xl flex items-center gap-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50"></div>
                            <div className="relative flex items-center gap-5">
                                <img
                                    src="/cgpwmu/assets/Logo/Chhattisgarh.webp"
                                    alt="Chhattisgarh Government"
                                    className="h-16 w-auto object-contain"
                                />
                                <div className="h-12 border-l border-white/60 mx-1"></div>
                                <img
                                    src="/cgpwmu/assets/Logo/unicef.webp"
                                    alt="UNICEF"
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight mb-4 flex flex-wrap justify-center items-center gap-x-1 tracking-tight">
                            <span>{t('heroTitle', translations)}</span>
                            <span className="relative inline-block h-[1.1em] overflow-hidden align-top text-green-600 min-w-[200px] md:min-w-[320px]">
                                <span
                                    className="flex flex-col"
                                    style={{
                                        transform: `translateY(-${toggleWordIndex * (100 / animatedWords.length)}%)`,
                                        transition: isTransitioning ? 'all 1000ms cubic-bezier(0.85, 0, 0.15, 1)' : 'none'
                                    }}
                                >
                                    {animatedWords.map((word, i) => (
                                        <span key={i} className="h-[1.1em] flex items-center justify-start whitespace-nowrap font-black italic tracking-tight">
                                            {word}
                                        </span>
                                    ))}
                                </span>
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 mb-2 font-medium">{t('platformSubtitle', translations)}</p>
                        <div className="flex flex-wrap justify-center items-center gap-6 mt-12">
                            <Link to="/login" className="btn-primary-new flex items-center gap-2">{t('getStarted', translations)} <ArrowRight className="w-5 h-5" /></Link>
                            <button className="btn-secondary-new flex items-center gap-2"><PlayCircle className="w-6 h-6 text-orange-500" /> {t('watchDemo', translations)}</button>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 w-full pt-72 pb-32">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="stat-card" style={{ animationDelay: '0s' }}>
                                <div className="stat-icon bg-gradient-to-br from-blue-400 to-blue-600"><Recycle className="w-8 h-8" /></div>
                                <div className="stat-number">{stats.tons.toLocaleString()}</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">{t('tonsProcessed', translations)}</div>
                            </div>
                            <div className="stat-card" style={{ animationDelay: '0.2s' }}>
                                <div className="stat-icon bg-gradient-to-br from-green-400 to-green-600"><Map className="w-8 h-8" /></div>
                                <div className="stat-number">{stats.pwmus}+</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">{t('pwmuOnline', translations)}</div>
                            </div>
                            <div className="stat-card" style={{ animationDelay: '0.4s' }}>
                                <div className="stat-icon bg-gradient-to-br from-amber-400 to-amber-600"><IndianRupee className="w-8 h-8" /></div>
                                <div className="stat-number">{stats.revenue}</div>
                                <div className="stat-label uppercase tracking-wider font-bold text-xs">{t('revenueGenerated', translations)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-white border-y border-gray-100 relative z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{t('stateStatusTitle', translations)}</h2>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {t('lastUpdated', translations)}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                        {[
                            { label: t('totalWasteMonth', translations), value: `${stats.tons} MT`, icon: <Recycle className="w-6 h-6 text-green-600" />, color: "bg-green-50", border: "border-green-100" },
                            { label: t('plasticRecovered', translations), value: `${stats.recovery}%`, icon: <PieChart className="w-6 h-6 text-blue-600" />, color: "bg-blue-50", border: "border-blue-100" },
                            { label: t('totalRevenue', translations), value: `₹${stats.revenue} Cr`, icon: <IndianRupee className="w-6 h-6 text-orange-600" />, color: "bg-orange-50", border: "border-orange-100" },
                            { label: t('machineFunctional', translations), value: "92%", icon: <Settings className="w-6 h-6 text-purple-600" />, color: "bg-purple-50", border: "border-purple-100" },
                            { label: t('reportingCompliance', translations), value: `${stats.compliance}%`, icon: <CheckCircle2 className="w-6 h-6 text-teal-600" />, color: "bg-teal-50", border: "border-teal-100" }
                        ].map((stat, i) => (
                            <div key={i} className={`p-5 rounded-2xl ${stat.color} border ${stat.border} hover:shadow-md transition-shadow relative overflow-hidden group`}>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-500">{stat.icon}</div>
                                <div className="mb-3">{stat.icon}</div>
                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gradient-to-b from-[#f4f7f6] to-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">{t('realityTitle', translations)}</h2>
                            <h3 className="text-4xl font-extrabold text-gray-900 leading-tight">{t('fragmentedInfra', translations)}</h3>
                            <div className="space-y-4 pt-4">
                                {[t('problem1', translations), t('problem2', translations), t('problem3', translations), t('problem4', translations)].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-600">
                                        <XCircle className="w-5 h-5 text-red-500" />
                                        <span className="font-medium">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                            <h2 className="text-green-600 font-bold tracking-widest uppercase text-sm mb-4">{t('digitalSolution', translations)}</h2>
                            <div className="space-y-6">
                                {[t('solution1', translations), t('solution2', translations), t('solution3', translations), t('solution4', translations)].map((text, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-green-600" /></div>
                                        <span className="font-bold text-gray-800">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-gray-900">{t('integratedWorkflow', translations)}</h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{t('fourPortalsDesc', translations)}</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: t('regPortal', translations), desc: t('regDesc', translations), icon: <Users className="w-8 h-8" />, color: "blue" },
                            { title: t('repPortal', translations), desc: t('repDesc', translations), icon: <FileText className="w-8 h-8" />, color: "green" },
                            { title: t('monPortal', translations), desc: t('monDesc', translations), icon: <Activity className="w-8 h-8" />, color: "amber" },
                            { title: t('anaPortal', translations), desc: t('anaDesc', translations), icon: <PieChart className="w-8 h-8" />, color: "indigo" }
                        ].map((portal, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all group">
                                <div className={`w-14 h-14 rounded-2xl bg-${portal.color}-100 text-${portal.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>{portal.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{portal.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16 mb-16">
                        <div className="flex-1">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{t('machineMonitoring', translations)}</h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">{t('machineIntelDesc', translations)}</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[t('serviceAlerts', translations), t('granularTracking', translations), t('predictCosts', translations)].map((text, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        <span className="font-bold text-gray-700">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full grid grid-cols-2 gap-4">
                            {[
                                { name: t('balingMachine', translations), status: t('functional', translations), efficiency: "94%", color: "green" },
                                { name: t('shredder', translations), status: t('needsRepair', translations), efficiency: "68%", color: "amber" },
                                { name: t('agglomerator', translations), status: t('functional', translations), efficiency: "91%", color: "green" },
                                { name: t('mixer', translations), status: t('down', translations), efficiency: "0%", color: "red" }
                            ].map((machine, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col justify-between group hover:shadow-lg transition-all">
                                    <div>
                                        <div className={`w-2 h-2 rounded-full bg-${machine.color}-500 mb-4 shadow-[0_0_8px_rgba(var(--tw-color-${machine.color}-500),0.5)]`}></div>
                                        <h4 className="font-bold text-gray-900 mb-1">{machine.name}</h4>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{machine.status}</p>
                                    </div>
                                    <div className="mt-8">
                                        <div className="flex items-end justify-between mb-2">
                                            <span className="text-2xl font-black text-gray-800">{machine.efficiency}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('optimal', translations)}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`h-full bg-${machine.color}-500 rounded-full`} style={{ width: machine.efficiency }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-24 bg-gradient-to-br from-green-600 to-green-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <svg className="w-full h-full" viewBox="0 0 400 400"><path d="M0 400 L400 400 L400 0 Z" fill="white" /></svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-white">
                        <div className="flex-1 max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">{t('ctaTitle', translations)}</h2>
                            <p className="text-green-100 text-lg mb-8 opacity-90">{t('ctaDesc', translations)}</p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/register-pwmu" className="px-10 py-5 rounded-2xl bg-white text-green-700 font-black text-lg shadow-2xl hover:-translate-y-1 transition-transform tracking-tight">{t('regPWMU', translations)}</Link>
                                <Link to="/register-village" className="px-10 py-5 rounded-2xl bg-green-900/30 backdrop-blur-md border border-green-400/30 text-white font-black text-lg shadow-2xl hover:-translate-y-1 transition-transform tracking-tight">{t('regVillage', translations)}</Link>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="w-64 h-64 md:w-80 md:h-80 relative group">
                                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20 group-hover:animate-none"></div>
                                <div className="absolute inset-4 bg-white/30 rounded-full animate-pulse group-hover:animate-none"></div>
                                <div className="absolute inset-10 bg-white rounded-full shadow-2xl flex items-center justify-center p-8 group-hover:scale-105 transition-transform">
                                    <Recycle className="w-full h-full text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
