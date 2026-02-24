import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocument, getDocumentFile, generateSummary, getChat, sendChatMessage, clearChat, generateFlashcards as genFlash, generateQuiz as genQuiz, submitQuiz } from '../services/api';
import toast from 'react-hot-toast';

const tabs = ['Content', 'Chat', 'AI Actions', 'Flashcards', 'Quizzes'];

export default function DocumentDetailPage() {
    const { id } = useParams();
    const [doc, setDoc] = useState(null);
    const [activeTab, setActiveTab] = useState('Content');
    const [loading, setLoading] = useState(true);

    // Summary state
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);

    // Explain concept state
    const [conceptInput, setConceptInput] = useState('');
    const [conceptResult, setConceptResult] = useState('');
    const [conceptLoading, setConceptLoading] = useState(false);

    // Chat state
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Flashcards state
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [flashLoading, setFlashLoading] = useState(false);

    // Quiz state
    const [quizId, setQuizId] = useState(null);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizLoading, setQuizLoading] = useState(false);
    const [quizScore, setQuizScore] = useState(null);
    const [quizCount, setQuizCount] = useState(5);
    const [showQuizSetup, setShowQuizSetup] = useState(true);

    useEffect(() => {
        getDocument(id)
            .then((res) => {
                setDoc(res.data.document);
                if (res.data.document.summary) setSummary(res.data.document.summary);
            })
            .catch(() => toast.error('Failed to load document'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (activeTab === 'Chat') {
            getChat(id).then((res) => setMessages(res.data.chat.messages || [])).catch(() => { });
        }
    }, [activeTab, id]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ---- Summary ----
    const handleGenerateSummary = async () => {
        setSummaryLoading(true);
        try {
            const res = await generateSummary(id);
            setSummary(res.data.summary);
            toast.success('Summary generated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    // ---- Explain Concept ----
    const handleExplainConcept = async (e) => {
        e.preventDefault();
        if (!conceptInput.trim()) return;
        setConceptLoading(true);
        setConceptResult('');
        try {
            const res = await sendChatMessage(id, conceptInput.trim());
            setConceptResult(res.data.reply);
            toast.success('Explanation ready!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to explain concept');
        } finally {
            setConceptLoading(false);
        }
    };

    // ---- Chat ----
    const handleSendChat = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const msg = chatInput.trim();
        setChatInput('');
        setMessages((prev) => [...prev, { role: 'user', content: msg }]);
        setChatLoading(true);
        try {
            const res = await sendChatMessage(id, msg);
            setMessages(res.data.chat.messages);
        } catch (err) {
            toast.error('Failed to get AI response');
        } finally {
            setChatLoading(false);
        }
    };

    const handleClearChat = async () => {
        await clearChat(id);
        setMessages([]);
        toast.success('Chat cleared');
    };

    // ---- Flashcards ----
    const handleGenFlashcards = async () => {
        setFlashLoading(true);
        try {
            const res = await genFlash(id, 10);
            setFlashcards(res.data.flashcardSet.cards);
            setCurrentCard(0);
            setFlipped(false);
            toast.success('Flashcards generated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate flashcards');
        } finally {
            setFlashLoading(false);
        }
    };

    // ---- Quiz ----
    const handleGenQuiz = async () => {
        setQuizLoading(true);
        setQuizSubmitted(false);
        setQuizScore(null);
        setQuizId(null);
        try {
            const res = await genQuiz(id, quizCount);
            setQuizId(res.data.quiz._id);
            setQuizQuestions(res.data.quiz.questions);
            setAnswers(new Array(res.data.quiz.questions.length).fill(-1));
            setCurrentQ(0);
            setShowQuizSetup(false);
            toast.success('Quiz generated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate quiz');
        } finally {
            setQuizLoading(false);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            if (quizId) {
                const res = await submitQuiz(quizId, answers);
                const quiz = res.data.quiz;
                setQuizScore(quiz.score);
                setQuizQuestions(quiz.questions);
            } else {
                let correct = 0;
                quizQuestions.forEach((q, i) => {
                    if (answers[i] === q.correctAnswer) correct++;
                });
                setQuizScore(Math.round((correct / quizQuestions.length) * 100));
            }
            setQuizSubmitted(true);
            toast.success(`Quiz submitted!`);
        } catch (err) {
            if (err.response?.data?.message === 'Quiz already submitted') {
                let correct = 0;
                quizQuestions.forEach((q, i) => {
                    if (answers[i] === q.correctAnswer) correct++;
                });
                setQuizScore(Math.round((correct / quizQuestions.length) * 100));
                setQuizSubmitted(true);
            } else {
                toast.error(err.response?.data?.message || 'Failed to submit quiz');
            }
        }
    };

    const handleReattempt = () => {
        setQuizQuestions([]);
        setQuizSubmitted(false);
        setQuizScore(null);
        setQuizId(null);
        setShowQuizSetup(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!doc) {
        return <div className="text-center py-16 text-gray-500">Document not found</div>;
    }

    const pdfUrl = getDocumentFile(id);

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link to="/documents" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </Link>
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{doc.title}</h1>
                    <p className="text-xs text-gray-500">{doc.pageCount} pages • {new Date(doc.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 ${activeTab === tab
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px]">
                {/* Content Tab */}
                {activeTab === 'Content' && (
                    <div className="h-[700px]">
                        <iframe
                            src={`${pdfUrl}#toolbar=1`}
                            className="w-full h-full border-0"
                            title="PDF Viewer"
                        />
                    </div>
                )}

                {/* AI Actions Tab */}
                {activeTab === 'AI Actions' && (
                    <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 bg-[#F9FAFB] p-4 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">AI Assistant</h2>
                                <p className="text-xs text-blue-600">Powered by advanced AI</p>
                            </div>
                        </div>

                        {/* Generate Summary Card */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Generate Summary</h3>
                                        <p className="text-xs text-gray-500">Get a concise summary of the entire document.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleGenerateSummary}
                                    disabled={summaryLoading}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-full shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all text-sm"
                                >
                                    {summaryLoading ? 'Generating...' : 'Summarize'}
                                </button>
                            </div>
                            {summary && (
                                <div className="mt-4 pt-4 border-t border-gray-100 prose max-w-none text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {summary}
                                </div>
                            )}
                        </div>

                        {/* Explain Concept Card */}
                        <div className="border border-gray-200 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-yellow-50 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Explain a Concept</h3>
                                    <p className="text-xs text-gray-500">Enter a topic or concept from the document to get a detailed explanation.</p>
                                </div>
                            </div>
                            <form onSubmit={handleExplainConcept} className="flex gap-3">
                                <input
                                    type="text"
                                    value={conceptInput}
                                    onChange={(e) => setConceptInput(e.target.value)}
                                    placeholder="e.g. 'React Hooks'"
                                    className="flex-1 h-[44px] px-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={conceptLoading || !conceptInput.trim()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-full shadow-sm shadow-blue-500/20 disabled:opacity-50 transition-all text-sm"
                                >
                                    {conceptLoading ? 'Explaining...' : 'Explain'}
                                </button>
                            </form>
                            {conceptResult && (
                                <div className="mt-4 pt-4 border-t border-gray-100 prose max-w-none text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {conceptResult}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Tab */}
                {activeTab === 'Chat' && (
                    <div className="flex flex-col h-[600px]">
                        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
                            <h3 className="font-medium text-gray-900 text-sm">Chat with Document</h3>
                            {messages.length > 0 && (
                                <button onClick={handleClearChat} className="text-xs text-red-500 hover:text-red-600 transition-colors">Clear Chat</button>
                            )}
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-5" style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%)' }}>
                            {messages.length === 0 && (
                                <div className="text-center py-12 text-gray-400 text-sm">
                                    Ask any question about this document...
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-2xl rounded-br-md shadow-sm'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-sm text-white text-xs font-bold">
                                            {doc.title?.charAt(0)?.toUpperCase() || 'A'}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {chatLoading && (
                                <div className="flex items-end gap-2.5 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    </div>
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                        <form onSubmit={handleSendChat} className="p-4 border-t border-gray-100 flex gap-2 bg-white">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 h-[44px] px-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                            <button
                                type="submit"
                                disabled={chatLoading}
                                className="px-5 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all text-sm font-medium"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                )}

                {/* Flashcards Tab */}
                {activeTab === 'Flashcards' && (
                    <div className="p-6">
                        {flashcards.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Flashcards</h3>
                                <p className="text-gray-500 mb-6 text-sm">Create AI-powered flashcards from this document</p>
                                <button
                                    onClick={handleGenFlashcards}
                                    disabled={flashLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all text-sm"
                                >
                                    {flashLoading ? 'Generating...' : 'Generate 10 Flashcards'}
                                </button>
                            </div>
                        ) : (
                            <div className="max-w-lg mx-auto">
                                <div className="text-center mb-4 text-sm text-gray-500">
                                    Card {currentCard + 1} of {flashcards.length}
                                </div>
                                <div
                                    onClick={() => setFlipped(!flipped)}
                                    className="relative w-full h-64 cursor-pointer perspective-1000"
                                >
                                    <div className={`relative w-full h-full transition-transform duration-500 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
                                        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-[#4F46E5] to-[#3B82F6] rounded-2xl p-6 flex items-center justify-center text-white shadow-xl">
                                            <p className="text-lg font-medium text-center">{flashcards[currentCard]?.question}</p>
                                        </div>
                                        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] rounded-2xl p-6 flex items-center justify-center text-white shadow-xl">
                                            <p className="text-lg font-medium text-center">{flashcards[currentCard]?.answer}</p>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-2">Click card to flip</p>
                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false); }}
                                        disabled={currentCard === 0}
                                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-all text-sm font-medium"
                                    >
                                        ← Previous
                                    </button>
                                    <button
                                        onClick={() => { setCurrentCard(Math.min(flashcards.length - 1, currentCard + 1)); setFlipped(false); }}
                                        disabled={currentCard === flashcards.length - 1}
                                        className="px-5 py-2 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-all text-sm font-medium"
                                    >
                                        Next →
                                    </button>
                                </div>
                                <div className="mt-6">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] rounded-full transition-all duration-300" style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'Quizzes' && (
                    <div className="p-6">
                        {showQuizSetup && quizQuestions.length === 0 ? (
                            /* Quiz Setup */
                            <div className="text-center py-12 max-w-md mx-auto">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate Quiz</h3>
                                <p className="text-gray-500 mb-6 text-sm">How many questions do you want to generate?</p>
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    {[3, 5, 10, 15].map((n) => (
                                        <button
                                            key={n}
                                            onClick={() => setQuizCount(n)}
                                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all ${quizCount === n
                                                ? 'bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white shadow-lg scale-110'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleGenQuiz}
                                    disabled={quizLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all text-sm"
                                >
                                    {quizLoading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Generating...
                                        </span>
                                    ) : '+ Generate Quiz'}
                                </button>
                            </div>
                        ) : !quizSubmitted && quizQuestions.length > 0 ? (
                            /* Quiz Attempt */
                            <div className="max-w-2xl mx-auto">
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                                        <span>Question {currentQ + 1} of {quizQuestions.length}</span>
                                        <span>{answers.filter(a => a !== -1).length} answered</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] rounded-full transition-all" style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        {quizQuestions[currentQ]?.question}
                                    </h3>
                                    <div className="space-y-3">
                                        {quizQuestions[currentQ]?.options?.map((opt, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    const newAnswers = [...answers];
                                                    newAnswers[currentQ] = i;
                                                    setAnswers(newAnswers);
                                                }}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${answers[currentQ] === i
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                    }`}
                                            >
                                                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
                                        disabled={currentQ === 0}
                                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl disabled:opacity-30 hover:bg-gray-200 transition-all text-sm font-medium"
                                    >
                                        ← Previous
                                    </button>
                                    {currentQ < quizQuestions.length - 1 ? (
                                        <button
                                            onClick={() => setCurrentQ(currentQ + 1)}
                                            className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-xl hover:shadow-lg transition-all text-sm font-medium"
                                        >
                                            Next →
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmitQuiz}
                                            disabled={answers.includes(-1)}
                                            className="px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 transition-all text-sm font-medium"
                                        >
                                            Submit Quiz
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : quizSubmitted ? (
                            /* Quiz Results */
                            <div className="max-w-2xl mx-auto">
                                {/* Score Card */}
                                <div className="bg-[#F9FAFB] rounded-2xl p-8 mb-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                        </div>
                                        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">YOUR SCORE</p>
                                        <h3 className={`text-4xl font-bold ${quizScore >= 70 ? 'text-blue-600' : 'text-red-500'}`}>
                                            {quizScore}%
                                        </h3>
                                        <p className="text-gray-500 mt-1 text-sm">
                                            {quizScore >= 90 ? 'Outstanding!' : quizScore >= 70 ? 'Great job!' : 'Keep practicing!'}
                                        </p>

                                        {/* Stat Badges */}
                                        <div className="flex items-center justify-center gap-3 mt-5">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-200 px-3 py-1.5 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                                {quizQuestions.length} Total
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                {quizQuestions.filter((q, i) => answers[i] === q.correctAnswer).length} Correct
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1.5 rounded-full">
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                {quizQuestions.filter((q, i) => answers[i] !== q.correctAnswer).length} Incorrect
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Review */}
                                <div className="space-y-4">
                                    {quizQuestions.map((q, i) => {
                                        const isCorrect = answers[i] === q.correctAnswer;
                                        return (
                                            <div key={i} className={`p-4 rounded-xl border-2 ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                                <div className="flex items-start gap-3">
                                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                                        {isCorrect ? '✓' : '✗'}
                                                    </span>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900 text-sm mb-2">{q.question}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Your answer: <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{q.options?.[answers[i]] || 'N/A'}</span>
                                                        </p>
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

                                <div className="flex justify-center gap-4 mt-6">
                                    <button
                                        onClick={handleReattempt}
                                        className="px-6 py-3 border-2 border-blue-500 text-blue-600 font-medium rounded-2xl hover:bg-blue-50 transition-all text-sm"
                                    >
                                        🔄 Reattempt Quiz
                                    </button>
                                    <button
                                        onClick={() => { setQuizQuestions([]); setQuizSubmitted(false); setQuizScore(null); setQuizId(null); setShowQuizSetup(true); }}
                                        className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all text-sm"
                                    >
                                        + Generate New Quiz
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
}
