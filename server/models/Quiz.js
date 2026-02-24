const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, default: '' },
});

const quizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    questions: [questionSchema],
    userAnswers: [{
        type: Number,
        default: -1,
    }],
    score: {
        type: Number,
        default: null,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

quizSchema.index({ userId: 1, documentId: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
