import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiActivity } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { getAppointments } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Loading';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAppointments({ limit: 5 });
                const appts = res.data.appointments;
                setAppointments(appts);
                setStats({
                    total: res.data.total,
                    pending: appts.filter(a => a.status === 'pending').length,
                    confirmed: appts.filter(a => a.status === 'confirmed').length,
                    completed: appts.filter(a => a.status === 'completed').length,
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900">Welcome back, {user?.name} 👋</h1>
                    <p className="text-gray-500 mt-1">Here's an overview of your appointments</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total', value: stats.total, icon: <FiCalendar />, color: 'from-primary-500 to-primary-600' },
                        { label: 'Pending', value: stats.pending, icon: <FiClock />, color: 'from-amber-500 to-amber-600' },
                        { label: 'Confirmed', value: stats.confirmed, icon: <FiActivity />, color: 'from-blue-500 to-blue-600' },
                        { label: 'Completed', value: stats.completed, icon: <FaUserMd />, color: 'from-accent-500 to-accent-600' },
                    ].map((s, i) => (
                        <div key={i} className="card p-5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
                                {s.icon}
                            </div>
                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Link to="/doctors" className="card p-6 group hover:-translate-y-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
                            <FaUserMd className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Find Doctors</h3>
                            <p className="text-sm text-gray-500">Browse specialists</p>
                        </div>
                    </Link>
                    <Link to="/patient/appointments" className="card p-6 group hover:-translate-y-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center group-hover:bg-accent-600 group-hover:text-white transition-all">
                            <FiCalendar className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">My Appointments</h3>
                            <p className="text-sm text-gray-500">View & manage</p>
                        </div>
                    </Link>
                    <Link to="/patient/profile" className="card p-6 group hover:-translate-y-1 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <FiUser className="text-xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">My Profile</h3>
                            <p className="text-sm text-gray-500">Update info</p>
                        </div>
                    </Link>
                </div>

                {/* Recent Appointments */}
                <div className="card">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                        <Link to="/patient/appointments" className="text-sm text-primary-600 font-semibold hover:underline">View all</Link>
                    </div>
                    {appointments.length === 0 ? (
                        <div className="p-12 text-center">
                            <FiCalendar className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No appointments yet</p>
                            <Link to="/doctors" className="btn-primary mt-4 inline-block">Book Now</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {appointments.map((appt) => (
                                <div key={appt._id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                            {appt.doctorId?.userId?.name?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-500">{appt.doctorId?.specialization} • {appt.timeSlot}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">{new Date(appt.date).toLocaleDateString()}</p>
                                        <span className={`status-${appt.status}`}>{appt.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
