const express = require('express');
const router = express.Router();
const { deposit, withdraw, transfer, getHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/deposit', protect, deposit);
router.post('/withdraw', protect, withdraw);
router.post('/transfer', protect, transfer);
router.get('/history', protect, getHistory);

module.exports = router;