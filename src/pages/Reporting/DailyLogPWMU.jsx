import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Truck, Save, CheckCircle2, TrendingUp, Search } from 'lucide-react';

const DailyLogPWMU = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get date from query params or default to today
    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');
    const today = new Date().toISOString().split('T')[0];

    const [selectedDate, setSelectedDate] = useState(dateParam || today);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Update state if URL changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newDate = params.get('date');
        if (newDate) {
            setSelectedDate(newDate);
        }
    }, [location.search]);

    // Mock data for linked villages
    // In a real app, this would be fetched based on the logged-in PWMU's ID
    const [villages, setVillages] = useState([
        { id: 'v1', name: 'Amora', type: 'Gram Panchayat', autoFilled: true, value: 120 },
        { id: 'v2', name: 'Borsi', type: 'Village', autoFilled: false, value: '' },
        { id: 'v3', name: 'Dondi', type: 'Gram Panchayat', autoFilled: false, value: '' },
        { id: 'v4', name: 'Gunderdehi', type: 'Block', autoFilled: true, value: 450 },
        { id: 'v5', name: 'Gurur', type: 'Gram Panchayat', autoFilled: false, value: '' },
        { id: 'v6', name: 'Sanjari', type: 'Village', autoFilled: false, value: '' },
    ]);

    const handleValueChange = (id, newValue) => {
        setVillages(prev => prev.map(v =>
            v.id === id ? { ...v, value: newValue } : v
        ));
    };

    const totalIntake = villages.reduce((sum, v) => sum + (Number(v.value) || 0), 0);

    const filteredVillages = villages.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsSaved(true);
            setTimeout(() => {
                navigate('/dashboard/pwmu');
            }, 2000);
        }, 1200);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto animate-fade-in-up">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <Truck className="w-7 h-7 text-[#005DAA]" />
                        Daily Waste Intake Log
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Record daily plastic waste collection from linked Gram Panchayats and Villages.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block w-full pl-10 p-2.5 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Top Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <TrendingUp className="w-20 h-20" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 mb-2 z-10">Total Intake Today</span>
                    <div className="flex items-baseline gap-2 z-10 transition-all duration-300">
                        <span className="text-4xl font-bold text-gray-900">{totalIntake}</span>
                        <span className="text-sm font-medium text-gray-500">kg</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
                    <span className="text-sm font-medium text-gray-500 mb-2 z-10">Reporting Villages</span>
                    <div className="flex items-baseline gap-2 z-10">
                        <span className="text-4xl font-bold text-gray-900">
                            {villages.filter(v => v.value !== '').length}
                        </span>
                        <span className="text-sm font-medium text-gray-500">/ {villages.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden mb-auto justify-center">
                    {!isSaved ? (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm flex items-center justify-center transition-all ${isSaving ? 'bg-[#00427A] opacity-90' : 'bg-[#005DAA] hover:bg-[#00427A]'}`}
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Save Daily Log
                                </div>
                            )}
                        </button>
                    ) : (
                        <div className="w-full py-3 px-4 rounded-lg font-medium text-white bg-[#28A745] shadow-sm flex items-center justify-center animate-fade-in-up">
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Saved Successfully
                        </div>
                    )}
                </div>
            </div>

            {/* Data Entry Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="font-semibold text-gray-800">Linked Villages & GPs</h2>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search village..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#005DAA] focus:border-[#005DAA] block w-full sm:w-64 pl-9 p-2"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-sm text-left text-gray-600 min-w-[600px]">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Location Name (स्थान का नाम)</th>
                                <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Type (प्रकार)</th>
                                <th scope="col" className="px-4 md:px-6 py-4 font-semibold">Status/Source (स्थिति/स्रोत)</th>
                                <th scope="col" className="px-4 md:px-6 py-4 font-semibold text-right">Intake kg (मात्रा किलो में)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredVillages.map((village) => (
                                <tr key={village.id} className="hover:bg-gray-50 transition-colors group border-b border-gray-50/50 last:border-0">
                                    <td className="px-4 md:px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {village.name}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {village.type}
                                    </td>
                                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                        {village.autoFilled ? (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Auto-filled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                Manual Entry
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 md:px-6 py-3 text-right">
                                        <div className="flex justify-end items-center">
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={village.value}
                                                onChange={(e) => handleValueChange(village.id, e.target.value)}
                                                disabled={village.autoFilled}
                                                placeholder="0"
                                                className={`w-28 text-right p-2 border rounded-lg focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] transition-colors
                                                    ${village.autoFilled
                                                        ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed font-semibold'
                                                        : 'bg-white border-gray-300 text-gray-900 font-medium'
                                                    }`}
                                            />
                                            <span className="ml-2 text-gray-400 font-medium w-4">kg</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredVillages.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        No linked villages matching "{searchTerm}" found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-blue-50/50 border-t border-blue-100 font-semibold text-gray-900">
                            <tr>
                                <td colSpan="3" className="px-4 md:px-6 py-4 text-right">Daily Total:</td>
                                <td className="px-4 md:px-6 py-4 text-right text-lg text-[#005DAA]">
                                    {totalIntake.toFixed(1)} <span className="text-sm font-medium text-gray-500">kg</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DailyLogPWMU;
