import React, { useState } from 'react';
import {
    Home, Droplets, Trash2, CheckCircle2, XCircle,
    Banknote, Users, Activity, Target
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

function VillageDashboard() {
    const { userRole: authRole } = useAuth();
    // Default to 'Admin' for visual testing if context is somehow null
    const userRole = authRole || 'Admin';

    const [selectedVillage, setSelectedVillage] = useState(userRole === 'Village' ? 'Gunderdehi Village' : 'All Villages');

    // Mock Data - Specific Village
    const collectionData = [
        { name: 'Mon', wet: 120, dry: 80 },
        { name: 'Tue', wet: 130, dry: 85 },
        { name: 'Wed', wet: 115, dry: 75 },
        { name: 'Thu', wet: 140, dry: 90 },
        { name: 'Fri', wet: 125, dry: 85 },
        { name: 'Sat', wet: 150, dry: 100 },
        { name: 'Sun', wet: 110, dry: 70 },
    ];

    const workers = [
        { id: 1, name: 'Ramesh Kumar', role: 'Driver', status: 'Present', avatar: 'RK' },
        { id: 2, name: 'Suresh Singh', role: 'Helper', status: 'Present', avatar: 'SS' },
        { id: 3, name: 'Anita Devi', role: 'Sorter', status: 'Absent', avatar: 'AD' },
        { id: 4, name: 'Geeta Bai', role: 'Sorter', status: 'Present', avatar: 'GB' },
    ];

    const targetKg = 250;
    const currentKg = 210;
    const progressPercent = Math.round((currentKg / targetKg) * 100);

    return (
        <div className="space-y-6">
            {/* Header: My Village or State Overview */}
            <div className={`flex flex-col ${userRole !== 'Village' ? 'lg:flex-row' : ''} justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${selectedVillage === 'All Villages' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-blue-50 text-[#005DAA] border-blue-100'}`}>
                        {selectedVillage === 'All Villages' ? <Activity className="w-8 h-8" /> : <Home className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {selectedVillage === 'All Villages' ? 'State Village Directory' : selectedVillage}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {selectedVillage === 'All Villages'
                                ? 'Overview of all registered Gram Panchayats and their collection metrics.'
                                : 'Gram Panchayat: Gunderdehi • Block: Gunderdehi • District: Balod'}
                        </p>
                    </div>
                </div>

                {/* Conditional Admin Location Filters viewable by Nodal/Admin/PWMU to change Villages */}
                {userRole !== 'Village' && (
                    <div className="flex flex-wrap lg:flex-nowrap bg-gray-50 border border-gray-200 rounded-lg p-1 overflow-x-auto w-full lg:w-auto hide-scrollbar">
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>District Wise</option>
                            <option>Balod</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>Block Wise</option>
                            <option>Gunderdehi</option>
                        </select>
                        <select
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            value={selectedVillage}
                            onChange={(e) => setSelectedVillage(e.target.value)}
                        >
                            <option value="All Villages">All Villages</option>
                            <option value="Gunderdehi Village">Gunderdehi Village</option>
                            <option value="Mowa Village">Mowa Village</option>
                        </select>
                    </div>
                )}
            </div>

            {/* If 'All Villages' is selected, show Directory View. Else show Specific Village details. */}
            {selectedVillage === 'All Villages' ? (
                <div className="space-y-6">
                    {/* Aggregated KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Home className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">Total Registered Villages</p>
                                <p className="text-2xl font-bold text-gray-800">1,245</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Droplets className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">State Avg. Daily Waste</p>
                                <p className="text-2xl font-bold text-gray-800">850 <span className="text-sm">MT</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">Total User Charge</p>
                                <p className="text-2xl font-bold text-gray-800">₹8.5L</p>
                            </div>
                        </div>
                    </div>

                    {/* Directory Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Village Performance Directory</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                        <th className="p-4 font-medium">Village Name</th>
                                        <th className="p-4 font-medium">District</th>
                                        <th className="p-4 font-medium">Daily Avg (kg)</th>
                                        <th className="p-4 font-medium">User Charge</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">Gunderdehi Village</td>
                                        <td className="p-4">Balod</td>
                                        <td className="p-4">210 kg</td>
                                        <td className="p-4 text-green-600 font-medium">₹12,450</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span></td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setSelectedVillage('Gunderdehi Village')} className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">Mowa Village</td>
                                        <td className="p-4">Raipur</td>
                                        <td className="p-4">340 kg</td>
                                        <td className="p-4 text-green-600 font-medium">₹18,200</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Active</span></td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setSelectedVillage('Mowa Village')} className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">Kurud Village</td>
                                        <td className="p-4">Dhamtari</td>
                                        <td className="p-4">95 kg</td>
                                        <td className="p-4 text-red-500 font-medium">₹2,100</td>
                                        <td className="p-4"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Pending Log</span></td>
                                        <td className="p-4 text-right">
                                            <button className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Today's Summary & Financials */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Today's Summary */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-[#005DAA]" />
                                    <h3 className="font-bold text-gray-800">Today's Collection Summary</h3>
                                </div>
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Submitted
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 mb-8">
                                <div className="flex-1 bg-green-50/50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Droplets className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Wet Waste</p>
                                        <h4 className="text-2xl font-bold text-green-700">125 <span className="text-sm text-green-600 font-medium">kg</span></h4>
                                    </div>
                                </div>
                                <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#005DAA]">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Dry Waste</p>
                                        <h4 className="text-2xl font-bold text-[#005DAA]">85 <span className="text-sm text-blue-600 font-medium">kg</span></h4>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-bold text-gray-700">Daily Target Progress</span>
                                    <span className="text-sm font-bold text-[#005DAA]">{currentKg} / {targetKg} kg</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div className="bg-[#005DAA] h-3 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${progressPercent}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Weekly Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity className="w-5 h-5 text-gray-600" />
                                <h3 className="font-bold text-gray-800">7-Day Collection Trend</h3>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={collectionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#F3F4F6' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Bar dataKey="wet" name="Wet Waste" stackId="a" fill="#28A745" radius={[0, 0, 4, 4]} barSize={30} />
                                        <Bar dataKey="dry" name="Dry Waste" stackId="a" fill="#005DAA" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Workers & Finance */}
                    <div className="space-y-6">

                        {/* Financials (User Charge) */}
                        <div className="bg-gradient-to-br from-[#005DAA] to-blue-800 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <Banknote className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="font-semibold text-blue-50">User Charge Collected</h3>
                            </div>
                            <p className="text-4xl font-bold mb-2">₹12,450</p>
                            <p className="text-sm text-blue-100/80">This Month (July 2024)</p>

                            <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-blue-100/70 mb-1">Target</p>
                                    <p className="font-semibold text-sm">₹15,000</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-blue-100/70 mb-1">Collection Rate</p>
                                    <p className="font-semibold text-sm">83%</p>
                                </div>
                            </div>
                        </div>

                        {/* Swachhata Workers */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">Swachhata Workers</h3>
                                </div>
                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">3/4 Present</span>
                            </div>
                            <div className="p-2">
                                {workers.map((worker) => (
                                    <div key={worker.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ring-2 ring-offset-2 transition-all ${worker.status === 'Present' ? 'bg-green-500 ring-green-100' : 'bg-gray-400 ring-gray-100 grayscale'
                                                }`}>
                                                {worker.avatar}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm">{worker.name}</p>
                                                <p className="text-xs text-gray-500 font-medium">{worker.role}</p>
                                            </div>
                                        </div>
                                        <div>
                                            {worker.status === 'Present' ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default VillageDashboard;
