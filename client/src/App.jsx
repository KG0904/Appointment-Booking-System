import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import useAuth from './hooks/useAuth';

// Public Pages
import Home from './pages/Home';
import DoctorListing from './pages/DoctorListing';
import DoctorDetails from './pages/DoctorDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import PatientProfile from './pages/patient/PatientProfile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import Earnings from './pages/doctor/Earnings';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAppointments from './pages/admin/ManageAppointments';

function App() {
    const { loading } = useAuth();

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<DoctorListing />} />
                    <Route path="/doctors/:id" element={<DoctorDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Patient Routes */}
                    <Route path="/patient/dashboard" element={
                        <ProtectedRoute roles={['patient']}><PatientDashboard /></ProtectedRoute>
                    } />
                    <Route path="/patient/book/:doctorId" element={
                        <ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>
                    } />
                    <Route path="/patient/appointments" element={
                        <ProtectedRoute roles={['patient']}><MyAppointments /></ProtectedRoute>
                    } />
                    <Route path="/patient/profile" element={
                        <ProtectedRoute roles={['patient']}><PatientProfile /></ProtectedRoute>
                    } />

                    {/* Doctor Routes */}
                    <Route path="/doctor/dashboard" element={
                        <ProtectedRoute roles={['doctor']}><DoctorDashboard /></ProtectedRoute>
                    } />
                    <Route path="/doctor/appointments" element={
                        <ProtectedRoute roles={['doctor']}><DoctorAppointments /></ProtectedRoute>
                    } />
                    <Route path="/doctor/earnings" element={
                        <ProtectedRoute roles={['doctor']}><Earnings /></ProtectedRoute>
                    } />
                    <Route path="/doctor/profile" element={
                        <ProtectedRoute roles={['doctor']}><DoctorProfile /></ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
                    } />
                    <Route path="/admin/doctors" element={
                        <ProtectedRoute roles={['admin']}><ManageDoctors /></ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                        <ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>
                    } />
                    <Route path="/admin/appointments" element={
                        <ProtectedRoute roles={['admin']}><ManageAppointments /></ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
            <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </div>
    );
}

export default App;
