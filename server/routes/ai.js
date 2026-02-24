const router = require('express').Router();
const { generateSummary, generateFlashcards, generateQuiz } = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/summary/:docId', auth, generateSummary);
router.post('/flashcards/:docId', auth, generateFlashcards);
router.post('/quiz/:docId', auth, generateQuiz);

module.exports = router;
