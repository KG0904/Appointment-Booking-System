import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiTrash2, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAppointments, updateAppointment, deleteAppointment } from '../../services/api';
import Loading from '../../components/Loading';

const MyAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => { fetchAppointments(); }, [filter, currentPage]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const params = { page: currentPage, limit: 10 };
            if (filter) params.status = filter;
            const res = await getAppointments(params);
            setAppointments(res.data.appointments);
            setTotalPages(res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCancel = async (id) => {
        if (!confirm('Cancel this appointment?')) return;
        try {
            await updateAppointment(id, { status: 'cancelled' });
            toast.success('Appointment cancelled');
            fetchAppointments();
        } catch (err) { toast.error('Failed to cancel'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this appointment permanently?')) return;
        try {
            await deleteAppointment(id);
            toast.success('Appointment deleted');
            fetchAppointments();
        } catch (err) { toast.error('Failed to delete'); }
    };

    const filters = ['', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'];

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">My Appointments</h1>
                        <p className="text-gray-500 mt-1">Manage your bookings</p>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
                        <FiFilter className="text-gray-400 flex-shrink-0" />
                        {filters.map((f) => (
                            <button key={f} onClick={() => { setFilter(f); setCurrentPage(1); }}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                    }`}>
                                {f || 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? <Loading /> : appointments.length === 0 ? (
                    <div className="card p-12 text-center">
                        <FiCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No appointments found</h3>
                        <p className="text-gray-400 text-sm mt-1">Your appointments will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appt) => (
                            <div key={appt._id} className="card p-5 hover:shadow-xl transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg min-w-[3.25rem] min-h-[3.25rem]">
                                            {appt.doctorId?.userId?.name?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Dr. {appt.doctorId?.userId?.name || 'Unknown'}</h3>
                                            <p className="text-sm text-primary-600 font-medium">{appt.doctorId?.specialization}</p>
                                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><FiCalendar /> {new Date(appt.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><FiClock /> {appt.timeSlot}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`status-${appt.status}`}>{appt.status}</span>
                                        <span className={`status-badge ${appt.paymentStatus === 'completed' ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {appt.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                                        </span>
                                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                                            <button onClick={() => handleCancel(appt._id)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg" title="Cancel">
                                                ✕
                                            </button>
                                        )}
                                        {(appt.status === 'cancelled' || appt.status === 'rejected') && (
                                            <button onClick={() => handleDelete(appt._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg" title="Delete">
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {appt.notes && <p className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">📝 {appt.notes}</p>}
                            </div>
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 pt-4">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button key={i} onClick={() => setCurrentPage(i + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border'
                                            }`}>{i + 1}</button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointments;
