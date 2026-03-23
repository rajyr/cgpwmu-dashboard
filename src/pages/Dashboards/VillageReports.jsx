import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FileText, Download, Calendar, Filter, Search, 
    ArrowUpDown, TrendingUp, Clock, CheckCircle2, 
    Truck, IndianRupee, MapPin, ChevronRight, 
    DownloadCloud, Loader2, Users, LayoutDashboard,
    FileBarChart, ExternalLink, Image as ImageIcon, Info,
    Home, Droplets, Trash2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

const API_BASE = '/cgpwmu/api';

function VillageReports() {
    const { user, userRole, userName } = useAuth();
    const { t, language } = useLanguage();
    const reportRef = useRef(null);

    // --- State ---
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(null);
    const [data, setData] = useState({
        villages: [],
        reports: [],
        locationData: {}
    });

    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        district: 'all',
        block: 'all',
        gp: 'all',
        villageId: userRole === 'Sarpanch' ? user?.id : 'all'
    });

    const [sortConfig, setSortConfig] = useState({ key: 'punctuality', direction: 'desc' });

    // --- Data Fetching ---
    useEffect(() => {
        const fetchAllData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const safeFetch = async (query) => {
                    try {
                        const { data, error } = await query;
                        if (error) console.warn('[VillageReports] Fetch error:', error);
                        return data || [];
                    } catch (e) {
                        console.error('[VillageReports] Fetch crash:', e);
                        return [];
                    }
                };

                // Fetch Villages (Sarpanch users)
                let villageQuery = supabase.from('users').select('*').eq('role', 'Sarpanch').eq('status', 'approved');
                if (userRole === 'Sarpanch') {
                    villageQuery = villageQuery.eq('id', user.id);
                }

                // Fetch Waste Reports
                let reportQuery = supabase.from('village_waste_reports').select('*');
                if (userRole === 'Sarpanch') {
                    reportQuery = reportQuery.eq('village_id', user.id);
                }

                const [villages, reports] = await Promise.all([
                    safeFetch(villageQuery),
                    safeFetch(reportQuery)
                ]);

                // Parse registration data
                const parsedVillages = villages.map(v => {
                    try {
                        const reg = typeof v.registration_data === 'string' ? JSON.parse(v.registration_data || '{}') : (v.registration_data || {});
                        return { ...v, reg };
                    } catch (e) {
                        return { ...v, reg: {} };
                    }
                });

                // Load location data
                let locationData = {};
                try {
                    const locRes = await fetch('/cgpwmu/data/locationData.json');
                    if (locRes.ok) locationData = await locRes.json();
                } catch (e) {}

                setData({
                    villages: parsedVillages,
                    reports: reports,
                    locationData: locationData
                });
                
                setLoading(false);
            } catch (err) {
                console.error('[VillageReports] Critical error:', err);
                setLoading(false);
            }
        };
        fetchAllData();
    }, [user, userRole]);

    // --- Filtering Options ---
    const availableDistricts = useMemo(() => {
        return [...new Set(data.villages.map(v => v.reg?.district || v.district))].filter(Boolean).sort();
    }, [data.villages]);

    const availableBlocks = useMemo(() => {
        let filtered = data.villages;
        if (filters.district !== 'all') filtered = filtered.filter(v => (v.reg?.district || v.district) === filters.district);
        return [...new Set(filtered.map(v => v.reg?.block || v.block))].filter(Boolean).sort();
    }, [data.villages, filters.district]);

    // --- Metrics Calculation ---
    const filteredData = useMemo(() => {
        let results = data.villages.map(village => {
            const vReports = data.reports.filter(r => 
                r.village_id === village.id && 
                r.collection_date >= filters.startDate && 
                r.collection_date <= filters.endDate
            );

            const totalWet = vReports.reduce((sum, r) => sum + (Number(r.wet_waste_kg) || 0), 0);
            const totalDry = vReports.reduce((sum, r) => sum + (Number(r.dry_waste_kg) || 0), 0);
            const totalShared = vReports.reduce((sum, r) => sum + (Number(r.shared_with_pwmu_kg) || 0), 0);
            const totalUserCharge = vReports.reduce((sum, r) => sum + (Number(r.user_charge_collected) || 0), 0);

            // Punctuality = Days reported / Days in range
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            const dayDiff = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
            const uniqueDays = new Set(vReports.map(r => r.collection_date)).size;
            const punctuality = Math.min(100, (uniqueDays / dayDiff) * 100);

            return {
                id: village.id,
                name: village.full_name || village.reg?.villageName || 'Unknown Village',
                district: village.reg?.district || village.district || '—',
                block: village.reg?.block || village.block || '—',
                gp: village.reg?.gramPanchayat || village.gramPanchayat || '—',
                totalWet,
                totalDry,
                totalShared,
                totalUserCharge,
                punctuality: parseFloat(punctuality.toFixed(1)),
                totalWaste: totalWet + totalDry
            };
        });

        // Apply additional filters
        if (filters.district !== 'all') results = results.filter(r => r.district === filters.district);
        if (filters.block !== 'all') results = results.filter(r => r.block === filters.block);
        if (filters.villageId !== 'all') results = results.filter(r => r.id === filters.villageId);

        // Sorting
        results.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return results;
    }, [data, filters, sortConfig]);

    // --- Export Handlers ---
    const exportCSV = () => {
        const headers = ["Village Name", "District", "Block", "Gram Panchayat", "Wet Waste (kg)", "Dry Waste (kg)", "Sent to PWMU (kg)", "User Charge (₹)", "Punctuality (%)"];
        const rows = filteredData.map(r => [
            r.name, r.district, r.block, r.gp, r.totalWet, r.totalDry, r.totalShared, r.totalUserCharge, r.punctuality
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Village_Performance_Report_${filters.startDate}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFontSize(18);
        doc.text("Village Waste Management Performance Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 28);
        
        const tableColumn = ["Village Name", "District", "Block", "GP", "Wet (kg)", "Dry (kg)", "Shared (kg)", "User Charge", "Punctuality"];
        const tableRows = filteredData.map(r => [
            r.name, r.district, r.block, r.gp, r.totalWet, r.totalDry, r.totalShared, `₹${r.totalUserCharge}`, `${r.punctuality}%`
        ]);

        autoTable(doc, {
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: '#005DAA' }
        });

        doc.save(`Village_Master_Report_${filters.startDate}.pdf`);
    };

    const exportJPG = async () => {
        if (!reportRef.current) return;
        setExporting('jpg');
        // Hide UI elements during capture
        const noExport = document.querySelectorAll('.no-export');
        noExport.forEach(el => el.style.display = 'none');
        
        const canvas = await html2canvas(reportRef.current);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `Village_Master_Report_${filters.startDate}.jpg`;
        link.click();
        
        // Restore UI elements
        noExport.forEach(el => el.style.display = '');
        setExporting(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#005DAA]" />
                <p className="font-bold text-lg">Generating Village Performance Insights...</p>
                <p className="text-sm">Consolidating daily logs and monthly submissions</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in" ref={reportRef}>
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 no-export">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        <Home className="w-8 h-8 text-[#005DAA]" />
                        Village Performance Master Report
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Consolidated analysis of waste collection, user charges, and reporting punctuality.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-white hover:border-[#005DAA] hover:text-[#005DAA] transition-all">
                        <DownloadCloud className="w-4 h-4" /> CSV
                    </button>
                    <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 transition-all">
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={exportJPG} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-100 transition-all">
                        <ImageIcon className="w-4 h-4" /> JPG
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 no-export">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">Start Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="date" 
                                value={filters.startDate}
                                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20" 
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">End Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="date" 
                                value={filters.endDate}
                                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005DAA]/20" 
                            />
                        </div>
                    </div>

                    {userRole !== 'Sarpanch' ? (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">District</label>
                                <select 
                                    value={filters.district}
                                    onChange={(e) => setFilters({...filters, district: e.target.value, block: 'all', villageId: 'all'})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                                    <option value="all">All Districts</option>
                                    {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">Block</label>
                                <select 
                                    value={filters.block}
                                    onChange={(e) => setFilters({...filters, block: e.target.value, villageId: 'all'})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                                    <option value="all">All Blocks</option>
                                    {availableBlocks.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">Village</label>
                                <select 
                                    value={filters.villageId}
                                    onChange={(e) => setFilters({...filters, villageId: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                                    <option value="all">All Villages</option>
                                    {data.villages
                                        .filter(v => (filters.district === 'all' || (v.reg?.district || v.district) === filters.district) && (filters.block === 'all' || (v.reg?.block || v.block) === filters.block))
                                        .map(v => <option key={v.id} value={v.id}>{v.full_name}</option>)
                                    }
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="lg:col-span-3 flex items-center px-4 bg-blue-50 rounded-xl border border-blue-100">
                             <MapPin className="w-4 h-4 text-[#005DAA] mr-2" />
                             <span className="text-sm font-bold text-[#005DAA]">Viewing data for: {userName || user?.email}</span>
                        </div>
                    )}
                    
                    <div className="flex items-end">
                        <div className="bg-[#005DAA] text-white p-3 rounded-xl w-full shadow-lg shadow-[#005DAA]/20 flex items-center justify-between">
                             <div className="flex flex-col">
                                 <span className="text-[10px] font-black uppercase opacity-60">Avg. Punctuality</span>
                                 <span className="text-xl font-black">{(filteredData.reduce((sum, r) => sum + r.punctuality, 0) / (filteredData.length || 1)).toFixed(1)}%</span>
                             </div>
                             <TrendingUp className="w-6 h-6 text-blue-200" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-black text-gray-800">Village Performance Leaderboard</h2>
                    <p className="text-xs text-gray-500 font-bold mt-1">Aggregated results from daily logs and user charge collections</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-100">
                                <th className="px-8 py-5 cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center gap-2">Village <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5">GP / Block</th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'totalWet', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2">Wet Waste <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'totalDry', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2">Dry Waste <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'totalShared', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2 text-red-500">To PWMU <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5 text-right font-black cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'totalUserCharge', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-end gap-2">User Charge <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-8 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'punctuality', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2 text-green-600">Punctuality <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-gray-400 font-bold">No village data found for this selection.</td>
                                </tr>
                            ) : filteredData.map((row, idx) => (
                                <tr key={row.id} className="group hover:bg-gray-50/80 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005DAA] border border-blue-100 flex items-center justify-center font-black text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 leading-none">{row.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">{row.district}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-gray-600 text-sm">
                                        <p>{row.gp}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{row.block}</p>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                                            <Droplets className="w-3 h-3" /> {row.totalWet.toLocaleString()} kg
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                                            <Trash2 className="w-3 h-3" /> {row.totalDry.toLocaleString()} kg
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-black">
                                            <Truck className="w-3 h-3" /> {row.totalShared.toLocaleString()} kg
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right font-black text-gray-900 text-base">₹{row.totalUserCharge.toLocaleString()}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-full max-w-[100px] h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${
                                                        row.punctuality > 80 ? 'bg-green-500' : row.punctuality > 50 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`} 
                                                    style={{width: `${row.punctuality}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] font-black text-gray-600">{row.punctuality}% LOGGED</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50/50 p-6 border-t border-gray-100 no-export">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 justify-center italic">
                         <Info className="w-3.5 h-3.5 text-blue-500" /> 
                         Punctuality represents the percentage of days having at least one waste log submission in the selected range.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default VillageReports;
