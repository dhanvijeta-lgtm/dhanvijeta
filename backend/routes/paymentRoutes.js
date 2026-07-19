const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, paymentController.checkout);
router.post('/verify', protect, paymentController.verify);
router.get('/history', protect, paymentController.getPaymentHistory);

module.exports = router;
