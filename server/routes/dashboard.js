const router = require('express').Router();
const { getSummary, getActivity } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/summary', auth, getSummary);
router.get('/activity', auth, getActivity);

module.exports = router;
