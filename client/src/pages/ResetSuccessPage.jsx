import { Link } from 'react-router-dom';

export default function ResetSuccessPage() {
    return (
        <div className="h-screen overflow-hidden flex items-center justify-center bg-[#0F172A] relative">
            {/* Radial glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-[420px] mx-4 relative z-10">
                <div className="bg-[#1E293B]/80 backdrop-blur-xl rounded-2xl border border-[#334155]/60 p-8 shadow-2xl shadow-black/20 text-center">
                    {/* Success checkmark */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-[#F8FAFC] mb-2">
                        Password Updated Successfully
                    </h1>
                    <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">
                        Your DocuMind password has been changed successfully.<br />
                        You can now log in with your new credentials.
                    </p>

                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full h-11 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 text-sm hover:scale-[1.01] active:scale-[0.99]"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
