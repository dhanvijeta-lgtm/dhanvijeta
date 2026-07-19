const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');

router.get('/', protect, purchaseController.getMyPurchases);
router.get('/:courseId', protect, purchaseController.getBatchDetails);
router.post('/:courseId/lessons/:lessonId/complete', protect, purchaseController.completeLesson);
router.get('/:courseId/certificate', protect, purchaseController.getBatchCertificate);

module.exports = router;
