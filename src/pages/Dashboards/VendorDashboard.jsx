import React, { useState } from 'react';
import {
    Flame, Store, MapPin, Truck, ChevronRight,
    TrendingUp, CalendarCheck, PackageSearch
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

function VendorDashboard() {
    const { userRole: authRole } = useAuth();
    // Default to 'Admin' for visual testing if context is somehow null
    const userRole = authRole || 'Admin';

    const [selectedVendor, setSelectedVendor] = useState(userRole === 'Vendor' ? 'Raj Recyclers Hub' : 'All Vendors');

    // Mock Data
    const marketAvailability = [
        { id: 1, pwmu: 'Balod City PWMU', material: 'HDPE Plastic', stock: 1250, unit: 'kg', distance: '12 km', hot: true },
        { id: 2, pwmu: 'Durg Central PWMU', material: 'Mixed Paper', stock: 800, unit: 'kg', distance: '45 km', hot: false },
        { id: 3, pwmu: 'Bemetara PWMU', material: 'PET Bottles', stock: 2100, unit: 'kg', distance: '68 km', hot: true },
        { id: 4, pwmu: 'Gunderdehi PWMU', material: 'Scrap Metal', stock: 450, unit: 'kg', distance: '18 km', hot: false },
    ];

    const pickHistory = [
        { month: 'Jan', kg: 4500 },
        { month: 'Feb', kg: 5200 },
        { month: 'Mar', kg: 4800 },
        { month: 'Apr', kg: 6100 },
        { month: 'May', kg: 5900 },
        { month: 'Jun', kg: 7200 },
    ];

    return (
        <div className="space-y-6">
            {/* Header / State Overview */}
            <div className={`flex flex-col ${userRole !== 'Vendor' ? 'lg:flex-row' : ''} justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 ${selectedVendor === 'All Vendors' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {selectedVendor === 'All Vendors' ? <Store className="w-8 h-8" /> : <Store className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {selectedVendor === 'All Vendors' ? 'State Vendor Directory' : selectedVendor}
                        </h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            {selectedVendor === 'All Vendors'
                                ? 'Overview of all registered Market Partners and Recyclers.'
                                : 'Vendor ID: VEND-CG-4089 • Category: Plastic Recycler'}
                        </p>
                    </div>
                </div>

                {/* Conditional Admin Location Filters viewable by Nodal/Admin/PWMU to change Vendors */}
                {userRole !== 'Vendor' && (
                    <div className="flex flex-wrap lg:flex-nowrap bg-gray-50 border border-gray-200 rounded-lg p-1 overflow-x-auto w-full lg:w-auto hide-scrollbar">
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>District Wise</option>
                            <option>Balod</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>Block Wise</option>
                            <option>Gunderdehi</option>
                        </select>
                        <select className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none border-r border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                            <option>GP Wise</option>
                            <option>Gunderdehi</option>
                        </select>
                        <select
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                        >
                            <option value="All Vendors">All Vendors</option>
                            <option value="Raj Recyclers Hub">Raj Recyclers Hub</option>
                            <option value="Green Earth Processors">Green Earth Processors</option>
                        </select>
                    </div>
                )}
            </div>

            {/* If 'All Vendors' is selected, show Directory View. Else show Specific Vendor details. */}
            {selectedVendor === 'All Vendors' ? (
                <div className="space-y-6">
                    {/* Aggregated KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">Total Registered Vendors</p>
                                <p className="text-2xl font-bold text-gray-800">48</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">Total Pickups This Month</p>
                                <p className="text-2xl font-bold text-gray-800">1,204</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium text-gray-500">Avg. Market Rate Payment</p>
                                <p className="text-2xl font-bold text-gray-800">₹8.5 / kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Directory Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Vendor Network Directory</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                        <th className="p-4 font-medium">Vendor Name</th>
                                        <th className="p-4 font-medium">District Config</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">Total Vol (YTD)</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">RR</div>
                                            Raj Recyclers Hub
                                        </td>
                                        <td className="p-4">Durg Division</td>
                                        <td className="p-4">Plastic Processor</td>
                                        <td className="p-4 text-[#005DAA] font-bold">33.7 MT</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Verified</span></td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setSelectedVendor('Raj Recyclers Hub')} className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                        </td>
                                    </tr>
                                    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold">GE</div>
                                            Green Earth Processors
                                        </td>
                                        <td className="p-4">Raipur Division</td>
                                        <td className="p-4">Paper/Cardboard</td>
                                        <td className="p-4 text-[#005DAA] font-bold">85.2 MT</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Verified</span></td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => setSelectedVendor('Green Earth Processors')} className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Market Availability */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div className="flex items-center gap-2">
                                    <PackageSearch className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-bold text-gray-800">State Market Availability</h3>
                                </div>
                                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                    <Flame className="w-3 h-3" /> Hot Items
                                </span>
                            </div>

                            <div className="p-4 space-y-3">
                                {marketAvailability.map((item) => (
                                    <div key={item.id} className="group border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
                                        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.hot ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {item.hot ? <Flame className="w-6 h-6 animate-pulse" /> : <PackageSearch className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800">{item.material}</h4>
                                                    {item.hot && (
                                                        <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-red-200">
                                                            High Demand
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> {item.pwmu}
                                                    <span className="mx-1 text-gray-300">|</span>
                                                    <Truck className="w-3 h-3 ml-1" /> {item.distance}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-4 sm:border-l border-gray-100">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-gray-500 font-medium mb-0.5">Available Stock</p>
                                                <p className="text-xl font-bold text-[#005DAA]">{item.stock.toLocaleString()} <span className="text-sm font-medium text-gray-500">{item.unit}</span></p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm group-hover:text-orange-600 transition-colors">
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-500" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
                                <button className="text-sm font-bold text-[#005DAA] hover:underline">View All State Postings</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analytics & Quick Stats */}
                    <div className="space-y-6">

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">33.7 <span className="text-sm font-medium text-gray-500">MT</span></p>
                                <p className="text-xs text-gray-500 font-medium mt-1">YTD Procurement</p>
                            </div>

                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                                        <CalendarCheck className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">12</p>
                                <p className="text-xs text-gray-500 font-medium mt-1">PWMUs Partnered</p>
                            </div>
                        </div>

                        {/* My Picks / History Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-orange-600" />
                                    <h3 className="font-bold text-gray-800">My Pickups History</h3>
                                </div>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={pickHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `${val / 1000}k`} />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${value.toLocaleString()} kg`, 'Vol.']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="kg"
                                            stroke="#FF9933"
                                            strokeWidth={4}
                                            dot={{ r: 4, fill: '#FF9933', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6, fill: '#FF9933', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">Volume in Kilograms (kg)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VendorDashboard;
