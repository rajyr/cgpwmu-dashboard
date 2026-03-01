import React, { useState, useEffect } from 'react';
import {
    Flame, Store, MapPin, Truck, ChevronRight,
    TrendingUp, CalendarCheck, PackageSearch, Loader2
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';

const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : import.meta.env.VITE_SUPABASE_URL);

function VendorDashboard() {
    const { userRole: authRole, userName } = useAuth();
    const userRole = authRole || 'Admin';

    const [selectedVendor, setSelectedVendor] = useState(userRole === 'Vendor' ? 'self' : 'All Vendors');
    const [vendorProfile, setVendorProfile] = useState(null);
    const [allVendors, setAllVendors] = useState([]);
    const [marketData, setMarketData] = useState([]);
    const [pickupData, setPickupData] = useState([]);
    const [loadingProfile, setLoadingProfile] = useState(true);

    // Fetch vendor profile and all vendors from DB
    useEffect(() => {
        const fetchData = async () => {
            try {
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const token = session.access_token;
                if (!token) return;
                const proxyUrl = getProxyUrl();

                // 1. Fetch own profile
                const profileRes = await fetch(
                    `${proxyUrl}/rest/v1/users?id=eq.${session.user?.id}&select=id,full_name,role,district,registration_data`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    if (data.length > 0) setVendorProfile(data[0]);
                }

                // 2. Fetch all approved vendors (for admin directory)
                const vendorsRes = await fetch(
                    `${proxyUrl}/rest/v1/users?role=eq.Vendor&status=eq.approved&select=id,full_name,district,registration_data,created_at`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                if (vendorsRes.ok) {
                    setAllVendors(await vendorsRes.json());
                }

                // 3. Fetch market availability
                const marketRes = await fetch(
                    `${proxyUrl}/rest/v1/market_availability?select=*&order=is_hot.desc,created_at.desc`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                if (marketRes.ok) {
                    setMarketData(await marketRes.json());
                }

                // 4. Fetch vendor pickups
                const pickupsRes = await fetch(
                    `${proxyUrl}/rest/v1/vendor_pickups?select=*&order=pickup_date.asc`,
                    { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(8000) }
                );
                if (pickupsRes.ok) {
                    setPickupData(await pickupsRes.json());
                }
            } catch (err) {
                console.error('Error fetching vendor data:', err);
            } finally {
                setLoadingProfile(false);
            }
        };
        fetchData();
    }, []);

    // Process pickup data for the chart (grouped by month)
    const processedPickHistory = React.useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const hist = months.map(m => ({ month: m, kg: 0 }));

        pickupData.forEach(p => {
            const date = new Date(p.pickup_date);
            const monthIdx = date.getMonth();
            hist[monthIdx].kg += Number(p.quantity_kg || 0);
        });

        // Filter out months with no data and maybe limit to last 6?
        // For demonstration, let's keep all but focus on the ones with data
        return hist.filter((h, idx) => idx <= new Date().getMonth());
    }, [pickupData]);

    const totalPickupsThisMonth = React.useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return pickupData
            .filter(p => new Date(p.pickup_date) >= startOfMonth)
            .reduce((sum, p) => sum + Number(p.quantity_kg || 0), 0);
    }, [pickupData]);

    const avgMarketRate = React.useMemo(() => {
        if (marketData.length === 0) return 0;
        const sum = marketData.reduce((s, m) => s + Number(m.rate_per_kg || 0), 0);
        return (sum / marketData.length).toFixed(1);
    }, [marketData]);

    // Derive vendor display info from profile
    const regData = vendorProfile?.registration_data || {};
    const vendorDisplayName = vendorProfile?.full_name || userName || 'Vendor';
    const vendorCategory = regData.vendorType || 'Recycler';
    const vendorDistrict = vendorProfile?.district || regData.district || '—';
    const vendorGstin = regData.gstin || '—';
    const vendorCompany = regData.companyName || vendorDisplayName;

    // For admin: get selected vendor info
    const selectedVendorObj = selectedVendor !== 'All Vendors' && selectedVendor !== 'self'
        ? allVendors.find(v => v.id === selectedVendor) : null;

    const getDisplayName = () => {
        if (selectedVendor === 'All Vendors') return 'State Vendor Directory';
        if (selectedVendor === 'self') return vendorCompany;
        if (selectedVendorObj) return selectedVendorObj.registration_data?.companyName || selectedVendorObj.full_name;
        return vendorCompany;
    };

    const getSubtitle = () => {
        if (selectedVendor === 'All Vendors') return `Overview of all registered Market Partners. ${allVendors.length} vendors registered.`;
        if (selectedVendor === 'self') return `Category: ${vendorCategory} • GSTIN: ${vendorGstin} • District: ${vendorDistrict}`;
        if (selectedVendorObj) return `District: ${selectedVendorObj.district || '—'}`;
        return `Category: ${vendorCategory}`;
    };

    if (loadingProfile) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading vendor data...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className={`flex flex-col ${userRole !== 'Vendor' ? 'lg:flex-row' : ''} justify-between items-start lg:items-center gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner shrink-0 bg-orange-50 text-orange-600 border-orange-100">
                        <Store className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{getDisplayName()}</h1>
                        <p className="text-sm font-medium text-gray-500 mt-1">{getSubtitle()}</p>
                    </div>
                </div>

                {/* Admin filters to switch vendors */}
                {userRole !== 'Vendor' && (
                    <div className="flex flex-wrap lg:flex-nowrap bg-gray-50 border border-gray-200 rounded-lg p-1 overflow-x-auto w-full lg:w-auto hide-scrollbar">
                        <select
                            className="bg-transparent text-xs font-semibold text-gray-700 px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                        >
                            <option value="All Vendors">All Vendors</option>
                            {allVendors.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.registration_data?.companyName || v.full_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* All Vendors Directory View */}
            {selectedVendor === 'All Vendors' ? (
                <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Registered Vendors</p>
                                <p className="text-2xl font-bold text-gray-800">{allVendors.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                <Truck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Pickups This Month</p>
                                <p className="text-2xl font-bold text-gray-800">{totalPickupsThisMonth.toLocaleString()} <span className="text-sm font-medium text-gray-500">kg</span></p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Avg. Market Rate Payment</p>
                                <p className="text-2xl font-bold text-gray-800">₹{avgMarketRate} / kg</p>
                            </div>
                        </div>
                    </div>

                    {/* Vendor Directory Table — from real data */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Vendor Network Directory</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                        <th className="p-4 font-medium">Vendor Name</th>
                                        <th className="p-4 font-medium">District</th>
                                        <th className="p-4 font-medium">Category</th>
                                        <th className="p-4 font-medium">GSTIN</th>
                                        <th className="p-4 font-medium">Registered</th>
                                        <th className="p-4 font-medium text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm text-gray-700">
                                    {allVendors.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-400">No vendors registered yet.</td></tr>
                                    ) : allVendors.map(v => {
                                        const rd = v.registration_data || {};
                                        const initials = (v.full_name || '?').split(' ').map(n => n[0]).join('').substring(0, 2);
                                        return (
                                            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">{initials}</div>
                                                    {rd.companyName || v.full_name}
                                                </td>
                                                <td className="p-4">{v.district || '—'}</td>
                                                <td className="p-4">{rd.vendorType || '—'}</td>
                                                <td className="p-4 font-mono text-xs">{rd.gstin || '—'}</td>
                                                <td className="p-4 text-xs text-gray-400">{v.created_at ? new Date(v.created_at).toLocaleDateString() : '—'}</td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => setSelectedVendor(v.id)} className="text-[#005DAA] font-medium hover:underline text-xs">View Dashboard</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* Individual Vendor View */
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
                                {marketData.length === 0 ? (
                                    <p className="text-center py-8 text-gray-400">No market listings available.</p>
                                ) : marketData.map((item) => (
                                    <div key={item.id} className="group border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:border-orange-200 hover:bg-orange-50/30 transition-all cursor-pointer">
                                        <div className="flex items-start sm:items-center gap-4 mb-4 sm:mb-0">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.is_hot ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                                                {item.is_hot ? <Flame className="w-6 h-6 animate-pulse" /> : <PackageSearch className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-800">{item.material}</h4>
                                                    {item.is_hot && (
                                                        <span className="bg-red-100 text-red-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-red-200">High Demand</span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" /> {item.pwmu_name}
                                                    <span className="mx-1 text-gray-300">|</span>
                                                    <Truck className="w-3 h-3 ml-1" /> {item.distance_km} km
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:pl-4 sm:border-l border-gray-100">
                                            <div className="text-left sm:text-right">
                                                <p className="text-xs text-gray-500 font-medium mb-0.5">Available Stock</p>
                                                <p className="text-xl font-bold text-[#005DAA]">{item.stock_kg.toLocaleString()} <span className="text-sm font-medium text-gray-500">{item.unit || 'kg'}</span></p>
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

                    {/* Right Column: Analytics */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {(pickupData.reduce((sum, p) => sum + Number(p.quantity_kg || 0), 0) / 1000).toFixed(1)} <span className="text-sm font-medium text-gray-500">MT</span>
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-1">YTD Procurement</p>
                            </div>
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[#005DAA]">
                                        <CalendarCheck className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-gray-800">
                                    {[...new Set(pickupData.map(p => p.pwmu_name))].length}
                                </p>
                                <p className="text-xs text-gray-500 font-medium mt-1">PWMUs Partnered</p>
                            </div>
                        </div>

                        {/* Pickups Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-orange-600" />
                                    <h3 className="font-bold text-gray-800">My Pickups History</h3>
                                </div>
                            </div>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={processedPickHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `${val / 1000}k`} />
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`${value.toLocaleString()} kg`, 'Vol.']}
                                        />
                                        <Line type="monotone" dataKey="kg" stroke="#FF9933" strokeWidth={4}
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
