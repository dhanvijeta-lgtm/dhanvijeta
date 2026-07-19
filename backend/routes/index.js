const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courseRoutes = require('./courseRoutes');
const paymentRoutes = require('./paymentRoutes');
const purchaseRoutes = require('./purchaseRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const couponRoutes = require('./couponRoutes');
const notificationRoutes = require('./notificationRoutes');
const blogRoutes = require('./blogRoutes');
const adminRoutes = require('./adminRoutes');
const certificateRoutes = require('./certificateRoutes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/payments', paymentRoutes);
router.use('/my-batch', purchaseRoutes);
router.use('/wishlists', wishlistRoutes);
router.use('/coupons', couponRoutes);
router.use('/notifications', notificationRoutes);
router.use('/blogs', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/certificates', certificateRoutes);

module.exports = router;
