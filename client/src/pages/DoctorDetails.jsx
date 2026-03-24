import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiClock, FiDollarSign, FiStar, FiCalendar, FiMail, FiPhone } from 'react-icons/fi';
import { FaUserMd, FaGraduationCap } from 'react-icons/fa';
import { getDoctor } from '../services/api';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await getDoctor(id);
                setDoctor(res.data.doctor);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) return <Loading />;
    if (!doctor) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-700">Doctor not found</h2>
            <Link to="/doctors" className="btn-primary mt-4">Back to Doctors</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 animate-fade-in">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-purple-700 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                            <span className="text-white text-4xl font-bold">
                                {doctor.userId?.name?.charAt(0)?.toUpperCase() || 'D'}
                            </span>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-extrabold text-white">
                                Dr. {doctor.userId?.name || 'Unknown'}
                            </h1>
                            <p className="text-accent-300 font-semibold mt-1">{doctor.specialization}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-white/70 text-sm">
                                <span className="flex items-center gap-1"><FiStar className="text-amber-400" /> {doctor.rating || '4.5'} Rating</span>
                                <span className="flex items-center gap-1"><FiClock /> {doctor.experience} yrs experience</span>
                                <span className="flex items-center gap-1"><FaGraduationCap /> {doctor.totalPatients || 0} patients</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                            <p className="text-gray-600 leading-relaxed">{doctor.bio || 'A dedicated medical professional committed to delivering exceptional patient care and utilizing the latest medical advancements.'}</p>
                        </div>

                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Available Slots</h2>
                            {doctor.availabilitySlots && doctor.availabilitySlots.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {doctor.availabilitySlots.map((slot, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-accent-50 rounded-xl">
                                            <FiCalendar className="text-accent-600" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-800">{slot.day}</p>
                                                <p className="text-xs text-gray-500">{slot.startTime} - {slot.endTime}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Available Monday - Saturday, 9:00 AM - 5:00 PM</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="card p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-accent-50 rounded-xl">
                                    <span className="text-sm text-gray-600">Fee</span>
                                    <span className="text-lg font-bold text-accent-700 flex items-center gap-1">
                                        <FiDollarSign />₹{doctor.consultationFee}
                                    </span>
                                </div>
                                {doctor.userId?.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiMail className="text-primary-500" /> {doctor.userId.email}
                                    </div>
                                )}
                                {doctor.userId?.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiPhone className="text-primary-500" /> {doctor.userId.phone}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) return navigate('/login');
                                    navigate(`/patient/book/${doctor._id}`);
                                }}
                                className="btn-primary w-full mt-5 flex items-center justify-center gap-2"
                            >
                                <FiCalendar /> Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDetails;
