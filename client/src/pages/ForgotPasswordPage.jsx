import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await forgotPassword({ email });
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#0F172A] relative">
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[420px] mx-4 relative z-10">
                {/* Card */}
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/60 p-8 shadow-2xl shadow-black/20">
                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-[#F8FAFC] text-center mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-sm text-[#94A3B8] text-center mb-6">
                        Enter your registered email to receive a 6-digit verification code.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                required
                                className="w-full h-11 px-4 rounded-xl bg-[#1F2937] border border-[#334155] text-[#F8FAFC] placeholder-[#64748B] text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm hover:scale-[1.01] active:scale-[0.99]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Sending Code...
                                </span>
                            ) : (
                                'Send Code'
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
