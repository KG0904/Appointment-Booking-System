import { useState, useEffect } from 'react';
import { FiUsers, FiTrash2, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAllUsers, deleteUser } from '../../services/api';
import Loading from '../../components/Loading';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { fetchUsers(); }, [roleFilter, currentPage]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 15 };
            if (roleFilter) params.role = roleFilter;
            const res = await getAllUsers(params);
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete user "${name}"?`)) return;
        try {
            await deleteUser(id);
            toast.success('User deleted');
            fetchUsers();
        } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
    };

    const roleColors = {
        patient: 'bg-blue-100 text-blue-700',
        doctor: 'bg-purple-100 text-purple-700',
        admin: 'bg-red-100 text-red-700',
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Manage Users</h1>
                        <p className="text-gray-500 mt-1">View and manage all platform users</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400" />
                        {['', 'patient', 'doctor', 'admin'].map((r) => (
                            <button key={r} onClick={() => { setRoleFilter(r); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${roleFilter === r ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100'
                                    }`}>{r || 'All'}</button>
                        ))}
                    </div>
                </div>

                {loading ? <Loading /> : users.length === 0 ? (
                    <div className="card p-12 text-center">
                        <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No users found</h3>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500">
                                        <th className="text-left py-3 px-5 font-medium">User</th>
                                        <th className="text-left py-3 px-5 font-medium">Email</th>
                                        <th className="text-left py-3 px-5 font-medium">Role</th>
                                        <th className="text-left py-3 px-5 font-medium">Joined</th>
                                        <th className="text-right py-3 px-5 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-gray-50/50">
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {u.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5 text-gray-600">{u.email}</td>
                                            <td className="py-3 px-5">
                                                <span className={`status-badge ${roleColors[u.role]}`}>{u.role}</span>
                                            </td>
                                            <td className="py-3 px-5 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-5 text-right">
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDelete(u._id, u.name)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'}`}>{i + 1}</button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
