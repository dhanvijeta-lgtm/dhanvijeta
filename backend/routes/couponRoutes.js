const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Verification (Student Checkout)
router.get('/validate', protect, couponController.validateCoupon);

// Admin Coupon CRUD Panel
router.get('/', protect, authorize('admin'), couponController.getCoupons);
router.post('/', protect, authorize('admin'), couponController.createCoupon);
router.put('/:id', protect, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', protect, authorize('admin'), couponController.deleteCoupon);

module.exports = router;
