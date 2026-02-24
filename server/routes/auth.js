const router = require('express').Router();
const { register, login, getMe, changePassword, forgotPassword, verifyOtp, resetPassword } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);

// Password reset flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
