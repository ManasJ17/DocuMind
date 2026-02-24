const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');

// POST /api/documents/upload
exports.upload = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        let extractedText = '';
        let pageCount = 0;

        try {
            // Robust PDF parsing handling both v1.x (function) and v2.x (class)
            // v2.4.5 exports an object { PDFParse: class } and requires Uint8Array
            if (typeof pdfParse === 'function') {
                const pdfData = await pdfParse(dataBuffer);
                extractedText = pdfData.text || '';
                pageCount = pdfData.numpages || 0;
            } else if (typeof pdfParse === 'object' && pdfParse.PDFParse) {
                // v2.x usage
                const uint8Array = new Uint8Array(dataBuffer);
                const parser = new pdfParse.PDFParse(uint8Array);
                const pdfData = await parser.getText();
                extractedText = pdfData.text || '';
                pageCount = pdfData.total || (pdfData.pages ? pdfData.pages.length : 0);
            } else {
                throw new Error('Unsupported pdf-parse library version');
            }

            console.log(`📄 PDF parsed: "${req.file.originalname}" — ${pageCount} pages, ${extractedText.length} chars extracted`);
        } catch (parseError) {
            console.error('❌ PDF parse error:', parseError);
            // Continue without text — document still gets saved
        }

        if (!extractedText || extractedText.trim().length === 0) {
            console.warn('⚠️ No text extracted from PDF — may be a scanned/image PDF');
        }

        const document = await Document.create({
            userId: req.user._id,
            title: req.body.title || req.file.originalname.replace('.pdf', ''),
            originalName: req.file.originalname,
            filePath: filePath,
            extractedText,
            pageCount,
            fileSize: req.file.size,
        });

        res.status(201).json({
            document,
            hasText: extractedText.trim().length > 0,
            warning: extractedText.trim().length === 0
                ? 'No readable text found in PDF. AI features may not work for scanned/image PDFs.'
                : undefined,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/documents
exports.getAll = async (req, res, next) => {
    try {
        const FlashcardSet = require('../models/FlashcardSet');
        const Quiz = require('../models/Quiz');

        const documents = await Document.find({ userId: req.user._id })
            .select('-extractedText')
            .sort({ createdAt: -1 })
            .lean();

        // Aggregate flashcard/quiz counts per document
        const docIds = documents.map(d => d._id);

        const [flashCounts, quizCounts] = await Promise.all([
            FlashcardSet.aggregate([
                { $match: { documentId: { $in: docIds } } },
                { $group: { _id: '$documentId', count: { $sum: 1 } } },
            ]),
            Quiz.aggregate([
                { $match: { documentId: { $in: docIds } } },
                { $group: { _id: '$documentId', count: { $sum: 1 } } },
            ]),
        ]);

        const flashMap = Object.fromEntries(flashCounts.map(f => [f._id.toString(), f.count]));
        const quizMap = Object.fromEntries(quizCounts.map(q => [q._id.toString(), q.count]));

        const enriched = documents.map(doc => ({
            ...doc,
            flashcardCount: flashMap[doc._id.toString()] || 0,
            quizCount: quizMap[doc._id.toString()] || 0,
        }));

        res.json({ documents: enriched });
    } catch (error) {
        next(error);
    }
};

// GET /api/documents/:id
exports.getById = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json({ document });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/documents/:id
exports.remove = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Delete file from disk
        if (fs.existsSync(document.filePath)) {
            fs.unlinkSync(document.filePath);
        }

        await Document.deleteOne({ _id: document._id });

        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// GET /api/documents/:id/file
exports.getFile = async (req, res, next) => {
    try {
        const document = await Document.findOne({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        if (!fs.existsSync(document.filePath)) {
            return res.status(404).json({ message: 'File not found on disk' });
        }

        res.sendFile(path.resolve(document.filePath));
    } catch (error) {
        next(error);
    }
};
