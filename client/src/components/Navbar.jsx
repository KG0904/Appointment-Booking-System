import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar, FiHome, FiGrid } from 'react-icons/fi';
import { FaUserMd, FaHeartbeat } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'admin': return '/admin/dashboard';
            case 'doctor': return '/doctor/dashboard';
            default: return '/patient/dashboard';
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 glass border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-xl transition-all">
                            <FaHeartbeat className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold gradient-text">MediBook</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'}`}>
                            <span className="flex items-center gap-1.5"><FiHome size={16} /> Home</span>
                        </Link>
                        <Link to="/doctors" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/doctors') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'}`}>
                            <span className="flex items-center gap-1.5"><FaUserMd size={14} /> Doctors</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to={getDashboardLink()} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname.includes('dashboard') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'}`}>
                                    <span className="flex items-center gap-1.5"><FiGrid size={16} /> Dashboard</span>
                                </Link>
                                {user?.role === 'patient' && (
                                    <Link to="/patient/appointments" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive('/patient/appointments') ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'}`}>
                                        <span className="flex items-center gap-1.5"><FiCalendar size={16} /> My Appointments</span>
                                    </Link>
                                )}
                                <div className="w-px h-6 bg-gray-200 mx-2" />
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="text-xs font-semibold text-gray-700">{user?.name}</p>
                                            <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Logout">
                                        <FiLogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-4">
                                <Link to="/login" className="btn-secondary text-sm !py-2 !px-4">Login</Link>
                                <Link to="/register" className="btn-primary text-sm !py-2 !px-4">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-gray-600 hover:text-primary-600 rounded-lg">
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 animate-fade-in">
                        <div className="flex flex-col gap-1 pt-2">
                            <Link to="/" onClick={() => setIsOpen(false)} className="sidebar-link"><FiHome /> Home</Link>
                            <Link to="/doctors" onClick={() => setIsOpen(false)} className="sidebar-link"><FaUserMd /> Doctors</Link>
                            {isAuthenticated ? (
                                <>
                                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="sidebar-link"><FiGrid /> Dashboard</Link>
                                    <Link to={`/${user?.role}/profile`} onClick={() => setIsOpen(false)} className="sidebar-link"><FiUser /> Profile</Link>
                                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="sidebar-link text-red-500"><FiLogOut /> Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="sidebar-link">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="sidebar-link">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
