const router = require('express').Router();
const { getChat, sendMessage, clearChat } = require('../controllers/chatController');
const auth = require('../middleware/auth');

router.get('/:docId', auth, getChat);
router.post('/:docId', auth, sendMessage);
router.delete('/:docId', auth, clearChat);

module.exports = router;
