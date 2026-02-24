const router = require('express').Router();
const { upload: uploadDoc, getAll, getById, remove, getFile } = require('../controllers/documentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('pdf'), uploadDoc);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.get('/:id/file', auth, getFile);
router.delete('/:id', auth, remove);

module.exports = router;
