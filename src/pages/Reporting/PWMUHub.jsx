import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, FileBarChart, Bell, Calendar as CalendarIcon, Clock, CheckCircle2, AlertTriangle, ArrowRight, Factory, History, XCircle, ChevronLeft, ChevronRight, TrendingUp, Users, Activity } from 'lucide-react';

const PWMUHub = () => {
    const navigate = useNavigate();
    const currentDateObj = new Date();
    const today = currentDateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Mock Notifications
    const [notifications] = useState([
        { id: 1, type: 'warning', text: '3 linked villages have not submitted daily logs today.', unread: true },
        { id: 2, type: 'info', text: 'Monthly Performance Report is due in 4 days.', unread: true },
        { id: 3, type: 'success', text: 'Yesterday\'s daily log approved.', unread: false },
    ]);

    // Mock History
    const recentActivity = [
        { id: 101, title: 'Daily Waste Log', date: 'Yesterday, 5:30 PM', status: 'Submitted', icon: Truck },
        { id: 102, title: 'Daily Waste Log', date: '2 Days Ago, 6:00 PM', status: 'Approved', icon: Truck },
        { id: 103, title: 'Monthly Report (Previous Month)', date: 'Oct 2, 10:15 AM', status: 'Approved', icon: FileBarChart },
    ];

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const realToday = new Date();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Mock Calendar Data (Randomized slightly based on month for visual effect)
    const submittedDays = currentMonth === realToday.getMonth()
        ? [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26]
        : Array.from({ length: 20 }, () => Math.floor(Math.random() * 28) + 1); // Mock data for other months

    // Any day before today that isn't submitted is missed
    const missedDays = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => {
        const dDate = new Date(currentYear, currentMonth, d);
        return dDate < realToday && !submittedDays.includes(d);
    });

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    };

    return (
        <div className="animate-fade-in-up space-y-6 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#005DAA] to-[#0070CC] rounded-2xl p-6 lg:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Factory className="w-64 h-64" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome, Nodal Officer</h1>
                        <p className="text-blue-100 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 opacity-80" />
                            {today}
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></div>
                        <span className="font-semibold tracking-wide text-sm">BALOD CENTRAL PWMU ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions (Core Reporting) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Daily Log Card */}
                <div
                    onClick={() => navigate('/pwmu/daily-log')}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-[#005DAA]/30 group"
                >
                    <div className="w-14 h-14 bg-blue-50 text-[#005DAA] rounded-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-[#005DAA] group-hover:text-white transition-colors duration-300">
                        <Truck className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Daily Log</h2>
                    <p className="text-gray-500 mb-6 flex-grow">
                        Record daily plastic waste collection from your linked Gram Panchayats and Villages. Ensure all 35 connected bodies are accounted for.
                    </p>
                    <div className="flex items-center text-[#005DAA] font-semibold text-sm">
                        Start Data Entry
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

                {/* Monthly Report Card */}
                <div
                    onClick={() => navigate('/pwmu/monthly-report')}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500/30 group"
                >
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                        <FileBarChart className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Submit Monthly Report</h2>
                    <p className="text-gray-500 mb-6 flex-grow">
                        File your comprehensive monthly performance report including operational status, financial sales (revenue), and O&M expenses.
                    </p>
                    <div className="flex items-center text-green-600 font-semibold text-sm">
                        Start Data Entry
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ROW 1: Calendar & KPIs */}
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        {/* Submission Calendar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">Daily Submission Tracker</h3>

                                {/* Month Navigation */}
                                <div className="ml-4 flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                                    <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="px-3 text-sm font-semibold text-[#005DAA] min-w-[120px] text-center">
                                        {monthName}
                                    </div>
                                    <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold">
                                <div className="flex items-center gap-1.5 text-green-700">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div> Submitted
                                </div>
                                <div className="flex items-center gap-1.5 text-red-700">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div> Missed
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-200"></div> Pending
                                </div>
                            </div>
                        </div>

                        <div className="p-4 overflow-x-auto">
                            <div className="min-w-[400px]">
                                {/* Days of Week Header */}
                                <div className="grid grid-cols-7 gap-1.5 mb-2">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                                            {day}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1.5">
                                    {/* Empty slots for first day offset */}
                                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square"></div>
                                    ))}

                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const cellDate = new Date(currentYear, currentMonth, day);

                                        const isSubmitted = submittedDays.includes(day);
                                        const isMissed = missedDays.includes(day);
                                        const isFuture = cellDate > realToday && cellDate.toDateString() !== realToday.toDateString();
                                        const isToday = cellDate.toDateString() === realToday.toDateString();

                                        let bgClass = "bg-gray-50 border border-gray-100 hover:border-gray-200";
                                        let textClass = "text-gray-600";
                                        let icon = null;

                                        let cursorClass = "cursor-default";

                                        if (isSubmitted) {
                                            bgClass = "bg-green-50 border border-green-200 hover:border-green-300";
                                            textClass = "text-green-700 font-bold";
                                            icon = <CheckCircle2 className="w-4 h-4 text-green-500 opacity-50 absolute bottom-1 right-1" />;
                                        } else if (isMissed) {
                                            bgClass = "bg-red-50 border border-red-200 hover:border-red-300";
                                            textClass = "text-red-700 font-bold";
                                            icon = <XCircle className="w-4 h-4 text-red-400 opacity-50 absolute bottom-1 right-1" />;
                                            cursorClass = "cursor-pointer hover:shadow-md";
                                        } else if (isFuture) {
                                            bgClass = "bg-transparent border border-dashed border-gray-200 opacity-50";
                                            textClass = "text-gray-400";
                                        }

                                        const handleDayClick = () => {
                                            if (isMissed) {
                                                const formattedDate = `${currentDateObj.getFullYear()}-${String(currentDateObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                navigate(`/pwmu/daily-log?date=${formattedDate}`);
                                            }
                                        };

                                        return (
                                            <div
                                                key={day}
                                                onClick={handleDayClick}
                                                className={`group relative aspect-square rounded-xl p-1.5 flex flex-col items-center justify-center transition-all ${bgClass} ${cursorClass} ${isToday ? 'ring-2 ring-[#005DAA] ring-offset-2' : ''}`}
                                            >
                                                <span className={`text-[13px] ${textClass}`}>{day}</span>
                                                {/* Only show icon if not today to save space, or make it distinct */}
                                                {!isToday && icon}

                                                {/* Hover Stats Tooltip */}
                                                {(!isFuture) && (
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-900 border border-gray-700 text-white text-xs rounded-lg py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl flex flex-col items-center gap-1 scale-95 group-hover:scale-100 origin-bottom duration-200">
                                                        <div className="font-semibold text-gray-200">
                                                            {isSubmitted ? '35 / 35 Linked Bodies' : '0 / 35 Linked Bodies'}
                                                        </div>
                                                        <div className={isSubmitted ? "text-green-400" : "text-red-400"}>
                                                            {isSubmitted ? '100% Data Filled' : 'Data Missing - Click to Log'}
                                                        </div>
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
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
                </div>
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        {/* Weekly Performance KPIs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                                <TrendingUp className="w-5 h-5 text-[#005DAA]" />
                                <h3 className="font-bold text-gray-800">Weekly Performance</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Total Intake (This Week)</p>
                                        <h4 className="text-2xl font-bold text-[#005DAA]">1,240 <span className="text-sm font-medium text-gray-500">kg</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-[#005DAA]">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Active Reporting Rate</p>
                                        <h4 className="text-2xl font-bold text-green-700">92% <span className="text-xs text-green-600 ml-1">↑ 4%</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Users className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Total Secondary Transport</p>
                                        <h4 className="text-2xl font-bold text-orange-700">450 <span className="text-sm font-medium text-gray-500">kg</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1">Resource Recovery Rate</p>
                                        <h4 className="text-2xl font-bold text-purple-700">76% <span className="text-xs text-purple-600 ml-1">↑ 2%</span></h4>
                                    </div>
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        <Factory className="w-5 h-5" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2: Action Center & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        {/* Notifications & Action Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">Action Center & Alerts</h3>
                            </div>
                            {notifications.filter(n => n.unread).length > 0 && (
                                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {notifications.filter(n => n.unread).length} New
                                </span>
                            )}
                        </div>
                        <div className="p-4 flex-grow">
                            <div className="space-y-3">
                                {notifications.map(note => (
                                    <div key={note.id} className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${note.type === 'warning' ? 'bg-orange-50/50 border-orange-100' :
                                        note.type === 'info' ? 'bg-blue-50/50 border-blue-100' :
                                            'bg-green-50/50 border-green-100'
                                        }`}>
                                        <div className="mt-0.5 shrink-0">
                                            {note.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                                                note.type === 'info' ? <Clock className="w-5 h-5 text-blue-500" /> :
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                        </div>
                                        <div className="flex-grow">
                                            <p className={`text-sm ${note.unread ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                                {note.text}
                                            </p>
                                        </div>
                                        {note.unread && <div className="w-2 h-2 rounded-full bg-[#005DAA] shrink-0 mt-2"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <div className="flex-1 flex flex-col h-full">
                        {/* Recent History / Approvals */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">Recent History</h3>
                                </div>
                            </div>
                            <div className="p-4 flex-grow">
                                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-4">
                                    {recentActivity.map((item, index) => {
                                        return (
                                            <div key={item.id} className="relative pl-5">
                                                {/* Timeline Dot */}
                                                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${index === 0 ? 'bg-[#005DAA]' : 'bg-gray-300'
                                                    }`}></div>

                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-gray-800 leading-tight">
                                                            {item.title}
                                                        </h4>
                                                        <p className="text-[11px] text-gray-500 mt-0.5">{item.date}</p>
                                                    </div>
                                                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button className="w-full mt-2 py-2 text-xs font-semibold text-[#005DAA] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                                    View All History
                                </button>
                            </div>
                        </div>

                    </div>
                    </div>
                </div>
        </div>
    );
};

export default PWMUHub;
