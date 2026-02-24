import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const changePassword = (data) => API.put('/auth/change-password', data);

// Password Reset
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resetPasswordApi = (data) => API.post('/auth/reset-password', data);

// Documents
export const uploadDocument = (formData) =>
    API.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
export const getDocuments = () => API.get('/documents');
export const getDocument = (id) => API.get(`/documents/${id}`);
export const deleteDocument = (id) => API.delete(`/documents/${id}`);
export const getDocumentFile = (id) => {
    const token = localStorage.getItem('token');
    return `http://localhost:5000/api/documents/${id}/file?token=${token}`;
};

// AI
export const generateSummary = (docId) => API.post(`/ai/summary/${docId}`);
export const generateFlashcards = (docId, count) => API.post(`/ai/flashcards/${docId}`, { count });
export const generateQuiz = (docId, count) => API.post(`/ai/quiz/${docId}`, { count });

// Chat
export const getChat = (docId) => API.get(`/chat/${docId}`);
export const sendChatMessage = (docId, message) => API.post(`/chat/${docId}`, { message });
export const clearChat = (docId) => API.delete(`/chat/${docId}`);

// Flashcards
export const getFlashcardSets = () => API.get('/flashcards');
export const getFlashcardSet = (id) => API.get(`/flashcards/${id}`);
export const updateFlashcardProgress = (id, cardIndex, mastered) =>
    API.put(`/flashcards/${id}/progress`, { cardIndex, mastered });
export const deleteFlashcardSet = (id) => API.delete(`/flashcards/${id}`);

// Quizzes
export const getQuizzes = () => API.get('/quizzes');
export const getQuiz = (id) => API.get(`/quizzes/${id}`);
export const submitQuiz = (id, answers) => API.put(`/quizzes/${id}/submit`, { answers });
export const deleteQuiz = (id) => API.delete(`/quizzes/${id}`);

// Dashboard
export const getDashboardSummary = () => API.get('/dashboard/summary');
export const getDashboardActivity = () => API.get('/dashboard/activity');

export default API;
