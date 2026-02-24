import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { verifyOtp, forgotPassword } from '../services/api';

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    // Redirect if no email in state
    useEffect(() => {
        if (!email) navigate('/forgot-password', { replace: true });
    }, [email, navigate]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer]);

    // Auto-focus first input
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // numeric only
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const newOtp = pasted.split('');
            setOtp(newOtp);
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (!code || code.length !== 6) {
            setError('Please enter the complete 6-digit code.');
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtp({ email, otp: code });
            const resetToken = res.data.resetToken;
            navigate('/reset-password', { state: { email, resetToken } });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid code. Please try again.');
            // Clear OTP on failure
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        setResendLoading(true);
        try {
            await forgotPassword({ email });
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            setError('');
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#0F172A] relative">
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[420px] mx-4 relative z-10">
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/60 p-8 shadow-2xl shadow-black/20">
                    {/* Icon */}
                    <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-[#F8FAFC] text-center mb-2">
                        Verify Your Identity
                    </h1>
                    <p className="text-sm text-[#94A3B8] text-center mb-6">
                        We've sent a 6-digit code to{' '}
                        {email ? <span className="text-blue-400 font-medium">{email}</span> : 'your email'}.
                    </p>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center mb-4">
                            {error}
                        </div>
                    )}

                    {/* OTP Inputs */}
                    <div className="flex items-center justify-center gap-3 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputRefs.current[i] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-[#1F2937] border border-[#334155] text-[#F8FAFC] focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all outline-none"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.some((d) => d === '')}
                        className="w-full h-11 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm hover:scale-[1.01] active:scale-[0.99]"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'Verify Code'
                        )}
                    </button>

                    <div className="text-center mt-5">
                        {resendTimer > 0 ? (
                            <p className="text-xs text-[#64748B]">
                                Resend code in <span className="text-[#94A3B8] font-medium">{resendTimer}s</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
                            >
                                {resendLoading ? 'Sending...' : 'Resend Code'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
