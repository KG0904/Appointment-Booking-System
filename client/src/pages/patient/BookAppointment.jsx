import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getDoctor, createAppointment, createPayment } from '../../services/api';
import Loading from '../../components/Loading';

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM',
];

const BookAppointment = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1); // 1: select, 2: confirm, 3: done

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await getDoctor(doctorId);
                setDoctor(res.data.doctor);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchDoctor();
    }, [doctorId]);

    // Get min date (tomorrow)
    const getMinDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    };

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) {
            return toast.error('Please select date and time slot');
        }
        setBooking(true);
        try {
            const res = await createAppointment({
                doctorId,
                date: selectedDate,
                timeSlot: selectedSlot,
                notes,
            });

            // Try payment
            try {
                await createPayment({ appointmentId: res.data.appointment._id });
            } catch (payErr) {
                console.log('Payment simulated or skipped');
            }

            toast.success('Appointment booked successfully!');
            setStep(3);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBooking(false);
        }
    };

    if (loading) return <Loading />;
    if (!doctor) return <div className="text-center py-20"><p>Doctor not found</p></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25' : 'bg-gray-200 text-gray-500'
                                }`}>{s}</div>
                            <span className={`text-sm font-medium hidden sm:block ${step >= s ? 'text-primary-700' : 'text-gray-400'}`}>
                                {s === 1 ? 'Select' : s === 2 ? 'Confirm' : 'Done'}
                            </span>
                            {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                {step === 3 ? (
                    /* Success */
                    <div className="card p-10 text-center">
                        <div className="w-20 h-20 mx-auto rounded-full bg-accent-100 flex items-center justify-center mb-5">
                            <FiCheck className="text-accent-600 text-3xl" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Appointment Booked!</h2>
                        <p className="text-gray-500 mb-6">Your appointment with Dr. {doctor.userId?.name} has been confirmed.</p>
                        <div className="card p-5 max-w-sm mx-auto mb-6 bg-gray-50">
                            <p className="text-sm text-gray-600"><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p className="text-sm text-gray-600 mt-1"><strong>Time:</strong> {selectedSlot}</p>
                            <p className="text-sm text-gray-600 mt-1"><strong>Fee:</strong> ₹{doctor.consultationFee}</p>
                        </div>
                        <button onClick={() => navigate('/patient/appointments')} className="btn-primary">View My Appointments</button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="card p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiCalendar className="text-primary-600" /> Select Date
                                </h2>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={getMinDate()}
                                    className="input-field"
                                />
                            </div>

                            <div className="card p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiClock className="text-primary-600" /> Select Time Slot
                                </h2>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-2.5 px-2 rounded-xl text-sm font-medium transition-all ${selectedSlot === slot
                                                    ? 'bg-primary-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="card p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Notes (Optional)</h2>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="input-field min-h-[100px] resize-none"
                                    placeholder="Describe your symptoms or reason for visit..."
                                />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="card p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                        {doctor.userId?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Dr. {doctor.userId?.name}</p>
                                        <p className="text-sm text-primary-600">{doctor.specialization}</p>
                                    </div>
                                </div>
                                {selectedDate && (
                                    <div className="text-sm text-gray-600 mb-2">📅 {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                )}
                                {selectedSlot && <div className="text-sm text-gray-600 mb-4">🕐 {selectedSlot}</div>}
                                <div className="flex items-center justify-between p-3 bg-accent-50 rounded-xl mb-4">
                                    <span className="text-sm text-gray-600">Consultation Fee</span>
                                    <span className="font-bold text-accent-700">₹{doctor.consultationFee}</span>
                                </div>

                                {step === 1 ? (
                                    <button
                                        onClick={() => {
                                            if (!selectedDate || !selectedSlot) return toast.error('Select date and time');
                                            setStep(2);
                                        }}
                                        className="btn-primary w-full"
                                    >
                                        Continue
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <button onClick={handleBook} disabled={booking} className="btn-primary w-full flex items-center justify-center">
                                            {booking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm & Pay'}
                                        </button>
                                        <button onClick={() => setStep(1)} className="btn-secondary w-full text-sm">Go Back</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
