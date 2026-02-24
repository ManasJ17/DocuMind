import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef } from 'react';

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

function RevealSection({ children, className = '', delay = 0 }) {
    const ref = useScrollReveal();
    return (
        <div
            ref={ref}
            className={`scroll-reveal ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

/* ─── Inline SVG Icons for Features ─── */
const FeatureIcon = ({ children, color = 'blue' }) => {
    const colors = {
        blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600',
        indigo: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600',
        yellow: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600',
        cyan: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600',
    };
    return (
        <div className={`w-14 h-14 rounded-2xl ${colors[color]} flex items-center justify-center mb-5 shadow-sm`}>
            {children}
        </div>
    );
};

/* ─── 3D Educational Hero Illustration ─── */
function HeroIllustration() {
    return (
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: 400 }}>
            {/* Floating gradient blobs */}
            <div className="absolute top-4 right-8 w-44 h-44 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-8 left-4 w-32 h-32 bg-gradient-to-br from-yellow-300/15 to-orange-300/10 rounded-full blur-2xl animate-float-reverse" />
            <div className="absolute top-1/2 right-0 w-24 h-24 bg-gradient-to-br from-pink-300/10 to-purple-300/10 rounded-full blur-xl animate-float" />

            {/* === LAPTOP === */}
            <div className="relative z-10">
                {/* Laptop Screen */}
                <div className="w-[340px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl shadow-blue-500/10 border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Screen bezel */}
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        <span className="ml-auto text-[8px] text-gray-400 font-medium tracking-wider">DocuMind Dashboard</span>
                    </div>

                    {/* Dashboard Content */}
                    <div className="p-4 space-y-3">
                        {/* Student profile bar */}
                        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg px-3 py-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">Student Dashboard</span>
                        </div>

                        {/* Mini Stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-lg p-2 text-center border border-blue-100/50 dark:border-blue-500/20">
                                <p className="text-base font-bold text-blue-600">24</p>
                                <p className="text-[8px] text-blue-500 font-medium">Documents</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-lg p-2 text-center border border-indigo-100/50 dark:border-indigo-500/20">
                                <p className="text-base font-bold text-indigo-600">156</p>
                                <p className="text-[8px] text-indigo-500 font-medium">Flashcards</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-500/10 dark:to-amber-500/10 rounded-lg p-2 text-center border border-yellow-100/50 dark:border-yellow-500/20">
                                <p className="text-base font-bold text-yellow-600">89%</p>
                                <p className="text-[8px] text-yellow-500 font-medium">Avg Score</p>
                            </div>
                        </div>

                        {/* Chart */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[9px] font-semibold text-gray-600 dark:text-gray-300">Weekly Progress</span>
                                <span className="text-[9px] text-green-600 font-semibold">+12%</span>
                            </div>
                            <div className="flex items-end gap-1.5 h-14">
                                {[35, 55, 42, 72, 58, 88, 70].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t transition-all"
                                        style={{
                                            height: `${h}%`,
                                            background: i === 5
                                                ? 'linear-gradient(to top, #4F46E5, #3B82F6)'
                                                : i === 3 || i === 6
                                                    ? 'linear-gradient(to top, #818CF8, #A5B4FC)'
                                                    : '#E0E7FF',
                                        }}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-1">
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                    <span key={i} className="text-[7px] text-gray-400 flex-1 text-center">{d}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Laptop Base */}
                <div className="mx-auto w-[380px] h-3 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-b-xl shadow-inner" />
                <div className="mx-auto w-[400px] h-1.5 bg-gray-300 dark:bg-gray-600 rounded-b-lg" />
            </div>

            {/* === FLOATING ELEMENTS === */}

            {/* Graduation Cap */}
            <div className="absolute -top-2 right-4 animate-float z-20">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                    <polygon points="32,12 6,24 32,36 58,24" fill="#1E293B" />
                    <polygon points="16,26 16,38 32,46 48,38 48,26 32,36" fill="#334155" />
                    <line x1="48" y1="24" x2="52" y2="36" stroke="#FACC15" strokeWidth="2" />
                    <circle cx="52" cy="38" r="3" fill="#FACC15" />
                </svg>
            </div>

            {/* Trophy */}
            <div className="absolute bottom-8 -left-2 animate-float-reverse z-20">
                <svg width="48" height="56" viewBox="0 0 48 56" fill="none">
                    <path d="M12,8 L12,24 C12,34 24,40 24,40 C24,40 36,34 36,24 L36,8 Z" fill="url(#trophy-grad)" />
                    <path d="M12,12 C4,12 4,22 12,22" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                    <path d="M36,12 C44,12 44,22 36,22" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                    <polygon points="24,16 26,21 31,21 27,24 29,29 24,26 19,29 21,24 17,21 22,21" fill="white" opacity="0.9" />
                    <rect x="21" y="40" width="6" height="6" rx="1" fill="#D97706" />
                    <rect x="16" y="46" width="16" height="4" rx="2" fill="#D97706" />
                    <defs>
                        <linearGradient id="trophy-grad" x1="12" y1="8" x2="36" y2="40">
                            <stop offset="0%" stopColor="#FBBF24" />
                            <stop offset="100%" stopColor="#F59E0B" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Books Stack */}
            <div className="absolute -bottom-2 right-0 animate-float z-20">
                <svg width="60" height="48" viewBox="0 0 60 48" fill="none">
                    <rect x="4" y="30" width="52" height="12" rx="2" fill="#3B82F6" />
                    <rect x="6" y="32" width="2" height="8" rx="1" fill="#2563EB" />
                    <rect x="6" y="18" width="48" height="12" rx="2" fill="#6366F1" />
                    <rect x="8" y="20" width="2" height="8" rx="1" fill="#4F46E5" />
                    <rect x="8" y="6" width="44" height="12" rx="2" fill="#EC4899" />
                    <rect x="10" y="8" width="2" height="8" rx="1" fill="#DB2777" />
                </svg>
            </div>

            {/* Quiz Score Badge */}
            <div className="absolute top-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 p-2.5 animate-float z-20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-400 font-medium">Quiz Score</p>
                        <p className="text-sm font-bold text-green-600">95%</p>
                    </div>
                </div>
            </div>

            {/* Decorative floating circles */}
            <div className="absolute top-16 right-2 w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/30 animate-float-slow z-10" />
            <div className="absolute bottom-24 left-12 w-3 h-3 rounded-full bg-pink-400 shadow-lg shadow-pink-400/30 animate-float z-10" />
            <div className="absolute top-1/3 -right-4 w-3 h-3 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/30 animate-float-reverse z-10" />
            <div className="absolute bottom-12 right-16 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/30 animate-float z-10" />

            {/* Mini pie chart */}
            <div className="absolute top-2 left-1/4 animate-float-slow z-20">
                <svg width="36" height="36" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="#E0E7FF" />
                    <path d="M18,4 A14,14 0 0,1 32,18 L18,18 Z" fill="#4F46E5" />
                    <path d="M18,4 A14,14 0 0,0 8,28 L18,18 Z" fill="#818CF8" />
                </svg>
            </div>

            {/* Target / bullseye */}
            <div className="absolute bottom-4 left-1/3 animate-float z-20">
                <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="14" fill="#FEE2E2" />
                    <circle cx="16" cy="16" r="10" fill="#FECACA" />
                    <circle cx="16" cy="16" r="6" fill="#EF4444" />
                    <circle cx="16" cy="16" r="2.5" fill="white" />
                </svg>
            </div>
        </div>
    );
}

/* ─── Dashboard Preview ─── */
function DashboardPreview() {
    return (
        <div className="relative max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-blue-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="ml-3 text-xs text-gray-400 font-medium">DocuMind — Dashboard</span>
                </div>

                <div className="p-6 flex gap-5">
                    <div className="w-40 flex-shrink-0 space-y-2 hidden md:block">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                            <div className="w-4 h-4 rounded bg-gradient-to-br from-[#4F46E5] to-[#3B82F6]" />
                            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300">Dashboard</span>
                        </div>
                        {['Documents', 'Flashcards', 'Quizzes', 'Profile'].map((item) => (
                            <div key={item} className="flex items-center gap-2 px-3 py-2 rounded-lg">
                                <div className="w-4 h-4 rounded bg-gray-200 dark:bg-gray-600" />
                                <span className="text-[10px] text-gray-500 dark:text-gray-400">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'Documents', val: '24', color: 'text-blue-600' },
                                { label: 'Flashcards', val: '156', color: 'text-indigo-600' },
                                { label: 'Quizzes', val: '18', color: 'text-yellow-600' },
                                { label: 'Avg Score', val: '89%', color: 'text-green-600' },
                            ].map((s) => (
                                <div key={s.label} className="bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl p-3 text-center shadow-sm">
                                    <p className={`text-lg font-bold ${s.color}`}>{s.val}</p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 h-28">
                            <div className="flex items-end gap-2 h-full">
                                {[30, 55, 40, 70, 50, 85, 65, 90, 60, 75, 80, 95].map((h, i) => (
                                    <div key={i} className="flex-1 rounded-t-sm"
                                        style={{
                                            height: `${h}%`,
                                            background: i >= 9 ? 'linear-gradient(to top, #4F46E5, #3B82F6)' : '#E0E7FF',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>
    );
}

/* ─── Theme Toggle ─── */
function ThemeToggle() {
    const { darkMode, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 border border-gray-200 dark:border-gray-700"
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

/* ═══════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300">

            {/* ──── NAVBAR ──── */}
            <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                            AI
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">DocuMind</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollTo('features')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">How It Works</button>
                        <button onClick={() => scrollTo('preview')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">Preview</button>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            to="/register"
                            className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200"
                        >
                            Getting Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ──── HERO SECTION ──── */}
            <section className="pt-20 pb-12 lg:pt-24 lg:pb-16">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
                    {/* Left */}
                    <RevealSection>
                        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            AI-Powered Learning Platform
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white mb-5">
                            Transform PDFs Into{' '}
                            <span className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">
                                Intelligent Study
                            </span>{' '}
                            Experiences
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-7">
                            Upload any document and let AI generate summaries, flashcards, quizzes, and
                            interactive chat — everything you need to learn smarter, not harder.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="px-7 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-sm"
                            >
                                Get Started — It's Free
                            </Link>
                            <button
                                onClick={() => scrollTo('features')}
                                className="px-7 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 text-sm"
                            >
                                Learn More ↓
                            </button>
                        </div>

                        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                            {[
                                { val: '10K+', label: 'Students' },
                                { val: '50K+', label: 'PDFs Processed' },
                                { val: '4.9★', label: 'Rating' },
                            ].map((b) => (
                                <div key={b.label}>
                                    <p className="text-xl font-bold bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">{b.val}</p>
                                    <p className="text-xs text-gray-400">{b.label}</p>
                                </div>
                            ))}
                        </div>
                    </RevealSection>

                    {/* Right */}
                    <RevealSection delay={200} className="relative lg:pl-6">
                        <HeroIllustration />
                    </RevealSection>
                </div>
            </section>

            {/* ──── FEATURES SECTION ──── */}
            <section id="features" className="py-20 bg-[#F9FAFB] dark:bg-gray-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealSection className="text-center mb-14">
                        <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Features</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Everything You Need to Learn <span className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">Smarter</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            Our AI-powered tools transform any PDF into an interactive learning experience.
                        </p>
                    </RevealSection>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                color: 'blue',
                                title: 'Smart PDF Summarization',
                                desc: 'Get concise, AI-generated summaries of entire documents in seconds.',
                                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                            },
                            {
                                color: 'indigo',
                                title: 'AI Document Chat',
                                desc: 'Ask questions about your documents and get instant AI-powered answers.',
                                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
                            },
                            {
                                color: 'yellow',
                                title: 'Auto Flashcard Generation',
                                desc: 'Automatically create study flashcards from any uploaded document.',
                                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
                            },
                            {
                                color: 'cyan',
                                title: 'AI Quiz Builder',
                                desc: 'Generate customizable quizzes to test your understanding of any material.',
                                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
                            },
                        ].map((f, i) => (
                            <RevealSection key={f.title} delay={i * 100}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    <FeatureIcon color={f.color}>{f.icon}</FeatureIcon>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                                </div>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── HOW IT WORKS ──── */}
            <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealSection className="text-center mb-14">
                        <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">How It Works</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Three Simple Steps</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">From upload to mastery in minutes — powered by advanced AI.</p>
                    </RevealSection>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] opacity-20" />

                        {[
                            { num: '1', title: 'Upload Your PDF', desc: 'Drag and drop any PDF document. We support files up to 20MB.' },
                            { num: '2', title: 'AI Processes It', desc: 'Our AI reads, understands, and prepares interactive study materials for you.' },
                            { num: '3', title: 'Study Smarter', desc: 'Use summaries, flashcards, quizzes, and chat to master the material.' },
                        ].map((s, i) => (
                            <RevealSection key={s.num} delay={i * 150} className="text-center relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white text-xl font-bold mx-auto mb-5 shadow-lg shadow-blue-500/20">
                                    {s.num}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
                            </RevealSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── DASHBOARD PREVIEW ──── */}
            <section id="preview" className="py-20 bg-[#F9FAFB] dark:bg-gray-800/50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <RevealSection className="text-center mb-14">
                        <p className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">Preview</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Your Personal Learning Dashboard</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">Track progress, manage documents, and access all AI tools from one beautiful interface.</p>
                    </RevealSection>
                    <RevealSection delay={200}>
                        <DashboardPreview />
                    </RevealSection>
                </div>
            </section>

            {/* ──── CTA ──── */}
            <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl" />
                </div>

                <RevealSection className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <div className="bg-gradient-to-br from-[#4F46E5]/5 to-[#3B82F6]/5 dark:from-[#4F46E5]/10 dark:to-[#3B82F6]/10 rounded-3xl p-12 md:p-16 border border-blue-100/50 dark:border-blue-500/20">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                            Start Learning Smarter <span className="bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] bg-clip-text text-transparent">Today</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                            Join thousands of students already transforming their study experience with AI.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-semibold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-sm"
                        >
                            Getting Started — Free Forever
                        </Link>
                    </div>
                </RevealSection>
            </section>

            {/* ──── FOOTER ──── */}
            <footer className="py-10 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
                            AI
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">DocuMind</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <button onClick={() => scrollTo('features')} className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</button>
                        <button onClick={() => scrollTo('how-it-works')} className="hover:text-gray-900 dark:hover:text-white transition-colors">How It Works</button>
                        <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">Get Started</Link>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        © {new Date().getFullYear()} DocuMind. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
