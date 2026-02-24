const FlashcardSet = require('../models/FlashcardSet');

// GET /api/flashcards
exports.getAll = async (req, res, next) => {
    try {
        const flashcardSets = await FlashcardSet.find({ userId: req.user._id })
            .populate('documentId', 'title')
            .sort({ createdAt: -1 });

        res.json({ flashcardSets });
    } catch (error) {
        next(error);
    }
};

// GET /api/flashcards/:id
exports.getById = async (req, res, next) => {
    try {
        const flashcardSet = await FlashcardSet.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('documentId', 'title');

        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }

        res.json({ flashcardSet });
    } catch (error) {
        next(error);
    }
};

// PUT /api/flashcards/:id/progress
exports.updateProgress = async (req, res, next) => {
    try {
        const { cardIndex, mastered } = req.body;

        const flashcardSet = await FlashcardSet.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }

        if (cardIndex !== undefined && flashcardSet.cards[cardIndex]) {
            flashcardSet.cards[cardIndex].mastered = mastered;
        }

        // Recalculate progress
        const studied = flashcardSet.cards.filter(c => c.mastered).length;
        flashcardSet.progress = { studied, total: flashcardSet.cards.length };

        await flashcardSet.save();

        res.json({ flashcardSet });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/flashcards/:id
exports.remove = async (req, res, next) => {
    try {
        const result = await FlashcardSet.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }

        res.json({ message: 'Flashcard set deleted' });
    } catch (error) {
        next(error);
    }
};
