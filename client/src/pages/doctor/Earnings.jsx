import { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { getAppointments, getMyDoctorProfile } from '../../services/api';
import Loading from '../../components/Loading';

const Earnings = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [apptRes, docRes] = await Promise.all([
                    getAppointments({ limit: 100 }),
                    getMyDoctorProfile(),
                ]);
                setAppointments(apptRes.data.appointments);
                setDoctorProfile(docRes.data.doctor);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <Loading />;

    const fee = doctorProfile?.consultationFee || 0;
    const completed = appointments.filter(a => a.status === 'completed');
    const confirmed = appointments.filter(a => a.status === 'confirmed');
    const totalEarned = completed.length * fee;
    const projectedEarnings = (completed.length + confirmed.length) * fee;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Earnings</h1>
                <p className="text-gray-500 mb-8">Track your revenue and appointment history</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card p-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center text-white mb-3"><FiDollarSign /></div>
                        <p className="text-2xl font-extrabold text-gray-900">₹{totalEarned}</p>
                        <p className="text-sm text-gray-500">Total Earned</p>
                    </div>
                    <div className="card p-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-3"><FiTrendingUp /></div>
                        <p className="text-2xl font-extrabold text-gray-900">₹{projectedEarnings}</p>
                        <p className="text-sm text-gray-500">Projected</p>
                    </div>
                    <div className="card p-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-3"><FiCheckCircle /></div>
                        <p className="text-2xl font-extrabold text-gray-900">{completed.length}</p>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                    <div className="card p-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-3"><FiCalendar /></div>
                        <p className="text-2xl font-extrabold text-gray-900">₹{fee}</p>
                        <p className="text-sm text-gray-500">Per Consultation</p>
                    </div>
                </div>

                {/* Completed Appointments */}
                <div className="card">
                    <div className="p-5 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Completed Appointments</h2>
                    </div>
                    {completed.length === 0 ? (
                        <p className="p-8 text-center text-gray-400">No completed appointments yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500">
                                        <th className="text-left py-3 px-5 font-medium">Patient</th>
                                        <th className="text-left py-3 px-5 font-medium">Date</th>
                                        <th className="text-left py-3 px-5 font-medium">Time</th>
                                        <th className="text-left py-3 px-5 font-medium">Payment</th>
                                        <th className="text-right py-3 px-5 font-medium">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {completed.map((appt) => (
                                        <tr key={appt._id} className="hover:bg-gray-50/50">
                                            <td className="py-3 px-5 font-medium text-gray-900">{appt.patientId?.name || 'Patient'}</td>
                                            <td className="py-3 px-5 text-gray-600">{new Date(appt.date).toLocaleDateString()}</td>
                                            <td className="py-3 px-5 text-gray-600">{appt.timeSlot}</td>
                                            <td className="py-3 px-5">
                                                <span className={`status-badge ${appt.paymentStatus === 'completed' ? 'bg-accent-100 text-accent-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {appt.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-3 px-5 text-right font-semibold text-accent-700">₹{fee}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 font-bold">
                                        <td colSpan="4" className="py-3 px-5 text-gray-700">Total</td>
                                        <td className="py-3 px-5 text-right text-accent-700">₹{totalEarned}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Earnings;
