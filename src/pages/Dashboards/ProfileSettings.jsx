import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
    User, Mail, Phone, MapPin, Factory, Home, Truck, 
    Save, Loader2, CheckCircle2, AlertCircle, Building2
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const ProfileSettings = () => {
    const { user, userRole, refreshProfile } = useAuth();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [pwmuCenters, setPwmuCenters] = useState([]);
    
    const [locationData, setLocationData] = useState({});
    const [serviceDistrict, setServiceDistrict] = useState('');
    const [serviceBlock, setServiceBlock] = useState('');
    const [serviceGP, setServiceGP] = useState('');
    const [serviceVillage, setServiceVillage] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        district: '',
        block: '',
        // Role specific data will be held here too
        registration_data: {}
    });

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone_number: user.phone_number || '',
                district: user.district || user.registration_data?.district || '',
                block: user.block || user.registration_data?.block || '',
                registration_data: {
                    ...user.registration_data,
                    partnered_pwmus: user.registration_data?.partnered_pwmus || [],
                    serviceVillages: user.registration_data?.serviceVillages || []
                }
            });
        }

        const fetchPwmus = async () => {
            try {
                const { data, error } = await supabase
                    .from('pwmu_centers')
                    .select('id, name, district');
                
                if (error) throw error;
                setPwmuCenters(data || []);
            } catch (err) {
                console.error("Failed to fetch PWMUs:", err);
            }
        };
        fetchPwmus();

        const loadLocationData = async () => {
            const paths = [
                `${import.meta.env.BASE_URL}data/locationData.json`,
                'data/locationData.json',
                '/cgpwmu/data/locationData.json'
            ];
            for (const path of paths) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const data = await res.json();
                        setLocationData(data);
                        return;
                    }
                } catch (e) {}
            }
        };
        loadLocationData();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegDataChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            registration_data: {
                ...prev.registration_data,
                [name]: value
            }
        }));
    };

    const removeVillage = (vName) => {
        setFormData(prev => ({
            ...prev,
            registration_data: {
                ...prev.registration_data,
                serviceVillages: (prev.registration_data.serviceVillages || []).filter(v => v !== vName)
            }
        }));
    };

    const toggleVillage = (vName) => {
        setFormData(prev => {
            const current = prev.registration_data.serviceVillages || [];
            const isSelected = current.includes(vName);
            return {
                ...prev,
                registration_data: {
                    ...prev.registration_data,
                    serviceVillages: isSelected 
                        ? current.filter(v => v !== vName)
                        : [...current, vName]
                }
            };
        });
    };

    const toggleGP = (gpName) => {
        if (!serviceDistrict || !serviceBlock) return;
        const gpVillages = locationData[serviceDistrict][serviceBlock][gpName] || [];
        setFormData(prev => {
            const current = prev.registration_data.serviceVillages || [];
            const allInGP = gpVillages.every(v => current.includes(v));
            
            let nextVillages;
            if (allInGP) {
                // Remove all in this GP
                nextVillages = current.filter(v => !gpVillages.includes(v));
            } else {
                // Add all missing in this GP
                nextVillages = [...new Set([...current, ...gpVillages])];
            }
            
            return {
                ...prev,
                registration_data: {
                    ...prev.registration_data,
                    serviceVillages: nextVillages
                }
            };
        });
    };

    const addAllInBlock = () => {
        if (!serviceDistrict || !serviceBlock) return;
        const blockData = locationData[serviceDistrict][serviceBlock];
        const allVillagesInBlock = Object.values(blockData).flat();
        
        setFormData(prev => ({
            ...prev,
            registration_data: {
                ...prev.registration_data,
                serviceVillages: [...new Set([...(prev.registration_data.serviceVillages || []), ...allVillagesInBlock])]
            }
        }));
    };

    const addVillage = () => {
        if (!serviceVillage) return;
        setFormData(prev => {
            const current = prev.registration_data.serviceVillages || [];
            if (current.includes(serviceVillage)) return prev;
            return {
                ...prev,
                registration_data: {
                    ...prev.registration_data,
                    serviceVillages: [...current, serviceVillage]
                }
            };
        });
        setServiceVillage('');
    };

    const districts = Object.keys(locationData);
    const blocks = serviceDistrict ? Object.keys(locationData[serviceDistrict] || {}) : [];
    const gps = (serviceDistrict && serviceBlock) ? Object.keys(locationData[serviceDistrict][serviceBlock] || {}) : [];
    const villages = (serviceDistrict && serviceBlock && serviceGP) ? (locationData[serviceDistrict][serviceBlock][serviceGP] || []) : [];

    const handlePwmuToggle = (pwmuId) => {
        setFormData(prev => {
            const currentPartners = prev.registration_data?.partnered_pwmus || [];
            const isSelected = currentPartners.includes(pwmuId);
            return {
                ...prev,
                registration_data: {
                    ...prev.registration_data,
                    partnered_pwmus: isSelected 
                        ? currentPartners.filter(id => id !== pwmuId)
                        : [...currentPartners, pwmuId]
                }
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const token = session.access_token;
            if (!token) throw new Error("No session found");

            const response = await fetch('/cgpwmu/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(true);
                await refreshProfile();
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const errData = await response.json();
                throw new Error(errData.error || "Update failed");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;

    const isPWMU = userRole === 'PWMUManager';
    const isVillage = userRole === 'Sarpanch';
    const isVendor = userRole === 'Vendor';

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-bold">
                            {user.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{user.full_name}</h1>
                            <p className="text-blue-100 text-sm opacity-90">{userRole}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <User className="w-5 h-5 text-blue-600" /> Basic Profile
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                <input 
                                    type="text" name="full_name" value={formData.full_name} onChange={handleInputChange}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                    Email / Login ID <AlertCircle className="w-3 h-3 text-amber-500" title="Non-editable" />
                                </label>
                                <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed">
                                    <Mail className="w-4 h-4" /> {user.email}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="tel" name="phone_number" value={formData.phone_number} onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Location Info */}
                    <section className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                            <MapPin className="w-5 h-5 text-blue-600" /> Location Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                    District <AlertCircle className="w-3 h-3 text-amber-500" title="Locked" />
                                </label>
                                <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed">
                                    <MapPin className="w-4 h-4" /> {user.district || '—'}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                                    Block <AlertCircle className="w-3 h-3 text-amber-500" title="Locked" />
                                </label>
                                <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 flex items-center gap-2 cursor-not-allowed">
                                    <Building2 className="w-4 h-4" /> {user.block || user.registration_data?.block || '—'}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Role Specific Registration Data */}
                    {isPWMU && (
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Factory className="w-5 h-5 text-blue-600" /> PWMU Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Capacity (Tons/Day)</label>
                                    <input 
                                        type="number" value={formData.registration_data.capacity || ''} 
                                        onChange={(e) => handleRegDataChange('capacity', e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <p className="text-sm font-medium text-gray-500">Installed Machinery</p>
                                    <div className="flex flex-wrap gap-4">
                                        {[
                                            { id: 'hasBaler', label: 'Baler' },
                                            { id: 'hasShredder', label: 'Shredder' },
                                            { id: 'hasFatka', label: 'Fatka' },
                                            { id: 'hasWeight', label: 'Weighing' }
                                        ].map(m => (
                                            <label key={m.id} className="inline-flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" checked={formData.registration_data[m.id] || false}
                                                    onChange={(e) => handleRegDataChange(m.id, e.target.checked)}
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{m.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Home className="w-4 h-4 text-blue-600" /> Service Area / Linked Villages
                                </h4>
                                
                                <div className="space-y-4">
                                    {/* Existing Villages */}
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-3">Currently Linked ({formData.registration_data.serviceVillages?.length || 0})</p>
                                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                            {(formData.registration_data.serviceVillages || []).map(v => (
                                                <div key={v} className="flex items-center gap-1.5 bg-white text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-200 shadow-sm transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-700 group">
                                                    {v}
                                                    <button type="button" onClick={() => removeVillage(v)} className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">×</button>
                                                </div>
                                            ))}
                                            {(formData.registration_data.serviceVillages || []).length === 0 && (
                                                <span className="text-xs text-gray-400 italic">No villages linked yet</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Add New Village */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <p className="text-xs font-bold text-gray-500 uppercase">Add Villages</p>
                                            {serviceDistrict && serviceBlock && (
                                                <button
                                                    type="button"
                                                    onClick={addAllInBlock}
                                                    className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                                                >
                                                    + Select All in {serviceBlock}
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                            <select
                                                value={serviceDistrict}
                                                onChange={(e) => { setServiceDistrict(e.target.value); setServiceBlock(''); setServiceGP(''); setServiceVillage(''); }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20"
                                            >
                                                <option value="">Select District</option>
                                                {districts.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                            <select
                                                value={serviceBlock}
                                                onChange={(e) => { setServiceBlock(e.target.value); setServiceGP(''); setServiceVillage(''); }}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                                                disabled={!serviceDistrict}
                                            >
                                                <option value="">Select Block</option>
                                                {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                                            </select>
                                        </div>

                                        {serviceDistrict && serviceBlock ? (
                                            <div className="bg-white p-3 rounded-xl border border-gray-200 max-h-80 overflow-y-auto custom-scrollbar space-y-4">
                                                {Object.keys(locationData[serviceDistrict][serviceBlock] || {}).map(gp => {
                                                    const gpVillages = locationData[serviceDistrict][serviceBlock][gp] || [];
                                                    const currentService = formData.registration_data.serviceVillages || [];
                                                    const allInGP = gpVillages.length > 0 && gpVillages.every(v => currentService.includes(v));
                                                    
                                                    return (
                                                        <div key={gp} className="space-y-2 border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                                            <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg">
                                                                <span className="text-xs font-bold text-gray-700">{gp}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleGP(gp)}
                                                                    className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${allInGP ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'}`}
                                                                >
                                                                    {allInGP ? 'Deselect GP' : 'Select All GP'}
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-2">
                                                                {gpVillages.map(v => (
                                                                    <label key={v} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded transition-colors group">
                                                                        <input 
                                                                            type="checkbox"
                                                                            checked={currentService.includes(v)}
                                                                            onChange={() => toggleVillage(v)}
                                                                            className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                        />
                                                                        <span className="text-[11px] text-gray-600 group-hover:text-gray-900 line-clamp-1">{v}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                                <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                <p className="text-xs text-gray-400">Select a district and block to see available villages</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {isVillage && (
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Home className="w-5 h-5 text-blue-600" /> Village Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Gram Panchayat</label>
                                    <input 
                                        type="text" value={formData.registration_data.gramPanchayatName || ''} 
                                        onChange={(e) => handleRegDataChange('gramPanchayatName', e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Village Name</label>
                                    <input 
                                        type="text" value={formData.registration_data.primaryVillage || ''} 
                                        onChange={(e) => handleRegDataChange('primaryVillage', e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {isVendor && (
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Truck className="w-5 h-5 text-blue-600" /> Vendor Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Firm Name</label>
                                    <input 
                                        type="text" value={formData.registration_data.firmName || ''} 
                                        onChange={(e) => handleRegDataChange('firmName', e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">GST Number</label>
                                    <input 
                                        type="text" value={formData.registration_data.gstNumber || ''} 
                                        onChange={(e) => handleRegDataChange('gstNumber', e.target.value)}
                                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Partnered PWMU Hubs</label>
                                    <p className="text-xs text-gray-500 mb-3">Select the PWMU hubs you purchase waste from to see their availability in your Vendor Hub.</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                                        {pwmuCenters.length === 0 ? (
                                            <p className="text-xs text-gray-400 p-2 col-span-full">Loading PWMU Hubs...</p>
                                        ) : pwmuCenters.map(pwmu => {
                                            const currentPartners = formData.registration_data?.partnered_pwmus || [];
                                            const isSelected = currentPartners.includes(pwmu.id);
                                            return (
                                                <label key={pwmu.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all shadow-sm
                                                    ${isSelected ? 'bg-blue-50/80 border-blue-300 shadow-blue-100/50' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={isSelected}
                                                        onChange={() => handlePwmuToggle(pwmu.id)}
                                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm font-bold leading-tight ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>{pwmu.name}</span>
                                                        <span className="text-[11px] font-medium text-gray-500 mt-0.5">{pwmu.district}</span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Messages */}
                    {success && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 animate-fade-in">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">Profile updated successfully!</p>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="pt-6 border-t flex justify-end">
                        <button
                            type="submit" disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <><Save className="w-5 h-5" /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
