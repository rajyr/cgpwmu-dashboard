import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, IndianRupee, Users, ShoppingCart, CheckCircle2, Calendar, MapPin } from 'lucide-react';

const VillageMonthlyReport = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [basicInfo, setBasicInfo] = useState({
        villageId: 'VIL-2024-042',
        villageName: 'Dhamtari Khas, Block A',
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0') // 01 to 12
    });

    const [salesInfo, setSalesInfo] = useState({
        recyclerType: '', // 'kabadiwala', 'vendor', 'recycler'
        wasteSold: '', // kg
        earningAmount: '' // Rs
    });

    const [expensesInfo, setExpensesInfo] = useState({
        numWorkers: '',
        honorariumPerWorker: '',
        otherExpenses: ''
    });

    // Option Definitions
    const months = [
        { val: '01', label: 'January' }, { val: '02', label: 'February' }, { val: '03', label: 'March' },
        { val: '04', label: 'April' }, { val: '05', label: 'May' }, { val: '06', label: 'June' },
        { val: '07', label: 'July' }, { val: '08', label: 'August' }, { val: '09', label: 'September' },
        { val: '10', label: 'October' }, { val: '11', label: 'November' }, { val: '12', label: 'December' }
    ];

    const years = ['2024', '2025', '2026'];

    // Handlers
    const handleBasicChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSalesChange = (e) => setSalesInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleExpensesChange = (e) => setExpensesInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const selectRecycler = (type) => setSalesInfo(prev => ({ ...prev, recyclerType: type }));

    // Calculations
    const totalHonorarium = (Number(expensesInfo.numWorkers) || 0) * (Number(expensesInfo.honorariumPerWorker) || 0);
    const totalExpenses = totalHonorarium + (Number(expensesInfo.otherExpenses) || 0);
    const totalEarnings = Number(salesInfo.earningAmount) || 0;
    const netBalance = totalEarnings - totalExpenses;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }, 1500);
    };

    if (showSuccess) {
        return (
            <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center flex flex-col items-center animate-fade-in-up border border-green-100">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Monthly Report Saved!</h2>
                    <p className="text-gray-500 mb-6">Financial and operational data for {basicInfo.villageName} recorded successfully.</p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#f4f7f6] p-4 lg:p-8 pb-32">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Village Monthly Report</h1>
                        </div>
                        <p className="text-gray-500 text-sm pl-12 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-600" /> {basicInfo.villageName}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <select
                            name="month" value={basicInfo.month} onChange={handleBasicChange}
                            className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 text-right cursor-pointer outline-none"
                        >
                            {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                        </select>
                        <select
                            name="year" value={basicInfo.year} onChange={handleBasicChange}
                            className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 md:pl-2 cursor-pointer outline-none md:border-l md:border-gray-300"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Sales to Recyclers */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">Disposal & Revenue</h2>
                        </div>
                        <div className="p-6 space-y-6">

                            {/* Recycler Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Where was the segregated waste sold?</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { id: 'kabadiwala', label: 'Local Kabadiwala', desc: 'Informal scrap dealer' },
                                        { id: 'vendor', label: 'Registered Vendor', desc: 'Authorized aggregator' },
                                        { id: 'recycler', label: 'Direct to Recycler', desc: 'Processing facility' }
                                    ].map(type => (
                                        <div
                                            key={type.id}
                                            onClick={() => selectRecycler(type.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${salesInfo.recyclerType === type.id
                                                    ? 'border-green-500 bg-green-50 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className={`font-bold ${salesInfo.recyclerType === type.id ? 'text-green-700' : 'text-gray-800'}`}>{type.label}</h3>
                                                {salesInfo.recyclerType === type.id && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                            </div>
                                            <p className="text-xs text-gray-500">{type.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sales Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Waste Sold (kg)</label>
                                    <div className="relative">
                                        <input
                                            type="number" name="wasteSold" value={salesInfo.wasteSold} onChange={handleSalesChange} required min="0" placeholder="0"
                                            className="w-full p-2.5 pl-3 pr-8 bg-white border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">kg</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Revenue Earned (₹)</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        <input
                                            type="number" name="earningAmount" value={salesInfo.earningAmount} onChange={handleSalesChange} required min="0" placeholder="0"
                                            className="w-full p-2.5 pl-8 bg-white border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono text-green-700 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Section 2: Honorarium & Expenses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">Swachhata Workers & Expenses</h2>
                        </div>
                        <div className="p-6 space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Workers Count */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Swachhata Workers</label>
                                    <input
                                        type="number" name="numWorkers" value={expensesInfo.numWorkers} onChange={handleExpensesChange} required min="0" placeholder="0"
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Active workers during this month</p>
                                </div>

                                {/* Honorarium Per Worker */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Honorarium per Worker (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                        <input
                                            type="number" name="honorariumPerWorker" value={expensesInfo.honorariumPerWorker} onChange={handleExpensesChange} required min="0" placeholder="0"
                                            className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Amount paid to each individual</p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <div className="bg-blue-50/50 px-4 py-3 rounded-xl border border-blue-100 flex items-center gap-4 w-full md:w-auto mt-2">
                                    <span className="text-sm font-medium text-blue-800">Total Honorarium Calculated:</span>
                                    <span className="text-xl font-bold text-blue-700 font-mono border-b pb-0.5 border-blue-300">₹{totalHonorarium.toLocaleString()}</span>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Other Expenses */}
                            <div className="w-full md:w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Other Operating Expenses (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                    <input
                                        type="number" name="otherExpenses" value={expensesInfo.otherExpenses} onChange={handleExpensesChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 font-mono"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Transport, maintenance, etc.</p>
                            </div>

                        </div>
                    </div>

                    {/* Bottom Action Bar (Sticky) */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Summary Pill */}
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-4 text-sm font-bold border ${netBalance >= 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <span>Village Net Balance:</span>
                            <span className="text-xl font-mono tracking-tight">
                                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving || !salesInfo.recyclerType}
                                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        Save Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default VillageMonthlyReport;
