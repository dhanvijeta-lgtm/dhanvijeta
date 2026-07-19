const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Public listing route for demo page, but creation is restricted
router.get('/demo-videos', adminController.getDemoVideos);

// Protected Admin Console Pathways
router.get('/analytics', protect, authorize('admin'), adminController.getDashboardAnalytics);
router.get('/students', protect, authorize('admin'), adminController.getStudents);
router.post('/announcements', protect, authorize('admin'), adminController.createAnnouncement);

router.post('/demo-videos', protect, authorize('admin'), adminController.createDemoVideo);
router.put('/demo-videos/:id', protect, authorize('admin'), adminController.updateDemoVideo);
router.delete('/demo-videos/:id', protect, authorize('admin'), adminController.deleteDemoVideo);

module.exports = router;
