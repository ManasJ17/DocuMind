const Document = require('../models/Document');
const FlashcardSet = require('../models/FlashcardSet');
const Quiz = require('../models/Quiz');

// GET /api/dashboard/summary
exports.getSummary = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const [docCount, flashcardCount, quizCount, recentQuizzes] = await Promise.all([
            Document.countDocuments({ userId }),
            FlashcardSet.countDocuments({ userId }),
            Quiz.countDocuments({ userId }),
            Quiz.find({ userId, completed: true })
                .sort({ completedAt: -1 })
                .limit(5)
                .select('score title completedAt')
                .populate('documentId', 'title'),
        ]);

        // Calculate average score
        const avgScore = recentQuizzes.length > 0
            ? Math.round(recentQuizzes.reduce((acc, q) => acc + q.score, 0) / recentQuizzes.length)
            : 0;

        res.json({
            summary: {
                totalDocuments: docCount,
                totalFlashcards: flashcardCount,
                totalQuizzes: quizCount,
                averageScore: avgScore,
                recentQuizScores: recentQuizzes,
            },
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/dashboard/activity
exports.getActivity = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Gather recent activities from various collections
        const [recentDocs, recentFlashcards, recentQuizzes] = await Promise.all([
            Document.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title createdAt'),
            FlashcardSet.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title createdAt progress'),
            Quiz.find({ userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title score completed createdAt completedAt'),
        ]);

        // Combine and sort by date
        const activities = [
            ...recentDocs.map(d => ({
                type: 'document',
                title: d.title,
                description: 'Uploaded a new document',
                date: d.createdAt,
            })),
            ...recentFlashcards.map(f => ({
                type: 'flashcard',
                title: f.title,
                description: `${f.progress.studied}/${f.progress.total} cards mastered`,
                date: f.createdAt,
            })),
            ...recentQuizzes.map(q => ({
                type: 'quiz',
                title: q.title,
                description: q.completed ? `Score: ${q.score}%` : 'In progress',
                date: q.completedAt || q.createdAt,
            })),
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        res.json({ activities });
    } catch (error) {
        next(error);
    }
};
