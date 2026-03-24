import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiDollarSign, FiUsers, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAppointments, updateAppointment, getMyDoctorProfile } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Loading';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [apptRes, docRes] = await Promise.all([
                getAppointments({ limit: 10 }),
                getMyDoctorProfile(),
            ]);
            setAppointments(apptRes.data.appointments);
            setDoctorProfile(docRes.data.doctor);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            toast.success(`Appointment ${status}`);
            fetchData();
        } catch (err) { toast.error('Action failed'); }
    };

    if (loading) return <Loading />;

    const pending = appointments.filter(a => a.status === 'pending');
    const confirmed = appointments.filter(a => a.status === 'confirmed');
    const completed = appointments.filter(a => a.status === 'completed');

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold text-gray-900">Doctor Dashboard</h1>
                    <p className="text-gray-500 mt-1">Welcome, Dr. {user?.name}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Patients', value: doctorProfile?.totalPatients || appointments.length, icon: <FiUsers />, color: 'from-primary-500 to-primary-600' },
                        { label: 'Pending', value: pending.length, icon: <FiClock />, color: 'from-amber-500 to-amber-600' },
                        { label: 'Confirmed', value: confirmed.length, icon: <FiCalendar />, color: 'from-blue-500 to-blue-600' },
                        { label: 'Earnings', value: `₹${completed.length * (doctorProfile?.consultationFee || 0)}`, icon: <FiDollarSign />, color: 'from-accent-500 to-accent-600' },
                    ].map((s, i) => (
                        <div key={i} className="card p-5">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>{s.icon}</div>
                            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                            <p className="text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <Link to="/doctor/appointments" className="card p-5 group hover:-translate-y-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all"><FiCalendar /></div>
                        <div><h3 className="font-bold text-gray-900 text-sm">Appointments</h3><p className="text-xs text-gray-500">View all</p></div>
                    </Link>
                    <Link to="/doctor/earnings" className="card p-5 group hover:-translate-y-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center group-hover:bg-accent-600 group-hover:text-white transition-all"><FiDollarSign /></div>
                        <div><h3 className="font-bold text-gray-900 text-sm">Earnings</h3><p className="text-xs text-gray-500">Track revenue</p></div>
                    </Link>
                    <Link to="/doctor/profile" className="card p-5 group hover:-translate-y-1 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all"><FiUsers /></div>
                        <div><h3 className="font-bold text-gray-900 text-sm">Profile</h3><p className="text-xs text-gray-500">Update info</p></div>
                    </Link>
                </div>

                {/* Pending Appointments */}
                <div className="card mb-6">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Pending Appointments ({pending.length})</h2>
                    </div>
                    {pending.length === 0 ? (
                        <p className="p-8 text-center text-gray-400">No pending appointments</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {pending.map((appt) => (
                                <div key={appt._id} className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                                            {appt.patientId?.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{appt.patientId?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(appt.date).toLocaleDateString()} • {appt.timeSlot}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleAction(appt._id, 'confirmed')} className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg" title="Accept">
                                            <FiCheck size={18} />
                                        </button>
                                        <button onClick={() => handleAction(appt._id, 'rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Reject">
                                            <FiX size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Confirmed */}
                <div className="card">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Upcoming Appointments ({confirmed.length})</h2>
                    </div>
                    {confirmed.length === 0 ? (
                        <p className="p-8 text-center text-gray-400">No upcoming appointments</p>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {confirmed.map((appt) => (
                                <div key={appt._id} className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                            {appt.patientId?.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{appt.patientId?.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(appt.date).toLocaleDateString()} • {appt.timeSlot}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleAction(appt._id, 'completed')} className="btn-success text-xs !py-1.5 !px-3">
                                        Mark Complete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
