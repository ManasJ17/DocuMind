import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, uploadDocument, deleteDocument } from '../services/api';
import toast from 'react-hot-toast';

function timeAgo(dateStr) {
    const now = new Date();
    const d = new Date(dateStr);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return 'a day ago';
    return `${Math.floor(diff / 86400)} days ago`;
}

export default function DocumentsPage() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await getDocuments();
            setDocuments(res.data.documents);
        } catch (err) {
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a PDF file');

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('title', title || file.name.replace('.pdf', ''));

        setUploading(true);
        try {
            await uploadDocument(formData);
            toast.success('Document uploaded successfully!');
            setShowUpload(false);
            setTitle('');
            setFile(null);
            fetchDocuments();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await deleteDocument(id);
            toast.success('Document deleted');
            setDocuments(documents.filter((d) => d._id !== id));
        } catch (err) {
            toast.error('Failed to delete document');
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Documents</h1>
                    <p className="text-gray-500 mt-1">Upload and manage your PDFs</p>
                </div>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] hover:from-[#4338CA] hover:to-[#2563EB] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 text-sm"
                >
                    + Upload PDF
                </button>
            </div>

            {/* Upload Form */}
            {showUpload && (
                <form
                    onSubmit={handleUpload}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">Document Title (optional)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full h-[48px] px-4 rounded-2xl border border-gray-200 bg-[#F9FAFB] text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                            placeholder="Enter a title for your document"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1.5">PDF File</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                            onClick={() => document.getElementById('pdf-input').click()}
                        >
                            <input
                                id="pdf-input"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />
                            {file ? (
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    <span className="font-medium">{file.name}</span>
                                    <span className="text-gray-400">({formatSize(file.size)})</span>
                                </div>
                            ) : (
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-2">
                                        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <p className="text-sm text-gray-500">Click to select a PDF file (max 20MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#3B82F6] text-white font-medium rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all text-sm"
                        >
                            {uploading ? 'Uploading...' : 'Upload Document'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowUpload(false); setFile(null); setTitle(''); }}
                            className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Documents Grid */}
            {documents.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No documents yet</h3>
                    <p className="text-gray-500">Upload your first PDF to start learning with AI</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {documents.map((doc) => (
                        <div
                            key={doc._id}
                            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <button
                                    onClick={() => handleDelete(doc._id)}
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                    title="Delete"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>

                            <Link to={`/documents/${doc._id}`} className="block">
                                <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    {formatSize(doc.fileSize)}
                                </p>

                                {/* Flashcard & Quiz Count Badges */}
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-lg">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        {doc.flashcardCount || 0} Flashcards
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-1 rounded-lg">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                        {doc.quizCount || 0} Quizzes
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400 mt-3">
                                    Uploaded {timeAgo(doc.createdAt)}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
