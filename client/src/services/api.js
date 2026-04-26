import axios from 'axios';

console.log("API URL:", import.meta.env.VITE_API_URL); // 👈 ADD THIS

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Doctor APIs
export const getDoctors = (params) => API.get('/doctors', { params });
export const getDoctor = (id) => API.get(`/doctors/${id}`);
export const createDoctor = (data) => API.post('/doctors', data);
export const updateDoctor = (id, data) => API.put(`/doctors/${id}`, data);
export const deleteDoctor = (id) => API.delete(`/doctors/${id}`);
export const getMyDoctorProfile = () => API.get('/doctors/me');

// Appointment APIs
export const createAppointment = (data) => API.post('/appointments', data);
export const getAppointments = (params) => API.get('/appointments', { params });
export const updateAppointment = (id, data) => API.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

// Payment APIs
export const createPayment = (data) => API.post('/payments/create', data);
export const verifyPayment = (data) => API.post('/payments/verify', data);

// Admin APIs
export const getAdminStats = () => API.get('/admin/stats');
export const getAllUsers = (params) => API.get('/admin/users', { params });
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAllAppointments = (params) => API.get('/admin/appointments', { params });

export default API;
