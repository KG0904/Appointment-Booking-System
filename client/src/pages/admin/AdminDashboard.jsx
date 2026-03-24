import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiCalendar, FiDollarSign, FiActivity, FiUserPlus, FiClock } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { getAdminStats } from '../../services/api';
import Loading from '../../components/Loading';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getAdminStats();
                setStats(res.data.stats);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Platform overview and management</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FiUsers />, color: 'from-primary-500 to-primary-600' },
                        { label: 'Doctors', value: stats?.totalDoctors || 0, icon: <FaUserMd />, color: 'from-blue-500 to-blue-600' },
                        { label: 'Appointments', value: stats?.totalAppointments || 0, icon: <FiCalendar />, color: 'from-purple-500 to-purple-600' },
                        { label: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: <FiDollarSign />, color: 'from-accent-500 to-accent-600' },
                    ].map((s, i) => (
                        <div key={i} className="card p-5 hover:-translate-y-0.5 transition-transform">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>{s.icon}</div>
                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="card p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FiClock className="text-xl" /></div>
                        <div><p className="text-2xl font-extrabold text-gray-900">{stats?.pendingAppointments || 0}</p><p className="text-sm text-gray-500">Pending Appointments</p></div>
                    </div>
                    <div className="card p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center"><FiActivity className="text-xl" /></div>
                        <div><p className="text-2xl font-extrabold text-gray-900">{stats?.completedAppointments || 0}</p><p className="text-sm text-gray-500">Completed Appointments</p></div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    {[
                        { to: '/admin/doctors', icon: <FaUserMd />, label: 'Manage Doctors', color: 'bg-blue-50 text-blue-600' },
                        { to: '/admin/users', icon: <FiUsers />, label: 'Manage Users', color: 'bg-purple-50 text-purple-600' },
                        { to: '/admin/appointments', icon: <FiCalendar />, label: 'Appointments', color: 'bg-primary-50 text-primary-600' },
                        { to: '/admin/doctors', icon: <FiUserPlus />, label: 'Add Doctor', color: 'bg-accent-50 text-accent-600' },
                    ].map((a, i) => (
                        <Link key={i} to={a.to} className="card p-5 group hover:-translate-y-1 text-center">
                            <div className={`w-12 h-12 mx-auto rounded-xl ${a.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>{a.icon}</div>
                            <p className="font-semibold text-gray-900 text-sm">{a.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Appointments */}
                <div className="card">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                    </div>
                    {!stats?.recentAppointments?.length ? (
                        <p className="p-8 text-center text-gray-400">No recent appointments</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {stats.recentAppointments.map((appt) => (
                                <div key={appt._id} className="p-4 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                                            {appt.patientId?.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{appt.patientId?.name} → Dr. {appt.doctorId?.userId?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(appt.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`status-${appt.status}`}>{appt.status}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
