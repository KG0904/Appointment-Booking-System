import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaHeartbeat } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { registerUser } from '../services/api';
import useAuth from '../hooks/useAuth';

const Register = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'patient',
        specialization: '', experience: '', consultationFee: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        setLoading(true);
        try {
            const payload = { ...form };
            delete payload.confirmPassword;
            if (payload.role !== 'doctor') {
                delete payload.specialization;
                delete payload.experience;
                delete payload.consultationFee;
            }
            const res = await registerUser(payload);
            login(res.data.token, res.data.user);
            toast.success('Registration successful!');
            const role = res.data.user.role;
            if (role === 'doctor') navigate('/doctor/dashboard');
            else navigate('/patient/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-primary-50/30 animate-fade-in">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-xl shadow-primary-500/25 mb-4">
                        <FaHeartbeat className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-1">Join MediBook today</p>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">I am a</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['patient', 'doctor'].map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setForm({ ...form, role })}
                                        className={`py-3 px-4 rounded-xl font-medium capitalize transition-all ${form.role === role
                                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-11" placeholder="John Doe" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                                <div className="relative">
                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-11" placeholder="+91 98765 43210" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-11" placeholder="you@example.com" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-11" placeholder="••••••" required minLength={6} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field pl-11" placeholder="••••••" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Doctor-specific fields */}
                        {form.role === 'doctor' && (
                            <div className="space-y-4 pt-2 mt-2 border-t border-gray-100">
                                <p className="text-sm font-semibold text-primary-600">Doctor Details</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Specialization</label>
                                        <select value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="input-field text-sm !py-2.5" required>
                                            <option value="">Select</option>
                                            {['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry', 'Ophthalmology', 'Dentistry', 'General'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Experience (yrs)</label>
                                        <input type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} className="input-field text-sm !py-2.5" placeholder="5" min="0" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Fee (₹)</label>
                                        <input type="number" value={form.consultationFee} onChange={(e) => setForm({ ...form, consultationFee: e.target.value })} className="input-field text-sm !py-2.5" placeholder="500" min="0" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full !py-3 flex items-center justify-center mt-2">
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
