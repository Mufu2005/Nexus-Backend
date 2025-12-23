const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    enable2FA,
    verify2FA
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister } = require('../middleware/validationMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerUser);
router.post('/login', loginUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify', protect, verify2FA);

module.exports = router;