import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiCheck, FiX, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAppointments, updateAppointment } from '../../services/api';
import Loading from '../../components/Loading';

const DoctorAppointments = () => {
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

    const handleAction = async (id, status) => {
        try {
            await updateAppointment(id, { status });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch (err) { toast.error('Action failed'); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Appointments</h1>
                        <p className="text-gray-500 mt-1">Manage patient appointments</p>
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
                    <div className="space-y-4">
                        {appointments.map((appt) => (
                            <div key={appt._id} className="card p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold">
                                            {appt.patientId?.name?.charAt(0) || 'P'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{appt.patientId?.name || 'Patient'}</h3>
                                            <p className="text-sm text-gray-500">{appt.patientId?.email}</p>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><FiCalendar /> {new Date(appt.date).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><FiClock /> {appt.timeSlot}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`status-${appt.status}`}>{appt.status}</span>
                                        {appt.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleAction(appt._id, 'confirmed')} className="p-2 text-accent-600 hover:bg-accent-50 rounded-lg" title="Accept"><FiCheck size={18} /></button>
                                                <button onClick={() => handleAction(appt._id, 'rejected')} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Reject"><FiX size={18} /></button>
                                            </>
                                        )}
                                        {appt.status === 'confirmed' && (
                                            <button onClick={() => handleAction(appt._id, 'completed')} className="btn-success text-xs !py-1.5 !px-3">Complete</button>
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

export default DoctorAppointments;
