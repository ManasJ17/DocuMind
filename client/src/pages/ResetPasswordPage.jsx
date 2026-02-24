import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPasswordApi } from '../services/api';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const resetToken = location.state?.resetToken || '';

    // Redirect if missing state
    useEffect(() => {
        if (!email || !resetToken) navigate('/forgot-password', { replace: true });
    }, [email, resetToken, navigate]);

    // Password strength
    const getStrength = (pw) => {
        if (!pw) return { level: 0, label: '', color: '' };
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 10) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) return { level: 1, label: 'Weak', color: '#EF4444' };
        if (score <= 2) return { level: 2, label: 'Fair', color: '#F59E0B' };
        if (score <= 3) return { level: 3, label: 'Good', color: '#3B82F6' };
        return { level: 4, label: 'Strong', color: '#10B981' };
    };

    const strength = getStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await resetPasswordApi({ email, resetToken, newPassword: password });
            navigate('/reset-success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const EyeIcon = ({ show }) => show ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
    ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    );

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#0F172A] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[420px] mx-4 relative z-10">
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/60 p-8 shadow-2xl shadow-black/20">
                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-[#F8FAFC] text-center mb-2">
                        Create New Password
                    </h1>
                    <p className="text-sm text-[#94A3B8] text-center mb-6">
                        Choose a strong password for your DocuMind account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                                {error}
                            </div>
                        )}

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    required
                                    minLength={6}
                                    className="w-full h-11 px-4 pr-10 rounded-xl bg-[#1F2937] border border-[#334155] text-[#F8FAFC] placeholder-[#64748B] text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors">
                                    <EyeIcon show={showPassword} />
                                </button>
                            </div>
                            {/* Strength indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex gap-1.5 mb-1">
                                        {[1, 2, 3, 4].map((bar) => (
                                            <div
                                                key={bar}
                                                className="h-1 flex-1 rounded-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: bar <= strength.level ? strength.color : '#334155',
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-medium" style={{ color: strength.color }}>
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-medium text-[#94A3B8] mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                                    required
                                    className="w-full h-11 px-4 pr-10 rounded-xl bg-[#1F2937] border border-[#334155] text-[#F8FAFC] placeholder-[#64748B] text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8] transition-colors">
                                    <EyeIcon show={showConfirm} />
                                </button>
                            </div>
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
                                    Updating...
                                </span>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
