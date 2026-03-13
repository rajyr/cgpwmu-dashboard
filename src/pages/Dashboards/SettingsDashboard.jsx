import React, { useState, useEffect, useCallback } from 'react';
import {
    Settings, Users, Shield, Bell, Save, Sliders, Database, Key, Check, Plus, Search, Filter, MoreVertical, Loader2, RefreshCw, X, CheckCircle2, XCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const getProxyUrl = () => (import.meta.env.DEV ? '/supabase' : SUPABASE_URL);

const SettingsDashboard = () => {
    const { userRole } = useAuth();
    const [activeTab, setActiveTab] = useState('users');

    // Security Lockdown
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

    // Real user data from database
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [activeActionsMenu, setActiveActionsMenu] = useState(null);
    const [autoApprove, setAutoApprove] = useState(true); // Default to true as requested
    const [settingsLoading, setSettingsLoading] = useState(false);

    const roleLabelMap = {
        'StateAdmin': 'State Admin', 'DistrictNodal': 'District Nodal',
        'PWMUManager': 'PWMU Manager', 'Sarpanch': 'Sarpanch', 'Vendor': 'Vendor',
    };

    // Fetch all users from database
    const fetchUsers = useCallback(async () => {
        setLoadingUsers(true);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const token = session.access_token;
            if (!token) return;

            const proxyUrl = getProxyUrl();
            const res = await fetch(
                `${proxyUrl}/rest/v1/users?select=id,full_name,role,status,district,phone_number,created_at&order=created_at.desc`,
                {
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(8000),
                }
            );
            if (res.ok) {
                const data = await res.json();
                setUsers(data.map(u => ({
                    ...u,
                    name: u.full_name || 'Unknown',
                    status: u.status || 'approved',
                })));
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoadingUsers(false);
        }
    }, []);

    const fetchSettings = useCallback(async () => {
        setSettingsLoading(true);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const token = session.access_token;
            if (!token) return;

            const proxyUrl = getProxyUrl();
            const res = await fetch(
                `${proxyUrl}/rest/v1/system_settings?key=eq.auto_approve_users`,
                {
                    headers: {
                        'apikey': ANON_KEY,
                        'Authorization': `Bearer ${token}`,
                    },
                    signal: AbortSignal.timeout(5000),
                }
            );
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setAutoApprove(data[0].value === true);
                }
            }
        } catch (err) {
            console.warn('System settings table might not exist yet:', err);
        } finally {
            setSettingsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchSettings();
    }, [fetchUsers, fetchSettings]);

    const toggleAutoApprove = async () => {
        const newValue = !autoApprove;
        setAutoApprove(newValue);
        setSettingsLoading(true);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const proxyUrl = getProxyUrl();
            await fetch(`${proxyUrl}/rest/v1/system_settings?key=eq.auto_approve_users`, {
                method: 'PATCH',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({ value: newValue }),
                signal: AbortSignal.timeout(5000),
            });
            // If PATCH fails (table missing), we still keep the local state for now
        } catch (err) {
            console.warn('Failed to save auto-approve setting:', err);
        } finally {
            setSettingsLoading(false);
        }
    };

    // Approve a pending user
    const handleApprove = async (userId) => {
        setActionLoading(userId);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const proxyUrl = getProxyUrl();
            await fetch(`${proxyUrl}/rest/v1/users?id=eq.${userId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({ status: 'approved' }),
                signal: AbortSignal.timeout(8000),
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'approved' } : u));
        } catch (err) {
            console.error('Error approving user:', err);
        } finally {
            setActionLoading(null);
        }
    };

    // Reject a pending user
    const handleReject = async (userId) => {
        setActionLoading(userId);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const proxyUrl = getProxyUrl();
            await fetch(`${proxyUrl}/rest/v1/users?id=eq.${userId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({ status: 'rejected' }),
                signal: AbortSignal.timeout(8000),
            });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
        } catch (err) {
            console.error('Error rejecting user:', err);
        } finally {
            setActionLoading(null);
        }
    };

    // Delete a user
    const handleDeleteUser = async (userId) => {
        setActionLoading(userId);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const proxyUrl = getProxyUrl();
            const res = await fetch(`${proxyUrl}/rest/v1/users?id=eq.${userId}`, {
                method: 'DELETE',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                },
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                setShowDeleteConfirm(false);
            }
        } catch (err) {
            console.error('Error deleting user:', err);
        } finally {
            setActionLoading(null);
        }
    };

    // Update user details
    const handleUpdateUser = async (updatedData) => {
        if (!editingUser) return;
        setLoadingUsers(true);
        try {
            const session = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}');
            const proxyUrl = getProxyUrl();
            const res = await fetch(`${proxyUrl}/rest/v1/users?id=eq.${editingUser.id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal',
                },
                body: JSON.stringify({
                    full_name: updatedData.full_name,
                    role: updatedData.role,
                    district: updatedData.district,
                    phone_number: updatedData.phone_number
                }),
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok) {
                setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...updatedData, name: updatedData.full_name } : u));
                setShowEditModal(false);
                setEditingUser(null);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        } finally {
            setLoadingUsers(false);
        }
    };

    // Filtered users
    const filteredUsers = users.filter(u => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (u.name || '').toLowerCase().includes(q) || (u.role || '').toLowerCase().includes(q) || (u.district || '').toLowerCase().includes(q);
    });
    const pendingUsers = filteredUsers.filter(u => u.status === 'pending');
    const otherUsers = filteredUsers.filter(u => u.status !== 'pending');

    // Add User Modal
    const AddUserModal = () => {
        const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', role: 'DistrictNodal', district: '', phone_number: '' });
        const [adding, setAdding] = useState(false);
        const [addError, setAddError] = useState('');
        const [addSuccess, setAddSuccess] = useState(false);

        const handleAdd = async () => {
            setAdding(true);
            setAddError('');
            try {
                if (!newUser.email || !newUser.password) throw new Error('Email and password are required.');
                if (newUser.password.length < 6) throw new Error('Password must be at least 6 characters.');

                const proxyUrl = getProxyUrl();
                // 1. Create auth user
                const authRes = await fetch(`${proxyUrl}/auth/v1/signup`, {
                    method: 'POST',
                    headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: newUser.email, password: newUser.password }),
                    signal: AbortSignal.timeout(12000),
                });
                const authData = await authRes.json();
                if (!authRes.ok) throw new Error(authData.msg || authData.error_description || 'Failed to create user');

                // 2. Insert into users table as auto-approved
                const token = JSON.parse(localStorage.getItem('cgpwmu_session') || '{}').access_token;
                const userId = authData.user?.id;
                if (userId) {
                    await fetch(`${proxyUrl}/rest/v1/users`, {
                        method: 'POST',
                        headers: {
                            'apikey': ANON_KEY,
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal',
                        },
                        body: JSON.stringify({
                            id: userId,
                            full_name: newUser.full_name,
                            role: newUser.role,
                            status: 'approved',
                            district: newUser.district || null,
                            phone_number: newUser.phone_number || null,
                        }),
                        signal: AbortSignal.timeout(8000),
                    });
                }
                setAddSuccess(true);
                setTimeout(() => { setShowAddModal(false); fetchUsers(); }, 1500);
            } catch (err) {
                setAddError(err.message);
            } finally {
                setAdding(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-blue-600" /> Add New User</h3>

                    {addSuccess ? (
                        <div className="text-center py-8">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="text-lg font-bold text-gray-800">User Created!</p>
                            <p className="text-sm text-gray-500">Account is auto-approved and ready to use.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={newUser.full_name} onChange={e => setNewUser(p => ({ ...p, full_name: e.target.value }))} placeholder="Full Name" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                                <input type="email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                                <input type="password" value={newUser.password} onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} placeholder="Min 6 characters" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                        <option value="StateAdmin">State Admin</option>
                                        <option value="DistrictNodal">District Nodal</option>
                                        <option value="PWMUManager">PWMU Manager</option>
                                        <option value="Sarpanch">Sarpanch</option>
                                        <option value="Vendor">Vendor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                    <input type="text" value={newUser.district} onChange={e => setNewUser(p => ({ ...p, district: e.target.value }))} placeholder="District" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="tel" value={newUser.phone_number} onChange={e => setNewUser(p => ({ ...p, phone_number: e.target.value }))} placeholder="+91" className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                            {addError && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{addError}</p>}
                            <button onClick={handleAdd} disabled={adding} className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                                {adding ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create User (Auto-Approved)</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Edit User Modal
    const EditUserModal = () => {
        const [formData, setFormData] = useState({ ...editingUser });
        if (!editingUser) return null;

        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Save className="w-5 h-5 text-blue-600" /> Edit User Profile</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" value={formData.full_name || ''} onChange={e => setFormData(p => ({ ...p, full_name: e.target.value }))} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={formData.role || ''} onChange={e => setFormData(p => ({ ...p, role: e.target.value }))} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                    <option value="StateAdmin">State Admin</option>
                                    <option value="DistrictNodal">District Nodal</option>
                                    <option value="PWMUManager">PWMU Manager</option>
                                    <option value="Sarpanch">Sarpanch</option>
                                    <option value="Vendor">Vendor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                                <input type="text" value={formData.district || ''} onChange={e => setFormData(p => ({ ...p, district: e.target.value }))} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" value={formData.phone_number || ''} onChange={e => setFormData(p => ({ ...p, phone_number: e.target.value }))} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setShowEditModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                            <button onClick={() => handleUpdateUser(formData)} disabled={loadingUsers} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                                {loadingUsers ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Delete Confirmation Modal
    const DeleteConfirmModal = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Delete User?</h3>
                <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone. The user will lose all access immediately.</p>
                <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Go Back</button>
                    <button onClick={() => handleDeleteUser(userToDelete)} disabled={actionLoading === userToDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                        {actionLoading === userToDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Permanently'}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <div className="animate-fade-in">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800">User Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Manage system access, roles, and approvals. <span className="font-medium text-blue-600">{pendingUsers.length} pending</span></p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 bg-white">
                                    <RefreshCw className={`w-4 h-4 ${loadingUsers ? 'animate-spin' : ''}`} /> Refresh
                                </button>
                                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                    <Plus className="w-4 h-4" /> Add New User
                                </button>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Search users by name, role, or district..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {loadingUsers ? (
                            <div className="flex items-center justify-center py-16 text-gray-400">
                                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading users...
                            </div>
                        ) : (
                            <>
                                {/* Pending Approval Section */}
                                {pendingUsers.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span> Pending Approval ({pendingUsers.length})
                                        </h3>
                                        <div className="border-2 border-amber-200 rounded-xl overflow-hidden bg-amber-50/30">
                                            <table className="w-full text-left border-collapse">
                                                <tbody className="divide-y divide-amber-100">
                                                    {pendingUsers.map(user => (
                                                        <tr key={user.id} className="hover:bg-amber-50 transition-colors">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                                        {(user.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                                        <p className="text-xs text-gray-500">{user.district || 'No district'}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-sm text-gray-700 font-medium">{roleLabelMap[user.role] || user.role}</span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-xs text-gray-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
                                                            </td>
                                                            <td className="py-3 px-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button onClick={() => handleApprove(user.id)} disabled={actionLoading === user.id}
                                                                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 disabled:bg-gray-300 flex items-center gap-1">
                                                                        {actionLoading === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Approve
                                                                    </button>
                                                                    <button onClick={() => handleReject(user.id)} disabled={actionLoading === user.id}
                                                                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 disabled:bg-gray-300 flex items-center gap-1">
                                                                        <XCircle className="w-3 h-3" /> Reject
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* All Users */}
                                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/80 border-b border-gray-200">
                                            <tr>
                                                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                                                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">System Role</th>
                                                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
                                                <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {otherUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors relative">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                                                                {(user.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                                                <p className="text-xs text-gray-500">{user.district || '—'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-sm text-gray-700 font-medium">{roleLabelMap[user.role] || user.role}</span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${user.status === 'approved' ? 'bg-green-100 text-green-700' : user.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                            {user.status === 'approved' ? 'Active' : user.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="text-xs text-gray-400">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right overflow-visible">
                                                        <div className="relative inline-block">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setActiveActionsMenu(activeActionsMenu === user.id ? null : user.id);
                                                                }}
                                                                className={`p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors ${activeActionsMenu === user.id ? 'bg-gray-100 text-gray-700' : ''}`}
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>

                                                            {activeActionsMenu === user.id && (
                                                                <>
                                                                    <div className="fixed inset-0 z-10" onClick={() => setActiveActionsMenu(null)}></div>
                                                                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-fade-in">
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingUser(user);
                                                                                setShowEditModal(true);
                                                                                setActiveActionsMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                                                        >
                                                                            <Settings className="w-3 h-3" /> Edit Profile
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                setUserToDelete(user.id);
                                                                                setShowDeleteConfirm(true);
                                                                                setActiveActionsMenu(null);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                                        >
                                                                            <XCircle className="w-3 h-3" /> Delete User
                                                                        </button>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {otherUsers.length === 0 && (
                                                <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No users found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {showAddModal && <AddUserModal />}
                        {showEditModal && <EditUserModal />}
                        {showDeleteConfirm && <DeleteConfirmModal />}
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
                                            <td className="py-4 px-5 text-center"><input type="checkbox" defaultChecked={rule.app} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" /></td>
                                            <td className="py-4 px-5 text-center"><input type="checkbox" defaultChecked={rule.email} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" /></td>
                                            <td className="py-4 px-5 text-center"><input type="checkbox" defaultChecked={rule.sms} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" /></td>
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
                            <div className="bg-white border flex flex-col border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Database className="w-5 h-5" /></div>
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
                            <div className="bg-white border flex flex-col border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600"><Key className="w-5 h-5" /></div>
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

            case 'security':
                return (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">Security & Access</h2>
                            <p className="text-sm text-gray-500 mt-1">Configure platform security rules and global access controls.</p>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            {/* Auto-Approval Section */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-blue-600" />
                                            User Registration Rules
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                            When enabled, all new registrations will be automatically approved and granted immediate access. When disabled, administrators must manually approve each account.
                                        </p>
                                    </div>
                                    <div className="shrink-0 flex flex-col items-end">
                                        <button
                                            onClick={toggleAutoApprove}
                                            disabled={settingsLoading}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoApprove ? 'bg-green-500' : 'bg-gray-200'}`}
                                        >
                                            <span className={`${autoApprove ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                        </button>
                                        <span className={`text-[10px] font-bold mt-1 uppercase ${autoApprove ? 'text-green-600' : 'text-gray-400'}`}>
                                            {autoApprove ? 'Auto-Approve ON' : 'Manual Approval'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Password Policy */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-60">
                                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Key className="w-4 h-4 text-gray-400" />
                                    Password Policies
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Minimum Length</span>
                                        <span className="font-bold text-gray-800">8 Characters</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-600">Require Special Character</span>
                                        <span className="font-bold text-gray-400 italic">Optional</span>
                                    </div>
                                </div>
                                <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded mt-4">Managed via Supabase Auth Console</p>
                            </div>

                            {/* Data Backup */}
                            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <RefreshCw className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-800">System State Backup</h3>
                                        <p className="text-xs text-gray-500">Last backup: Yesterday at 11:45 PM</p>
                                    </div>
                                </div>
                                <button className="text-xs font-bold text-blue-600 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50">
                                    Trigger Backup
                                </button>
                            </div>
                        </div>
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
                                        {tab.id === 'users' && pendingUsers.length > 0 && (
                                            <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingUsers.length}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsDashboard;
