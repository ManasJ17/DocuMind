const Chat = require('../models/Chat');
const Document = require('../models/Document');
const aiService = require('../services/aiService');

// GET /api/chat/:docId
exports.getChat = async (req, res, next) => {
    try {
        let chat = await Chat.findOne({
            userId: req.user._id,
            documentId: req.params.docId,
        });

        if (!chat) {
            chat = { messages: [] };
        }

        res.json({ chat });
    } catch (error) {
        next(error);
    }
};

// POST /api/chat/:docId
exports.sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const document = await Document.findOne({
            _id: req.params.docId,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (!document.extractedText || document.extractedText.trim().length === 0) {
            return res.status(400).json({
                message: 'No text extracted from this document. Chat requires readable text in the PDF.',
            });
        }

        // Get or create chat
        let chat = await Chat.findOne({
            userId: req.user._id,
            documentId: document._id,
        });

        if (!chat) {
            chat = new Chat({
                userId: req.user._id,
                documentId: document._id,
                messages: [],
            });
        }

        // Add user message
        chat.messages.push({ role: 'user', content: message });

        // Get AI response
        console.log(`💬 Chat question for "${document.title}": "${message.substring(0, 80)}..."`);
        const aiResponse = await aiService.explainConcept(document.extractedText, message);

        // Add AI response
        chat.messages.push({ role: 'assistant', content: aiResponse });

        await chat.save();

        res.json({
            chat,
            reply: aiResponse,
        });
    } catch (error) {
        console.error('❌ Chat error:', error.message);
        next(error);
    }
};

// DELETE /api/chat/:docId
exports.clearChat = async (req, res, next) => {
    try {
        await Chat.deleteOne({
            userId: req.user._id,
            documentId: req.params.docId,
        });

        res.json({ message: 'Chat cleared' });
    } catch (error) {
        next(error);
    }
};
