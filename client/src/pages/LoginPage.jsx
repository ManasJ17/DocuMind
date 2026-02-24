import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { loginUser } from '../services/api';

function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 border border-gray-200 dark:border-gray-700 z-50"
            aria-label="Toggle theme"
        >
            {darkMode ? (
                <svg className="w-[18px] h-[18px] text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                <svg className="w-[18px] h-[18px] text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                navigate('/dashboard');
            }
        } catch (err) {
            // Error is handled inside AuthContext.login via toast,
            // but we also capture the message for inline display
        }

        setLoading(false);
    };

    // Override login in AuthContext to get error details for inline display
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await loginUser({ email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            // Trigger auth context update
            window.location.href = '/dashboard';
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Please try again.';
            const code = err.response?.data?.code;

            setError(msg);

            // If user not found, suggest registration
            if (code === 'USER_NOT_FOUND') {
                setError('Account not found. Please register first.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-white dark:bg-gray-900 transition-colors duration-300 relative">
            <ThemeToggle />

            {/* Left — Form */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
                <div className="w-full max-w-sm">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                        Login to DocuMind
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-3">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Username or email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-blue-600 font-medium hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-xs text-gray-500 dark:text-gray-400">
                                Remember me
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-10 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Login'
                            )}
                        </button>

                        {/* Error Message — Now under the login form */}
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 text-red-600 dark:text-red-400 text-xs text-center animate-in fade-in slide-in-from-top-1 duration-200">
                                {error}
                                {error.includes('register') && (
                                    <Link to="/register" className="block mt-1 text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                        Create an account →
                                    </Link>
                                )}
                            </div>
                        )}
                    </form>

                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right — Image Panel */}
            <div className="hidden lg:flex flex-1 items-center justify-center bg-[#F3F4F6] dark:bg-gray-800 overflow-hidden transition-colors duration-300">
                <img
                    src="http://localhost:5000/uploads/loginARegister.png"
                    alt="DocuMind — AI Learning Platform"
                    className="max-w-full max-h-full object-contain p-4"
                />
            </div>
        </div>
    );
}
