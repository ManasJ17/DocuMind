const Document = require('../models/Document');
const aiService = require('../services/aiService');

// POST /api/ai/summary/:docId
exports.generateSummary = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.docId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (!document.extractedText || document.extractedText.trim().length === 0) {
            return res.status(400).json({
                message: 'No text extracted from this document. This may be a scanned/image PDF. AI features require readable text.',
            });
        }

        console.log(`🤖 Generating summary for "${document.title}" (${document.extractedText.length} chars)`);
        const summary = await aiService.generateSummary(document.extractedText);

        // Save summary to document
        document.summary = summary;
        await document.save();

        res.json({ summary });
    } catch (error) {
        console.error('❌ Summary generation error:', error.message);
        next(error);
    }
};

// POST /api/ai/flashcards/:docId
exports.generateFlashcards = async (req, res, next) => {
    try {
        const { count = 10 } = req.body;
        const document = await Document.findOne({
            _id: req.params.docId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (!document.extractedText || document.extractedText.trim().length === 0) {
            return res.status(400).json({
                message: 'No text extracted from this document. This may be a scanned/image PDF. AI features require readable text.',
            });
        }

        console.log(`🃏 Generating ${count} flashcards for "${document.title}"`);
        const cards = await aiService.generateFlashcards(document.extractedText, count);

        const FlashcardSet = require('../models/FlashcardSet');
        const flashcardSet = await FlashcardSet.create({
            userId: req.user._id,
            documentId: document._id,
            title: `Flashcards - ${document.title}`,
            cards,
            progress: { studied: 0, total: cards.length },
        });

        res.status(201).json({ flashcardSet });
    } catch (error) {
        console.error('❌ Flashcard generation error:', error.message);
        next(error);
    }
};

// POST /api/ai/quiz/:docId
exports.generateQuiz = async (req, res, next) => {
    try {
        const { count = 5 } = req.body;
        const document = await Document.findOne({
            _id: req.params.docId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (!document.extractedText || document.extractedText.trim().length === 0) {
            return res.status(400).json({
                message: 'No text extracted from this document. This may be a scanned/image PDF. AI features require readable text.',
            });
        }

        console.log(`📝 Generating ${count} quiz questions for "${document.title}"`);
        const questions = await aiService.generateQuiz(document.extractedText, count);

        const Quiz = require('../models/Quiz');
        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: `Quiz - ${document.title}`,
            questions,
            totalQuestions: questions.length,
            userAnswers: new Array(questions.length).fill(-1),
        });

        res.status(201).json({ quiz });
    } catch (error) {
        console.error('❌ Quiz generation error:', error.message);
        next(error);
    }
};
