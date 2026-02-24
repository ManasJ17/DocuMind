const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const chatSchema = new mongoose.Schema({
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
    messages: [messageSchema],
}, {
    timestamps: true,
});

chatSchema.index({ userId: 1, documentId: 1 });

module.exports = mongoose.model('Chat', chatSchema);
