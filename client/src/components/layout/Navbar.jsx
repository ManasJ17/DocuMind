import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar({ onMenuToggle }) {
    const { user } = useAuth();
    const { darkMode, toggleTheme } = useTheme();

    return (
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-colors duration-300">
            {/* Left — Hamburger */}
            <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Center — Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full h-10 px-4 pl-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-[#F9FAFB] dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Right — Theme toggle + User */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                {/* Notification bell */}
                <button className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
                </button>

                {/* User avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-gray-100 dark:border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white text-sm font-bold shadow-md shadow-blue-500/20">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.username}
                    </span>
                </div>
            </div>
        </header>
    );
}
