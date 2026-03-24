import { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [doctorProfile, setDoctorProfile] = useState(null);

    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const res = await getMe();
            setUser(res.data.user);
            if (res.data.doctorProfile) {
                setDoctorProfile(res.data.doctorProfile);
            }
        } catch (err) {
            console.error('Failed to load user:', err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = (tokenValue, userData) => {
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(tokenValue);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setDoctorProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                doctorProfile,
                login,
                logout,
                loadUser,
                setDoctorProfile,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
