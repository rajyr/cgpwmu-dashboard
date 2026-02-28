import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Truck, ShoppingBasket, CheckCircle2, Calendar, MapPin, Search } from 'lucide-react';

const VillageDailyReport = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form State
    const [basicInfo, setBasicInfo] = useState({
        date: new Date().toISOString().split('T')[0],
        villageId: 'VIL-2024-042', // Simulated auto-populate by login ID
        villageName: 'Dhamtari Khas, Block A', // Simulated auto-populate
        collectionSource: 'door-to-door' // 'door-to-door' or 'shed'
    });

    const [wasteData, setWasteData] = useState({
        wet: { value: '', label: 'Wet Waste (गीला कचरा)', color: 'border-green-200 bg-green-50 focus-within:ring-green-500/20 focus-within:border-green-500', icon: 'bg-green-100 text-green-600' },
        plastic: { value: '', label: 'Plastic (प्लास्टिक)', color: 'border-blue-200 bg-blue-50 focus-within:ring-blue-500/20 focus-within:border-blue-500', icon: 'bg-blue-100 text-blue-600' },
        metal: { value: '', label: 'Metal (धातु)', color: 'border-gray-300 bg-gray-50 focus-within:ring-gray-500/20 focus-within:border-gray-500', icon: 'bg-gray-200 text-gray-700' },
        glass: { value: '', label: 'Glass (कांच)', color: 'border-teal-200 bg-teal-50 focus-within:ring-teal-500/20 focus-within:border-teal-500', icon: 'bg-teal-100 text-teal-600' },
        ewaste: { value: '', label: 'E-Waste (ई-कचरा)', color: 'border-orange-200 bg-orange-50 focus-within:ring-orange-500/20 focus-within:border-orange-500', icon: 'bg-orange-100 text-orange-600' },
        other: { value: '', label: 'Other/Mixed (अन्य/मिश्रित)', color: 'border-purple-200 bg-purple-50 focus-within:ring-purple-500/20 focus-within:border-purple-500', icon: 'bg-purple-100 text-purple-600' },
    });

    // Handlers
    const handleBasicInfoChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSourceChange = (source) => setBasicInfo(prev => ({ ...prev, collectionSource: source }));

    const handleWasteChange = (key, value) => {
        setWasteData(prev => ({
            ...prev,
            [key]: { ...prev[key], value: value }
        }));
    };

    // Calculations
    const totalWaste = Object.values(wasteData).reduce((sum, item) => sum + (Number(item.value) || 0), 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard'); // Go back to dashboard or stay on village dashboard
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Log Saved!</h2>
                    <p className="text-gray-500 mb-6">Waste collection data for {basicInfo.villageName} has been successfully submitted for {basicInfo.date}.</p>
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
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
                    {/* Decorative Background Icon */}
                    <div className="absolute -right-4 -top-8 opacity-5 transform rotate-12 pointer-events-none">
                        <Leaf className="w-48 h-48" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-green-600 text-white rounded-lg shadow-sm">
                                <Leaf className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Village Daily Log</h1>
                        </div>
                        <p className="text-gray-600 text-sm pl-12">Track segregated waste collection at the Gram Panchayat level.</p>
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <input
                                type="date"
                                name="date"
                                value={basicInfo.date}
                                onChange={handleBasicInfoChange}
                                className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 text-sm cursor-pointer outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-[#005DAA]/5 px-3 py-2 rounded-xl border border-[#005DAA]/10">
                            <MapPin className="w-4 h-4 text-[#005DAA]" />
                            <span className="text-sm font-semibold text-[#005DAA] truncate max-w-[150px]">{basicInfo.villageName}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Collection Source */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100">
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">Primary Collection Source</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    onClick={() => handleSourceChange('door-to-door')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${basicInfo.collectionSource === 'door-to-door'
                                        ? 'border-[#005DAA] bg-blue-50/50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${basicInfo.collectionSource === 'door-to-door' ? 'bg-[#005DAA] text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <Truck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${basicInfo.collectionSource === 'door-to-door' ? 'text-[#005DAA]' : 'text-gray-700'}`}>Door-to-Door</h3>
                                        <p className="text-xs text-gray-500 mt-1">Directly collected from households</p>
                                    </div>
                                    {basicInfo.collectionSource === 'door-to-door' && (
                                        <CheckCircle2 className="w-5 h-5 text-[#005DAA] ml-auto shrink-0" />
                                    )}
                                </div>

                                <div
                                    onClick={() => handleSourceChange('shed')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-4 transition-all duration-200 ${basicInfo.collectionSource === 'shed'
                                        ? 'border-[#005DAA] bg-blue-50/50 shadow-sm'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${basicInfo.collectionSource === 'shed' ? 'bg-[#005DAA] text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        <ShoppingBasket className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${basicInfo.collectionSource === 'shed' ? 'text-[#005DAA]' : 'text-gray-700'}`}>Shed Collection</h3>
                                        <p className="text-xs text-gray-500 mt-1">Collected at designated village points</p>
                                    </div>
                                    {basicInfo.collectionSource === 'shed' && (
                                        <CheckCircle2 className="w-5 h-5 text-[#005DAA] ml-auto shrink-0" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Segregated Waste Matrix */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">Segregated Quantities</h2>
                            <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded-md shadow-sm">Enter in Kg</span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(wasteData).map(([key, item]) => (
                                    <div
                                        key={key}
                                        className={`relative p-4 rounded-2xl border transition-all duration-200 group ${item.color} ${item.value ? 'shadow-sm' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.icon} shadow-sm group-hover:scale-110 transition-transform`}>
                                                {key === 'wet' && <Leaf className="w-5 h-5" />}
                                                {key === 'plastic' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" /><path d="M14 4h-4a2 2 0 0 0-2 2v4h8V6a2 2 0 0 0-2-2z" /></svg>}
                                                {key === 'metal' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>}
                                                {key === 'glass' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 5-5-5-5 5v3.5a1.5 1.5 0 0 0 .58 1.15l4.89 3.65v4.2A1.5 1.5 0 0 0 12 19h0a1.5 1.5 0 0 0 1.5-1.5v-4.2l4.89-3.65A1.5 1.5 0 0 0 19 8.5V5z" /><path d="M5 5h10" /></svg>}
                                                {key === 'ewaste' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="8" x="5" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 18h2" /><path d="M12 18h6" /></svg>}
                                                {key === 'other' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                                            </div>
                                            {item.value && <div className="w-2 h-2 rounded-full bg-current opacity-50"></div>}
                                        </div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2 truncate" title={item.label}>{item.label}</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={item.value}
                                                onChange={(e) => handleWasteChange(key, e.target.value)}
                                                min="0"
                                                placeholder="0.0"
                                                className="w-full bg-white/80 backdrop-blur-sm border border-transparent rounded-lg py-2 pl-3 pr-8 text-right font-mono text-gray-800 font-bold focus:outline-none shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] transition-shadow"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">kg</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Live Total Calculator */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Total Collected Today</span>
                                <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-md flex items-baseline gap-2">
                                    <span className="text-3xl font-black tracking-tighter">{totalWaste > 0 ? totalWaste.toFixed(1) : '0.0'}</span>
                                    <span className="text-sm font-bold text-gray-400">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar (Sticky) */}
                    <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex items-center justify-end gap-3">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving || totalWaste === 0}
                            className="px-8 py-2.5 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                        >
                            {isSaving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    Submit
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default VillageDailyReport;
