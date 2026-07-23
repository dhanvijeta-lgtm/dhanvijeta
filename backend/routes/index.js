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

// API Health endpoints
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dhan Vijeta Backend API is Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Dhan Vijeta Backend API is Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

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
