import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary, getDashboardActivity } from '../services/api';

export default function DashboardPage() {
    const [summary, setSummary] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([getDashboardSummary(), getDashboardActivity()])
            .then(([sumRes, actRes]) => {
                setSummary(sumRes.data.summary);
                setActivities(actRes.data.activities);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const statCards = summary
        ? [
            {
                label: 'Documents', value: summary.totalDocuments, icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                ), color: 'bg-blue-50 text-blue-600', accent: 'bg-blue-500'
            },
            {
                label: 'Flashcards', value: summary.totalFlashcards, icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                ), color: 'bg-indigo-50 text-indigo-600', accent: 'bg-indigo-500'
            },
            {
                label: 'Quizzes', value: summary.totalQuizzes, icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                ), color: 'bg-yellow-50 text-yellow-600', accent: 'bg-yellow-500'
            },
            {
                label: 'Avg Score', value: `${summary.averageScore}%`, icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                ), color: 'bg-green-50 text-green-600', accent: 'bg-green-500'
            },
        ]
        : [];

    const activityIcons = {
        document: <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        flashcard: <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
        quiz: <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's your learning overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${card.color} mb-3`}>
                            {card.icon}
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    {activities.length === 0 ? (
                        <p className="text-gray-400 text-sm py-8 text-center">No activity yet. Upload a document to get started!</p>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((act, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <span className="mt-0.5">{activityIcons[act.type] || <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{act.title}</p>
                                        <p className="text-xs text-gray-500">{act.description}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(act.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/documents"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Upload Document</p>
                                <p className="text-xs text-gray-500">Upload a PDF to start learning</p>
                            </div>
                        </Link>

                        <Link
                            to="/flashcards"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Study Flashcards</p>
                                <p className="text-xs text-gray-500">Review your flashcard sets</p>
                            </div>
                        </Link>

                        <Link
                            to="/quizzes"
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-yellow-50 hover:border-yellow-200 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">Take a Quiz</p>
                                <p className="text-xs text-gray-500">Test your knowledge</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
