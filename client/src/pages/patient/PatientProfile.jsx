import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiSave } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { updateProfile } from '../../services/api';
import useAuth from '../../hooks/useAuth';

const PatientProfile = () => {
    const { user, loadUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(form);
            await loadUser();
            toast.success('Profile updated!');
        } catch (err) { toast.error('Update failed'); }
        finally { setSaving(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 animate-fade-in">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-500 mb-8">Manage your personal information</p>

                {/* Avatar Section */}
                <div className="card p-8 text-center mb-6">
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center shadow-xl shadow-primary-400/25 mb-4">
                        <span className="text-white text-3xl font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full capitalize">{user?.role}</span>
                </div>

                {/* Edit Form */}
                <div className="card p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-5">Edit Information</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={user?.email || ''} className="input-field pl-11 bg-gray-100 cursor-not-allowed" disabled />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" placeholder="+91 98765 43210" />
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave />}
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
