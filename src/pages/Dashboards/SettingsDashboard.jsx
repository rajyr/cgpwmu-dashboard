import React, { useState } from 'react';
import {
    Settings, Users, Shield, Bell, Save, Sliders, Database, Key, Check, Plus, Search, Filter, MoreVertical
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SettingsDashboard = () => {
    const { userRole } = useAuth();
    const [activeTab, setActiveTab] = useState('users');

    // Security Lockdown: Double check role inside component
    const effectiveRole = userRole === 'StateAdmin' ? 'Admin' : userRole;
    if (effectiveRole !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
    }

    const tabs = [
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'thresholds', label: 'System Thresholds', icon: Sliders },
        { id: 'notifications', label: 'Notification Rules', icon: Bell },
        { id: 'integrations', label: 'API Integrations', icon: Database },
        { id: 'security', label: 'Security & Access', icon: Shield },
    ];

    // Mock User Data with state for Approval demo
    const [users, setUsers] = useState([
        { id: 1, name: 'Raj Yamgar', email: 'raj@sbm.gov.in', role: 'State Admin', status: 'Active', lastActive: '2 mins ago' },
        { id: 2, name: 'Priya Sharma', email: 'priya@raipur.gov.in', role: 'District Nodal', status: 'Active', lastActive: '1 hr ago' },
        { id: 3, name: 'Amit Kumar', email: 'amit.k@pwmu.in', role: 'PWMU Manager', status: 'Inactive', lastActive: '5 days ago' },
        { id: 4, name: 'Neha Gupta', email: 'neha@sbm.gov.in', role: 'Auditor', status: 'Active', lastActive: '3 hrs ago' },
        { id: 5, name: 'Suresh Patel', email: 'suresh@village.in', role: 'Sarpanch', status: 'Pending', lastActive: 'Never' },
    ]);

    const handleApprove = (userId) => {
        setUsers(prev => prev.map(u =>
            u.id === userId ? { ...u, status: 'Active' } : u
        ));
    };

    const handleReject = (userId) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage system access, roles, and permissions.</p>
                            </div>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                <Plus className="w-4 h-4" /> Add New User
                            </button>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users by name, email, or role..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 bg-white">
                                <Filter className="w-4 h-4" /> Filters
                            </button>
                        </div>

                        {/* Users Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">System Role</th>
                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                                        <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-700 font-medium">{user.role}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    user.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-500">{user.lastActive}</span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {user.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleApprove(user.id)}
                                                            className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(user.id)}
                                                            className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'thresholds':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">System Thresholds</h2>
                            <p className="text-sm text-gray-500 mt-1">Configure automated alert triggers and operational benchmarks.</p>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            {/* Setting Group 1 */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Operational Alerts</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700">Reporting Delay Flag</label>
                                            <p className="text-xs text-gray-500">Days before a PWMU is marked 'Delayed' in Compliance.</p>
                                        </div>
                                        <div className="w-32">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 ring-blue-500">
                                                <input type="number" defaultValue={10} className="w-full px-3 py-2 text-sm outline-none text-center font-semibold" />
                                                <span className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-l border-gray-200">Days</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700">Machine Downtime Critical Alert</label>
                                            <p className="text-xs text-gray-500">Hours of continuous failure before SMS goes to Nodal Officer.</p>
                                        </div>
                                        <div className="w-32">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 ring-blue-500">
                                                <input type="number" defaultValue={48} className="w-full px-3 py-2 text-sm outline-none text-center font-semibold" />
                                                <span className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-l border-gray-200">Hrs</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Setting Group 2 */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Performance Benchmarks</h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm font-semibold text-gray-700">Minimum expected yield</label>
                                            <p className="text-xs text-gray-500">Triggers 'Poor Quality' flag if recyclables extracted is lower.</p>
                                        </div>
                                        <div className="w-32">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-1 ring-blue-500">
                                                <input type="number" defaultValue={85} className="w-full px-3 py-2 text-sm outline-none text-center font-semibold" />
                                                <span className="bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 border-l border-gray-200">%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm ml-auto">
                                <Save className="w-4 h-4" /> Save Thresholds
                            </button>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Notification Rules</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage global email, SMS, and push notification triggers.</p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm max-w-3xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-5 text-sm font-bold text-gray-800 w-1/2">Trigger Event</th>
                                        <th className="py-4 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">In-App</th>
                                        <th className="py-4 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Email</th>
                                        <th className="py-4 px-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">SMS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { desc: 'New User Registration Pending', app: true, email: true, sms: false },
                                        { desc: 'Critical Machine Failure Reported', app: true, email: true, sms: true },
                                        { desc: 'Monthly SLA Report Generated', app: true, email: false, sms: false },
                                        { desc: 'Data Sync Failure (SBM Portal)', app: true, email: true, sms: true },
                                    ].map((rule, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-5 text-sm font-medium text-gray-700">{rule.desc}</td>
                                            <td className="py-4 px-5 text-center">
                                                <input type="checkbox" defaultChecked={rule.app} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                                            </td>
                                            <td className="py-4 px-5 text-center">
                                                <input type="checkbox" defaultChecked={rule.email} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                                            </td>
                                            <td className="py-4 px-5 text-center">
                                                <input type="checkbox" defaultChecked={rule.sms} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                    <Save className="w-4 h-4" /> Save Rules
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'integrations':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">API Integrations</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage external connections and data sync configurations.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                            {/* Integration Card 1 */}
                            <div className="bg-white border flex flex-col border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                            <Database className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">SBM Phase II Portal</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Check className="w-3 h-3 text-green-500" /> Connected (Synced 5 mins ago)</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600"><Settings className="w-4 h-4" /></button>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 flex-1">Two-way synchronization of village-level ODF+ metrics and waste facility operational logs.</p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                    <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">API_KEY_****a8f</span>
                                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-800">Rotate Key</button>
                                </div>
                            </div>

                            {/* Integration Card 2 */}
                            <div className="bg-white border flex flex-col border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
                                            <Key className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">NIC SMS Gateway</h3>
                                            <p className="text-xs text-gray-500 mt-0.5 text-yellow-600">Auth Expiring in 5 days</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600"><Settings className="w-4 h-4" /></button>
                                </div>
                                <p className="text-sm text-gray-600 mb-6 flex-1">Gateway for sending automated SMS alerts to Nodal Officers and Sarpanch.</p>
                                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                    <button className="text-xs font-semibold bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded hover:bg-yellow-100 transition-colors">Renew Token</button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-fade-in">
                        <Shield className="w-12 h-12 mb-3 opacity-20" />
                        <p>This module is currently under setup.</p>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-6 font-sans pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8 text-gray-700" />
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">System Settings</h1>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 mt-0.5 uppercase tracking-wide">Admin Access Only</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Central configuration and control hub for the CG-PWMU platform.</p>
                </div>
            </div>

            {/* Main Layout: Sidebar + Content */}
            <div className="flex flex-col md:flex-row gap-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

                {/* Settings Sidebar Nav */}
                <div className="w-full md:w-64 shrink-0">
                    <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm sticky top-6">
                        <nav className="flex flex-col gap-1">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                                        {tab.label}
                                        {isActive && <div className="w-1 h-5 bg-blue-600 rounded-full ml-auto absolute -right-2 hidden md:block"></div>}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    {renderContent()}
                </div>

            </div>
        </div>
    );
};

export default SettingsDashboard;
