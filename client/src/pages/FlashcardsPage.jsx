import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFlashcardSets, deleteFlashcardSet } from '../services/api';
import toast from 'react-hot-toast';

export default function FlashcardsPage() {
    const [sets, setSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFlashcardSets()
            .then((res) => setSets(res.data.flashcardSets))
            .catch(() => toast.error('Failed to load flashcards'))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!confirm('Delete this flashcard set?')) return;
        try {
            await deleteFlashcardSet(id);
            setSets(sets.filter((s) => s._id !== id));
            toast.success('Flashcard set deleted');
        } catch {
            toast.error('Failed to delete');
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
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Flashcards</h1>
                <p className="text-gray-500 mt-1">All your flashcard sets in one place</p>
            </div>

            {sets.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No flashcard sets yet</h3>
                    <p className="text-gray-500 mb-6">Generate flashcards from any document</p>
                    <Link to="/documents" className="inline-flex px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm">
                        Go to Documents
                    </Link>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sets.map((set) => (
                        <div key={set._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <button onClick={() => handleDelete(set._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <Link to={`/documents/${set.documentId?._id || set.documentId}`}>
                                <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">{set.title}</h3>
                                <p className="text-xs text-gray-500 mt-1">{set.cards.length} cards</p>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Progress</span>
                                        <span>{set.progress.studied}/{set.progress.total}</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] rounded-full transition-all" style={{ width: `${set.progress.total ? (set.progress.studied / set.progress.total) * 100 : 0}%` }}></div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
