import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Database, Trash2, Edit2, Save, X, RefreshCw } from 'lucide-react';

const DatabaseManager = () => {
    const { token, user } = useAuth();
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [schema, setSchema] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // For editing rows based on array index instead of ID (some tables might lack an ID)
    const [editingRowIndex, setEditingRowIndex] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        if (!token || user?.role !== 'StateAdmin') return;
        fetchTables();
    }, [token, user]);

    // Protect Route
    if (user?.role !== 'StateAdmin') {
        return <Navigate to="/dashboard" replace />;
    }

    const fetchTables = async () => {
        try {
            const res = await fetch('/cgpwmu/api/data/admin/tables', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch tables');
            const data = await res.json();
            setTables(data);
        } catch (err) {
            setError('Could not connect to database manager: ' + err.message);
        }
    };

    const fetchTableData = async (tableName) => {
        setLoading(true);
        setError('');
        setSuccess('');
        setEditingRowIndex(null);
        try {
            const schemaRes = await fetch(`/cgpwmu/api/data/admin/schema/${tableName}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!schemaRes.ok) throw new Error('Failed to fetch schema');
            const schemaData = await schemaRes.json();
            setSchema(schemaData);

            const dataRes = await fetch('/cgpwmu/api/data/admin/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ query: `SELECT rowid as _rowid_, * FROM ${tableName} ORDER BY _rowid_ DESC LIMIT 100` })
            });
            
            if (!dataRes.ok) throw new Error('Failed to fetch data');
            const dataData = await dataRes.json();
            if (dataData.error) throw new Error(dataData.error);
            setData(dataData.data);
        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (e) => {
        const table = e.target.value;
        setSelectedTable(table);
        if (table) fetchTableData(table);
        else { setSchema([]); setData([]); }
    };

    const runQuery = async (queryStr, paramsArr) => {
        const res = await fetch('/cgpwmu/api/data/admin/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ query: queryStr, params: paramsArr })
        });
        const result = await res.json();
        if (!res.ok || result.error) throw new Error(result.error || 'Query failed');
        return result;
    };

    const handleDelete = async (row) => {
        const rowid = row._rowid_;
        if (!window.confirm(`Are you absolutely sure you want to delete row ${rowid} from ${selectedTable}? This action cannot be undone.`)) return;

        try {
            setError('');
            await runQuery(`DELETE FROM ${selectedTable} WHERE rowid = ?`, [rowid]);
            setSuccess(`Deleted row successfully.`);
            fetchTableData(selectedTable);
        } catch (err) {
            setError('Delete failed: ' + err.message);
        }
    };

    const startEdit = (index, row) => {
        setEditingRowIndex(index);
        const formState = { ...row };
        delete formState._rowid_; // Don't allow editing internal rowid
        setEditForm(formState);
    };

    const handleSave = async (row) => {
        try {
            setError('');
            const rowid = row._rowid_;
            const keys = Object.keys(editForm);
            const setClause = keys.map(k => `${k} = ?`).join(', ');
            const values = keys.map(k => editForm[k]);
            
            // Append rowid for the WHERE clause
            values.push(rowid);

            const query = `UPDATE ${selectedTable} SET ${setClause} WHERE rowid = ?`;
            await runQuery(query, values);
            
            setSuccess('Row updated successfully.');
            setEditingRowIndex(null);
            fetchTableData(selectedTable);
        } catch (err) {
            setError('Update failed: ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                            <Database className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold border-b-0 pb-0 mb-1 text-gray-900">Database Manager</h1>
                            <p className="text-sm text-gray-500">Direct SQLite Access. Use with extreme caution.</p>
                        </div>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-red-800">DANGER ZONE</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Making direct edits or deletions here can permanently corrupt application data or break relational links (Foreign Keys). 
                                <strong> NEVER edit ID columns.</strong> Ensure you know what you are doing.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="flex-1 w-full">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Select Database Table</label>
                            <select 
                                value={selectedTable} 
                                onChange={handleTableChange}
                                className="w-full sm:max-w-xs p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm shadow-sm"
                            >
                                <option value="">-- Select Table --</option>
                                {tables.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        {selectedTable && (
                            <button 
                                onClick={() => fetchTableData(selectedTable)}
                                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg flex items-center gap-2 transition-colors border border-gray-200 shadow-sm"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh Data
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-mono break-all">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium">
                            {success}
                        </div>
                    )}
                </div>

                {selectedTable && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 font-mono"><span className="text-gray-400 font-sans font-normal text-sm mr-2">Table:</span>{selectedTable}</h3>
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded font-bold">{data.length} records (Limit 100)</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-12 text-center text-gray-400 font-medium">Loading data...</div>
                            ) : data.length === 0 ? (
                                <div className="p-12 text-center text-gray-400 font-medium">Table is empty.</div>
                            ) : (
                                <table className="w-full text-left border-collapse min-w-max">
                                    <thead>
                                        <tr>
                                            <th className="p-3 bg-gray-100 border-b border-r text-xs font-bold text-gray-600 uppercase tracking-wider sticky left-0 z-10 w-24">Actions</th>
                                            {schema.map(col => (
                                                <th key={col.name} className="p-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                    {col.name} <span className="text-[10px] text-gray-400 font-normal ml-1">({col.type})</span>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {data.map((row, index) => {
                                            const isEditing = editingRowIndex === index;
                                            return (
                                                <tr key={row._rowid_} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                                                    <td className="p-2 border-r bg-white sticky left-0 z-10">
                                                        {isEditing ? (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleSave(row)} className="p-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded" title="Save">
                                                                    <Save className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => setEditingRowIndex(null)} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded" title="Cancel">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => startEdit(index, row)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded" title="Edit">
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleDelete(row)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded" title="Delete">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    {schema.map(col => (
                                                        <td key={col.name} className="p-3 text-gray-700 font-mono text-xs whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                                                            {isEditing ? (
                                                                <input
                                                                    type="text"
                                                                    value={editForm[col.name] === null ? '' : editForm[col.name]}
                                                                    onChange={(e) => setEditForm({ ...editForm, [col.name]: e.target.value })}
                                                                    className="w-full p-1 border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 bg-blue-50/30"
                                                                />
                                                            ) : (
                                                                <span title={row[col.name]}>{row[col.name] === null ? <em className="text-gray-300">NULL</em> : String(row[col.name])}</span>
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabaseManager;
