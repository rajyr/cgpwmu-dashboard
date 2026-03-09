import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileBarChart, Bell, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, ArrowRight, Factory, History, XCircle, ChevronLeft, ChevronRight, TrendingUp, Users, Activity } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PWMUHub = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const hubTranslations = {
        en: {
            welcome: "Welcome, Nodal Officer",
            activeStatus: "BALOD CENTRAL PWMU ACTIVE",
            submitDailyLog: "Submit Daily Log",
            dailyDesc: "Record daily plastic waste collection from your linked Gram Panchayats and Villages. Ensure all 35 connected bodies are accounted for.",
            submitMonthly: "Submit Monthly Report",
            monthlyDesc: "File your comprehensive monthly performance report including operational status, financial sales (revenue), and O&M expenses.",
            startDataEntry: "Start Data Entry",
            dailyTracker: "Daily Submission Tracker",
            submitted: "Submitted",
            missed: "Missed",
            pending: "Pending",
            sun: "Sun", mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat",
            weeklyPerf: "Weekly Performance",
            totalIntake: "Total Intake (This Week)",
            reportingRate: "Active Reporting Rate",
            secondaryTransport: "Total Secondary Transport",
            recoveryRate: "Resource Recovery Rate",
            actionCenter: "Action Center & Alerts",
            newAlerts: "{count} New",
            recentHistory: "Recent History",
            viewAllHistory: "View All History",
            dataFilled: "100% Data Filled",
            dataMissing: "Data Missing - Click to Log",
            linkedBodies: "35 / 35 Linked Bodies",
            missedBodies: "0 / 35 Linked Bodies",
            dailyLogTitle: "Daily Waste Log",
            monthlyReportTitle: "Monthly Report (Previous Month)",
            statusSubmitted: "Submitted",
            statusApproved: "Approved",
            unsubmittedLogs: "3 linked villages have not submitted daily logs today.",
            monthlyDue: "Monthly Performance Report is due in 4 days.",
            logApproved: "Yesterday's daily log approved.",
            kg: "kg"
        },
        hi: {
            welcome: "स्वागत है, नोडल अधिकारी",
            activeStatus: "बालोद केंद्रीय PWMU सक्रिय",
            submitDailyLog: "दैनिक लॉग सबमिट करें",
            dailyDesc: "अपनी लिंक की गई ग्राम पंचायतों और गांवों से दैनिक प्लास्टिक कचरा संग्रह रिकॉर्ड करें। सुनिश्चित करें कि सभी 35 निकाय शामिल हैं।",
            submitMonthly: "मासिक रिपोर्ट सबमिट करें",
            monthlyDesc: "परिचालन स्थिति, वित्तीय बिक्री (राजस्व) और ओ एंड एम खर्चों सहित अपनी व्यापक मासिक प्रदर्शन रिपोर्ट दर्ज करें।",
            startDataEntry: "डेटा प्रविष्टि शुरू करें",
            dailyTracker: "दैनिक सबमिशन ट्रैकर",
            submitted: "सबमिट किया गया",
            missed: "छूट गया",
            pending: "लंबित",
            sun: "रवि", mon: "सोम", tue: "मंगल", wed: "बुध", thu: "गुरु", fri: "शुक्र", sat: "शनि",
            weeklyPerf: "साप्ताहिक प्रदर्शन",
            totalIntake: "कुल अंतर्ग्रहण (इस सप्ताह)",
            reportingRate: "सक्रिय रिपोर्टिंग दर",
            secondaryTransport: "कुल द्वितीयक परिवहन",
            recoveryRate: "संसाधन रिकवरी दर",
            actionCenter: "एक्शन सेंटर और अलर्ट",
            newAlerts: "{count} नए",
            recentHistory: "हाल का इतिहास",
            viewAllHistory: "पूरा इतिहास देखें",
            dataFilled: "100% डेटा भरा गया",
            dataMissing: "डेटा गायब - लॉग करने के लिए क्लिक करें",
            linkedBodies: "35 / 35 लिंक किए गए निकाय",
            missedBodies: "0 / 35 लिंक किए गए निकाय",
            dailyLogTitle: "दैनिक अपशिष्ट लॉग",
            monthlyReportTitle: "मासिक रिपोर्ट (पिछला महीना)",
            statusSubmitted: "सबमिट किया गया",
            statusApproved: "अनुमोदित",
            unsubmittedLogs: "3 लिंक किए गए गांवों ने आज दैनिक लॉग सबमिट नहीं किए हैं।",
            monthlyDue: "मासिक प्रदर्शन रिपोर्ट 4 दिनों में देय है।",
            logApproved: "कल का दैनिक लॉग स्वीकृत हो गया।",
            kg: "किलो"
        }
    };

    const currentDateObj = new Date();
    const today = currentDateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const [notifications] = useState([
        { id: 1, type: 'warning', text: t('unsubmittedLogs', hubTranslations), unread: true },
        { id: 2, type: 'info', text: t('monthlyDue', hubTranslations), unread: true },
        { id: 3, type: 'success', text: t('logApproved', hubTranslations), unread: false },
    ]);

    const recentActivity = [
        { id: 101, title: t('dailyLogTitle', hubTranslations), date: 'Yesterday, 5:30 PM', status: t('statusSubmitted', hubTranslations), icon: Truck },
        { id: 102, title: t('dailyLogTitle', hubTranslations), date: '2 Days Ago, 6:00 PM', status: t('statusApproved', hubTranslations), icon: Truck },
        { id: 103, title: t('monthlyReportTitle', hubTranslations), date: 'Oct 2, 10:15 AM', status: t('statusApproved', hubTranslations), icon: FileBarChart },
    ];

    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const realToday = new Date();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthName = currentDate.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { month: 'long', year: 'numeric' });

    const submittedDays = currentMonth === realToday.getMonth()
        ? [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26]
        : Array.from({ length: 20 }, () => Math.floor(Math.random() * 28) + 1);

    const missedDays = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => {
        const dDate = new Date(currentYear, currentMonth, d);
        return dDate < realToday && !submittedDays.includes(d);
    });

    const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

    return (
        <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#005DAA] to-[#0070CC] rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Factory className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{t('welcome', hubTranslations)}</h1>
                        <p className="text-blue-100 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 opacity-80" />
                            {today}
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                        <span className="font-semibold tracking-wide text-sm">{t('activeStatus', hubTranslations)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => navigate('/pwmu/daily-log')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#005DAA]/30 group">
                    <div className="w-14 h-14 bg-blue-50 text-[#005DAA] rounded-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-[#005DAA] group-hover:text-white transition-colors duration-300">
                        <Truck className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitDailyLog', hubTranslations)}</h2>
                    <p className="text-gray-500 mb-6 flex-grow">{t('dailyDesc', hubTranslations)}</p>
                    <div className="flex items-center text-[#005DAA] font-semibold text-sm">
                        {t('startDataEntry', hubTranslations)}
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

                <div onClick={() => navigate('/pwmu/monthly-report')} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500/30 group">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                        <FileBarChart className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitMonthly', hubTranslations)}</h2>
                    <p className="text-gray-500 mb-6 flex-grow">{t('monthlyDesc', hubTranslations)}</p>
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                        {t('startDataEntry', hubTranslations)}
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">{t('dailyTracker', hubTranslations)}</h3>
                                <div className="ml-4 flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="px-3 text-sm font-semibold text-[#005DAA] min-w-[120px] text-center">{monthName}</div>
                                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1.5 text-green-700">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div> {t('submitted', hubTranslations)}
                                </div>
                                <div className="flex items-center gap-1.5 text-red-700">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div> {t('missed', hubTranslations)}
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div> {t('pending', hubTranslations)}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 overflow-x-auto">
                            <div className="min-w-[400px]">
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {[t('sun', hubTranslations), t('mon', hubTranslations), t('tue', hubTranslations), t('wed', hubTranslations), t('thu', hubTranslations), t('fri', hubTranslations), t('sat', hubTranslations)].map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1.5">
                                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square"></div>
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const cellDate = new Date(currentYear, currentMonth, day);
                                        const isSubmitted = submittedDays.includes(day);
                                        const isMissed = missedDays.includes(day);
                                        const isToday = cellDate.toDateString() === realToday.toDateString();
                                        const isFuture = cellDate > realToday && !isToday;

                                        let bgClass = "bg-gray-50 border border-gray-100";
                                        let textClass = "text-gray-600";
                                        if (isSubmitted) { bgClass = "bg-green-50 border-green-200"; textClass = "text-green-700 font-bold"; }
                                        else if (isMissed) { bgClass = "bg-red-50 border-red-200"; textClass = "text-red-700 font-bold"; }
                                        else if (isFuture) { bgClass = "bg-transparent border-dashed opacity-50"; textClass = "text-gray-400"; }

                                        return (
                                            <div key={day} onClick={() => isMissed && navigate(`/pwmu/daily-log?date=${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                                                className={`relative aspect-square rounded-xl p-1.5 flex flex-col items-center justify-center transition-all ${bgClass} ${isMissed ? 'cursor-pointer hover:shadow-md' : 'cursor-default'} ${isToday ? 'ring-2 ring-[#005DAA] ring-offset-2' : ''}`}>
                                                <span className={`text-[13px] ${textClass}`}>{day}</span>
                                                {!isFuture && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-900 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                                        {isSubmitted ? t('linkedBodies', hubTranslations) : t('missedBodies', hubTranslations)}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                            <TrendingUp className="w-5 h-5 text-[#005DAA]" />
                            <h3 className="font-bold text-gray-800">{t('weeklyPerf', hubTranslations)}</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: t('totalIntake', hubTranslations), value: '1,240', unit: t('kg', hubTranslations), icon: Activity, color: 'blue' },
                                { label: t('reportingRate', hubTranslations), value: '92%', unit: '↑ 4%', icon: Users, color: 'green' },
                                { label: t('secondaryTransport', hubTranslations), value: '450', unit: t('kg', hubTranslations), icon: Truck, color: 'orange' },
                                { label: t('recoveryRate', hubTranslations), value: '76%', unit: '↑ 2%', icon: Factory, color: 'purple' }
                            ].map((kpi, idx) => (
                                <div key={idx} className={`bg-${kpi.color}-50/50 rounded-xl p-4 border border-${kpi.color}-100 flex items-center justify-between`}>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">{kpi.label}</p>
                                        <h4 className={`text-2xl font-bold text-${kpi.color}-700`}>{kpi.value} <span className="text-sm font-medium text-gray-500">{kpi.unit}</span></h4>
                                    </div>
                                    <div className={`w-10 h-10 bg-${kpi.color}-100 rounded-full flex items-center justify-center text-${kpi.color}-600`}>
                                        <kpi.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">{t('actionCenter', hubTranslations)}</h3>
                            </div>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                {t('newAlerts', hubTranslations).replace('{count}', notifications.filter(n => n.unread).length)}
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {notifications.map(note => (
                                <div key={note.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${note.type === 'warning' ? 'bg-orange-50/50 border-orange-100' : note.type === 'info' ? 'bg-blue-50/50 border-blue-100' : 'bg-green-50/50 border-green-100'}`}>
                                    <div className="mt-0.5 shrink-0">
                                        {note.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : note.type === 'info' ? <Clock className="w-5 h-5 text-blue-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div className="flex-grow">
                                        <p className={`text-sm ${note.unread ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{note.text}</p>
                                    </div>
                                    {note.unread && <div className="w-2 h-2 rounded-full bg-[#005DAA] shrink-0 mt-2"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                            <History className="w-5 h-5 text-gray-600" />
                            <h3 className="font-bold text-gray-800">{t('recentHistory', hubTranslations)}</h3>
                        </div>
                        <div className="p-4">
                            <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                                {recentActivity.map((item, index) => (
                                    <div key={item.id} className="relative pl-5">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${index === 0 ? 'bg-[#005DAA]' : 'bg-gray-300'}`}></div>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-800 leading-tight">{item.title}</h4>
                                                <p className="text-[11px] text-gray-500 mt-0.5">{item.date}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${item.status === t('statusApproved', hubTranslations) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-2 py-2 text-xs font-semibold text-[#005DAA] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">{t('viewAllHistory', hubTranslations)}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PWMUHub;
