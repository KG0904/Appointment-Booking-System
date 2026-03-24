import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiFilter } from 'react-icons/fi';
import { getAllAppointments } from '../../services/api';
import Loading from '../../components/Loading';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { fetchAppointments(); }, [filter, currentPage]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 15 };
            if (filter) params.status = filter;
            const res = await getAllAppointments(params);
            setAppointments(res.data.appointments);
            setTotalPages(res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">All Appointments</h1>
                        <p className="text-gray-500 mt-1">Monitor all platform appointments</p>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
                        <FiFilter className="text-gray-400 flex-shrink-0" />
                        {['', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((f) => (
                            <button key={f} onClick={() => { setFilter(f); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-100'
                                    }`}>{f || 'All'}</button>
                        ))}
                    </div>
                </div>

                {loading ? <Loading /> : appointments.length === 0 ? (
                    <div className="card p-12 text-center">
                        <FiCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No appointments found</h3>
                    </div>
                ) : (
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500">
                                        <th className="text-left py-3 px-5 font-medium">Patient</th>
                                        <th className="text-left py-3 px-5 font-medium">Doctor</th>
                                        <th className="text-left py-3 px-5 font-medium">Date</th>
                                        <th className="text-left py-3 px-5 font-medium">Time</th>
                                        <th className="text-left py-3 px-5 font-medium">Status</th>
                                        <th className="text-left py-3 px-5 font-medium">Payment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map((appt) => (
                                        <tr key={appt._id} className="hover:bg-gray-50/50">
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                        {appt.patientId?.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 text-xs">{appt.patientId?.name || 'Unknown'}</p>
                                                        <p className="text-[10px] text-gray-400">{appt.patientId?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5">
                                                <p className="font-medium text-gray-900 text-xs">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</p>
                                                <p className="text-[10px] text-primary-500">{appt.doctorId?.specialization}</p>
                                            </td>
                                            <td className="py-3 px-5 text-gray-600 text-xs flex items-center gap-1">
                                                <FiCalendar className="hidden sm:inline" size={12} /> {new Date(appt.date).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-5 text-gray-600 text-xs">{appt.timeSlot}</td>
                                            <td className="py-3 px-5"><span className={`status-${appt.status}`}>{appt.status}</span></td>
                                            <td className="py-3 px-5">
                                                <span className={`status-badge ${appt.paymentStatus === 'completed' ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {appt.paymentStatus}
                                                </span>
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

export default ManageAppointments;
