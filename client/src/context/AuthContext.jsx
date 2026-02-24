import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getMe } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getMe()
                .then((res) => setUser(res.data.user))
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const res = await loginUser({ email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            toast.success('Welcome back!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await registerUser({ username, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            toast.success('Account created successfully!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
