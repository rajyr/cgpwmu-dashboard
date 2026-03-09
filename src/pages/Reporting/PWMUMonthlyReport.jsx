import { FileBarChart, Settings, IndianRupee, Factory, Plus, Trash2, Calendar, CheckCircle2, AlertTriangle, AlertCircle, Wrench } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const PWMUMonthlyReport = () => {
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const monthlyTranslations = {
        en: {
            title: "PWMU Monthly Report",
            subtitle: "Submit operational, financial, and asset status data for the selected month.",
            facilityInfo: "Facility Information",
            pwmuCenter: "PWMU Center (Auto-Selected)",
            nodalOfficer: "Logged in as Nodal Officer",
            assetStatus: "Asset & Machinery Status",
            selectMachines: "Select installed machines",
            operationalChecklist: "Operational Condition Checklist",
            functional: "Functional",
            nonFunctional: "Non-Functional",
            dateBreakdown: "Date Breakdown Occurred",
            primaryReason: "Primary Reason",
            selectReason: "-- Select Reason --",
            salesRevenue: "Sales & Diversion (Revenue)",
            addRecord: "Add Record",
            noSales: "No sales recorded for this month.",
            vendorCol: "Purchasing Vendor",
            materialCol: "Material Type",
            qtyCol: "Qty (Kg)",
            revenueCol: "Revenue (₹)",
            actionCol: "Action",
            selectVendor: "Select Vendor...",
            selectMaterial: "Select Material...",
            totalRev: "Total Revenue:",
            opExpenses: "Operating Expenses (O&M)",
            electricity: "Electricity Bill (₹)",
            honorarium: "Swachhata Samuh Honorarium (₹)",
            otherExp: "Other Gen. Expenses (₹)",
            reportingMonthDesc: "For the reporting month",
            distWorkersDesc: "Total distributed to workers",
            repairsDesc: "Repairs, transport, consumables",
            totalExp: "Total Expenses:",
            netBalance: "Net Monthly Balance:",
            cancel: "Cancel",
            saveReport: "Save Report",
            saving: "Saving...",
            submitted: "Report Submitted!",
            submittedDesc: "The monthly performance report for {month} {year} has been successfully recorded.",
            jan: "January", feb: "February", mar: "March", apr: "April", may: "May", jun: "June",
            jul: "July", aug: "August", sep: "September", oct: "October", nov: "November", dec: "December",
            kg: "kg",
            reasons: [
                'Electricity/Power supply issue',
                'Operator (Swachhgrahi) unavailable',
                'Unsuitable plastic quality',
                'Technical machine failure',
                'Part replacement required',
                'Other'
            ],
            wasteTypes: [
                'PET (Water Bottles)', 'HDPE (Milk Jugs)', 'LDPE (Plastic Bags)',
                'PP (Tupperware)', 'MLP (Multi-Layer Packages)', 'Processed RDF', 'Shredded Mixed Plastic'
            ],
            machines: {
                fatka: 'Fatka / Dust Cleaning Machine',
                baling: 'Hydraulic Baling Machine',
                shredder: 'Plastic Shredder Machine',
                agglomerator: 'Agglomerator Machine',
                mixer: 'Mixer Machine',
                granular: 'Granule Making Machine'
            }
        },
        hi: {
            title: "PWMU मासिक रिपोर्ट",
            subtitle: "चयनित महीने के लिए परिचालन, वित्तीय और संपत्ति की स्थिति का डेटा सबमिट करें।",
            facilityInfo: "सुविधा की जानकारी",
            pwmuCenter: "PWMU केंद्र (स्वत: चयनित)",
            nodalOfficer: "नोडल अधिकारी के रूप में लॉग इन किया गया",
            assetStatus: "संपत्ति और मशीनरी की स्थिति",
            selectMachines: "स्थापित मशीनों का चयन करें",
            operationalChecklist: "परिचालन स्थिति चेकलिस्ट",
            functional: "चालू",
            nonFunctional: "बंद",
            dateBreakdown: "खराबी होने की तिथि",
            primaryReason: "मुख्य कारण",
            selectReason: "-- कारण चुनें --",
            salesRevenue: "बिक्री और डाइवर्जन (राजस्व)",
            addRecord: "रिकॉर्ड जोड़ें",
            noSales: "इस महीने के लिए कोई बिक्री दर्ज नहीं की गई।",
            vendorCol: "खरीदार विक्रेता",
            materialCol: "सामग्री का प्रकार",
            qtyCol: "मात्रा (किलो)",
            revenueCol: "राजस्व (₹)",
            actionCol: "कार्रवाई",
            selectVendor: "विक्रेता चुनें...",
            selectMaterial: "सामग्री चुनें...",
            totalRev: "कुल राजस्व:",
            opExpenses: "परिचालन व्यय (O&M)",
            electricity: "बिजली बिल (₹)",
            honorarium: "स्वच्छता समूह मानदेय (₹)",
            otherExp: "अन्य सामान्य खर्च (₹)",
            reportingMonthDesc: "रिपोर्टिंग महीने के लिए",
            distWorkersDesc: "श्रमिकों को कुल वितरण",
            repairsDesc: "मरम्मत, परिवहन, उपभोग्य वस्तुएं",
            totalExp: "कुल खर्च:",
            netBalance: "शुद्ध मासिक शेष:",
            cancel: "रद्द करें",
            saveReport: "रिपोर्ट सहेजें",
            saving: "सहेज रहा है...",
            submitted: "रिपोर्ट सबमिट की गई!",
            submittedDesc: "{month} {year} के लिए मासिक प्रदर्शन रिपोर्ट सफलतापूर्वक दर्ज की गई है।",
            jan: "जनवरी", feb: "फरवरी", mar: "मार्च", apr: "अप्रैल", may: "मई", jun: "जून",
            jul: "जुलाई", aug: "अगस्त", sep: "सितंबर", oct: "अक्टूबर", nov: "नवंबर", dec: "दिसंबर",
            kg: "किलो",
            reasons: [
                'बिजली/बिजली आपूर्ति समस्या',
                'ऑपरेटर (स्वच्छाग्राही) अनुपलब्ध',
                'अनुपयुक्त प्लास्टिक गुणवत्ता',
                'तकनीकी मशीन विफलता',
                'पुर्जे बदलने की आवश्यकता',
                'अन्य'
            ],
            wasteTypes: [
                'PET (पानी की बोतलें)', 'HDPE (दूध के जग)', 'LDPE (प्लास्टिक बैग)',
                'PP (टपरवेयर)', 'MLP (मल्टी-लेयर पैकेज)', 'प्रसंस्कृत RDF', 'कटा हुआ मिश्रित प्लास्टिक'
            ],
            machines: {
                fatka: 'फटका / धूल सफाई मशीन',
                baling: 'हाइड्रोलिक बेलिंग मशीन',
                shredder: 'प्लास्टिक श्रेडर मशीन',
                agglomerator: 'एग्लोमेरेटर मशीन',
                mixer: 'मिक्सर मशीन',
                granular: 'ग्रेन्यूल बनाने की मशीन'
            }
        }
    };

    const months = [
        { val: '01', label: t('jan', monthlyTranslations) }, { val: '02', label: t('feb', monthlyTranslations) }, { val: '03', label: t('mar', monthlyTranslations) },
        { val: '04', label: t('apr', monthlyTranslations) }, { val: '05', label: t('may', monthlyTranslations) }, { val: '06', label: t('jun', monthlyTranslations) },
        { val: '07', label: t('jul', monthlyTranslations) }, { val: '08', label: t('aug', monthlyTranslations) }, { val: '09', label: t('sep', monthlyTranslations) },
        { val: '10', label: t('oct', monthlyTranslations) }, { val: '11', label: t('nov', monthlyTranslations) }, { val: '12', label: t('dec', monthlyTranslations) }
    ];

    const machineOptions = t('machines', monthlyTranslations);
    const breakdownReasons = t('reasons', monthlyTranslations);
    const wasteTypes = t('wasteTypes', monthlyTranslations);

    // Handlers
    const handleBasicInfoChange = (e) => setBasicInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleExpenseChange = (e) => setExpenses(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const toggleMachineSelection = (key) => {
        setMachineStatus(prev => ({
            ...prev,
            [key]: { ...prev[key], selected: !prev[key].selected, functional: true } // Reset to functional when turning on
        }));
    };

    const updateMachineIssue = (key, field, value) => {
        setMachineStatus(prev => ({
            ...prev,
            [key]: { ...prev[key], [field]: value }
        }));
    };

    const addSaleRow = () => {
        setSales(prev => [...prev, { id: Date.now(), vendor: '', wasteType: '', quantity: '', revenue: '' }]);
    };

    const removeSaleRow = (id) => {
        setSales(prev => prev.filter(s => s.id !== id));
    };

    const updateSaleRow = (id, field, value) => {
        setSales(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    // Calculations
    const totalRevenue = sales.reduce((sum, sale) => sum + (Number(sale.revenue) || 0), 0);
    const totalExpenses = (Number(expenses.electricity) || 0) + (Number(expenses.honorarium) || 0) + (Number(expenses.other) || 0);
    const netBalance = totalRevenue - totalExpenses;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowSuccess(true);
            setTimeout(() => {
                navigate('/dashboard/pwmu');
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('submitted', monthlyTranslations)}</h2>
                    <p className="text-gray-500 mb-6">{t('submittedDesc', monthlyTranslations).replace('{month}', months.find(m => m.val === basicInfo.month)?.label).replace('{year}', basicInfo.year)}</p>
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
            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-blue-100 text-[#005DAA] rounded-lg">
                                <FileBarChart className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">{t('title', monthlyTranslations)}</h1>
                        </div>
                        <p className="text-gray-500 text-sm pl-12">{t('subtitle', monthlyTranslations)}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <select
                            name="month" value={basicInfo.month} onChange={handleBasicInfoChange}
                            className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 text-right cursor-pointer"
                        >
                            {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
                        </select>
                        <select
                            name="year" value={basicInfo.year} onChange={handleBasicInfoChange}
                            className="bg-transparent border-none text-gray-700 font-semibold focus:ring-0 p-0 cursor-pointer"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Basic Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Factory className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('facilityInfo', monthlyTranslations)}</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">{t('pwmuCenter', monthlyTranslations)}</label>
                                    <div className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                        <div className="p-2 bg-blue-100 rounded-lg text-[#005DAA]">
                                            <Factory className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#005DAA] text-lg">{basicInfo.pwmuName}</div>
                                            <div className="text-xs text-gray-500">{t('nodalOfficer', monthlyTranslations)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Asset Status */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-500" />
                                <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('assetStatus', monthlyTranslations)}</h2>
                            </div>
                            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">{t('selectMachines', monthlyTranslations)}</span>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Machine Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries(machineOptions).map(([key, label]) => {
                                    const isSelected = machineStatus[key].selected;
                                    return (
                                        <div
                                            key={key}
                                            onClick={() => toggleMachineSelection(key)}
                                            className={`p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-200 ${isSelected ? 'border-[#005DAA] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className={`text-sm font-medium ${isSelected ? 'text-[#005DAA]' : 'text-gray-600'}`}>{label}</span>
                                            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-[#005DAA] border-[#005DAA] text-white' : 'border-gray-300 bg-white'
                                                }`}>
                                                {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Detailed Status for Selected Machines */}
                            {Object.values(machineStatus).some(m => m.selected) && (
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
                                        <Wrench className="w-4 h-4" /> {t('operationalChecklist', monthlyTranslations)}
                                    </h3>
                                    {Object.entries(machineOptions).map(([key, label]) => {
                                        const machine = machineStatus[key];
                                        if (!machine.selected) return null;

                                        return (
                                            <div key={`status-${key}`} className={`p-4 rounded-xl border ${machine.functional ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <span className="font-semibold text-gray-800 flex items-center gap-2">
                                                        {machine.functional ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                                                        {label}
                                                    </span>

                                                    {/* Toggle Functional Status */}
                                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateMachineIssue(key, 'functional', true)}
                                                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${machine.functional ? 'bg-green-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {t('functional', monthlyTranslations)}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateMachineIssue(key, 'functional', false)}
                                                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors ${!machine.functional ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                                                                }`}
                                                        >
                                                            {t('nonFunctional', monthlyTranslations)}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Issue Details if broken */}
                                                {!machine.functional && (
                                                    <div className="mt-4 pt-4 border-t border-red-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
                                                        <div>
                                                            <label className="block text-xs font-medium text-red-800 mb-1">{t('dateBreakdown', monthlyTranslations)}</label>
                                                            <input
                                                                type="date"
                                                                value={machine.dateBroke}
                                                                onChange={(e) => updateMachineIssue(key, 'dateBroke', e.target.value)}
                                                                required={!machine.functional}
                                                                className="w-full p-2 bg-white border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-red-800 mb-1">{t('primaryReason', monthlyTranslations)}</label>
                                                            <select
                                                                value={machine.reason}
                                                                onChange={(e) => updateMachineIssue(key, 'reason', e.target.value)}
                                                                required={!machine.functional}
                                                                className="w-full p-2 bg-white border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-red-900"
                                                            >
                                                                <option value="">{t('selectReason', monthlyTranslations)}</option>
                                                                {breakdownReasons.map(r => <option key={r} value={r}>{r}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 3: Financials - Sales */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-gray-500" />
                                <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('salesRevenue', monthlyTranslations)}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={addSaleRow}
                                className="flex items-center gap-1 text-sm font-semibold text-[#005DAA] hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            >
                                <Plus className="w-4 h-4" /> {t('addRecord', monthlyTranslations)}
                            </button>
                        </div>
                        <div className="p-6">
                            {sales.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{t('noSales', monthlyTranslations)}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Desktop Header */}
                                    <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-4">{t('vendorCol', monthlyTranslations)}</div>
                                        <div className="col-span-3">{t('materialCol', monthlyTranslations)}</div>
                                        <div className="col-span-2 text-right">{t('qtyCol', monthlyTranslations)}</div>
                                        <div className="col-span-2 text-right">{t('revenueCol', monthlyTranslations)}</div>
                                        <div className="col-span-1 text-center">{t('actionCol', monthlyTranslations)}</div>
                                    </div>

                                    {/* Rows */}
                                    {sales.map((sale, index) => (
                                        <div key={sale.id} className="relative bg-white border border-gray-200 rounded-xl p-4 md:p-2 md:bg-transparent md:border-none md:rounded-none grid grid-cols-1 md:grid-cols-12 gap-4 items-end md:items-center animate-fade-in-up">
                                            {/* Mobile Labels */}
                                            <div className="col-span-1 md:col-span-4">
                                                <label className="md:hidden block text-xs font-semibold text-gray-500 mb-1">{t('vendorCol', monthlyTranslations)}</label>
                                                <select
                                                    value={sale.vendor} onChange={(e) => updateSaleRow(sale.id, 'vendor', e.target.value)} required
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20"
                                                >
                                                    <option value="">{t('selectVendor', monthlyTranslations)}</option>
                                                    <option value="EcoPlast Recyclers Pvt Ltd">EcoPlast Recyclers Pvt Ltd</option>
                                                    <option value="Ambuja Cement Facility">Ambuja Cement Facility</option>
                                                    <option value="Local PWD Contractor">Local PWD Contractor</option>
                                                    <option value="Other">Other (Register New)</option>
                                                </select>
                                            </div>
                                            <div className="col-span-1 md:col-span-3">
                                                <label className="md:hidden block text-xs font-semibold text-gray-500 mb-1">{t('materialCol', monthlyTranslations)}</label>
                                                <select
                                                    value={sale.wasteType} onChange={(e) => updateSaleRow(sale.id, 'wasteType', e.target.value)} required
                                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005DAA]/20"
                                                >
                                                    <option value="">{t('selectMaterial', monthlyTranslations)}</option>
                                                    {wasteTypes.map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="md:hidden block text-xs font-semibold text-gray-500 mb-1">{t('qtyCol', monthlyTranslations)}</label>
                                                <div className="relative">
                                                    <input
                                                        type="number" value={sale.quantity} onChange={(e) => updateSaleRow(sale.id, 'quantity', e.target.value)} required min="0" placeholder="0"
                                                        className="w-full p-2 pl-3 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#005DAA]/20 font-mono"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">{t('kg', monthlyTranslations)}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-1 md:col-span-2">
                                                <label className="md:hidden block text-xs font-semibold text-gray-500 mb-1">{t('revenueCol', monthlyTranslations)}</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                    <input
                                                        type="number" value={sale.revenue} onChange={(e) => updateSaleRow(sale.id, 'revenue', e.target.value)} required min="0" placeholder="0"
                                                        className="w-full p-2 pl-7 bg-gray-50 border border-gray-200 rounded-lg text-sm text-right focus:ring-2 focus:ring-[#005DAA]/20 font-mono text-green-700 font-bold"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-1 md:col-span-1 flex justify-end md:justify-center mt-2 md:mt-0">
                                                <button
                                                    type="button" onClick={() => removeSaleRow(sale.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                    title="Remove Row"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Subtotal */}
                                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                                        <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-3">
                                            <span className="text-sm font-semibold text-green-800">{t('totalRev', monthlyTranslations)}</span>
                                            <span className="text-lg font-bold text-green-700 font-mono">₹{totalRevenue.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 4: Operating Expenses */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <IndianRupee className="w-5 h-5 text-gray-500" />
                            <h2 className="font-semibold text-gray-800 tracking-wide uppercase text-sm">{t('opExpenses', monthlyTranslations)}</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('electricity', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="electricity" value={expenses.electricity} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('reportingMonthDesc', monthlyTranslations)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('honorarium', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="honorarium" value={expenses.honorarium} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('distWorkersDesc', monthlyTranslations)}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('otherExp', monthlyTranslations)}</label>
                                    <input
                                        type="number" name="other" value={expenses.other} onChange={handleExpenseChange} min="0" placeholder="0"
                                        className="w-full p-2.5 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#005DAA]/20 focus:border-[#005DAA] font-mono text-gray-800 relative"
                                        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239CA3AF\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'><line x1=\'12\' y1=\'1\' x2=\'12\' y2=\'23\'></line><path d=\'M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'></path></svg>")', backgroundPosition: '10px center', backgroundRepeat: 'no-repeat' }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{t('repairsDesc', monthlyTranslations)}</p>
                                </div>
                            </div>

                            {/* Expense Subtotal */}
                            <div className="pt-4 mt-6 border-t border-gray-100 flex justify-end">
                                <div className="bg-red-50 px-4 py-2 rounded-lg border border-red-100 flex items-center gap-3">
                                    <span className="text-sm font-semibold text-red-800">{t('totalExp', monthlyTranslations)}</span>
                                    <span className="text-lg font-bold text-red-700 font-mono">₹{totalExpenses.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar (Sticky) */}
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">

                        {/* Summary Pill */}
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-4 text-sm font-bold border ${netBalance >= 0 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                            <span>{t('netBalance', monthlyTranslations)}</span>
                            <span className="text-xl font-mono tracking-tight">
                                {netBalance >= 0 ? '+' : ''}₹{netBalance.toLocaleString()}
                            </span>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <button type="button" onClick={() => navigate('/dashboard/pwmu')} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                                {t('cancel', monthlyTranslations)}
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving || !basicInfo.pwmuName}
                                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-[#005DAA] text-white font-bold hover:bg-[#00427A] shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                            >
                                {isSaving ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>{t('saving', monthlyTranslations)}</span>
                                    </div>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        {t('saveReport', monthlyTranslations)}
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

export default PWMUMonthlyReport;
