import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getDoctors, createDoctor, deleteDoctor } from '../../services/api';
import Loading from '../../components/Loading';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '',
        specialization: 'General', experience: '', consultationFee: '', bio: '',
    });

    useEffect(() => { fetchDoctors(); }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await getDoctors({ limit: 50 });
            setDoctors(res.data.doctors);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createDoctor(form);
            toast.success('Doctor added successfully!');
            setShowModal(false);
            setForm({ name: '', email: '', password: '', phone: '', specialization: 'General', experience: '', consultationFee: '', bio: '' });
            fetchDoctors();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to add doctor'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Remove this doctor?')) return;
        try {
            await deleteDoctor(id);
            toast.success('Doctor removed');
            fetchDoctors();
        } catch (err) { toast.error('Delete failed'); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Manage Doctors</h1>
                        <p className="text-gray-500 mt-1">Add, edit, or remove doctors</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
                        <FiPlus /> Add Doctor
                    </button>
                </div>

                {loading ? <Loading /> : doctors.length === 0 ? (
                    <div className="card p-12 text-center">
                        <FaUserMd className="text-5xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No doctors found</h3>
                        <button onClick={() => setShowModal(true)} className="btn-primary mt-4">Add First Doctor</button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {doctors.map((doc) => (
                            <div key={doc._id} className="card p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {doc.userId?.name?.charAt(0) || 'D'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Dr. {doc.userId?.name}</h3>
                                            <p className="text-sm text-primary-600">{doc.specialization}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(doc._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded-lg"><span className="text-gray-500">Exp:</span> <span className="font-medium">{doc.experience} yrs</span></div>
                                    <div className="bg-gray-50 p-2 rounded-lg"><span className="text-gray-500">Fee:</span> <span className="font-medium">₹{doc.consultationFee}</span></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">{doc.userId?.email}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Doctor Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-slide-up">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-lg font-bold text-gray-900">Add New Doctor</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><FiX /></button>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Phone</label>
                                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field text-sm" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field text-sm" required minLength={6} />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                                        <select value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="input-field text-sm">
                                            {['General', 'Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry'].map(s => <option key={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Experience</label>
                                        <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input-field text-sm" required min="0" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Fee (₹)</label>
                                        <input type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} className="input-field text-sm" required min="0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bio</label>
                                    <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field text-sm min-h-[60px] resize-none" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" className="btn-primary flex-1">Add Doctor</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageDoctors;
