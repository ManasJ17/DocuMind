import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    {
        path: '/dashboard', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        )
    },
    {
        path: '/documents', label: 'Documents', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        )
    },
    {
        path: '/flashcards', label: 'Flashcards', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        )
    },
    {
        path: '/quizzes', label: 'Quizzes', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        )
    },
    {
        path: '/profile', label: 'Profile', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
        )
    },
];

export default function Sidebar({ isOpen, onClose }) {
    const { logout } = useAuth();

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                            AI
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            DocuMind
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                                }`
                            }
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
