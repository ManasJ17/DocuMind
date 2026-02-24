const router = require('express').Router();
const { getAll, getById, updateProgress, remove } = require('../controllers/flashcardController');
const auth = require('../middleware/auth');

router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id/progress', auth, updateProgress);
router.delete('/:id', auth, remove);

module.exports = router;
