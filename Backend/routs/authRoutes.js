const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware.js');
const { registerUser, verifyOTP, resendOTP, loginUser, user } = require('../controllers/authController.js');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.get('/users', protect, admin, user);

module.exports = router;