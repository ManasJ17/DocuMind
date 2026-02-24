const Quiz = require('../models/Quiz');

// GET /api/quizzes
exports.getAll = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id })
            .populate('documentId', 'title')
            .select('-questions.correctAnswer -questions.explanation')
            .sort({ createdAt: -1 });

        res.json({ quizzes });
    } catch (error) {
        next(error);
    }
};

// GET /api/quizzes/:id
exports.getById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Hide answers if not completed
        if (!quiz.completed) {
            const quizObj = quiz.toObject();
            quizObj.questions = quizObj.questions.map(q => ({
                ...q,
                correctAnswer: undefined,
                explanation: undefined,
            }));
            return res.json({ quiz: quizObj });
        }

        res.json({ quiz });
    } catch (error) {
        next(error);
    }
};

// PUT /api/quizzes/:id/submit
exports.submit = async (req, res, next) => {
    try {
        const { answers } = req.body;

        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id,
        }).populate('documentId', 'title');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.completed) {
            return res.status(400).json({ message: 'Quiz already submitted' });
        }

        // Calculate score
        let correctCount = 0;
        quiz.questions.forEach((q, i) => {
            if (answers[i] === q.correctAnswer) {
                correctCount++;
            }
        });

        quiz.userAnswers = answers;
        quiz.score = Math.round((correctCount / quiz.totalQuestions) * 100);
        quiz.completed = true;
        quiz.completedAt = new Date();

        await quiz.save();

        res.json({ quiz });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/quizzes/:id
exports.remove = async (req, res, next) => {
    try {
        const result = await Quiz.deleteOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.json({ message: 'Quiz deleted' });
    } catch (error) {
        next(error);
    }
};
