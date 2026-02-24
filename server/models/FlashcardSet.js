const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    mastered: { type: Boolean, default: false },
});

const flashcardSetSchema = new mongoose.Schema({
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
    cards: [flashcardSchema],
    progress: {
        studied: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

flashcardSetSchema.index({ userId: 1, documentId: 1 });

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);
