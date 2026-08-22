const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.post('/checkout', protect, paymentController.checkout);
router.post('/verify', protect, paymentController.verify);
router.post('/cancel', protect, paymentController.cancel);
router.post('/webhook', paymentController.webhook);
router.post('/refund', protect, authorize('admin'), paymentController.refund);
router.get('/history', protect, paymentController.getPaymentHistory);

module.exports = router;
