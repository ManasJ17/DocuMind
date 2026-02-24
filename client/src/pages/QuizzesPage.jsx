import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getQuizzes, getQuiz, deleteQuiz } from '../services/api';
import toast from 'react-hot-toast';

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingQuiz, setViewingQuiz] = useState(null);
    const [viewLoading, setViewLoading] = useState(false);

    useEffect(() => {
        getQuizzes()
            .then((res) => setQuizzes(res.data.quizzes))
            .catch(() => toast.error('Failed to load quizzes'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this quiz?')) return;
        try {
            await deleteQuiz(id);
            setQuizzes(quizzes.filter((q) => q._id !== id));
            if (viewingQuiz?._id === id) setViewingQuiz(null);
            toast.success('Quiz deleted');
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleViewResults = async (quizId) => {
        setViewLoading(true);
        try {
            const res = await getQuiz(quizId);
            setViewingQuiz(res.data.quiz);
        } catch {
            toast.error('Failed to load quiz results');
        } finally {
            setViewLoading(false);
        }
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Quizzes</h1>
                    <p className="text-gray-500 mt-1">Track your quiz performance</p>
                </div>
                <Link
                    to="/documents"
                    className="px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm inline-flex items-center gap-1"
                >
                    + Generate Quiz
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
                    <p className="text-gray-500 mb-6">Generate quizzes from any document</p>
                    <Link to="/documents" className="inline-flex px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm">
                        Go to Documents
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizzes.map((quiz) => (
                            <div key={quiz._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-3">
                                    {/* Score Badge */}
                                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${quiz.completed
                                        ? quiz.score >= 70
                                            ? 'bg-green-50 text-green-700'
                                            : 'bg-yellow-50 text-yellow-700'
                                        : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                        Score: {quiz.completed ? quiz.score : 0}
                                    </span>
                                    <button onClick={() => handleDelete(quiz._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                <h3 className="font-semibold text-gray-900 truncate">{quiz.title}</h3>
                                <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-wider">
                                    Created {new Date(quiz.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>

                                <div className="mt-3">
                                    <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                                        {quiz.totalQuestions} Questions
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleViewResults(quiz._id)}
                                    className="mt-4 w-full py-2.5 text-sm font-medium text-gray-700 bg-[#F9FAFB] rounded-xl border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                    View Results
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Inline Results View */}
                    {viewingQuiz && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            {/* Back to Document Link */}
                            {viewingQuiz.documentId && (
                                <Link
                                    to={`/documents/${typeof viewingQuiz.documentId === 'object' ? viewingQuiz.documentId._id : viewingQuiz.documentId}`}
                                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                    Back to Document
                                </Link>
                            )}

                            {/* Title + Close */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{viewingQuiz.title} - Quiz Results</h2>
                                </div>
                                <button
                                    onClick={() => setViewingQuiz(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {viewingQuiz.completed && viewingQuiz.questions ? (
                                <>
                                    {/* Score Card */}
                                    <div className="bg-[#F9FAFB] rounded-2xl p-8 mb-6">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                            </div>
                                            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">YOUR SCORE</p>
                                            <h3 className={`text-4xl font-bold ${viewingQuiz.score >= 70 ? 'text-blue-600' : 'text-red-500'}`}>
                                                {viewingQuiz.score}%
                                            </h3>
                                            <p className="text-gray-500 mt-1 text-sm">
                                                {viewingQuiz.score >= 90 ? 'Outstanding!' : viewingQuiz.score >= 70 ? 'Great job!' : 'Keep practicing!'}
                                            </p>

                                            <div className="flex items-center justify-center gap-3 mt-5">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1.5 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                    {viewingQuiz.totalQuestions} Total
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                    {viewingQuiz.questions.filter((q, i) => viewingQuiz.userAnswers?.[i] === q.correctAnswer).length} Correct
                                                </span>
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                    {viewingQuiz.questions.filter((q, i) => viewingQuiz.userAnswers?.[i] !== q.correctAnswer).length} Incorrect
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Review */}
                                    <div className="space-y-4">
                                        {viewingQuiz.questions.map((q, i) => {
                                            const userAnswer = viewingQuiz.userAnswers?.[i];
                                            const isCorrect = userAnswer === q.correctAnswer;
                                            return (
                                                <div key={i} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                    <div className="flex items-start gap-3">
                                                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                            {isCorrect ? '✓' : '✗'}
                                                        </span>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900 text-sm mb-2">{q.question}</p>
                                                            {userAnswer !== undefined && (
                                                                <p className="text-sm text-gray-600">
                                                                    Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{q.options?.[userAnswer] || 'N/A'}</span>
                                                                </p>
                                                            )}
                                                            {!isCorrect && (
                                                                <p className="text-sm text-green-600 mt-1">
                                                                    Correct: {q.options?.[q.correctAnswer] || 'N/A'}
                                                                </p>
                                                            )}
                                                            {q.explanation && (
                                                                <p className="text-xs text-gray-500 mt-2 italic">{q.explanation}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>This quiz hasn't been completed yet. Open the document to attempt it.</p>
                                    {viewingQuiz.documentId && (
                                        <Link
                                            to={`/documents/${typeof viewingQuiz.documentId === 'object' ? viewingQuiz.documentId._id : viewingQuiz.documentId}`}
                                            className="inline-flex mt-4 px-4 py-2 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-2xl hover:shadow-lg transition-all text-sm font-medium"
                                        >
                                            Go to Document
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
