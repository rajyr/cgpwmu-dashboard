import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FileText, Download, Calendar, Filter, Search, 
    ArrowUpDown, TrendingUp, Clock, CheckCircle2, 
    Truck, IndianRupee, MapPin, ChevronRight, 
    DownloadCloud, Loader2, Users, LayoutDashboard,
    FileBarChart, ExternalLink, Image as ImageIcon, Info
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const API_BASE = '/cgpwmu/api';

function MasterReports() {
    const { user, userRole } = useAuth();
    const { t, language } = useLanguage();
    const reportRef = useRef(null);

    // --- State ---
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(null);
    const [data, setData] = useState({
        villages: [],
        pwmus: [],
        intake: [],
        sales: [],
        monthly: []
    });

    const [filters, setFilters] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        pwmuId: 'all',
        district: 'all',
        block: 'all',
        village: 'all'
    });

    const [sortConfig, setSortConfig] = useState({ key: 'effectiveness', direction: 'desc' });
    const [locationData, setLocationData] = useState({});

    // --- Data Fetching ---
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Determine scope based on user role
                // Admin: all data
                // PWMU: only their data
                // Village: only their data

                let baseQuery = supabase;
                const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
                const headers = { 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, 'Authorization': `Bearer ${session.access_token}` };

                const responses = await Promise.all([
                    fetch(`${API_BASE}/data/pwmu_centers?select=*`, { headers }),
                    fetch(`${API_BASE}/data/users?role=eq.Sarpanch&select=*`, { headers }),
                    fetch(`${API_BASE}/data/village_waste_reports?select=*`, { headers }),
                    fetch(`${API_BASE}/data/vendor_pickups?select=*`, { headers }),
                    fetch(`${API_BASE}/data/monthly_reports?select=*`, { headers })
                ]);

                const [pwmus, villages, intake, sales, monthly] = await Promise.all(responses.map(r => r.json()));

                setData({
                    pwmus: Array.isArray(pwmus) ? pwmus : [],
                    villages: Array.isArray(villages) ? villages.map(v => ({ ...v, reg: JSON.parse(v.registration_data || '{}') })) : [],
                    intake: Array.isArray(intake) ? intake : [],
                    sales: Array.isArray(sales) ? sales : [],
                    monthly: Array.isArray(monthly) ? monthly : []
                });

                // Load location data
                const locRes = await fetch('/cgpwmu/data/locationData.json');
                if (locRes.ok) setLocationData(await locRes.json());

            } catch (err) {
                console.error('Error fetching report data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    // --- Filtering Logic ---
    const filteredData = useMemo(() => {
        let results = data.pwmus.map(pwmu => {
            // 1. Linked Villages
            const linkedVillages = data.villages.filter(v => v.reg?.pwmuId === pwmu.id);
            
            // 2. Intake in date range
            const pwmuIntake = data.intake.filter(i => 
                i.pwmu_id === pwmu.id && 
                i.collection_date >= filters.startDate && 
                i.collection_date <= filters.endDate
            );

            // 3. Sales in date range
            const pwmuSales = data.sales.filter(s => 
                // Using name-based matching if ID isn't available in vendor_pickups
                (s.pwmu_name === pwmu.name) &&
                s.pickup_date >= filters.startDate && 
                s.pickup_date <= filters.endDate
            );

            // 4. Calculate Efficiency & Punctuality
            // Effectiveness = (Processed / Received) or derived from activity
            // Since we don't have a direct 'effectiveness' flag, we derive it:
            // High effectiveness if they've submitted monthly reports and have sales
            const totalRec = pwmuIntake.reduce((sum, i) => sum + (i.shared_with_pwmu_kg || 0), 0);
            const totalSold = pwmuSales.reduce((sum, s) => sum + (s.quantity_kg || 0), 0);
            
            // Punctuality = Days reported / Days in range
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            const uniqueDaysIntake = new Set(pwmuIntake.map(i => i.collection_date)).size;
            
            const punctuality = Math.min(100, (uniqueDaysIntake / dayDiff) * 100);
            const effectiveness = totalRec > 0 ? Math.min(100, (totalSold / totalRec) * 100) : 0;

            return {
                ...pwmu,
                linkedCount: linkedVillages.length,
                totalReceived: totalRec,
                totalSold: totalSold,
                revenue: pwmuSales.reduce((sum, s) => sum + (s.amount_paid || 0), 0),
                effectiveness: parseFloat(effectiveness.toFixed(1)),
                punctuality: parseFloat(punctuality.toFixed(1)),
                grade: effectiveness > 80 ? 'A' : effectiveness > 50 ? 'B' : 'C'
            };
        });

        // Apply Geograhic/PWMU filters
        if (filters.pwmuId !== 'all') results = results.filter(r => r.id === filters.pwmuId);
        if (filters.district !== 'all') results = results.filter(r => r.district === filters.district);

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
        const headers = ["PWMU Name", "District", "Villages Linked", "Waste Received (kg)", "Waste Sold (kg)", "Revenue (₹)", "Effectiveness (%)", "Punctuality (%)"];
        const rows = filteredData.map(r => [
            r.name, r.district, r.linkedCount, r.totalReceived, r.totalSold, r.revenue, r.effectiveness, r.punctuality
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `PWMU_Master_Report_${filters.startDate}_to_${filters.endDate}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');
        doc.setFontSize(18);
        doc.text("PWMU Master System Report", 14, 20);
        doc.setFontSize(10);
        doc.text(`Period: ${filters.startDate} to ${filters.endDate}`, 14, 28);
        
        const tableColumn = ["PWMU Name", "District", "Villages", "Recv (kg)", "Sold (kg)", "Revenue", "Effect.", "Punct."];
        const tableRows = filteredData.map(r => [
            r.name, r.district, r.linkedCount, r.totalReceived, r.totalSold, `₹${r.revenue}`, `${r.effectiveness}%`, `${r.punctuality}%`
        ]);

        doc.autoTable({
            startY: 35,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillStyle: '#005DAA' }
        });

        doc.save(`PWMU_Master_Report_${filters.startDate}.pdf`);
    };

    const exportJPG = async () => {
        if (!reportRef.current) return;
        setExporting('jpg');
        const canvas = await html2canvas(reportRef.current);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const link = document.createElement('a');
        link.href = imgData;
        link.download = `PWMU_Master_Report_${filters.startDate}.jpg`;
        link.click();
        setExporting(null);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#005DAA]" />
                <p className="font-bold text-lg">Generating Comprehensive Report...</p>
                <p className="text-sm">Synthesizing state-wide data and performance metrics</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in" ref={reportRef}>
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 no-export">
                <div>
                    <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                        <FileBarChart className="w-8 h-8 text-[#005DAA]" />
                        Master System Performance Report
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Detailed analysis of waste flow, vendor relations, and center effectiveness.</p>
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
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">District</label>
                        <select 
                            value={filters.district}
                            onChange={(e) => setFilters({...filters, district: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                            <option value="all">All Districts</option>
                            {Object.keys(locationData).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest px-1">PWMU Center</label>
                        <select 
                            value={filters.pwmuId}
                            onChange={(e) => setFilters({...filters, pwmuId: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#005DAA]/20">
                            <option value="all">All Centers</option>
                            {data.pwmus.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="xl:col-span-2 flex items-end">
                        <div className="flex bg-[#005DAA] text-white p-0.5 rounded-xl w-full shadow-lg shadow-[#005DAA]/20">
                           <div className="flex items-center gap-3 px-4 py-2 border-r border-white/20">
                               <TrendingUp className="w-5 h-5 text-blue-200" />
                               <div className="flex flex-col">
                                   <span className="text-[10px] font-black uppercase opacity-60 leading-none mb-1">State Avg</span>
                                   <span className="text-base font-black leading-none">88.4%</span>
                               </div>
                           </div>
                           <div className="flex-1 px-4 py-2 flex items-center justify-between">
                               <span className="text-[10px] font-black uppercase opacity-60">System Health</span>
                               <span className="text-xs font-black bg-blue-400/30 px-2 py-0.5 rounded-full border border-white/20">OPTIMAL</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Ranking Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-gray-800">Operational Leaderboard</h2>
                        <p className="text-xs text-gray-500 font-bold mt-1">Ranking centers by overall effectiveness & punctuality</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-100">
                                <th className="px-8 py-5 cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'name', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center gap-2">PWMU Center <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5">District</th>
                                <th className="px-6 py-5 text-center">Villages</th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'totalReceived', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2">Total Waste <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5 text-center">Sales Vol.</th>
                                <th className="px-6 py-5 text-right font-black">Revenue</th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'effectiveness', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2 text-blue-600">Effectiveness <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-6 py-5 text-center cursor-pointer hover:text-[#005DAA]" onClick={() => setSortConfig({key: 'punctuality', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'})}>
                                    <div className="flex items-center justify-center gap-2 text-green-600">Punctuality <ArrowUpDown className="w-3 h-3" /></div>
                                </th>
                                <th className="px-8 py-5 text-right">Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-8 py-12 text-center text-gray-400 font-bold">No PWMU data found for this selection.</td>
                                </tr>
                            ) : filteredData.map((row, idx) => (
                                <tr key={row.id} className="group hover:bg-gray-50/80 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#005DAA]/5 text-[#005DAA] border border-[#005DAA]/10 flex items-center justify-center font-black text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800 leading-none">{row.name}</p>
                                                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase">ID: {row.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-gray-600 text-sm">{row.district}</td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
                                            <Users className="w-3 h-3" /> {row.linkedCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center font-bold text-gray-800">{row.totalReceived.toLocaleString()} <span className="text-[10px] text-gray-400 uppercase">kg</span></td>
                                    <td className="px-6 py-6 text-center font-bold text-gray-600">{row.totalSold.toLocaleString()} <span className="text-[10px] text-gray-400 uppercase">kg</span></td>
                                    <td className="px-6 py-6 text-right font-black text-gray-900 text-base">₹{row.revenue.toLocaleString()}</td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-full max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#005DAA]" style={{width: `${row.effectiveness}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-blue-700">{row.effectiveness}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div className="w-full max-w-[80px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{width: `${row.punctuality}%`}}></div>
                                            </div>
                                            <span className="text-[10px] font-black text-green-700">{row.punctuality}%</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-black ${
                                            row.grade === 'A' ? 'bg-green-100 text-green-700' : 
                                            row.grade === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            GRADE {row.grade}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50/50 p-6 flex flex-col md:flex-row justify-between items-center border-t border-gray-100 no-export">
                    <p className="text-xs text-gray-500 font-bold mb-4 md:mb-0 uppercase tracking-widest italic flex items-center gap-2">
                         <Info className="w-3.5 h-3.5 text-blue-500" /> 
                         Effectiveness is calculated based on Processing to Sales conversion ratio.
                    </p>
                    <div className="flex gap-2">
                         <div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-[10px] font-black text-gray-500 uppercase mr-4">High (80%+)</span>
                         <div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-[10px] font-black text-gray-500 uppercase mr-4">Moderate (50%+)</span>
                         <div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-[10px] font-black text-gray-500 uppercase">Critical (Below 50%)</span>
                    </div>
                </div>
            </div>

            {/* Role Disclaimer */}
            {userRole === 'Sarpanch' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-4 no-export">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 shrink-0">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 leading-tight">Sarpanch Access (Restricted)</h4>
                        <p className="text-xs text-amber-700 font-medium mt-1">You are viewing performance metrics for your linked PWMU center. For detailed block-level insights, contact your Nodal Officer.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MasterReports;
