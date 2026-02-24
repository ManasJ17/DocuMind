const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Document title is required'],
        trim: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    extractedText: {
        type: String,
        default: '',
    },
    summary: {
        type: String,
        default: '',
    },
    pageCount: {
        type: Number,
        default: 0,
    },
    fileSize: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

documentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
