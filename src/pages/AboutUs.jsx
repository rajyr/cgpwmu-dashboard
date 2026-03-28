import React, { useEffect, useState } from 'react';
import { Leaf, Recycle, MapPin, Factory, Users, Handshake, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
    const [scrolledIndex, setScrolledIndex] = useState(-1);
    const { t } = useLanguage();

    const aboutTranslations = {
        en: {
            titlePart1: "A Vision for a Cleaner",
            titlePart2: "Chhattisgarh",
            heroDesc: "The CG-PWMU Digital Platform is a collaborative initiative designed to bring transparency, efficiency, and sustainability to rural plastic waste management.",
            partnershipTitle: "The Partnership",
            partnershipDesc: "A strategic alliance between the Government of Chhattisgarh and UNICEF. Combining state infrastructure with global expertise to establish a robust, circular waste economy.",
            missionTitle: "Our Mission",
            missionDesc: "To empower Village Panchayats, digitize waste tracking, prevent environmental leakage, and create sustainable livelihoods through the organized monetization of recyclable materials.",
            howItWorks: "How It Works",
            howItWorksDesc: "The lifecycle of rural plastic waste managed through our platform.",
            sourceTitle: "Source Collection",
            sourceDesc: "Segregated waste is collected daily from rural households by trained Swachhata workers.",
            secondaryTitle: "Secondary Segregation",
            secondaryDesc: "Waste arrives at the Gram Panchayat sheds for further sorting and temporary storage.",
            pwmuTitle: "PWMU Processing",
            pwmuDesc: "Transported to Central Plastic Waste Management Units (PWMU) for baling, shredding, and recovery.",
            sustainableTitle: "Sustainable Disposal",
            sustainableDesc: "Baled plastic is sold to registered recyclers or forwarded for use in road construction.",
            readyTitle: "Ready to make a difference?",
            readyDesc: "Join the network of Gram Panchayats and recyclers working to create a circular economy in Chhattisgarh.",
            getInvolved: "Get Involved"
        },
        hi: {
            titlePart1: "एक स्वच्छ",
            titlePart2: "छत्तीसगढ़ के लिए विजन",
            heroDesc: "CG-PWMU डिजिटल प्लेटफ़ॉर्म एक सहयोगी पहल है जिसे ग्रामीण प्लास्टिक अपशिष्ट प्रबंधन में पारदर्शिता, दक्षता और स्थिरता लाने के लिए डिज़ाइन किया गया है।",
            partnershipTitle: "साझेदारी",
            partnershipDesc: "छत्तीसगढ़ सरकार और यूनिसेफ के बीच एक रणनीतिक गठबंधन। एक मजबूत, चक्रीय अपशिष्ट अर्थव्यवस्था स्थापित करने के लिए वैश्विक विशेषज्ञता के साथ राज्य के बुनियादी ढांचे का संयोजन।",
            missionTitle: "हमारा मिशन",
            missionDesc: "ग्राम पंचायतों को सशक्त बनाना, अपशिष्ट ट्रैकिंग को डिजिटल बनाना, पर्यावरणीय रिसाव को रोकना और पुनर्चक्रण योग्य सामग्रियों के व्यवस्थित मुद्रीकरण के माध्यम से स्थायी आजीविका बनाना।",
            howItWorks: "यह कैसे काम करता है",
            howItWorksDesc: "हमारे मंच के माध्यम से प्रबंधित ग्रामीण प्लास्टिक कचरे का जीवनचक्र।",
            sourceTitle: "स्रोत संग्रह",
            sourceDesc: "प्रशिक्षित स्वच्छता कार्यकर्ताओं द्वारा ग्रामीण परिवारों से प्रतिदिन अलग-अलग कचरा एकत्र किया जाता है।",
            secondaryTitle: "द्वितीयक पृथक्करण",
            secondaryDesc: "आगे की छंटाई और अस्थायी भंडारण के लिए कचरा ग्राम पंचायत शेड में पहुंचता है।",
            pwmuTitle: "PWMU प्रसंस्करण",
            pwmuDesc: "बेलिंग, श्रेडिंग और रिकवरी के लिए केंद्रीय प्लास्टिक अपशिष्ट प्रबंधन इकाइयों (PWMU) को ले जाया गया।",
            sustainableTitle: "सतत निपटान",
            sustainableDesc: "बेली हुई प्लास्टिक को पंजीकृत रिसाइकलर्स को बेचा जाता है या सड़क निर्माण में उपयोग के लिए भेजा जाता है।",
            readyTitle: "बदलाव लाने के लिए तैयार हैं?",
            readyDesc: "छत्तीसगढ़ में एक चक्रीय अर्थव्यवस्था बनाने के लिए काम कर रहे ग्राम पंचायतों और पुनर्चक्रणकर्ताओं के नेटवर्क में शामिल हों।",
            getInvolved: "शामिल हों"
        }
    };

    // Simulate scroll-based animation for timeline
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 600) setScrolledIndex(3);
            else if (scrollY > 400) setScrolledIndex(2);
            else if (scrollY > 200) setScrolledIndex(1);
            else if (scrollY > 50) setScrolledIndex(0);
            else setScrolledIndex(-1);
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const timelineSteps = [
        {
            title: t('sourceTitle', aboutTranslations),
            desc: t('sourceDesc', aboutTranslations),
            icon: <MapPin className="w-6 h-6" />,
            color: "bg-blue-500",
            lightColor: "bg-blue-100",
            textColor: "text-blue-600"
        },
        {
            title: t('secondaryTitle', aboutTranslations),
            desc: t('secondaryDesc', aboutTranslations),
            icon: <Users className="w-6 h-6" />,
            color: "bg-orange-500",
            lightColor: "bg-orange-100",
            textColor: "text-orange-600"
        },
        {
            title: t('pwmuTitle', aboutTranslations),
            desc: t('pwmuDesc', aboutTranslations),
            icon: <Factory className="w-6 h-6" />,
            color: "bg-purple-500",
            lightColor: "bg-purple-100",
            textColor: "text-purple-600"
        },
        {
            title: t('sustainableTitle', aboutTranslations),
            desc: t('sustainableDesc', aboutTranslations),
            icon: <Recycle className="w-6 h-6" />,
            color: "bg-green-500",
            lightColor: "bg-green-100",
            textColor: "text-green-600"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f4f7f6] pt-24 pb-20 font-sans">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

                {/* Hero / Vision Section */}
                <section className="text-center max-w-4xl mx-auto animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
                        {t('titlePart1', aboutTranslations)} <span className="text-[#005DAA] relative inline-block">
                            {t('titlePart2', aboutTranslations)}
                            <div className="absolute -bottom-2 left-0 w-full h-3 bg-orange-400/30 -rotate-1 skew-x-12"></div>
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-6">
                        {t('heroDesc', aboutTranslations)}
                    </p>

                    {/* Branding Logos - Relocated below description and enlarged */}
                    <div className="flex justify-center animate-fade-in mb-16">
                        <div className="bg-white/40 backdrop-blur-xl px-8 py-4 rounded-full border border-white shadow-xl flex items-center gap-8 group hover:bg-white/60 transition-all duration-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50"></div>
                            <div className="relative flex items-center gap-6">
                                <img
                                    src="/cgpwmu/assets/Logo/Chhattisgarh.webp"
                                    alt="Chhattisgarh Government"
                                    className="h-16 md:h-20 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                                />
                                <div className="h-12 border-l border-gray-300 mx-2 opacity-50"></div>
                                <img
                                    src="/cgpwmu/assets/Logo/unicef.webp"
                                    alt="UNICEF"
                                    className="h-12 md:h-16 w-auto object-contain transition-all duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 my-16">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <Handshake className="w-32 h-32" />
                            </div>
                            <div className="w-16 h-16 bg-[#005DAA]/10 rounded-2xl flex items-center justify-center mb-6">
                                <Handshake className="w-8 h-8 text-[#005DAA]" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('partnershipTitle', aboutTranslations)}</h3>
                            <p className="text-gray-600 leading-relaxed text-left">
                                {t('partnershipDesc', aboutTranslations)}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('missionTitle', aboutTranslations)}</h3>
                            <p className="text-gray-600 leading-relaxed text-left">
                                {t('missionDesc', aboutTranslations)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Process Timeline Infographic */}
                <section className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howItWorks', aboutTranslations)}</h2>
                        <p className="text-gray-600">{t('howItWorksDesc', aboutTranslations)}</p>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-1 bg-gray-200 -translate-x-1/2 rounded-full overflow-hidden">
                            <div
                                className="w-full bg-[#005DAA] transition-all duration-1000 ease-out"
                                style={{ height: `${(scrolledIndex + 1) * 25}%` }}
                            ></div>
                        </div>

                        <div className="space-y-12 relative z-10">
                            {timelineSteps.map((step, index) => {
                                const isActive = scrolledIndex >= index;
                                return (
                                    <div key={index} className={`flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-8'}`}>

                                        {/* Left Side (Empty on mobile, text on desktop for even items) */}
                                        <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'text-right pr-12' : 'pl-12 order-3'}`}>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>

                                        {/* Center Node */}
                                        <div className={`w-16 h-16 shrink-0 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-colors duration-500 z-10 ${isActive ? step.color + ' text-white' : 'bg-gray-200 text-gray-400'} ${index % 2 !== 0 ? 'md:order-2' : ''}`}>
                                            {step.icon}
                                        </div>

                                        {/* Right Side (Text on mobile, text on desktop for odd items) */}
                                        <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:hidden' : 'md:hidden'}`}>
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                                                {/* Mobile View Pointer */}
                                                <div className="absolute top-6 -left-3 w-6 h-6 bg-white border-l border-b border-gray-100 rotate-45 md:hidden"></div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                                <p className="text-gray-600">{step.desc}</p>
                                            </div>
                                        </div>

                                        {/* Desktop Card (Right align for Even) */}
                                        <div className={`hidden md:block w-1/2 ${index % 2 !== 0 ? 'text-left pl-12 order-3' : 'pr-12 order-1 opacity-0'}`}>
                                            {index % 2 !== 0 && (
                                                <>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                                    <p className="text-gray-600">{step.desc}</p>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="bg-[#005DAA] rounded-3xl p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('readyTitle', aboutTranslations)}</h2>
                        <p className="text-blue-100 text-lg">{t('readyDesc', aboutTranslations)}</p>
                        <div className="pt-4">
                            <NavLink to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#005DAA] font-bold text-lg hover:bg-gray-50 hover:shadow-lg hover:-translate-y-1 transition-all">
                                {t('getInvolved', aboutTranslations)} <ArrowRight className="w-5 h-5" />
                            </NavLink>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutUs;
