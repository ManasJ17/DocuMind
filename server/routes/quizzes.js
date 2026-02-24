const router = require('express').Router();
const { getAll, getById, submit, remove } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id/submit', auth, submit);
router.delete('/:id', auth, remove);

module.exports = router;
