import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiSave, FiClock, FiPlus, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { updateProfile, getMyDoctorProfile, updateDoctor } from '../../services/api';
import useAuth from '../../hooks/useAuth';
import Loading from '../../components/Loading';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorProfile = () => {
    const { user, loadUser } = useAuth();
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '' });
    const [docForm, setDocForm] = useState({ specialization: '', experience: '', consultationFee: '', bio: '' });
    const [slots, setSlots] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getMyDoctorProfile();
                const doc = res.data.doctor;
                setDoctorProfile(doc);
                setForm({ name: user?.name || '', phone: user?.phone || '' });
                setDocForm({
                    specialization: doc.specialization || '',
                    experience: doc.experience || '',
                    consultationFee: doc.consultationFee || '',
                    bio: doc.bio || '',
                });
                setSlots(doc.availabilitySlots || []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchProfile();
    }, [user]);

    const addSlot = () => {
        setSlots([...slots, { day: 'Monday', startTime: '09:00', endTime: '17:00' }]);
    };

    const removeSlot = (index) => {
        setSlots(slots.filter((_, i) => i !== index));
    };

    const updateSlot = (index, field, value) => {
        const updated = [...slots];
        updated[index][field] = value;
        setSlots(updated);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(form);
            if (doctorProfile) {
                await updateDoctor(doctorProfile._id, { ...docForm, availabilitySlots: slots });
            }
            await loadUser();
            toast.success('Profile updated!');
        } catch (err) { toast.error('Update failed'); }
        finally { setSaving(false); }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Doctor Profile</h1>
                <p className="text-gray-500 mb-8">Update your professional information</p>

                <form onSubmit={handleSave} className="space-y-6">
                    {/* Personal Info */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={user?.email || ''} className="input-field pl-11 bg-gray-100" disabled />
                            </div>
                        </div>
                    </div>

                    {/* Professional Info */}
                    <div className="card p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-5">Professional Details</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                                <select value={docForm.specialization} onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })} className="input-field">
                                    {['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry', 'General'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years)</label>
                                <input type="number" value={docForm.experience} onChange={(e) => setDocForm({ ...docForm, experience: e.target.value })} className="input-field" min="0" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee (₹)</label>
                                <input type="number" value={docForm.consultationFee} onChange={(e) => setDocForm({ ...docForm, consultationFee: e.target.value })} className="input-field" min="0" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                            <textarea value={docForm.bio} onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })} className="input-field min-h-[100px] resize-none" placeholder="Tell patients about yourself..." />
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="card p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">Availability Slots</h3>
                            <button type="button" onClick={addSlot} className="btn-secondary text-sm !py-1.5 !px-3 flex items-center gap-1"><FiPlus /> Add Slot</button>
                        </div>
                        {slots.length === 0 ? (
                            <p className="text-gray-400 text-sm text-center py-4">No slots added. Click "Add Slot" to set your availability.</p>
                        ) : (
                            <div className="space-y-3">
                                {slots.map((slot, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <select value={slot.day} onChange={(e) => updateSlot(i, 'day', e.target.value)} className="input-field !py-2 max-w-[140px] text-sm">
                                            {days.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FiClock className="text-gray-400" />
                                            <input type="time" value={slot.startTime} onChange={(e) => updateSlot(i, 'startTime', e.target.value)} className="input-field !py-2 text-sm" />
                                            <span className="text-gray-400">to</span>
                                            <input type="time" value={slot.endTime} onChange={(e) => updateSlot(i, 'endTime', e.target.value)} className="input-field !py-2 text-sm" />
                                        </div>
                                        <button type="button" onClick={() => removeSlot(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
                        Save All Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfile;
